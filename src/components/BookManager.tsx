/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Book Management Module (Catalog, Search, Add, Update, Delete)
 */

import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types/library';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  MapPin,
  Layers,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const BookManager: React.FC = () => {
  const { books, categories, activeRole, addBook, updateBook, deleteBook, setActiveTab } = useLibrary();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Out of Stock'>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: 'Computer Science',
    edition: '1st Edition',
    publicationYear: 2023,
    shelfRackNo: 'Rack A-1',
    totalCopies: 5,
    availableCopies: 5,
  });

  const canManage = activeRole === 'admin';

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.isbn.includes(searchTerm) ||
        b.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.shelfRackNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;

      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'Available' && b.availableCopies > 0) ||
        (availabilityFilter === 'Out of Stock' && b.availableCopies === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, searchTerm, selectedCategory, availabilityFilter]);

  const handleOpenAdd = () => {
    setFormData({
      isbn: '978-',
      title: '',
      author: '',
      publisher: '',
      category: categories[0]?.name || 'Computer Science',
      edition: '1st Edition',
      publicationYear: new Date().getFullYear(),
      shelfRackNo: 'Rack A-1',
      totalCopies: 5,
      availableCopies: 5,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: Book) => {
    setEditingBook(b);
    setFormData({
      isbn: b.isbn,
      title: b.title,
      author: b.author,
      publisher: b.publisher,
      category: b.category,
      edition: b.edition,
      publicationYear: b.publicationYear,
      shelfRackNo: b.shelfRackNo,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;
    addBook({
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      category: formData.category,
      edition: formData.edition,
      publicationYear: Number(formData.publicationYear),
      shelfRackNo: formData.shelfRackNo,
      totalCopies: Number(formData.totalCopies),
      availableCopies: Number(formData.availableCopies),
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    updateBook(editingBook.bookId, {
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      category: formData.category,
      edition: formData.edition,
      publicationYear: Number(formData.publicationYear),
      shelfRackNo: formData.shelfRackNo,
      totalCopies: Number(formData.totalCopies),
      availableCopies: Number(formData.availableCopies),
    });
    setEditingBook(null);
  };

  const handleDelete = (bookId: string) => {
    const res = deleteBook(bookId);
    if (res.success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-stone-700" />
              <span>Book Management & Catalog</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              College library volume repository, shelf placement, availability check, and copy tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search Title, Author, ISBN, Book ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800 bg-white"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800 bg-white"
            >
              <option value="All">All Availability</option>
              <option value="Available">Available for Issue Only</option>
              <option value="Out of Stock">All Copies Issued (0 Available)</option>
            </select>
          </div>

          <div className="text-right flex items-center justify-end text-xs text-stone-500 font-medium">
            <span>Showing {filteredBooks.length} of {books.length} Books</span>
          </div>
        </div>
      </div>

      {/* Main Books Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Book ID</th>
                <th className="py-3 px-4 font-semibold">Title & Author</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Publisher & Ed.</th>
                <th className="py-3 px-4 font-semibold">Shelf / Rack</th>
                <th className="py-3 px-4 font-semibold text-center">Total Copies</th>
                <th className="py-3 px-4 font-semibold text-center">Available</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBooks.map((b) => {
                const isOutOfStock = b.availableCopies === 0;
                return (
                  <tr key={b.bookId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{b.bookId}</td>
                    <td className="py-3 px-4 max-w-[280px]">
                      <div className="font-semibold text-stone-900 truncate">{b.title}</div>
                      <div className="text-stone-500 text-[11px] truncate">{b.author}</div>
                      <div className="text-[10px] text-stone-400 font-mono">ISBN: {b.isbn}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700 font-medium">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div>{b.publisher}</div>
                      <div className="text-[11px] text-stone-500">{b.edition} ({b.publicationYear})</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {b.shelfRackNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-stone-700 font-mono">
                      {b.totalCopies}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800'
                            : b.availableCopies <= 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {b.availableCopies}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBook(b)}
                          className="px-2 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                          title="View Details"
                        >
                          View
                        </button>

                        {canManage && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(b)}
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                              title="Edit Book"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(b.bookId)}
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Book"
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

        {filteredBooks.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            No books found matching the current search criteria.
          </div>
        )}
      </div>

      {/* VIEW BOOK DETAILS MODAL */}
      {viewingBook && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {viewingBook.bookId}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2">{viewingBook.title}</h3>
                <p className="text-xs text-stone-600">By {viewingBook.author}</p>
              </div>
              <button
                onClick={() => setViewingBook(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-lg border border-stone-100">
              <div>
                <span className="text-stone-500 block">ISBN</span>
                <span className="font-mono font-medium text-stone-800">{viewingBook.isbn}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Category</span>
                <span className="font-medium text-stone-800">{viewingBook.category}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Publisher</span>
                <span className="font-medium text-stone-800">{viewingBook.publisher}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Edition & Year</span>
                <span className="font-medium text-stone-800">{viewingBook.edition} ({viewingBook.publicationYear})</span>
              </div>
              <div>
                <span className="text-stone-500 block">Shelf / Rack Location</span>
                <span className="font-medium text-amber-800 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  {viewingBook.shelfRackNo}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Stock Copies</span>
                <span className="font-medium text-stone-800">
                  {viewingBook.availableCopies} available / {viewingBook.totalCopies} total
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BOOK MODAL (ADMIN ONLY) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Book (Admin)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="e.g., Computer Organization and Architecture"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="e.g., William Stallings"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="978-013..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="e.g., Pearson Education"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Edition</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    placeholder="10th Edition"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Pub. Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Shelf / Rack</label>
                  <input
                    type="text"
                    value={formData.shelfRackNo}
                    onChange={(e) => setFormData({ ...formData, shelfRackNo: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="Rack A-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({ ...formData, totalCopies: val, availableCopies: val });
                    }}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Available Copies</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalCopies}
                    value={formData.availableCopies}
                    onChange={(e) => setFormData({ ...formData, availableCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
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
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Book ({editingBook.bookId})</h3>
              <button onClick={() => setEditingBook(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Edition</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Pub. Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Shelf / Rack</label>
                  <input
                    type="text"
                    value={formData.shelfRackNo}
                    onChange={(e) => setFormData({ ...formData, shelfRackNo: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Available Copies</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalCopies}
                    value={formData.availableCopies}
                    onChange={(e) => setFormData({ ...formData, availableCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium"
                >
                  Update Book
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
            <h4 className="font-bold text-sm text-stone-900 mb-1">Confirm Book Removal</h4>
            <p className="text-stone-600 mb-4">
              Are you sure you want to remove book <strong className="font-mono text-stone-900">{deleteConfirmId}</strong> from the catalog? This action will check whether active loans exist before deletion.
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
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
