/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Reports Module (Admin Exclusive: Attendance, Issued, Returned, Overdue, Availability, Members, Employees)
 */

import React, { useState } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  BookOpen,
  ArrowRightLeft,
  AlertTriangle,
  Users,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

type ReportType =
  | 'attendance'
  | 'issued'
  | 'returned'
  | 'overdue'
  | 'availability'
  | 'members'
  | 'employees';

export const ReportsViewer: React.FC = () => {
  const { activeRole, books, members, employees, transactions, attendance } = useLibrary();
  const [selectedReport, setSelectedReport] = useState<ReportType>('issued');

  if (activeRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center max-w-lg mx-auto my-12">
        <h3 className="text-base font-bold text-stone-900 mb-1">Access Restricted</h3>
        <p className="text-xs text-stone-600">Only Library Administrators have permission to access institutional reports.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${SYSTEM_TODAY}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Report Data based on selected report
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'attendance': {
        const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Date', 'Login Time', 'Logout Time', 'Status'];
        const rows = attendance.map((a) => [
          a.id,
          a.employeeId,
          a.employeeName,
          a.date,
          a.loginTime,
          a.logoutTime || 'Active',
          a.status,
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">1. Staff Attendance & Shift Log Report</h3>
              <button
                onClick={() => exportCSV('staff_attendance_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{a.id}</td>
                      <td className="py-2 px-3 font-mono">{a.employeeId}</td>
                      <td className="py-2 px-3 font-medium">{a.employeeName}</td>
                      <td className="py-2 px-3 font-mono">{a.date}</td>
                      <td className="py-2 px-3 font-mono text-emerald-700">{a.loginTime}</td>
                      <td className="py-2 px-3 font-mono text-stone-600">{a.logoutTime || '--:--'}</td>
                      <td className="py-2 px-3">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'issued': {
        const issuedList = transactions.filter((t) => t.status === 'Issued');
        const headers = ['Txn ID', 'Book ID', 'Book Title', 'Member ID', 'Member Name', 'Issue Date', 'Due Date', 'Staff'];
        const rows = issuedList.map((t) => [
          t.transactionId,
          t.bookId,
          t.bookTitle || '',
          t.memberId,
          t.memberName || '',
          t.issueDate,
          t.dueDate,
          t.employeeName || '',
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">2. Currently Issued Books Report ({issuedList.length} volumes)</h3>
              <button
                onClick={() => exportCSV('issued_books_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {issuedList.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{t.transactionId}</td>
                      <td className="py-2 px-3 font-mono">{t.bookId}</td>
                      <td className="py-2 px-3 font-medium">{t.bookTitle}</td>
                      <td className="py-2 px-3 font-mono">{t.memberId}</td>
                      <td className="py-2 px-3">{t.memberName}</td>
                      <td className="py-2 px-3 font-mono">{t.issueDate}</td>
                      <td className="py-2 px-3 font-mono font-semibold">{t.dueDate}</td>
                      <td className="py-2 px-3">{t.employeeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'returned': {
        const returnedList = transactions.filter((t) => t.status === 'Returned');
        const headers = ['Txn ID', 'Book Title', 'Member Name', 'Issue Date', 'Due Date', 'Return Date', 'Overdue Days'];
        const rows = returnedList.map((t) => [
          t.transactionId,
          t.bookTitle || '',
          t.memberName || '',
          t.issueDate,
          t.dueDate,
          t.returnDate || '',
          t.overdueDays,
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">3. Returned Books Report ({returnedList.length} records)</h3>
              <button
                onClick={() => exportCSV('returned_books_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {returnedList.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{t.transactionId}</td>
                      <td className="py-2 px-3 font-medium">{t.bookTitle}</td>
                      <td className="py-2 px-3">{t.memberName}</td>
                      <td className="py-2 px-3 font-mono">{t.issueDate}</td>
                      <td className="py-2 px-3 font-mono">{t.dueDate}</td>
                      <td className="py-2 px-3 font-mono text-emerald-700 font-medium">{t.returnDate}</td>
                      <td className="py-2 px-3 font-mono">{t.overdueDays > 0 ? `${t.overdueDays} days` : 'On Time'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'overdue': {
        const overdueList = transactions.filter((t) => {
          if (t.status !== 'Issued') return false;
          return new Date(SYSTEM_TODAY) > new Date(t.dueDate);
        });
        const headers = ['Txn ID', 'Book Title', 'Member Name', 'Member Phone', 'Due Date', 'Days Overdue'];
        const rows = overdueList.map((t) => {
          const m = members.find((mem) => mem.memberId === t.memberId);
          const diffDays = Math.max(
            1,
            Math.floor((new Date(SYSTEM_TODAY).getTime() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24))
          );
          return [t.transactionId, t.bookTitle || '', t.memberName || '', m?.phone || '', t.dueDate, diffDays];
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900 text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>4. Overdue Books Report ({overdueList.length} urgent notices)</span>
              </h3>
              <button
                onClick={() => exportCSV('overdue_books_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {overdueList.map((t) => {
                    const m = members.find((mem) => mem.memberId === t.memberId);
                    const diffDays = Math.max(
                      1,
                      Math.floor((new Date(SYSTEM_TODAY).getTime() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24))
                    );
                    return (
                      <tr key={t.transactionId} className="hover:bg-rose-50/50">
                        <td className="py-2 px-3 font-mono">{t.transactionId}</td>
                        <td className="py-2 px-3 font-medium text-stone-900">{t.bookTitle}</td>
                        <td className="py-2 px-3">{t.memberName} ({t.memberId})</td>
                        <td className="py-2 px-3 font-mono">{m?.phone || 'N/A'}</td>
                        <td className="py-2 px-3 font-mono text-rose-700 font-bold">{t.dueDate}</td>
                        <td className="py-2 px-3 font-mono text-rose-700 font-bold">{diffDays} days</td>
                      </tr>
                    );
                  })}
                  {overdueList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-stone-400">
                        No overdue books currently in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'availability': {
        const headers = ['Book ID', 'ISBN', 'Title', 'Author', 'Category', 'Shelf Location', 'Total Copies', 'Available Copies'];
        const rows = books.map((b) => [
          b.bookId,
          b.isbn,
          b.title,
          b.author,
          b.category,
          b.shelfRackNo,
          b.totalCopies,
          b.availableCopies,
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">5. Book Stock & Shelf Availability Report</h3>
              <button
                onClick={() => exportCSV('book_availability_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {books.map((b) => (
                    <tr key={b.bookId} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{b.bookId}</td>
                      <td className="py-2 px-3 font-mono">{b.isbn}</td>
                      <td className="py-2 px-3 font-medium">{b.title}</td>
                      <td className="py-2 px-3 text-stone-600">{b.author}</td>
                      <td className="py-2 px-3">{b.category}</td>
                      <td className="py-2 px-3 font-mono text-amber-800">{b.shelfRackNo}</td>
                      <td className="py-2 px-3 font-mono text-center">{b.totalCopies}</td>
                      <td className="py-2 px-3 font-mono font-bold text-center">
                        <span className={b.availableCopies === 0 ? 'text-rose-600' : 'text-emerald-700'}>
                          {b.availableCopies}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'members': {
        const headers = ['Member ID', 'Name', 'Category', 'Department', 'Email', 'Phone', 'Registration Date', 'Status'];
        const rows = members.map((m) => [
          m.memberId,
          m.name,
          m.category,
          m.department || '',
          m.email,
          m.phone,
          m.registrationDate,
          m.status,
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">6. Registered Members Directory Report</h3>
              <button
                onClick={() => exportCSV('member_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {members.map((m) => (
                    <tr key={m.memberId} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{m.memberId}</td>
                      <td className="py-2 px-3 font-medium">{m.name}</td>
                      <td className="py-2 px-3">{m.category}</td>
                      <td className="py-2 px-3 text-stone-600">{m.department}</td>
                      <td className="py-2 px-3">{m.email}</td>
                      <td className="py-2 px-3 font-mono">{m.phone}</td>
                      <td className="py-2 px-3 font-mono">{m.registrationDate}</td>
                      <td className="py-2 px-3">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'employees': {
        const headers = ['Employee ID', 'Name', 'Role', 'Email', 'Phone', 'Joining Date', 'Status'];
        const rows = employees.map((e) => [
          e.employeeId,
          e.name,
          e.role,
          e.email,
          e.phone,
          e.joiningDate,
          e.status,
        ]);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">7. Library Staff & Employee Report</h3>
              <button
                onClick={() => exportCSV('employee_report', headers, rows)}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>{headers.map((h) => <th key={h} className="py-2.5 px-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {employees.map((e) => (
                    <tr key={e.employeeId} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono">{e.employeeId}</td>
                      <td className="py-2 px-3 font-medium">{e.name}</td>
                      <td className="py-2 px-3">{e.role}</td>
                      <td className="py-2 px-3">{e.email}</td>
                      <td className="py-2 px-3 font-mono">{e.phone}</td>
                      <td className="py-2 px-3 font-mono">{e.joiningDate}</td>
                      <td className="py-2 px-3">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-stone-700" />
            <h2 className="text-lg font-bold text-stone-900">Institutional Reports & Auditing</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Academic Field Project standard tabular reports for library operations, circulation, and staff records.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs">
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedReport('issued')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'issued'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Issued Books
          </button>
          <button
            onClick={() => setSelectedReport('returned')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'returned'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Returned Books
          </button>
          <button
            onClick={() => setSelectedReport('overdue')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'overdue'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Overdue Books
          </button>
          <button
            onClick={() => setSelectedReport('availability')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'availability'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Book Availability
          </button>
          <button
            onClick={() => setSelectedReport('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'attendance'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Staff Attendance
          </button>
          <button
            onClick={() => setSelectedReport('members')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'members'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setSelectedReport('employees')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedReport === 'employees'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Employees
          </button>
        </div>
      </div>

      {/* Report Canvas Container */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs print:border-none print:shadow-none">
        {renderReportContent()}
      </div>
    </div>
  );
};
