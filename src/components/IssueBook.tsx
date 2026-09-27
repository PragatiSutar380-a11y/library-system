/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Issue Book Module (Check-Out)
 */

import React, { useState } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import { BookDown, Search, CheckCircle, AlertTriangle, User, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const IssueBook: React.FC = () => {
  const { books, members, transactions, currentUser, issueBook, setActiveTab } = useLibrary();

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loanDays, setLoanDays] = useState(14);
  const [remarks, setRemarks] = useState('');

  // Selected member details
  const selectedMember = members.find((m) => m.memberId === selectedMemberId);
  const memberActiveBorrows = transactions.filter(
    (t) => t.memberId === selectedMemberId && t.status === 'Issued'
  );
  const borrowLimit = selectedMember?.category === 'Faculty' ? 6 : 3;
  const isMemberEligible = selectedMember && selectedMember.status === 'Active' && memberActiveBorrows.length < borrowLimit;

  // Selected book details
  const selectedBook = books.find((b) => b.bookId === selectedBookId);
  const isBookAvailable = selectedBook && selectedBook.availableCopies > 0;

  // Computed Due Date
  const issueDateObj = new Date(SYSTEM_TODAY);
  const dueDateObj = new Date(issueDateObj);
  dueDateObj.setDate(dueDateObj.getDate() + loanDays);
  const computedDueDate = dueDateObj.toISOString().split('T')[0];

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) return;

    const res = issueBook(selectedBookId, selectedMemberId, loanDays, remarks);
    if (res.success) {
      setSelectedBookId('');
      setSelectedMemberId('');
      setRemarks('');
      // Navigate to transactions or show success
      setActiveTab('transactions');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            <BookDown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Issue Book (Circulation Check-Out)</h2>
            <p className="text-xs text-stone-500">
              Select an active member and an available book copy. Stacks inventory automatically decrements upon submission.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Column (2 Cols) */}
        <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
            {/* 1. Member Selection */}
            <div>
              <label className="block text-stone-800 font-semibold mb-1 flex items-center justify-between">
                <span>1. Select Member (Borrower) *</span>
                {selectedMember && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isMemberEligible ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {isMemberEligible ? 'Eligible to Borrow' : 'Ineligible / Limit Exceeded'}
                  </span>
                )}
              </label>
              <select
                required
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-800"
              >
                <option value="">-- Choose Member from Registry --</option>
                {members.map((m) => {
                  const borrows = transactions.filter((t) => t.memberId === m.memberId && t.status === 'Issued').length;
                  return (
                    <option key={m.memberId} value={m.memberId}>
                      {m.memberId} - {m.name} ({m.category} • {m.department || 'General'}) [Active Loans: {borrows}]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Book Selection */}
            <div>
              <label className="block text-stone-800 font-semibold mb-1 flex items-center justify-between">
                <span>2. Select Book to Issue *</span>
                {selectedBook && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isBookAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {isBookAvailable ? `${selectedBook.availableCopies} Copies Available` : '0 Copies in Stacks'}
                  </span>
                )}
              </label>
              <select
                required
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-800"
              >
                <option value="">-- Choose Book from Catalog --</option>
                {books.map((b) => (
                  <option key={b.bookId} value={b.bookId} disabled={b.availableCopies === 0}>
                    {b.bookId} - {b.title} (By {b.author}) [{b.shelfRackNo}] - Available: {b.availableCopies}/{b.totalCopies}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Duration & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Issue Duration</label>
                <select
                  value={loanDays}
                  onChange={(e) => setLoanDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value={7}>7 Days (Short Loan)</option>
                  <option value={14}>14 Days (Standard Student Loan)</option>
                  <option value={21}>21 Days (Extended Exam Loan)</option>
                  <option value={30}>30 Days (Faculty Research Loan)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Calculated Due Date</label>
                <div className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{computedDueDate}</span>
                </div>
              </div>
            </div>

            {/* 4. Notes / Remarks */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">Issue Remarks / Purpose</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g., Reference textbook for Operating Systems lab assignment"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-mono">
                Issuing Staff ID: {currentUser?.id || 'EMP01'}
              </span>
              <button
                type="submit"
                disabled={!isMemberEligible || !isBookAvailable}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer ${
                  isMemberEligible && isBookAvailable
                    ? 'bg-stone-900 hover:bg-stone-800 text-white'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <BookDown className="w-4 h-4" />
                <span>Confirm & Issue Book</span>
              </button>
            </div>
          </form>
        </div>

        {/* Verification Summary Side Panel */}
        <div className="space-y-4">
          {/* Member Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs text-xs">
            <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-600" />
              <span>Borrower Eligibility</span>
            </h4>
            {selectedMember ? (
              <div className="space-y-2 text-stone-600">
                <div className="font-semibold text-stone-900">{selectedMember.name}</div>
                <div>ID: <span className="font-mono">{selectedMember.memberId}</span></div>
                <div>Category: <span className="font-medium text-stone-800">{selectedMember.category}</span></div>
                <div>Status: <span className="text-emerald-700 font-medium">{selectedMember.status}</span></div>
                <div className="pt-1 border-t border-stone-100">
                  Active Loans: <span className="font-bold">{memberActiveBorrows.length}</span> / {borrowLimit} allowed
                </div>
              </div>
            ) : (
              <p className="text-stone-400 py-4 text-center italic">
                No member selected yet.
              </p>
            )}
          </div>

          {/* Book Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs text-xs">
            <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-stone-600" />
              <span>Book Stack Location</span>
            </h4>
            {selectedBook ? (
              <div className="space-y-2 text-stone-600">
                <div className="font-semibold text-stone-900">{selectedBook.title}</div>
                <div>Author: {selectedBook.author}</div>
                <div>Location: <span className="font-mono text-amber-800 bg-amber-50 px-1 rounded">{selectedBook.shelfRackNo}</span></div>
                <div>Category: {selectedBook.category}</div>
                <div className="pt-1 border-t border-stone-100">
                  Available in Library: <strong className="text-emerald-700 font-mono text-sm">{selectedBook.availableCopies}</strong> / {selectedBook.totalCopies} copies
                </div>
              </div>
            ) : (
              <p className="text-stone-400 py-4 text-center italic">
                No book selected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
