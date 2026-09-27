/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Member Portal (My Profile, My Issued Books, Borrowing History)
 */

import React from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import { User, BookOpen, History, AlertTriangle, CheckCircle, Clock, ShieldCheck, LogOut } from 'lucide-react';

interface MemberPortalProps {
  view: 'profile' | 'books' | 'history';
}

export const MemberPortal: React.FC<MemberPortalProps> = ({ view }) => {
  const { currentUser, members, transactions, logout } = useLibrary();

  const memberId = currentUser?.id || 'MEM001';
  const member = members.find((m) => m.memberId === memberId) || members[0];

  const myLoans = transactions.filter((t) => t.memberId === member.memberId);
  const myIssued = myLoans.filter((t) => t.status === 'Issued');
  const myReturned = myLoans.filter((t) => t.status === 'Returned');

  if (view === 'profile') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-2xl uppercase">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-stone-900">{member.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Member ID: {member.memberId}</p>
                <p className="text-xs text-stone-600 mt-1">{member.department || 'Student'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Log out of Member account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>

          <div className="pt-5 space-y-4 text-xs">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Academic & Contact Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-100">
              <div>
                <span className="text-stone-500 block">Membership Category</span>
                <span className="font-semibold text-stone-800">{member.category}</span>
              </div>

              <div>
                <span className="text-stone-500 block">Registration Date</span>
                <span className="font-mono text-stone-800">{member.registrationDate}</span>
              </div>

              <div>
                <span className="text-stone-500 block">Email Address</span>
                <span className="text-stone-800 font-medium">{member.email}</span>
              </div>

              <div>
                <span className="text-stone-500 block">Phone Number</span>
                <span className="font-mono text-stone-800">{member.phone}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-stone-500 block">Campus / Residential Address</span>
                <span className="text-stone-800">{member.address}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                Borrowing Limit: Up to <strong>{member.category === 'Faculty' ? '6 books' : '3 books'}</strong> simultaneously.
                Currently borrowed: <strong>{myIssued.length}</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'books') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-700" />
            <h2 className="text-lg font-bold text-stone-900">My Currently Issued Books</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Volumes currently in your possession. Return books on or before due date to library desk.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {myIssued.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <th className="py-3 px-4 font-semibold">Transaction ID</th>
                    <th className="py-3 px-4 font-semibold">Book Title</th>
                    <th className="py-3 px-4 font-semibold">Book ID</th>
                    <th className="py-3 px-4 font-semibold">Issue Date</th>
                    <th className="py-3 px-4 font-semibold">Due Date</th>
                    <th className="py-3 px-4 font-semibold">Issued By Staff</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myIssued.map((tx) => {
                    const isOverdue = new Date(SYSTEM_TODAY) > new Date(tx.dueDate);
                    const dueTime = new Date(tx.dueDate).getTime();
                    const todayTime = new Date(SYSTEM_TODAY).getTime();
                    const overdueDays = Math.max(0, Math.floor((todayTime - dueTime) / (1000 * 60 * 60 * 24)));

                    return (
                      <tr key={tx.transactionId} className="hover:bg-stone-50">
                        <td className="py-3 px-4 font-mono font-medium text-stone-800">{tx.transactionId}</td>
                        <td className="py-3 px-4 font-semibold text-stone-900">{tx.bookTitle}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{tx.bookId}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{tx.issueDate}</td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{tx.dueDate}</td>
                        <td className="py-3 px-4 text-stone-600">{tx.employeeName}</td>
                        <td className="py-3 px-4">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Overdue ({overdueDays}d)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                              Active Loan
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
            <div className="py-12 text-center text-xs text-stone-500">
              You do not have any books currently issued.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Borrowing History
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-stone-700" />
          <h2 className="text-lg font-bold text-stone-900">My Complete Borrowing History</h2>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Audit trail of all books borrowed and returned during your membership.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {myLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="py-3 px-4 font-semibold">Book Title</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Return Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myLoans.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-medium text-stone-800">{tx.transactionId}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{tx.bookTitle}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{tx.issueDate}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{tx.dueDate}</td>
                    <td className="py-3 px-4 font-mono">
                      {tx.returnDate ? (
                        <span className="text-emerald-700 font-medium">{tx.returnDate}</span>
                      ) : (
                        <span className="text-stone-400">Not Returned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {tx.status === 'Returned' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                          Issued
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-500 italic max-w-[200px] truncate">
                      {tx.notes || 'Standard loan'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone-500">
            No borrowing history recorded on your account.
          </div>
        )}
      </div>
    </div>
  );
};
