/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Attendance Module (Employee Login/Logout Recording & Admin History)
 */

import React, { useState, useMemo } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import { AttendanceRecord } from '../types/library';
import {
  Calendar,
  Clock,
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  LogOut,
  LogIn,
  AlertCircle,
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { attendance, employees, activeRole, currentUser, recordAttendanceLogout } = useLibrary();

  const [filterEmployeeId, setFilterEmployeeId] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('');

  const isAdmin = activeRole === 'admin';

  // For Employee role, automatically restrict to their own ID
  const effectiveEmployeeFilter = !isAdmin && currentUser ? currentUser.id : filterEmployeeId;

  const filteredAttendance = useMemo(() => {
    return attendance.filter((rec) => {
      const matchesEmp =
        effectiveEmployeeFilter === 'All' || rec.employeeId === effectiveEmployeeFilter;
      const matchesDate = !filterDate || rec.date === filterDate;
      return matchesEmp && matchesDate;
    });
  }, [attendance, effectiveEmployeeFilter, filterDate]);

  // Today's record for currently logged in employee
  const currentEmpTodayRecord = attendance.find(
    (a) => a.employeeId === currentUser?.id && a.date === SYSTEM_TODAY
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-stone-700" />
                <span>
                  {isAdmin ? 'Staff Attendance Register & Shift Logs' : 'My Shift Attendance Logs'}
                </span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                Date: {SYSTEM_TODAY}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isAdmin
                ? 'Comprehensive login and logout timestamps recorded during employee circulation desk duty.'
                : 'Your daily check-in and check-out timestamps recorded upon system login.'}
            </p>
          </div>

          {!isAdmin && currentEmpTodayRecord && !currentEmpTodayRecord.logoutTime && currentUser && (
            <div>
              <button
                onClick={() => recordAttendanceLogout(currentUser.id)}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>Mark Shift Logout Time</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls (Admin has employee dropdown, employee only sees date filter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
          {isAdmin && (
            <div>
              <select
                value={filterEmployeeId}
                onChange={(e) => setFilterEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="All">All Library Employees ({employees.length})</option>
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.name} ({e.employeeId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-mono"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-stone-500 font-medium">
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="text-stone-700 hover:underline"
              >
                Clear Date
              </button>
            )}
            <span>Showing {filteredAttendance.length} records</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Record ID</th>
                <th className="py-3 px-4 font-semibold">Employee</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Login Time (Check-In)</th>
                <th className="py-3 px-4 font-semibold">Logout Time (Check-Out)</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAttendance.map((rec) => {
                const isCurrentlyActive = !rec.logoutTime && rec.date === SYSTEM_TODAY;
                return (
                  <tr key={rec.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-stone-700">{rec.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{rec.employeeName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{rec.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700">{rec.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <LogIn className="w-3 h-3 text-emerald-600" />
                        {rec.loginTime}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {rec.logoutTime ? (
                        <span className="inline-flex items-center gap-1 font-mono font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          <LogOut className="w-3 h-3 text-stone-500" />
                          {rec.logoutTime}
                        </span>
                      ) : isCurrentlyActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          On Duty
                        </span>
                      ) : (
                        <span className="text-stone-400 font-mono">--:--</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'Completed'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rec.status === 'Completed' ? 'Logged Out' : 'Present'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAttendance.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            No attendance logs found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
