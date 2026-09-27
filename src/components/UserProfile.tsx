/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * User Profile & Account Details View (Admin, Employee, Member)
 */

import React from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import {
  User,
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface UserProfileProps {
  onOpenLogin: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenLogin }) => {
  const {
    currentUser,
    activeRole,
    logout,
    members,
    employees,
    transactions,
    attendance,
    setActiveTab,
    loginAs,
  } = useLibrary();

  // If not logged in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 text-stone-500 flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-900">No Active User Session</h2>
          <p className="text-xs text-stone-500 mt-1">
            You are currently browsing as a guest. Please log in to view your profile and role features.
          </p>
        </div>
        <button
          onClick={onOpenLogin}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-amber-400" />
          <span>Open Login Screen</span>
        </button>

        <div className="pt-4 border-t border-stone-100">
          <span className="text-[11px] text-stone-400 block mb-2 font-medium">Or Quick Switch (Viva Evaluation):</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => loginAs('admin')}
              className="px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded text-xs font-medium transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => loginAs('employee', 'suresh')}
              className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-xs font-medium transition-colors"
            >
              Staff
            </button>
            <button
              onClick={() => loginAs('member', 'rahul01')}
              className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-medium transition-colors"
            >
              Member
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MEMBER PROFILE ----------------
  if (currentUser.role === 'member') {
    const member = members.find((m) => m.memberId === currentUser.id) || members[0];
    const myLoans = transactions.filter((t) => t.memberId === member.memberId);
    const myIssued = myLoans.filter((t) => t.status === 'Issued');
    const myReturned = myLoans.filter((t) => t.status === 'Returned');
    const myOverdue = myIssued.filter((t) => new Date(SYSTEM_TODAY) > new Date(t.dueDate));
    const maxLimit = member.category === 'Faculty' ? 6 : 3;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-stone-900">{member.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Member ID: {member.memberId}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {member.department || 'Student'} • Category: <strong className="text-stone-800">{member.category}</strong>
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                title="Log out of Member account"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg text-center">
              <span className="text-[11px] text-stone-500 block">Currently Issued</span>
              <span className="text-xl font-bold text-stone-900">{myIssued.length}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Max limit: {maxLimit}</span>
            </div>
            <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg text-center">
              <span className="text-[11px] text-stone-500 block">Total Borrowed</span>
              <span className="text-xl font-bold text-stone-900">{myLoans.length}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Lifetime checkouts</span>
            </div>
            <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg text-center">
              <span className="text-[11px] text-stone-500 block">Books Returned</span>
              <span className="text-xl font-bold text-emerald-700">{myReturned.length}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Returned safely</span>
            </div>
            <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg text-center">
              <span className="text-[11px] text-stone-500 block">Overdue Books</span>
              <span className={`text-xl font-bold ${myOverdue.length > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
                {myOverdue.length}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {myOverdue.length > 0 ? 'Action required' : 'Clean standing'}
              </span>
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-600" />
              <span>Personal & Membership Details</span>
            </h3>
            <span className="text-xs text-stone-500">Registered: {member.registrationDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Mail className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Email Address</span>
                <span className="font-semibold text-stone-900">{member.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Phone className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Phone Number</span>
                <span className="font-mono font-semibold text-stone-900">{member.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <BadgeCheck className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Membership Category</span>
                <span className="font-semibold text-stone-900">{member.category} (Limit: {maxLimit} books)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Login Timestamp</span>
                <span className="font-mono text-stone-900">{currentUser.loginTime}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Residential / Campus Address</span>
                <span className="text-stone-900">{member.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Buttons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('my-books')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View My Issued Books ({myIssued.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('my-history')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>View Borrowing History</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- EMPLOYEE PROFILE ----------------
  if (currentUser.role === 'employee') {
    const employee = employees.find((e) => e.employeeId === currentUser.id) || employees[0];
    const todayAtt = attendance.find((a) => a.employeeId === employee.employeeId && a.date === SYSTEM_TODAY);
    const myStaffTxns = transactions.filter((t) => t.employeeId === employee.employeeId);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-300 text-blue-800 flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
                {employee.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-stone-900">{employee.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    {employee.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Staff ID: {employee.employeeId}</p>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  {employee.role} • Central Library Operations
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                title="Log out & record shift departure"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Staff Desk</span>
              </button>
            </div>
          </div>

          {/* Attendance & Shift Card */}
          <div className="mt-5 p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Today's Shift Attendance Record ({SYSTEM_TODAY})</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  todayAtt?.status === 'Completed'
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {todayAtt?.status || 'Present'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-700 mt-2">
              <div>
                <span className="text-stone-500 block text-[11px]">Shift Login Time:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {todayAtt?.loginTime || currentUser.loginTime}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Shift Logout Time:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {todayAtt?.logoutTime || 'Logged In (Active Shift)'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Desk Transactions Handled:</span>
                <span className="font-semibold text-stone-900">{myStaffTxns.length} records</span>
              </div>
            </div>
            <p className="text-[11px] text-blue-800 mt-2.5">
              * Note: Clicking the <strong>Log Out</strong> button automatically records your departure time in the College Attendance Register.
            </p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-stone-600" />
              <span>Employee Employment Information</span>
            </h3>
            <span className="text-xs text-stone-500">Joined: {employee.joiningDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Mail className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Official Email</span>
                <span className="font-semibold text-stone-900">{employee.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Phone className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Contact Phone</span>
                <span className="font-mono font-semibold text-stone-900">{employee.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <User className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">System Username</span>
                <span className="font-mono font-semibold text-stone-900">{employee.username}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Current Session Start</span>
                <span className="font-mono text-stone-900">{currentUser.loginTime}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Residential Address</span>
                <span className="text-stone-900">{employee.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Staff Actions */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('issue-book')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Issue Book to Member</span>
            </button>
            <button
              onClick={() => setActiveTab('return-book')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Return / Check-In Book</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Attendance Log</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ADMIN PROFILE ----------------
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-800 flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
              <Shield className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">Admin ID: {currentUser.id}</p>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                Chief Administrator • College Central Library
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={logout}
              className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              title="Log out of Administrator account"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out of System</span>
            </button>
          </div>
        </div>

        {/* Admin Overview Details */}
        <div className="pt-5 space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-700" />
            <span>Administrator Credentials & Access Scope</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Mail className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Administrator Email</span>
                <span className="font-semibold text-stone-900">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <User className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">System Username</span>
                <span className="font-mono font-semibold text-stone-900">{currentUser.username}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">Session Started</span>
                <span className="font-mono font-semibold text-stone-900">{currentUser.loginTime}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100">
              <Calendar className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block text-[11px]">System Date</span>
                <span className="font-mono font-semibold text-stone-900">{SYSTEM_TODAY}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-lg text-xs text-purple-900">
            <div className="font-bold mb-1">Administrative Responsibilities:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-purple-800">
              <li>Manage complete employee lifecycle (Add, View, Update, Delete Staff)</li>
              <li>Monitor real-time and historical staff attendance logs</li>
              <li>Catalog books, maintain shelf locations, and adjust copy inventories</li>
              <li>Generate and export official administrative and circulation reports</li>
            </ul>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('books')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manage Books</span>
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Manage Employees</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View System Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
