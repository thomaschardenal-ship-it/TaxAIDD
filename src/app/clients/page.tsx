'use client';

import React, { useState } from 'react';
import { Plus, Search, Building2, Mail, Phone, Globe, MapPin, Edit2, Trash2, User, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useClients } from '@/context/ClientsContext';
import { Client, ClientContact } from '@/types';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    industry: '',
    address: '',
    website: '',
    siren: '',
    contacts: [],
  });
  const [newContact, setNewContact] = useState<Partial<ClientContact>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    isPrimary: false,
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    if (newClient.name && newClient.industry) {
      addClient({
        name: newClient.name,
        industry: newClient.industry,
        address: newClient.address,
        website: newClient.website,
        siren: newClient.siren,
        contacts: newClient.contacts,
      });
      setNewClient({ name: '', industry: '', address: '', website: '', siren: '', contacts: [] });
      setShowAddModal(false);
    }
  };

  const handleEditClient = () => {
    if (editingClient) {
      updateClient(editingClient);
      setEditingClient(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer ce client ?')) {
      deleteClient(clientId);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient({ ...client, contacts: client.contacts ? [...client.contacts] : [] });
    setShowEditModal(true);
  };

  const addContactToClient = (isEditing: boolean) => {
    if (newContact.name && newContact.email && newContact.role) {
      const contact: ClientContact = {
        id: `contact-${Date.now()}`,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        role: newContact.role,
        isPrimary: newContact.isPrimary,
      };

      if (isEditing && editingClient) {
        setEditingClient({
          ...editingClient,
          contacts: [...(editingClient.contacts || []), contact],
        });
      } else {
        setNewClient({
          ...newClient,
          contacts: [...(newClient.contacts || []), contact],
        });
      }
      setNewContact({ name: '', email: '', phone: '', role: '', isPrimary: false });
    }
  };

  const removeContact = (contactId: string, isEditing: boolean) => {
    if (isEditing && editingClient) {
      setEditingClient({
        ...editingClient,
        contacts: editingClient.contacts?.filter(c => c.id !== contactId),
      });
    } else {
      setNewClient({
        ...newClient,
        contacts: newClient.contacts?.filter(c => c.id !== contactId),
      });
    }
  };

  const ContactForm = ({ isEditing }: { isEditing: boolean }) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-sm mb-3">Ajouter un contact</h4>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={newContact.name}
          onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nom *"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedd-mint"
        />
        <input
          type="email"
          value={newContact.email}
          onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Email *"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedd-mint"
        />
        <input
          type="tel"
          value={newContact.phone}
          onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Telephone"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedd-mint"
        />
        <input
          type="text"
          value={newContact.role}
          onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
          placeholder="Fonction *"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedd-mint"
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={newContact.isPrimary}
            onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
            className="w-4 h-4 accent-wedd-mint"
          />
          Contact principal
        </label>
        <Button
          size="sm"
          onClick={() => addContactToClient(isEditing)}
          disabled={!newContact.name || !newContact.email || !newContact.role}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );

  const ContactsList = ({ contacts, isEditing }: { contacts?: ClientContact[], isEditing: boolean }) => (
    <div className="space-y-2">
      {contacts?.map(contact => (
        <div key={contact.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-wedd-mint/20 flex items-center justify-center">
              <User className="w-4 h-4 text-wedd-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{contact.name}</span>
                {contact.isPrimary && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-xs text-gray-500">{contact.role}</p>
            </div>
          </div>
          <button
            onClick={() => removeContact(contact.id, isEditing)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const ClientModal = ({ isEditing }: { isEditing: boolean }) => {
    const client = isEditing ? editingClient : newClient;
    const setClient = isEditing
      ? (updater: (prev: Client) => Client) => setEditingClient(prev => prev ? updater(prev) : null)
      : (updater: (prev: Partial<Client>) => Partial<Client>) => setNewClient(prev => updater(prev as Client));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={client?.name || ''}
              onChange={(e) => setClient((prev: any) => ({ ...prev, name: e.target.value }))}
              placeholder="Nom du client"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur *</label>
            <input
              type="text"
              value={client?.industry || ''}
              onChange={(e) => setClient((prev: any) => ({ ...prev, industry: e.target.value }))}
              placeholder="Technologies, Services, etc."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            value={client?.address || ''}
            onChange={(e) => setClient((prev: any) => ({ ...prev, address: e.target.value }))}
            placeholder="Adresse complete"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
            <input
              type="url"
              value={client?.website || ''}
              onChange={(e) => setClient((prev: any) => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SIREN</label>
            <input
              type="text"
              value={client?.siren || ''}
              onChange={(e) => setClient((prev: any) => ({ ...prev, siren: e.target.value }))}
              placeholder="123 456 789"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contacts</label>
          {client?.contacts && client.contacts.length > 0 && (
            <div className="mb-3">
              <ContactsList contacts={client.contacts} isEditing={isEditing} />
            </div>
          )}
          <ContactForm isEditing={isEditing} />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => {
            if (isEditing) {
              setShowEditModal(false);
              setEditingClient(null);
            } else {
              setShowAddModal(false);
            }
          }}>
            Annuler
          </Button>
          <Button
            onClick={isEditing ? handleEditClient : handleAddClient}
            disabled={!client?.name || !client?.industry}
          >
            {isEditing ? 'Enregistrer' : 'Creer'}
          </Button>
        </ModalFooter>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-wedd-black">Clients</h1>
          <p className="text-gray-500 mt-1">Gerez vos clients et leurs contacts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
          Nouveau client
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
              placeholder="Rechercher un client..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Client Header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-wedd-black">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.industry}</p>
                    {client.siren && (
                      <p className="text-xs text-gray-400 mt-1">SIREN: {client.siren}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(client)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {expandedClient === client.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {client.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{client.address}</span>
                  </div>
                )}
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-wedd-mint">
                    <Globe className="w-4 h-4" />
                    <span>{client.website.replace('https://', '')}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Expanded Contacts */}
            {expandedClient === client.id && client.contacts && client.contacts.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <h4 className="font-medium text-sm text-gray-700 mb-3">Contacts ({client.contacts.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {client.contacts.map(contact => (
                    <div key={contact.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{contact.name}</span>
                          {contact.isPrimary && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{contact.role}</p>
                      <div className="space-y-1 text-sm">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-600 hover:text-wedd-mint">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </a>
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-wedd-mint">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun client trouve</p>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nouveau client"
        size="lg"
      >
        <ClientModal isEditing={false} />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingClient(null);
        }}
        title="Modifier le client"
        size="lg"
      >
        <ClientModal isEditing={true} />
      </Modal>
    </div>
  );
}
