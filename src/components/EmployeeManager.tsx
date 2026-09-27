/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Employee Management Module (Admin Access Only)
 */

import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Employee } from '../types/library';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';

export const EmployeeManager: React.FC = () => {
  const { employees, activeRole, addEmployee, updateEmployee, deleteEmployee, attendance } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: 'password123',
    role: 'Assistant Librarian' as Employee['role'],
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Strict Role Check: Only Admin can access Employee Management
  if (activeRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1">Access Restricted: Administrator Only</h3>
        <p className="text-xs text-stone-600 mb-4">
          According to the Field Project security specification, library employees/staff cannot manage employee records. Only the Chief Librarian / Admin possesses authorization to create, modify, or remove employee accounts.
        </p>
        <span className="text-[11px] font-mono bg-stone-100 px-3 py-1 rounded text-stone-600">
          Current Role: {activeRole.toUpperCase()}
        </span>
      </div>
    );
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      password: 'password123',
      role: 'Assistant Librarian',
      status: 'Active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      address: emp.address,
      username: emp.username,
      password: emp.password || 'password123',
      role: emp.role,
      status: emp.status,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addEmployee({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      username: formData.username || formData.name.toLowerCase().replace(/\s+/g, ''),
      password: formData.password,
      role: formData.role,
      status: formData.status,
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    updateEmployee(editingEmployee.employeeId, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      status: formData.status,
    });
    setEditingEmployee(null);
  };

  const handleDelete = (empId: string) => {
    deleteEmployee(empId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-stone-700" />
                <span>Employee & Staff Management</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Maintain library staff accounts, designate operational roles, assign login credentials, and monitor duty status.
            </p>
          </div>

          <div>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search Employee Name, ID, Role..."
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
              <option value="All">All Employment Status</option>
              <option value="Active">Active Staff Only</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="text-right flex items-center justify-end text-xs text-stone-500 font-medium">
            <span>Showing {filteredEmployees.length} of {employees.length} Staff</span>
          </div>
        </div>
      </div>

      {/* Table of Employees */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Employee ID</th>
                <th className="py-3 px-4 font-semibold">Name & Role</th>
                <th className="py-3 px-4 font-semibold">Contact (Email & Phone)</th>
                <th className="py-3 px-4 font-semibold">Username</th>
                <th className="py-3 px-4 font-semibold">Joining Date</th>
                <th className="py-3 px-4 font-semibold text-center">Duty Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEmployees.map((emp) => {
                const totalAtt = attendance.filter((a) => a.employeeId === emp.employeeId).length;
                return (
                  <tr key={emp.employeeId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{emp.employeeId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{emp.name}</div>
                      <div className="text-[11px] text-stone-500">{emp.role}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div>{emp.email}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{emp.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700 bg-stone-50/50">
                      {emp.username}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{emp.joiningDate}</td>
                    <td className="py-3 px-4 text-center">
                      {emp.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="px-2 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(emp.employeeId)}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            No employee records match the given filter.
          </div>
        )}
      </div>

      {/* VIEW EMPLOYEE MODAL */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-stone-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {viewingEmployee.employeeId}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2">{viewingEmployee.name}</h3>
                <p className="text-xs text-stone-600">{viewingEmployee.role}</p>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-stone-50 p-4 rounded-lg border border-stone-100">
              <div>
                <span className="text-stone-500 block">Email Address</span>
                <span className="font-medium text-stone-800">{viewingEmployee.email}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Phone Number</span>
                <span className="font-mono font-medium text-stone-800">{viewingEmployee.phone}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Address</span>
                <span className="font-medium text-stone-800">{viewingEmployee.address}</span>
              </div>
              <div>
                <span className="text-stone-500 block">System Username</span>
                <span className="font-mono font-medium text-stone-800">{viewingEmployee.username}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Joining Date</span>
                <span className="font-mono font-medium text-stone-800">{viewingEmployee.joiningDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Account Status</span>
                <span className="font-medium text-stone-800">{viewingEmployee.status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Library Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="e.g., Manoj Shinde"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Assistant Librarian">Assistant Librarian</option>
                    <option value="Library Attendant">Library Attendant</option>
                    <option value="Cataloger">Cataloger</option>
                  </select>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="manoj@college.edu"
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
                <label className="block text-stone-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="Residential address"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Username (Login) *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="manoj01"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
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
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Employee ({editingEmployee.employeeId})</h3>
              <button onClick={() => setEditingEmployee(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Employee Name *</label>
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
                  <label className="block text-stone-700 font-medium mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Assistant Librarian">Assistant Librarian</option>
                    <option value="Library Attendant">Library Attendant</option>
                    <option value="Cataloger">Cataloger</option>
                  </select>
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
                <label className="block text-stone-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Username (Login) *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium"
                >
                  Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-stone-200 text-xs">
            <h4 className="font-bold text-sm text-stone-900 mb-1">Confirm Staff Removal</h4>
            <p className="text-stone-600 mb-4">
              Are you sure you want to delete staff account <strong className="font-mono text-stone-900">{deleteConfirmId}</strong>? They will no longer be able to log in to the circulation desk.
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
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
