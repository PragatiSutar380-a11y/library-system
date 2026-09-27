/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Authentication Modal / Role Login
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types/library';
import { Shield, UserCheck, Users, Lock, LogIn, X, KeyRound, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, employees, members } = useLibrary();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'employee') {
      setUsername(employees[0]?.username || 'suresh');
      setPassword('password123');
    } else {
      setUsername(members[0]?.username || 'rahul01');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter your username or ID');
      return;
    }
    const result = loginAs(selectedRole, username.trim(), password);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">System Authentication</h3>
              <p className="text-xs text-stone-400">Library Management System Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="p-5 pb-3">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Select Role to Access
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('employee')}
              className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'employee'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Employee</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('member')}
              className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'member'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Member</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 pt-2 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {selectedRole === 'admin'
                ? 'Admin Username'
                : selectedRole === 'employee'
                ? 'Employee Username or ID (e.g., suresh or EMP01)'
                : 'Member Username or ID (e.g., rahul01 or MEM001)'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-800"
              placeholder="Enter username or ID"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-800"
              placeholder="••••••••"
            />
          </div>

          {selectedRole === 'employee' && (
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded border border-stone-200">
              * Note: Logging in as Employee automatically marks your attendance record for today.
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login as {selectedRole.toUpperCase()}</span>
            </button>
          </div>
        </form>

        {/* Academic Evaluation Quick-Credentials */}
        <div className="bg-stone-50 border-t border-stone-200 p-3 text-[11px] text-stone-600">
          <div className="font-semibold text-stone-700 flex items-center gap-1 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-stone-500" />
            <span>Academic Demonstration Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-stone-600">
            <div className="bg-white p-1 rounded border border-stone-200">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="bg-white p-1 rounded border border-stone-200">
              <strong>Staff:</strong> suresh / password123
            </div>
            <div className="bg-white p-1 rounded border border-stone-200">
              <strong>Member:</strong> rahul01 / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
