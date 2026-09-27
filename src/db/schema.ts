/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Relational Cloud SQL Database Schema (PostgreSQL with Drizzle ORM)
 */

import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users Table (System Login & Role Management)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID / Identifier
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('member'), // 'admin' | 'employee' | 'member'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Employees Table (Library Staff & Attendants)
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  employeeId: text('employee_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  username: text('username').notNull().unique(),
  joiningDate: text('joining_date').notNull(),
  role: text('role').notNull(), // 'Assistant Librarian' | 'Library Attendant' | 'Cataloger'
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Members Table (Students, Faculty, Registered Patrons)
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  memberId: text('member_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  category: text('category').notNull().default('Student'), // 'Student' | 'Faculty' | 'Staff'
  department: text('department'),
  registrationDate: text('registration_date').notNull(),
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  username: text('username'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Book Categories Table (Classification)
export const bookCategories = pgTable('book_categories', {
  id: serial('id').primaryKey(),
  categoryId: text('category_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Books Table (Catalog & Physical Inventory)
export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  bookId: text('book_id').notNull().unique(),
  isbn: text('isbn').notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  publisher: text('publisher').notNull(),
  categoryId: text('category_id'),
  category: text('category').notNull(),
  edition: text('edition').notNull(),
  publicationYear: integer('publication_year').notNull(),
  shelfRackNo: text('shelf_rack_no').notNull(),
  totalCopies: integer('total_copies').notNull(),
  availableCopies: integer('available_copies').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Transactions Table (Issue & Return Circulation Records)
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  transactionId: text('transaction_id').notNull().unique(),
  bookId: text('book_id').notNull(),
  bookTitle: text('book_title'),
  memberId: text('member_id').notNull(),
  memberName: text('member_name'),
  employeeId: text('employee_id').notNull(),
  employeeName: text('employee_name'),
  issueDate: text('issue_date').notNull(),
  dueDate: text('due_date').notNull(),
  returnDate: text('return_date'),
  status: text('status').notNull().default('Issued'), // 'Issued' | 'Returned'
  overdueDays: integer('overdue_days').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Attendance Table (Staff Duty Logins & Logouts)
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  recordId: text('record_id').notNull().unique(),
  employeeId: text('employee_id').notNull(),
  employeeName: text('employee_name').notNull(),
  date: text('date').notNull(),
  loginTime: text('login_time').notNull(),
  logoutTime: text('logout_time'),
  status: text('status').notNull().default('Present'), // 'Present' | 'Completed' | 'Logged Out'
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  book: one(books, {
    fields: [transactions.bookId],
    references: [books.bookId],
  }),
  member: one(members, {
    fields: [transactions.memberId],
    references: [members.memberId],
  }),
  employee: one(employees, {
    fields: [transactions.employeeId],
    references: [employees.employeeId],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.employeeId],
  }),
}));
