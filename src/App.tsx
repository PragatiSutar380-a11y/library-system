/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Main Application Shell & Role-Based Tab Routing
 */

import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navigation } from './components/Navigation';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './components/Dashboard';
import { BookManager } from './components/BookManager';
import { MemberManager } from './components/MemberManager';
import { EmployeeManager } from './components/EmployeeManager';
import { AttendanceManager } from './components/AttendanceManager';
import { IssueBook } from './components/IssueBook';
import { ReturnBook } from './components/ReturnBook';
import { TransactionsLedger } from './components/TransactionsLedger';
import { MemberPortal } from './components/MemberPortal';
import { UserProfile } from './components/UserProfile';
import { ReportsViewer } from './components/ReportsViewer';
import { DatabaseSchemaDocs } from './components/DatabaseSchemaDocs';
import { ShieldAlert, CheckCircle, Info, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

const MainContent: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const { activeTab, activeRole, notification, resetAllData } = useLibrary();

  // Role Access Guard
  const renderTabContent = () => {
    // Member restricted tabs
    if (activeRole === 'member') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'my-profile':
          return <UserProfile onOpenLogin={onOpenLogin} />;
        case 'my-books':
          return <MemberPortal view="books" />;
        case 'my-history':
          return <MemberPortal view="history" />;
        case 'schema-docs':
          return <DatabaseSchemaDocs />;
        default:
          return (
            <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center max-w-lg mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">Access Restricted: Member Account</h3>
              <p className="text-xs text-stone-600 mb-4">
                Library members are authorized to view personal profile and loan history only. Admin or staff privileges are required to access management modules.
              </p>
            </div>
          );
      }
    }

    // Employee restricted tabs
    if (activeRole === 'employee') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'my-profile':
          return <UserProfile onOpenLogin={onOpenLogin} />;
        case 'books':
          return <BookManager />;
        case 'members':
          return <MemberManager />;
        case 'issue-book':
          return <IssueBook />;
        case 'return-book':
          return <ReturnBook />;
        case 'transactions':
          return <TransactionsLedger />;
        case 'attendance':
          return <AttendanceManager />;
        case 'schema-docs':
          return <DatabaseSchemaDocs />;
        case 'employees':
        case 'reports':
          return (
            <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center max-w-lg mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">Access Restricted: Administrator Only</h3>
              <p className="text-xs text-stone-600 mb-4">
                According to the Field Project specifications, Library Staff cannot manage other employees or access administrative reports.
              </p>
            </div>
          );
        default:
          return <Dashboard />;
      }
    }

    // Admin (Full Access)
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-profile':
        return <UserProfile onOpenLogin={onOpenLogin} />;
      case 'books':
        return <BookManager />;
      case 'members':
        return <MemberManager />;
      case 'employees':
        return <EmployeeManager />;
      case 'attendance':
        return <AttendanceManager />;
      case 'transactions':
        return <TransactionsLedger />;
      case 'issue-book':
        return <IssueBook />;
      case 'return-book':
        return <ReturnBook />;
      case 'reports':
        return <ReportsViewer />;
      case 'schema-docs':
        return <DatabaseSchemaDocs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-800">
      <Navigation onOpenLogin={onOpenLogin} />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top duration-200">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border text-xs flex items-center gap-2.5 max-w-md ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : notification.type === 'error'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : notification.type === 'warning'
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : 'bg-stone-900 text-stone-100 border-stone-700'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="font-medium leading-tight">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>

      {/* Academic Project Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-stone-800">Library Management System</span>
            <span className="mx-2">•</span>
            <span>B.Sc. Computer Science Field Project (PHP + MySQL Architecture)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={resetAllData}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              title="Reset sample college data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sample DB</span>
            </button>
            <span className="text-stone-300">|</span>
            <span>Roles: Admin • Employee • Member</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <LibraryProvider>
      <MainContent onOpenLogin={() => setIsLoginModalOpen(true)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </LibraryProvider>
  );
}
