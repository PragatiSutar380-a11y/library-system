/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Transactions Ledger (Circulation History & Issue/Return Monitoring)
 */

import React, { useState, useMemo } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import {
  ArrowRightLeft,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Calendar,
  BookOpen,
  User,
} from 'lucide-react';

export const TransactionsLedger: React.FC = () => {
  const { transactions, activeRole, returnBook, setActiveTab } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Issued' | 'Returned' | 'Overdue'>('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        tx.transactionId.toLowerCase().includes(s) ||
        (tx.bookTitle && tx.bookTitle.toLowerCase().includes(s)) ||
        (tx.memberName && tx.memberName.toLowerCase().includes(s)) ||
        (tx.employeeName && tx.employeeName.toLowerCase().includes(s)) ||
        tx.memberId.toLowerCase().includes(s) ||
        tx.bookId.toLowerCase().includes(s);

      const isOverdue = tx.status === 'Issued' && new Date(SYSTEM_TODAY) > new Date(tx.dueDate);

      if (statusFilter === 'Issued') return matchesSearch && tx.status === 'Issued';
      if (statusFilter === 'Returned') return matchesSearch && tx.status === 'Returned';
      if (statusFilter === 'Overdue') return matchesSearch && isOverdue;

      return matchesSearch;
    });
  }, [transactions, searchTerm, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-stone-700" />
              <span>Circulation Transactions Log</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Complete historical record of issued and returned volumes, staff identifiers, and overdue monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('issue-book')}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              + Issue Book
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search Transaction ID, Book, Member, Staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
            >
              <option value="All">All Transactions ({transactions.length})</option>
              <option value="Issued">Currently Issued (Active Loans)</option>
              <option value="Returned">Completed (Returned to Stacks)</option>
              <option value="Overdue">Overdue Loans Only</option>
            </select>
          </div>

          <div className="text-right flex items-center justify-end text-xs text-stone-500 font-medium">
            <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Txn ID</th>
                <th className="py-3 px-4 font-semibold">Book Details</th>
                <th className="py-3 px-4 font-semibold">Member</th>
                <th className="py-3 px-4 font-semibold">Issued By (Staff)</th>
                <th className="py-3 px-4 font-semibold">Issue Date</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Return Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.map((tx) => {
                const isOverdue = tx.status === 'Issued' && new Date(SYSTEM_TODAY) > new Date(tx.dueDate);
                return (
                  <tr key={tx.transactionId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{tx.transactionId}</td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-semibold text-stone-900 truncate">{tx.bookTitle}</div>
                      <div className="text-[11px] text-stone-500 font-mono">ID: {tx.bookId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900">{tx.memberName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{tx.memberId}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div>{tx.employeeName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{tx.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{tx.issueDate}</td>
                    <td className="py-3 px-4 font-mono text-stone-800 font-semibold">{tx.dueDate}</td>
                    <td className="py-3 px-4 font-mono">
                      {tx.returnDate ? (
                        <span className="text-emerald-700 font-medium">{tx.returnDate}</span>
                      ) : (
                        <span className="text-stone-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {tx.status === 'Returned' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Returned
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          Overdue ({tx.overdueDays || 1}d)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                          Issued
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.status === 'Issued' ? (
                        <button
                          onClick={() => returnBook(tx.transactionId)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium transition-colors"
                          title="Quick Return"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Closed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            No transactions match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
