/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 */

export type UserRole = 'admin' | 'employee' | 'member';

export interface AuthSession {
  role: UserRole;
  id: string; // Admin ID, Employee ID (e.g. EMP001), or Member ID (e.g. MEM101)
  name: string;
  username: string;
  email: string;
  loginTime: string;
}

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password?: string;
  joiningDate: string;
  role: 'Assistant Librarian' | 'Library Attendant' | 'Cataloger';
  status: 'Active' | 'Inactive';
}

export interface Member {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: 'Student' | 'Faculty' | 'Staff';
  registrationDate: string;
  status: 'Active' | 'Inactive';
  department?: string;
  username?: string;
  password?: string;
}

export interface BookCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Book {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  edition: string;
  publicationYear: number;
  shelfRackNo: string;
  totalCopies: number;
  availableCopies: number;
}

export interface Transaction {
  transactionId: string;
  bookId: string;
  bookTitle?: string;
  memberId: string;
  memberName?: string;
  employeeId: string;
  employeeName?: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned';
  overdueDays: number;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  loginTime: string;
  logoutTime?: string;
  status: 'Present' | 'Completed' | 'Logged Out';
}

export type ActiveNavTab =
  | 'dashboard'
  | 'books'
  | 'members'
  | 'employees'
  | 'attendance'
  | 'transactions'
  | 'issue-book'
  | 'return-book'
  | 'my-books'
  | 'my-history'
  | 'my-profile'
  | 'reports'
  | 'schema-docs';
