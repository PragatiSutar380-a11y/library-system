/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Return Book Module (Check-In)
 */

import React, { useState } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import { BookUp, Search, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

export const ReturnBook: React.FC = () => {
  const { transactions, returnBook, setActiveTab } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxnId, setSelectedTxnId] = useState('');
  const [returnConfirmTxnId, setReturnConfirmTxnId] = useState<string | null>(null);

  // Active issued transactions waiting for return
  const issuedTransactions = transactions.filter((t) => t.status === 'Issued');

  const filteredIssued = issuedTransactions.filter((t) => {
    const s = searchTerm.toLowerCase();
    return (
      t.transactionId.toLowerCase().includes(s) ||
      (t.bookTitle && t.bookTitle.toLowerCase().includes(s)) ||
      (t.memberName && t.memberName.toLowerCase().includes(s)) ||
      t.memberId.toLowerCase().includes(s) ||
      t.bookId.toLowerCase().includes(s)
    );
  });

  const handleReturnAction = (txnId: string) => {
    returnBook(txnId);
    setReturnConfirmTxnId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              <BookUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Return Book (Circulation Check-In)</h2>
              <p className="text-xs text-stone-500">
                Process volume returns from members, compute overdue status, and immediately restock shelf availability.
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
            System Return Date: <strong className="font-mono text-stone-900">{SYSTEM_TODAY}</strong>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Member ID, Book Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Issued Books Pending Return */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Books Currently In Loan ({filteredIssued.length} pending returns)
          </span>
          <span className="text-[11px] text-stone-500">
            Click 'Process Return' to restore book to available copies
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Book Details</th>
                <th className="py-3 px-4 font-semibold">Member (Borrower)</th>
                <th className="py-3 px-4 font-semibold">Issue Date</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Overdue Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredIssued.map((tx) => {
                const isOverdue = new Date(SYSTEM_TODAY) > new Date(tx.dueDate);
                const dueTime = new Date(tx.dueDate).getTime();
                const todayTime = new Date(SYSTEM_TODAY).getTime();
                const overdueDays = Math.max(0, Math.floor((todayTime - dueTime) / (1000 * 60 * 60 * 24)));

                return (
                  <tr key={tx.transactionId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{tx.transactionId}</td>
                    <td className="py-3 px-4 max-w-[240px]">
                      <div className="font-semibold text-stone-900 truncate">{tx.bookTitle}</div>
                      <div className="text-[11px] text-stone-500 font-mono">Book ID: {tx.bookId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900">{tx.memberName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{tx.memberId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{tx.issueDate}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-stone-800">{tx.dueDate}</td>
                    <td className="py-3 px-4">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Overdue by {overdueDays} day(s)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Within Due Date
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setReturnConfirmTxnId(tx.transactionId)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto shadow-xs cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Process Return</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredIssued.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            {searchTerm
              ? 'No issued books match your search query.'
              : 'All issued books have been successfully returned. No pending issues.'}
          </div>
        )}
      </div>

      {/* CONFIRM RETURN MODAL */}
      {returnConfirmTxnId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-stone-200 text-xs">
            <h4 className="font-bold text-sm text-stone-900 mb-1">Confirm Book Return</h4>
            <p className="text-stone-600 mb-4">
              Return book for Transaction <strong className="font-mono text-stone-900">{returnConfirmTxnId}</strong>? Available copies will immediately increase by 1, and the return date ({SYSTEM_TODAY}) will be permanently recorded.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReturnConfirmTxnId(null)}
                className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturnAction(returnConfirmTxnId)}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium shadow-xs"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
