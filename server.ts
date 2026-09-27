/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Full-Stack Express Server with Cloud SQL PostgreSQL & Vite Middleware
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';
import { db } from './src/db/index.ts';
import * as schema from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_BOOKS, INITIAL_EMPLOYEES, INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_ATTENDANCE } from './src/data/mockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Helper function to recursively add directories to a JSZip archive
function addFolderToZip(zip: JSZip, folderPath: string, rootRelative = '') {
  if (!fs.existsSync(folderPath)) return;
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === '.aistudio' || item === '.cache') continue;
    const fullPath = path.join(folderPath, item);
    const zipPath = rootRelative ? `${rootRelative}/${item}` : item;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addFolderToZip(zip, fullPath, zipPath);
      } else {
        const fileData = fs.readFileSync(fullPath);
        zip.file(zipPath, fileData);
      }
    } catch (e) {
      console.warn(`Could not read ${fullPath}:`, e);
    }
  }
}

// In-memory data store for resilient full-stack execution (with automatic Cloud SQL synchronization when configured)
let memoryBooks: any[] = JSON.parse(JSON.stringify(INITIAL_BOOKS));
let memoryEmployees: any[] = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
let memoryMembers: any[] = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
let memoryTransactions: any[] = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
let memoryAttendance: any[] = INITIAL_ATTENDANCE.map(a => ({
  recordId: a.id,
  employeeId: a.employeeId,
  employeeName: a.employeeName,
  date: a.date,
  loginTime: a.loginTime,
  logoutTime: a.logoutTime,
  status: a.status,
}));

const hasCloudSql = Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME);

// ---------------- HEALTH CHECK ----------------
app.get('/api/health', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const result = await db.select().from(schema.books).limit(1);
      return res.json({
        status: 'ok',
        database: 'connected',
        engine: 'PostgreSQL (Cloud SQL)',
        sampleBookAvailable: result.length > 0,
        booksCount: result.length,
      });
    } catch (error: any) {
      console.warn('Cloud SQL health check deferred:', error.message);
    }
  }

  res.json({
    status: 'ok',
    database: 'active',
    engine: 'Relational Database Engine (In-Memory / Cloud SQL Ready)',
    sampleBookAvailable: memoryBooks.length > 0,
    booksCount: memoryBooks.length,
  });
});

// ---------------- BOOKS ENDPOINTS ----------------
app.get('/api/books', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const allBooks = await db.select().from(schema.books).orderBy(schema.books.bookId);
      if (allBooks.length > 0) return res.json(allBooks);
    } catch (error: any) {
      console.warn('Cloud SQL books query fallback to memory:', error.message);
    }
  }
  res.json(memoryBooks);
});

app.post('/api/books', async (req: Request, res: Response) => {
  const bookData = req.body;
  const newBook = {
    bookId: bookData.bookId,
    isbn: bookData.isbn,
    title: bookData.title,
    author: bookData.author,
    publisher: bookData.publisher,
    category: bookData.category,
    categoryId: bookData.categoryId || null,
    edition: bookData.edition,
    publicationYear: Number(bookData.publicationYear),
    shelfRackNo: bookData.shelfRackNo,
    totalCopies: Number(bookData.totalCopies),
    availableCopies: Number(bookData.availableCopies ?? bookData.totalCopies),
    createdAt: new Date().toISOString(),
  };

  memoryBooks = [newBook, ...memoryBooks.filter(b => b.bookId !== newBook.bookId)];

  if (hasCloudSql) {
    try {
      const inserted = await db.insert(schema.books).values(newBook as any).returning();
      return res.status(201).json(inserted[0]);
    } catch (error: any) {
      console.warn('Cloud SQL insert book fallback:', error.message);
    }
  }

  res.status(201).json(newBook);
});

app.put('/api/books/:bookId', async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const updates = req.body;

  let updatedBook = null;
  memoryBooks = memoryBooks.map(b => {
    if (b.bookId === bookId) {
      updatedBook = {
        ...b,
        ...updates,
        publicationYear: updates.publicationYear ? Number(updates.publicationYear) : b.publicationYear,
        totalCopies: updates.totalCopies !== undefined ? Number(updates.totalCopies) : b.totalCopies,
        availableCopies: updates.availableCopies !== undefined ? Number(updates.availableCopies) : b.availableCopies,
      };
      return updatedBook;
    }
    return b;
  });

  if (hasCloudSql) {
    try {
      const updated = await db.update(schema.books)
        .set({
          isbn: updates.isbn,
          title: updates.title,
          author: updates.author,
          publisher: updates.publisher,
          category: updates.category,
          edition: updates.edition,
          publicationYear: updates.publicationYear ? Number(updates.publicationYear) : undefined,
          shelfRackNo: updates.shelfRackNo,
          totalCopies: updates.totalCopies !== undefined ? Number(updates.totalCopies) : undefined,
          availableCopies: updates.availableCopies !== undefined ? Number(updates.availableCopies) : undefined,
        })
        .where(eq(schema.books.bookId, bookId))
        .returning();
      if (updated.length > 0) return res.json(updated[0]);
    } catch (error: any) {
      console.warn('Cloud SQL update book fallback:', error.message);
    }
  }

  res.json(updatedBook || { bookId, ...updates });
});

app.delete('/api/books/:bookId', async (req: Request, res: Response) => {
  const { bookId } = req.params;
  memoryBooks = memoryBooks.filter(b => b.bookId !== bookId);

  if (hasCloudSql) {
    try {
      await db.delete(schema.books).where(eq(schema.books.bookId, bookId));
    } catch (error: any) {
      console.warn('Cloud SQL delete book fallback:', error.message);
    }
  }

  res.json({ success: true, message: `Book ${bookId} removed` });
});

// ---------------- MEMBERS ENDPOINTS ----------------
app.get('/api/members', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const allMembers = await db.select().from(schema.members).orderBy(schema.members.memberId);
      if (allMembers.length > 0) return res.json(allMembers);
    } catch (error: any) {
      console.warn('Cloud SQL members query fallback to memory:', error.message);
    }
  }
  res.json(memoryMembers);
});

app.post('/api/members', async (req: Request, res: Response) => {
  const memData = req.body;
  const newMember = {
    memberId: memData.memberId,
    name: memData.name,
    email: memData.email,
    phone: memData.phone,
    address: memData.address,
    category: memData.category || 'Student',
    department: memData.department || 'General',
    registrationDate: memData.registrationDate,
    status: memData.status || 'Active',
    username: memData.username || memData.memberId.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  memoryMembers = [newMember, ...memoryMembers.filter(m => m.memberId !== newMember.memberId)];

  if (hasCloudSql) {
    try {
      const inserted = await db.insert(schema.members).values(newMember as any).returning();
      return res.status(201).json(inserted[0]);
    } catch (error: any) {
      console.warn('Cloud SQL create member fallback:', error.message);
    }
  }

  res.status(201).json(newMember);
});

app.put('/api/members/:memberId', async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const updates = req.body;

  let updatedMember = null;
  memoryMembers = memoryMembers.map(m => {
    if (m.memberId === memberId) {
      updatedMember = { ...m, ...updates };
      return updatedMember;
    }
    return m;
  });

  if (hasCloudSql) {
    try {
      const updated = await db.update(schema.members)
        .set(updates)
        .where(eq(schema.members.memberId, memberId))
        .returning();
      if (updated.length > 0) return res.json(updated[0]);
    } catch (error: any) {
      console.warn('Cloud SQL update member fallback:', error.message);
    }
  }

  res.json(updatedMember || { memberId, ...updates });
});

app.delete('/api/members/:memberId', async (req: Request, res: Response) => {
  const { memberId } = req.params;
  memoryMembers = memoryMembers.filter(m => m.memberId !== memberId);

  if (hasCloudSql) {
    try {
      await db.delete(schema.members).where(eq(schema.members.memberId, memberId));
    } catch (error: any) {
      console.warn('Cloud SQL delete member fallback:', error.message);
    }
  }

  res.json({ success: true, message: `Member ${memberId} deleted` });
});

// ---------------- EMPLOYEES ENDPOINTS ----------------
app.get('/api/employees', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const allEmployees = await db.select().from(schema.employees).orderBy(schema.employees.employeeId);
      if (allEmployees.length > 0) return res.json(allEmployees);
    } catch (error: any) {
      console.warn('Cloud SQL employees query fallback to memory:', error.message);
    }
  }
  res.json(memoryEmployees);
});

app.post('/api/employees', async (req: Request, res: Response) => {
  const empData = req.body;
  const newEmp = {
    employeeId: empData.employeeId,
    name: empData.name,
    email: empData.email,
    phone: empData.phone,
    address: empData.address,
    username: empData.username,
    joiningDate: empData.joiningDate,
    role: empData.role || 'Assistant Librarian',
    status: empData.status || 'Active',
    createdAt: new Date().toISOString(),
  };

  memoryEmployees = [newEmp, ...memoryEmployees.filter(e => e.employeeId !== newEmp.employeeId)];

  if (hasCloudSql) {
    try {
      const inserted = await db.insert(schema.employees).values(newEmp as any).returning();
      return res.status(201).json(inserted[0]);
    } catch (error: any) {
      console.warn('Cloud SQL create employee fallback:', error.message);
    }
  }

  res.status(201).json(newEmp);
});

app.put('/api/employees/:employeeId', async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  const updates = req.body;

  let updatedEmp = null;
  memoryEmployees = memoryEmployees.map(e => {
    if (e.employeeId === employeeId) {
      updatedEmp = { ...e, ...updates };
      return updatedEmp;
    }
    return e;
  });

  if (hasCloudSql) {
    try {
      const updated = await db.update(schema.employees)
        .set(updates)
        .where(eq(schema.employees.employeeId, employeeId))
        .returning();
      if (updated.length > 0) return res.json(updated[0]);
    } catch (error: any) {
      console.warn('Cloud SQL update employee fallback:', error.message);
    }
  }

  res.json(updatedEmp || { employeeId, ...updates });
});

app.delete('/api/employees/:employeeId', async (req: Request, res: Response) => {
  const { employeeId } = req.params;
  memoryEmployees = memoryEmployees.filter(e => e.employeeId !== employeeId);

  if (hasCloudSql) {
    try {
      await db.delete(schema.employees).where(eq(schema.employees.employeeId, employeeId));
    } catch (error: any) {
      console.warn('Cloud SQL delete employee fallback:', error.message);
    }
  }

  res.json({ success: true, message: `Employee ${employeeId} removed` });
});

// ---------------- TRANSACTIONS ENDPOINTS ----------------
app.get('/api/transactions', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const allTxns = await db.select().from(schema.transactions).orderBy(desc(schema.transactions.id));
      if (allTxns.length > 0) return res.json(allTxns);
    } catch (error: any) {
      console.warn('Cloud SQL transactions query fallback to memory:', error.message);
    }
  }
  res.json(memoryTransactions);
});

app.post('/api/transactions/issue', async (req: Request, res: Response) => {
  const { bookId, bookTitle, memberId, memberName, employeeId, employeeName, issueDate, dueDate, notes } = req.body;
  const transactionId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTxn = {
    transactionId,
    bookId,
    bookTitle,
    memberId,
    memberName,
    employeeId,
    employeeName,
    issueDate,
    dueDate,
    status: 'Issued',
    overdueDays: 0,
    notes: notes || null,
    createdAt: new Date().toISOString(),
  };

  memoryTransactions = [newTxn, ...memoryTransactions];

  // Decrement available copies in memory
  memoryBooks = memoryBooks.map(b => {
    if (b.bookId === bookId) {
      return { ...b, availableCopies: Math.max(0, b.availableCopies - 1) };
    }
    return b;
  });

  if (hasCloudSql) {
    try {
      const insertedTxn = await db.insert(schema.transactions).values(newTxn as any).returning();
      const targetBook = await db.select().from(schema.books).where(eq(schema.books.bookId, bookId));
      if (targetBook.length > 0) {
        const currentAvailable = targetBook[0].availableCopies;
        await db.update(schema.books)
          .set({ availableCopies: Math.max(0, currentAvailable - 1) })
          .where(eq(schema.books.bookId, bookId));
      }
      return res.status(201).json(insertedTxn[0]);
    } catch (error: any) {
      console.warn('Cloud SQL issue transaction fallback:', error.message);
    }
  }

  res.status(201).json(newTxn);
});

app.post('/api/transactions/return', async (req: Request, res: Response) => {
  const { transactionId, returnDate, notes } = req.body;

  let targetBookId: string | null = null;
  let updatedTxn: any = null;

  memoryTransactions = memoryTransactions.map(t => {
    if (t.transactionId === transactionId) {
      targetBookId = t.bookId;
      updatedTxn = {
        ...t,
        returnDate,
        status: 'Returned',
        notes: notes || t.notes,
      };
      return updatedTxn;
    }
    return t;
  });

  if (targetBookId) {
    memoryBooks = memoryBooks.map(b => {
      if (b.bookId === targetBookId) {
        return { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) };
      }
      return b;
    });
  }

  if (hasCloudSql) {
    try {
      const existingTxn = await db.select().from(schema.transactions).where(eq(schema.transactions.transactionId, transactionId));
      if (existingTxn.length > 0) {
        const txn = existingTxn[0];
        const updated = await db.update(schema.transactions)
          .set({
            returnDate,
            status: 'Returned',
            notes: notes || txn.notes,
          })
          .where(eq(schema.transactions.transactionId, transactionId))
          .returning();

        const targetBook = await db.select().from(schema.books).where(eq(schema.books.bookId, txn.bookId));
        if (targetBook.length > 0) {
          await db.update(schema.books)
            .set({ availableCopies: Math.min(targetBook[0].totalCopies, targetBook[0].availableCopies + 1) })
            .where(eq(schema.books.bookId, txn.bookId));
        }
        return res.json(updated[0]);
      }
    } catch (error: any) {
      console.warn('Cloud SQL return transaction fallback:', error.message);
    }
  }

  res.json(updatedTxn || { success: true, transactionId, returnDate });
});

// ---------------- ATTENDANCE ENDPOINTS ----------------
app.get('/api/attendance', async (req: Request, res: Response) => {
  if (hasCloudSql) {
    try {
      const allAttendance = await db.select().from(schema.attendance).orderBy(desc(schema.attendance.date));
      if (allAttendance.length > 0) return res.json(allAttendance);
    } catch (error: any) {
      console.warn('Cloud SQL attendance query fallback to memory:', error.message);
    }
  }
  res.json(memoryAttendance);
});

app.post('/api/attendance/login', async (req: Request, res: Response) => {
  const { employeeId, employeeName, date, loginTime } = req.body;
  const recordId = `ATT-${date}-${employeeId}`;

  const existing = memoryAttendance.find(a => a.recordId === recordId || (a.employeeId === employeeId && a.date === date));
  if (existing) {
    return res.json(existing);
  }

  const newRecord = {
    recordId,
    employeeId,
    employeeName,
    date,
    loginTime,
    logoutTime: null,
    status: 'Present',
    createdAt: new Date().toISOString(),
  };

  memoryAttendance = [newRecord, ...memoryAttendance];

  if (hasCloudSql) {
    try {
      const inserted = await db.insert(schema.attendance).values(newRecord as any).returning();
      return res.status(201).json(inserted[0]);
    } catch (error: any) {
      console.warn('Cloud SQL record login attendance fallback:', error.message);
    }
  }

  res.status(201).json(newRecord);
});

app.post('/api/attendance/logout', async (req: Request, res: Response) => {
  const { employeeId, date, logoutTime } = req.body;
  const recordId = `ATT-${date}-${employeeId}`;

  let updatedRecord: any = null;
  memoryAttendance = memoryAttendance.map(a => {
    if (a.recordId === recordId || (a.employeeId === employeeId && a.date === date)) {
      updatedRecord = { ...a, logoutTime, status: 'Completed' };
      return updatedRecord;
    }
    return a;
  });

  if (hasCloudSql) {
    try {
      const updated = await db.update(schema.attendance)
        .set({ logoutTime, status: 'Completed' })
        .where(eq(schema.attendance.recordId, recordId))
        .returning();
      if (updated.length > 0) return res.json(updated[0]);
    } catch (error: any) {
      console.warn('Cloud SQL record logout attendance fallback:', error.message);
    }
  }

  res.json(updatedRecord || { success: true });
});

// ---------------- RESET DATABASE TO INITIAL SEED ----------------
app.post('/api/reset', async (req: Request, res: Response) => {
  memoryBooks = JSON.parse(JSON.stringify(INITIAL_BOOKS));
  memoryEmployees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
  memoryMembers = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
  memoryTransactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
  memoryAttendance = INITIAL_ATTENDANCE.map(a => ({
    recordId: a.id,
    employeeId: a.employeeId,
    employeeName: a.employeeName,
    date: a.date,
    loginTime: a.loginTime,
    logoutTime: a.logoutTime,
    status: a.status,
  }));

  if (hasCloudSql) {
    try {
      await db.delete(schema.transactions);
      await db.delete(schema.attendance);
      await db.delete(schema.books);
      await db.delete(schema.members);
      await db.delete(schema.employees);

      for (const b of INITIAL_BOOKS) {
        await db.insert(schema.books).values(b).onConflictDoNothing();
      }
      for (const e of INITIAL_EMPLOYEES) {
        await db.insert(schema.employees).values(e).onConflictDoNothing();
      }
      for (const m of INITIAL_MEMBERS) {
        await db.insert(schema.members).values(m).onConflictDoNothing();
      }
      for (const t of INITIAL_TRANSACTIONS) {
        await db.insert(schema.transactions).values(t).onConflictDoNothing();
      }
      for (const a of INITIAL_ATTENDANCE) {
        await db.insert(schema.attendance).values({
          recordId: a.id,
          employeeId: a.employeeId,
          employeeName: a.employeeName,
          date: a.date,
          loginTime: a.loginTime,
          logoutTime: a.logoutTime,
          status: a.status,
        }).onConflictDoNothing();
      }
    } catch (error: any) {
      console.warn('Cloud SQL reset fallback:', error.message);
    }
  }

  res.json({ success: true, message: 'Database reset to initial seed values' });
});

// ---------------- EXPORT / DOWNLOAD PROJECT ZIP ----------------
app.get('/api/download-project-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    // 1. Add complete editable frontend source code
    addFolderToZip(zip, path.resolve(__dirname, 'src'), 'src');
    if (fs.existsSync(path.resolve(__dirname, 'public'))) {
      addFolderToZip(zip, path.resolve(__dirname, 'public'), 'public');
    }

    // 2. Add complete XAMPP Apache + PHP + MySQL backend package
    if (fs.existsSync(path.resolve(__dirname, 'xampp-backend'))) {
      addFolderToZip(zip, path.resolve(__dirname, 'xampp-backend'), 'xampp-backend');
    }

    // 3. Add production build files for immediate local hosting in htdocs
    if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
      addFolderToZip(zip, path.resolve(__dirname, 'dist'), 'dist');
    }

    // 4. Add root configuration and server files
    const rootConfigFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'server.ts',
      'index.html',
      'metadata.json'
    ];

    for (const file of rootConfigFiles) {
      const filePath = path.resolve(__dirname, file);
      if (fs.existsSync(filePath)) {
        zip.file(file, fs.readFileSync(filePath));
      }
    }

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="library_management_system_xampp_project.zip"');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('Failed to generate project ZIP:', error);
    res.status(500).json({ error: 'Failed to generate project ZIP: ' + error.message });
  }
});

// ---------------- VITE MIDDLEWARE (DEV) & STATIC SERVE (PROD) ----------------
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Library Management System server running on http://0.0.0.0:${PORT}`);
});
