/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Role-Based Dashboard (Admin, Employee, Member)
 */

import React from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  UserCheck,
  Calendar,
  ArrowRightLeft,
  BookDown,
  BookUp,
  FileText,
  User,
  History,
  Shield,
  Search,
  LogOut,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeRole, currentUser, stats, books, members, transactions, attendance, setActiveTab, logout } = useLibrary();

  // ---------------- ADMIN DASHBOARD ----------------
  if (activeRole === 'admin') {
    const recentTransactions = transactions.slice(0, 5);
    const todayAttendance = attendance.filter((a) => a.date === SYSTEM_TODAY);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-stone-900 text-white rounded-xl p-6 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                Admin / Library Manager Portal
              </span>
              <span className="text-xs text-stone-400">| Session Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-100">
              Welcome, {currentUser?.name || 'Chief Librarian'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Centralized library operations, collection inventory, staff management, and system auditing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('issue-book' as any)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <BookDown className="w-3.5 h-3.5" />
              <span>Issue Book</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('my-profile')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Log out of system"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 6 Required Metric Cards for Admin */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Total Books</span>
              <BookOpen className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.totalBooks}</div>
            <div className="text-[11px] text-stone-500 mt-1">{books.length} distinct titles</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-medium">Available Books</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-900">{stats.availableBooks}</div>
            <div className="text-[11px] text-emerald-700 mt-1">Ready for circulation</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-medium">Issued Books</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{stats.issuedBooks}</div>
            <div className="text-[11px] text-blue-700 mt-1">Currently in loan</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/30 shadow-xs">
            <div className="flex items-center justify-between text-rose-700 mb-2">
              <span className="text-xs font-medium">Overdue Books</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-800">{stats.overdueBooks}</div>
            <div className="text-[11px] text-rose-700 mt-1">Due date passed</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Total Members</span>
              <Users className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.totalMembers}</div>
            <div className="text-[11px] text-stone-500 mt-1">{stats.activeMembers} active</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Total Staff</span>
              <UserCheck className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.totalEmployees}</div>
            <div className="text-[11px] text-stone-500 mt-1">{stats.todayAttendanceCount} logged in today</div>
          </div>
        </div>

        {/* Content Split: Recent Transactions & Staff Attendance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Issue / Return Transactions (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Recent Circulation Activity</h3>
                <p className="text-xs text-stone-500">Live book issues and returns recorded by library staff</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium underline"
              >
                View All Transactions →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 bg-stone-50">
                    <th className="py-2.5 px-3 font-semibold">Txn ID</th>
                    <th className="py-2.5 px-3 font-semibold">Book Title</th>
                    <th className="py-2.5 px-3 font-semibold">Member</th>
                    <th className="py-2.5 px-3 font-semibold">Staff (Issuer)</th>
                    <th className="py-2.5 px-3 font-semibold">Due Date</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentTransactions.map((tx) => {
                    const isOverdue = tx.status === 'Issued' && new Date(SYSTEM_TODAY) > new Date(tx.dueDate);
                    return (
                      <tr key={tx.transactionId} className="hover:bg-stone-50/70">
                        <td className="py-2.5 px-3 font-mono font-medium text-stone-700">
                          {tx.transactionId}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-stone-900 max-w-[200px] truncate">
                          {tx.bookTitle}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">{tx.memberName}</td>
                        <td className="py-2.5 px-3 text-stone-600">{tx.employeeName}</td>
                        <td className="py-2.5 px-3 text-stone-600 font-mono">{tx.dueDate}</td>
                        <td className="py-2.5 px-3">
                          {tx.status === 'Returned' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Returned
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                              Overdue ({tx.overdueDays}d)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              Issued
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Staff Attendance Summary */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Today's Staff Attendance</h3>
                  <p className="text-xs text-stone-500">Date: {SYSTEM_TODAY}</p>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium underline"
                >
                  History →
                </button>
              </div>

              <div className="space-y-3">
                {todayAttendance.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-lg border border-stone-100 bg-stone-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{rec.employeeName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{rec.employeeId}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        In: {rec.loginTime}
                      </span>
                      {rec.logoutTime && (
                        <div className="text-[10px] text-stone-500 mt-0.5">Out: {rec.logoutTime}</div>
                      )}
                    </div>
                  </div>
                ))}

                {todayAttendance.length === 0 && (
                  <div className="text-center py-6 text-xs text-stone-400">
                    No attendance recorded yet for today.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="text-xs text-stone-500 flex items-center justify-between">
                <span>Present staff today:</span>
                <span className="font-bold text-stone-800">{todayAttendance.length} / {stats.totalEmployees}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- EMPLOYEE DASHBOARD ----------------
  if (activeRole === 'employee') {
    const todayTransactions = transactions.filter(
      (t) => t.issueDate === SYSTEM_TODAY || t.returnDate === SYSTEM_TODAY
    );

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-stone-900 text-white rounded-xl p-6 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                Library Staff / Desk Portal
              </span>
              <span className="text-xs text-stone-400">| Shift Logged In</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-100">
              Staff Desk: {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Operational desk for book checkout, check-in, patron eligibility, and stack availability checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('issue-book')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <BookDown className="w-3.5 h-3.5" />
              <span>Issue Book</span>
            </button>
            <button
              onClick={() => setActiveTab('return-book')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookUp className="w-3.5 h-3.5" />
              <span>Return Book</span>
            </button>
            <button
              onClick={() => setActiveTab('my-profile')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Log out of staff desk and record departure attendance"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 4 Required Metric Cards for Employee */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Available Books</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.availableBooks}</div>
            <div className="text-[11px] text-stone-500 mt-1">In stacks & on shelves</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Currently Issued</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.issuedBooks}</div>
            <div className="text-[11px] text-stone-500 mt-1">With active borrowers</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Today's Transactions</span>
              <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{todayTransactions.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">Issues and returns today</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Registered Members</span>
              <Users className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stats.totalMembers}</div>
            <div className="text-[11px] text-stone-500 mt-1">Students & Faculty</div>
          </div>
        </div>

        {/* Operational Quick Actions & Today's Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Action Tiles */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Standard Circulation Operations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('issue-book')}
                className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-amber-500 text-stone-950 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <BookDown className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-stone-900">Issue Book (Check-Out)</div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Validate member ID, select available copy, record due date, decrement copies.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('return-book')}
                className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <BookUp className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-stone-900">Return Book (Check-In)</div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Record return date, calculate overdue status, increment available copies.
                </p>
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Looking for a volume?</span>
              <button
                onClick={() => setActiveTab('books')}
                className="text-stone-800 font-semibold underline"
              >
                Search Book Catalog →
              </button>
            </div>
          </div>

          {/* Today's Transactions at this desk */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Today's Desk Transactions</h3>
                <p className="text-xs text-stone-500">Date: {SYSTEM_TODAY}</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium underline"
              >
                All Logs →
              </button>
            </div>

            <div className="space-y-2">
              {todayTransactions.length > 0 ? (
                todayTransactions.map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="p-2.5 rounded-lg border border-stone-100 bg-stone-50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{tx.bookTitle}</div>
                      <div className="text-[11px] text-stone-500">
                        {tx.memberName} ({tx.memberId}) • Txn: {tx.transactionId}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tx.status === 'Returned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-stone-400">
                  No issues or returns processed today yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MEMBER DASHBOARD ----------------
  const myMemberId = currentUser?.id || 'MEM001';
  const myMember = members.find((m) => m.memberId === myMemberId) || members[0];
  const myLoans = transactions.filter((t) => t.memberId === myMember.memberId);
  const myIssuedLoans = myLoans.filter((t) => t.status === 'Issued');
  const myReturnedLoans = myLoans.filter((t) => t.status === 'Returned');
  const myOverdueLoans = myIssuedLoans.filter((t) => new Date(SYSTEM_TODAY) > new Date(t.dueDate));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-stone-900 text-white rounded-xl p-6 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
              Library Member Account ({myMember.category})
            </span>
            <span className="text-xs text-stone-400">| ID: {myMember.memberId}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-100">
            Welcome, {myMember.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Department: {myMember.department || 'Academic Scholar'} • Status: {myMember.status}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('my-books')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-white text-stone-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Issued Books ({myIssuedLoans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-profile')}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log out of Member account"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 4 Required Metric Cards for Member */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Currently Borrowed</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{myIssuedLoans.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Books currently in hand</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Due Soon</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {myIssuedLoans.filter((t) => !myOverdueLoans.includes(t)).length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Within regular loan window</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">Overdue Books</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-800">{myOverdueLoans.length}</div>
          <div className="text-[11px] text-rose-700 mt-1">Requires immediate return</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Borrowing History</span>
            <History className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{myReturnedLoans.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Past completed returns</div>
        </div>
      </div>

      {/* Currently Issued Books Table */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Currently Issued Books</h3>
            <p className="text-xs text-stone-500">Please return books by the due date to avoid overdue notices.</p>
          </div>
        </div>

        {myIssuedLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 bg-stone-50">
                  <th className="py-2.5 px-3 font-semibold">Transaction ID</th>
                  <th className="py-2.5 px-3 font-semibold">Book Title</th>
                  <th className="py-2.5 px-3 font-semibold">Issue Date</th>
                  <th className="py-2.5 px-3 font-semibold">Due Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myIssuedLoans.map((loan) => {
                  const isOverdue = new Date(SYSTEM_TODAY) > new Date(loan.dueDate);
                  return (
                    <tr key={loan.transactionId} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-mono font-medium text-stone-700">
                        {loan.transactionId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-stone-900">
                        {loan.bookTitle}
                        <span className="text-[11px] text-stone-500 block font-mono">ID: {loan.bookId}</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 font-mono">{loan.issueDate}</td>
                      <td className="py-2.5 px-3 text-stone-600 font-mono font-semibold">
                        {loan.dueDate}
                      </td>
                      <td className="py-2.5 px-3">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                            Active Issue
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
            <BookOpen className="w-6 h-6 mx-auto text-stone-400 mb-2" />
            <p>You have no books currently issued.</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Visit the library desk to borrow books.</p>
          </div>
        )}
      </div>
    </div>
  );
};
