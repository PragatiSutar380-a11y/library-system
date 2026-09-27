/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Context & State Management
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  AuthSession,
  Employee,
  Member,
  Book,
  BookCategory,
  Transaction,
  AttendanceRecord,
  ActiveNavTab,
} from '../types/library';
import {
  INITIAL_CATEGORIES,
  INITIAL_BOOKS,
  INITIAL_EMPLOYEES,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_ATTENDANCE,
} from '../data/mockData';

interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface LibraryContextType {
  // Auth & Session
  currentUser: AuthSession | null;
  activeRole: UserRole;
  loginAs: (role: UserRole, identifier?: string, password?: string) => { success: boolean; message: string };
  logout: () => void;

  // Navigation
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;

  // Alerts
  notification: NotificationState | null;
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Database Entities
  books: Book[];
  categories: BookCategory[];
  employees: Employee[];
  members: Member[];
  transactions: Transaction[];
  attendance: AttendanceRecord[];

  // Book Operations
  addBook: (bookData: Omit<Book, 'bookId' | 'availableCopies'> & { availableCopies?: number }) => Book;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  deleteBook: (bookId: string) => { success: boolean; message: string };

  // Member Operations
  addMember: (memberData: Omit<Member, 'memberId' | 'registrationDate'>) => Member;
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  deleteMember: (memberId: string) => { success: boolean; message: string };

  // Employee Operations (Admin only)
  addEmployee: (empData: Omit<Employee, 'employeeId' | 'joiningDate'>) => Employee;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  deleteEmployee: (employeeId: string) => { success: boolean; message: string };

  // Circulation (Issue / Return)
  issueBook: (bookId: string, memberId: string, days?: number, notes?: string) => { success: boolean; message: string; transactionId?: string };
  returnBook: (transactionId: string) => { success: boolean; message: string; overdueDays?: number };

  // Attendance
  recordAttendanceLogin: (employeeId: string, employeeName: string) => void;
  recordAttendanceLogout: (employeeId: string) => void;

  // Statistics / Aggregates
  stats: {
    totalBooks: number;
    availableBooks: number;
    issuedBooks: number;
    overdueBooks: number;
    totalMembers: number;
    activeMembers: number;
    totalEmployees: number;
    todayTransactionsCount: number;
    todayAttendanceCount: number;
  };

  // Reset to seed data
  resetAllData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: 'lms_academic_session_v1',
  BOOKS: 'lms_academic_books_v1',
  EMPLOYEES: 'lms_academic_employees_v1',
  MEMBERS: 'lms_academic_members_v1',
  TRANSACTIONS: 'lms_academic_transactions_v1',
  ATTENDANCE: 'lms_academic_attendance_v1',
};

// Fixed simulation date representing current semester session
export const SYSTEM_TODAY = '2026-09-26';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user session - default to Admin for immediate exploration, but easily toggleable
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      role: 'admin',
      id: 'ADM001',
      name: 'College Chief Librarian (Admin)',
      username: 'admin',
      email: 'admin.library@college.edu',
      loginTime: '08:30 AM',
    };
  });

  const activeRole: UserRole = currentUser?.role || 'admin';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');

  // Notification banner
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Relational Tables
  const [categories] = useState<BookCategory[]>(INITIAL_CATEGORIES);

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Save to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  // Synchronize from Cloud SQL PostgreSQL database on startup
  useEffect(() => {
    const syncFromCloudSql = async () => {
      try {
        const [booksRes, membersRes, employeesRes, txnsRes, attRes] = await Promise.all([
          fetch('/api/books').catch(() => null),
          fetch('/api/members').catch(() => null),
          fetch('/api/employees').catch(() => null),
          fetch('/api/transactions').catch(() => null),
          fetch('/api/attendance').catch(() => null),
        ]);

        if (booksRes && booksRes.ok) {
          const dbBooks = await booksRes.json();
          if (Array.isArray(dbBooks) && dbBooks.length > 0) setBooks(dbBooks);
        }
        if (membersRes && membersRes.ok) {
          const dbMembers = await membersRes.json();
          if (Array.isArray(dbMembers) && dbMembers.length > 0) setMembers(dbMembers);
        }
        if (employeesRes && employeesRes.ok) {
          const dbEmployees = await employeesRes.json();
          if (Array.isArray(dbEmployees) && dbEmployees.length > 0) setEmployees(dbEmployees);
        }
        if (txnsRes && txnsRes.ok) {
          const dbTxns = await txnsRes.json();
          if (Array.isArray(dbTxns) && dbTxns.length > 0) setTransactions(dbTxns);
        }
        if (attRes && attRes.ok) {
          const dbAtt = await attRes.json();
          if (Array.isArray(dbAtt) && dbAtt.length > 0) {
            setAttendance(dbAtt.map((a: any) => ({
              id: a.recordId || `ATT-${a.date}-${a.employeeId}`,
              employeeId: a.employeeId,
              employeeName: a.employeeName,
              date: a.date,
              loginTime: a.loginTime,
              logoutTime: a.logoutTime,
              status: a.status,
            })));
          }
        }
      } catch (err) {
        // Fallback to local storage silently
      }
    };

    syncFromCloudSql();
  }, []);

  const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // Attendance logging helpers
  const recordAttendanceLogin = (empId: string, empName: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = SYSTEM_TODAY;

    // Check if already logged in today
    const existing = attendance.find((a) => a.employeeId === empId && a.date === todayStr);
    if (!existing) {
      const newRecord: AttendanceRecord = {
        id: `ATT-${todayStr}-${empId}`,
        employeeId: empId,
        employeeName: empName,
        date: todayStr,
        loginTime: timeStr,
        status: 'Present',
      };
      setAttendance((prev) => [newRecord, ...prev]);

      fetch('/api/attendance/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: empId, employeeName: empName, date: todayStr, loginTime: timeStr }),
      }).catch((err) => console.warn('Cloud SQL attendance sync:', err));
    }
  };

  const recordAttendanceLogout = (empId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = SYSTEM_TODAY;

    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.employeeId === empId && rec.date === todayStr && !rec.logoutTime) {
          return { ...rec, logoutTime: timeStr, status: 'Completed' };
        }
        return rec;
      })
    );

    fetch('/api/attendance/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: empId, date: todayStr, logoutTime: timeStr }),
    }).catch((err) => console.warn('Cloud SQL attendance logout sync:', err));
  };

  // Auth / Login / Logout
  const loginAs = (role: UserRole, identifier?: string, password?: string): { success: boolean; message: string } => {
    if (role === 'admin') {
      const session: AuthSession = {
        role: 'admin',
        id: 'ADM001',
        name: 'Chief Librarian (Admin)',
        username: identifier || 'admin',
        email: 'admin.library@college.edu',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCurrentUser(session);
      setActiveTab('dashboard');
      notify('Logged in as Administrator (Full Management Privileges)', 'success');
      return { success: true, message: 'Welcome Administrator' };
    }

    if (role === 'employee') {
      // Find matching employee or pick first active employee
      const emp = identifier
        ? employees.find(
            (e) =>
              (e.username.toLowerCase() === identifier.toLowerCase() ||
                e.employeeId.toLowerCase() === identifier.toLowerCase() ||
                e.email.toLowerCase() === identifier.toLowerCase())
          )
        : employees[0];

      if (!emp) {
        notify('Employee not found with provided credentials', 'error');
        return { success: false, message: 'Employee record not found' };
      }

      if (emp.status === 'Inactive') {
        notify('Account is Inactive. Please contact the Library Admin.', 'error');
        return { success: false, message: 'Account inactive' };
      }

      const session: AuthSession = {
        role: 'employee',
        id: emp.employeeId,
        name: emp.name,
        username: emp.username,
        email: emp.email,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentUser(session);
      recordAttendanceLogin(emp.employeeId, emp.name);
      setActiveTab('dashboard');
      notify(`Logged in as Library Staff: ${emp.name} (${emp.employeeId}). Attendance recorded.`, 'success');
      return { success: true, message: `Welcome ${emp.name}` };
    }

    if (role === 'member') {
      // Find matching member or pick first active member
      const mem = identifier
        ? members.find(
            (m) =>
              (m.username?.toLowerCase() === identifier.toLowerCase() ||
                m.memberId.toLowerCase() === identifier.toLowerCase() ||
                m.email.toLowerCase() === identifier.toLowerCase())
          )
        : members[0];

      if (!mem) {
        notify('Member record not found', 'error');
        return { success: false, message: 'Member not found' };
      }

      if (mem.status === 'Inactive') {
        notify('Membership is Inactive or Expired. Please contact library staff.', 'warning');
        return { success: false, message: 'Membership inactive' };
      }

      const session: AuthSession = {
        role: 'member',
        id: mem.memberId,
        name: mem.name,
        username: mem.username || mem.memberId,
        email: mem.email,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentUser(session);
      setActiveTab('dashboard');
      notify(`Logged in as Library Member: ${mem.name} (${mem.memberId})`, 'success');
      return { success: true, message: `Welcome ${mem.name}` };
    }

    return { success: false, message: 'Invalid role' };
  };

  const logout = () => {
    if (currentUser?.role === 'employee') {
      recordAttendanceLogout(currentUser.id);
    }
    const loggedOutName = currentUser?.name || 'User';
    setCurrentUser(null);
    setActiveTab('dashboard');
    notify(`${loggedOutName} logged out successfully.`, 'info');
  };

  // ---------------- BOOK OPERATIONS ----------------
  const addBook = (
    bookData: Omit<Book, 'bookId' | 'availableCopies'> & { availableCopies?: number }
  ): Book => {
    // Generate new Book ID e.g. BK109
    const nextNum = 100 + books.length + 1;
    const newBook: Book = {
      ...bookData,
      bookId: `BK${nextNum}`,
      availableCopies: bookData.availableCopies ?? bookData.totalCopies,
    };
    setBooks((prev) => [newBook, ...prev]);
    notify(`Book added: "${newBook.title}" (ID: ${newBook.bookId})`, 'success');

    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    }).catch((err) => console.warn('Cloud SQL sync:', err));

    return newBook;
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.bookId === bookId) {
          const updated = { ...b, ...updates };
          // Ensure availableCopies does not exceed totalCopies
          if (updated.availableCopies > updated.totalCopies) {
            updated.availableCopies = updated.totalCopies;
          }
          return updated;
        }
        return b;
      })
    );
    notify(`Book ${bookId} details updated successfully`, 'success');

    fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Cloud SQL sync:', err));
  };

  const deleteBook = (bookId: string): { success: boolean; message: string } => {
    // Check if any copies are currently issued
    const activeIssue = transactions.find((t) => t.bookId === bookId && t.status === 'Issued');
    if (activeIssue) {
      notify(`Cannot delete book: Copies are currently issued in Transaction ${activeIssue.transactionId}`, 'error');
      return { success: false, message: 'Copies currently issued' };
    }
    setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
    notify(`Book ${bookId} removed from catalog`, 'success');

    fetch(`/api/books/${bookId}`, { method: 'DELETE' }).catch((err) => console.warn('Cloud SQL sync:', err));

    return { success: true, message: 'Book deleted' };
  };

  // ---------------- MEMBER OPERATIONS ----------------
  const addMember = (memberData: Omit<Member, 'memberId' | 'registrationDate'>): Member => {
    const nextNum = String(members.length + 1).padStart(3, '0');
    const newMember: Member = {
      ...memberData,
      memberId: `MEM${nextNum}`,
      registrationDate: SYSTEM_TODAY,
    };
    setMembers((prev) => [newMember, ...prev]);
    notify(`Member registered: ${newMember.name} (ID: ${newMember.memberId})`, 'success');

    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember),
    }).catch((err) => console.warn('Cloud SQL sync:', err));

    return newMember;
  };

  const updateMember = (memberId: string, updates: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.memberId === memberId ? { ...m, ...updates } : m)));
    notify(`Member ${memberId} profile updated`, 'success');

    fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Cloud SQL sync:', err));
  };

  const deleteMember = (memberId: string): { success: boolean; message: string } => {
    const activeLoan = transactions.find((t) => t.memberId === memberId && t.status === 'Issued');
    if (activeLoan) {
      notify(`Cannot remove member: Active book issue exists (${activeLoan.bookTitle})`, 'error');
      return { success: false, message: 'Active issued books exist' };
    }
    setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    notify(`Member record ${memberId} removed`, 'success');

    fetch(`/api/members/${memberId}`, { method: 'DELETE' }).catch((err) => console.warn('Cloud SQL sync:', err));

    return { success: true, message: 'Member deleted' };
  };

  // ---------------- EMPLOYEE OPERATIONS (Admin Only) ----------------
  const addEmployee = (empData: Omit<Employee, 'employeeId' | 'joiningDate'>): Employee => {
    const nextNum = String(employees.length + 1).padStart(2, '0');
    const newEmp: Employee = {
      ...empData,
      employeeId: `EMP${nextNum}`,
      joiningDate: SYSTEM_TODAY,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    notify(`Employee added: ${newEmp.name} (ID: ${newEmp.employeeId})`, 'success');

    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmp),
    }).catch((err) => console.warn('Cloud SQL sync:', err));

    return newEmp;
  };

  const updateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.employeeId === employeeId ? { ...e, ...updates } : e)));
    notify(`Employee ${employeeId} updated`, 'success');

    fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Cloud SQL sync:', err));
  };

  const deleteEmployee = (employeeId: string): { success: boolean; message: string } => {
    setEmployees((prev) => prev.filter((e) => e.employeeId !== employeeId));
    notify(`Employee record ${employeeId} removed`, 'success');

    fetch(`/api/employees/${employeeId}`, { method: 'DELETE' }).catch((err) => console.warn('Cloud SQL sync:', err));

    return { success: true, message: 'Employee deleted' };
  };

  // ---------------- ISSUE BOOK ----------------
  const issueBook = (
    bookId: string,
    memberId: string,
    days: number = 14,
    notes?: string
  ): { success: boolean; message: string; transactionId?: string } => {
    const book = books.find((b) => b.bookId === bookId);
    if (!book) {
      notify('Book not found in library catalog', 'error');
      return { success: false, message: 'Book not found' };
    }

    if (book.availableCopies <= 0) {
      notify(`Book "${book.title}" has 0 available copies in stacks`, 'error');
      return { success: false, message: 'No copies available' };
    }

    const member = members.find((m) => m.memberId === memberId);
    if (!member) {
      notify('Member ID not found', 'error');
      return { success: false, message: 'Member not found' };
    }

    if (member.status !== 'Active') {
      notify(`Member ${member.name} status is Inactive. Cannot issue book.`, 'error');
      return { success: false, message: 'Member inactive' };
    }

    // Check borrower active limit (e.g., student max 3, faculty max 6)
    const activeBorrows = transactions.filter((t) => t.memberId === memberId && t.status === 'Issued');
    const limit = member.category === 'Faculty' ? 6 : 3;
    if (activeBorrows.length >= limit) {
      notify(`Borrow limit reached (${limit} books) for ${member.category} ${member.name}`, 'warning');
      return { success: false, message: `Borrow limit reached (${limit})` };
    }

    // Calculate due date based on SYSTEM_TODAY
    const issueDateObj = new Date(SYSTEM_TODAY);
    const dueDateObj = new Date(issueDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + days);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    // Transaction ID
    const nextTxnId = `TXN${1000 + transactions.length + 1}`;
    const employeeId = currentUser?.role === 'employee' ? currentUser.id : 'EMP01';
    const employeeName = currentUser?.role === 'employee' ? currentUser.name : 'Suresh Kumar';

    const newTxn: Transaction = {
      transactionId: nextTxnId,
      bookId: book.bookId,
      bookTitle: book.title,
      memberId: member.memberId,
      memberName: member.name,
      employeeId,
      employeeName,
      issueDate: SYSTEM_TODAY,
      dueDate: dueDateStr,
      status: 'Issued',
      overdueDays: 0,
      notes: notes || `Issued to ${member.name} (${days} days)`,
    };

    // Decrease available copies by 1
    setBooks((prev) =>
      prev.map((b) => (b.bookId === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    setTransactions((prev) => [newTxn, ...prev]);
    notify(`Book "${book.title}" successfully issued to ${member.name}. Due on ${dueDateStr}.`, 'success');

    fetch('/api/transactions/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTxn),
    }).catch((err) => console.warn('Cloud SQL issue sync:', err));

    return { success: true, message: 'Book issued successfully', transactionId: nextTxnId };
  };

  // ---------------- RETURN BOOK ----------------
  const returnBook = (transactionId: string): { success: boolean; message: string; overdueDays?: number } => {
    const txn = transactions.find((t) => t.transactionId === transactionId);
    if (!txn) {
      notify('Transaction not found', 'error');
      return { success: false, message: 'Transaction not found' };
    }

    if (txn.status === 'Returned') {
      notify('This transaction is already marked as Returned', 'info');
      return { success: false, message: 'Already returned' };
    }

    // Calculate overdue days relative to return date
    const returnDate = SYSTEM_TODAY;
    const dueTime = new Date(txn.dueDate).getTime();
    const returnTime = new Date(returnDate).getTime();
    const diffDays = Math.max(0, Math.floor((returnTime - dueTime) / (1000 * 60 * 60 * 24)));

    // Update transaction
    setTransactions((prev) =>
      prev.map((t) =>
        t.transactionId === transactionId
          ? {
              ...t,
              status: 'Returned',
              returnDate,
              overdueDays: diffDays,
            }
          : t
      )
    );

    // Increase available copies by 1
    setBooks((prev) =>
      prev.map((b) =>
        b.bookId === txn.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b
      )
    );

    if (diffDays > 0) {
      notify(
        `Book "${txn.bookTitle}" returned by ${txn.memberName}. OVERDUE by ${diffDays} day(s). Available copies updated.`,
        'warning'
      );
    } else {
      notify(
        `Book "${txn.bookTitle}" successfully returned by ${txn.memberName} on time. Stacks updated.`,
        'success'
      );
    }

    fetch('/api/transactions/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, returnDate }),
    }).catch((err) => console.warn('Cloud SQL return sync:', err));

    return { success: true, message: 'Book returned successfully', overdueDays: diffDays };
  };

  // Compute stats
  const stats = useMemo(() => {
    const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0);
    const issuedBooks = transactions.filter((t) => t.status === 'Issued').length;

    // Check overdue against SYSTEM_TODAY
    const todayTime = new Date(SYSTEM_TODAY).getTime();
    const overdueBooks = transactions.filter((t) => {
      if (t.status !== 'Issued') return false;
      const dueTime = new Date(t.dueDate).getTime();
      return todayTime > dueTime;
    }).length;

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'Active').length;
    const totalEmployees = employees.length;

    const todayTransactionsCount = transactions.filter((t) => t.issueDate === SYSTEM_TODAY || t.returnDate === SYSTEM_TODAY).length;
    const todayAttendanceCount = attendance.filter((a) => a.date === SYSTEM_TODAY).length;

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalMembers,
      activeMembers,
      totalEmployees,
      todayTransactionsCount,
      todayAttendanceCount,
    };
  }, [books, transactions, members, employees, attendance]);

  const resetAllData = () => {
    setBooks(INITIAL_BOOKS);
    setEmployees(INITIAL_EMPLOYEES);
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAttendance(INITIAL_ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);

    fetch('/api/reset', { method: 'POST' }).catch((err) => console.warn('Cloud SQL reset sync:', err));
    notify('Database reset to initial college sample state', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser,
        activeRole,
        loginAs,
        logout,
        activeTab,
        setActiveTab,
        notification,
        notify,
        books,
        categories,
        employees,
        members,
        transactions,
        attendance,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        issueBook,
        returnBook,
        recordAttendanceLogin,
        recordAttendanceLogout,
        stats,
        resetAllData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
