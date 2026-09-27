/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Member Management Module (Students, Faculty, Staff)
 */

import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Member } from '../types/library';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  UserCheck,
} from 'lucide-react';

export const MemberManager: React.FC = () => {
  const { members, transactions, activeRole, addMember, updateMember, deleteMember } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Student' | 'Faculty' | 'Staff'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'Student' as 'Student' | 'Faculty' | 'Staff',
    department: 'B.Sc. Computer Science',
    status: 'Active' as 'Active' | 'Inactive',
    username: '',
    password: 'password123',
  });

  const canManage = activeRole === 'admin' || activeRole === 'employee';

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [members, searchTerm, categoryFilter, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      category: 'Student',
      department: 'B.Sc. Computer Science',
      status: 'Active',
      username: '',
      password: 'password123',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      email: m.email,
      phone: m.phone,
      address: m.address,
      category: m.category,
      department: m.department || '',
      status: m.status,
      username: m.username || '',
      password: m.password || 'password123',
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addMember({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      category: formData.category,
      department: formData.department,
      status: formData.status,
      username: formData.username || formData.name.toLowerCase().replace(/\s+/g, ''),
      password: formData.password,
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMember(editingMember.memberId, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      category: formData.category,
      department: formData.department,
      status: formData.status,
      username: formData.username,
      password: formData.password,
    });
    setEditingMember(null);
  };

  const handleDelete = (memberId: string) => {
    const res = deleteMember(memberId);
    if (res.success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-stone-700" />
              <span>Library Member Directory</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Registration, profile maintenance, and borrowing eligibility for students and faculty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Member</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search Name, ID, Email, Dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
            >
              <option value="All">All Categories (Student / Faculty / Staff)</option>
              <option value="Student">Students</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
            >
              <option value="All">All Status (Active & Inactive)</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive / Suspended</option>
            </select>
          </div>

          <div className="text-right flex items-center justify-end text-xs text-stone-500 font-medium">
            <span>Showing {filteredMembers.length} of {members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Table of Members */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Member ID</th>
                <th className="py-3 px-4 font-semibold">Name & Affiliation</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Contact (Phone / Email)</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-center">Active Loans</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMembers.map((m) => {
                const activeLoansCount = transactions.filter(
                  (t) => t.memberId === m.memberId && t.status === 'Issued'
                ).length;
                return (
                  <tr key={m.memberId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{m.memberId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{m.name}</div>
                      <div className="text-[11px] text-stone-500">{m.department || 'General'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          m.category === 'Faculty'
                            ? 'bg-purple-100 text-purple-800'
                            : m.category === 'Student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {m.category === 'Faculty' ? (
                          <Briefcase className="w-3 h-3" />
                        ) : (
                          <GraduationCap className="w-3 h-3" />
                        )}
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div>{m.email}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{m.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono">{m.registrationDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                          activeLoansCount > 0 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {activeLoansCount} books
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {m.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingMember(m)}
                          className="px-2 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                        >
                          Profile
                        </button>
                        {canManage && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                              title="Edit Member"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(m.memberId)}
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            No member accounts found matching your query.
          </div>
        )}
      </div>

      {/* VIEW MEMBER PROFILE MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-stone-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {viewingMember.memberId}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2">{viewingMember.name}</h3>
                <p className="text-xs text-stone-600">{viewingMember.category} • {viewingMember.department}</p>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-stone-50 p-4 rounded-lg border border-stone-100">
              <div>
                <span className="text-stone-500 block">Email Address</span>
                <span className="font-medium text-stone-800">{viewingMember.email}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Phone Number</span>
                <span className="font-mono font-medium text-stone-800">{viewingMember.phone}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Residential Address</span>
                <span className="font-medium text-stone-800">{viewingMember.address}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Registration Date</span>
                <span className="font-mono font-medium text-stone-800">{viewingMember.registrationDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Account Status</span>
                <span className="font-medium text-stone-800">{viewingMember.status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Register New Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="e.g., Anjali Sharma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Department / Course</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="e.g., B.Sc. CS Year 2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="student@college.edu"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="Hostel or Local Residential address"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Username (Login)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="e.g. anjali01"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Member ({editingMember.memberId})</h3>
              <button onClick={() => setEditingMember(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Department / Course</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Username (Login)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-stone-200 text-xs">
            <h4 className="font-bold text-sm text-stone-900 mb-1">Confirm Member Removal</h4>
            <p className="text-stone-600 mb-4">
              Are you sure you want to remove member <strong className="font-mono text-stone-900">{deleteConfirmId}</strong>? The system will ensure that no active issued books exist prior to deletion.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-xs"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
