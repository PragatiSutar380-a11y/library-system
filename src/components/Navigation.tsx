/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Top Navigation & Role Switcher
 */

import React, { useState } from 'react';
import { useLibrary, SYSTEM_TODAY } from '../context/LibraryContext';
import { ActiveNavTab, UserRole } from '../types/library';
import {
  BookOpen,
  Users,
  UserCheck,
  Calendar,
  ArrowRightLeft,
  FileText,
  LogOut,
  LogIn,
  LayoutDashboard,
  Database,
  BookDown,
  BookUp,
  User,
  History,
  ShieldAlert,
  Download,
} from 'lucide-react';

interface NavigationProps {
  onOpenLogin: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenLogin }) => {
  const { currentUser, activeRole, logout, activeTab, setActiveTab, stats, loginAs } = useLibrary();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Tab definitions based on role
  const getNavItems = () => {
    if (activeRole === 'admin') {
      return [
        { id: 'dashboard' as ActiveNavTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-profile' as ActiveNavTab, label: 'My Profile', icon: User },
        { id: 'books' as ActiveNavTab, label: 'Books', icon: BookOpen },
        { id: 'members' as ActiveNavTab, label: 'Members', icon: Users },
        { id: 'employees' as ActiveNavTab, label: 'Employees', icon: UserCheck },
        { id: 'attendance' as ActiveNavTab, label: 'Attendance', icon: Calendar },
        { id: 'transactions' as ActiveNavTab, label: 'Transactions', icon: ArrowRightLeft },
        { id: 'reports' as ActiveNavTab, label: 'Reports', icon: FileText },
        { id: 'schema-docs' as ActiveNavTab, label: 'Database & PHP', icon: Database },
      ];
    }

    if (activeRole === 'employee') {
      return [
        { id: 'dashboard' as ActiveNavTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-profile' as ActiveNavTab, label: 'My Profile', icon: User },
        { id: 'books' as ActiveNavTab, label: 'Books', icon: BookOpen },
        { id: 'members' as ActiveNavTab, label: 'Members', icon: Users },
        { id: 'issue-book' as ActiveNavTab, label: 'Issue Book', icon: BookDown },
        { id: 'return-book' as ActiveNavTab, label: 'Return Book', icon: BookUp },
        { id: 'transactions' as ActiveNavTab, label: 'Transactions', icon: ArrowRightLeft },
        { id: 'attendance' as ActiveNavTab, label: 'My Attendance', icon: Calendar },
        { id: 'schema-docs' as ActiveNavTab, label: 'Database & PHP', icon: Database },
      ];
    }

    // Member navigation
    return [
      { id: 'dashboard' as ActiveNavTab, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'my-profile' as ActiveNavTab, label: 'My Profile', icon: User },
      { id: 'my-books' as ActiveNavTab, label: 'My Issued Books', icon: BookOpen },
      { id: 'my-history' as ActiveNavTab, label: 'Borrowing History', icon: History },
      { id: 'schema-docs' as ActiveNavTab, label: 'Database & PHP', icon: Database },
    ];
  };

  const navItems = getNavItems();

  const getRoleBadgeColor = () => {
    switch (activeRole) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'employee':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'member':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const getRoleLabel = () => {
    switch (activeRole) {
      case 'admin':
        return 'Admin / Library Manager';
      case 'employee':
        return 'Staff / Employee';
      case 'member':
        return 'Library Member (Student/Faculty)';
      default:
        return 'Guest';
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with System Context & Fast Role Switcher */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-stone-100 tracking-wide">
            COLLEGE LIBRARY MANAGEMENT SYSTEM
          </span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden sm:inline text-stone-400">
            B.Sc. Computer Science Field Project
          </span>
          <span className="hidden md:inline text-stone-500">|</span>
          <span className="hidden md:inline text-stone-400">
            System Date: <strong className="text-stone-200 font-mono">{SYSTEM_TODAY}</strong>
          </span>
        </div>

        {/* Quick Role Switcher for Viva Evaluation */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 hidden sm:inline">Role:</span>
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch role for testing"
            >
              <span>{getRoleLabel()}</span>
              <span className="text-stone-400">▼</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-stone-800 rounded-md shadow-lg border border-stone-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-stone-100 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                  Switch Role (Academic Demo)
                </div>
                <button
                  onClick={() => {
                    loginAs('admin');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between ${
                    activeRole === 'admin' ? 'bg-purple-50 font-semibold text-purple-900' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-900">1. Admin (Manager)</div>
                    <div className="text-[11px] text-stone-500">Manage Books, Employees, Members, Reports</div>
                  </div>
                  {activeRole === 'admin' && <span className="text-purple-600">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs('employee', 'suresh');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between ${
                    activeRole === 'employee' ? 'bg-blue-50 font-semibold text-blue-900' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-900">2. Employee (Staff)</div>
                    <div className="text-[11px] text-stone-500">Issue/Return Books, Attendance, Catalog</div>
                  </div>
                  {activeRole === 'employee' && <span className="text-blue-600">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs('member', 'MEM001');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between ${
                    activeRole === 'member' ? 'bg-emerald-50 font-semibold text-emerald-900' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-900">3. Member (Student/Faculty)</div>
                    <div className="text-[11px] text-stone-500">View Issued Books, History, Profile</div>
                  </div>
                  {activeRole === 'member' && <span className="text-emerald-600">✓</span>}
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <button
              onClick={logout}
              className="text-stone-300 hover:text-rose-400 p-1 rounded hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Details */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm border border-stone-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-lg leading-tight tracking-tight">
                  Library Management System
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}
                >
                  {activeRole}
                </span>
              </div>
              <p className="text-xs text-stone-500">College Central Library & Departmental Archives</p>
            </div>
          </div>

          {/* User Session Info & Prominent Logout & Download Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download Complete Project ZIP Button */}
            <a
              href="/api/download-project-zip"
              download="library_management_system_xampp_project.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Download complete project source code + XAMPP PHP/MySQL package"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Download Project ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Clickable Profile Card */}
                <button
                  onClick={() => setActiveTab('my-profile')}
                  className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-left group cursor-pointer border border-transparent hover:border-stone-200"
                  title="Click to view full personal profile"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-stone-800 group-hover:text-amber-700 transition-colors flex items-center justify-end gap-1">
                      <span>{currentUser.name}</span>
                      <span className="text-[10px] font-normal text-stone-400 group-hover:text-amber-600 underline">
                        (Profile)
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      {currentUser.id} • {currentUser.email}
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-200 border border-stone-300 text-stone-800 flex items-center justify-center text-xs font-bold uppercase shadow-2xs group-hover:border-amber-400 group-hover:bg-amber-100 transition-colors">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>

                {/* Dedicated Visible Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  title="Log out of current account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation Items (Filtered by Role) */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 border-t border-stone-100 pt-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.id === 'books' && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full font-mono">
                    {stats.totalBooks}
                  </span>
                )}
                {item.id === 'transactions' && stats.overdueBooks > 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-rose-500 text-white rounded-full font-mono font-bold animate-pulse">
                    {stats.overdueBooks} due
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
