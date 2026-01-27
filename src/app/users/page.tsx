'use client';

import React, { useState } from 'react';
import { Plus, Search, Mail, Shield, Edit2, Trash2 } from 'lucide-react';
import { users as initialUsers } from '@/data';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Modal, { ModalFooter } from '@/components/ui/Modal';

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  senior: 'Senior',
  junior: 'Junior',
  specialist: 'Spécialiste',
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  senior: 'bg-blue-100 text-blue-700',
  junior: 'bg-green-100 text-green-700',
  specialist: 'bg-amber-100 text-amber-700',
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'junior' as User['role'],
    title: '',
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.title) {
      const user: User = {
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        title: newUser.title,
        initials: newUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      };
      setUsers(prev => [...prev, user]);
      setNewUser({ name: '', email: '', role: 'junior', title: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-taxaidd-black">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérez les membres de votre équipe</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={user.name}
                  initials={user.initials}
                  color={user.color}
                  size="lg"
                />
                <div>
                  <h3 className="font-semibold text-taxaidd-black">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.title}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>{roleLabels[user.role]}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un utilisateur"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              placeholder="jean.dupont@taxaidd.fr"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={newUser.title}
              onChange={(e) => setNewUser(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Fiscaliste Senior"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            >
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="specialist">Spécialiste</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={!newUser.name || !newUser.email || !newUser.title}
          >
            Ajouter
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
