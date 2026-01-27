'use client';

import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Building2,
  Save,
  Check,
} from 'lucide-react';
import { currentUser } from '@/data';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sections: SettingsSection[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'organization', label: 'Organisation', icon: Building2 },
  { id: 'integrations', label: 'Intégrations', icon: Database },
  { id: 'language', label: 'Langue', icon: Globe },
  { id: 'email', label: 'Email', icon: Mail },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title,
    phone: '+33 1 23 45 67 89',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newProject: true,
    documentUploaded: true,
    commentMention: true,
    weeklyReport: false,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    showAvatars: true,
  });

  // Organization settings
  const [organization, setOrganization] = useState({
    name: 'TaxAIDD',
    defaultDomain: 'Fiscal',
    autoArchive: true,
    archiveAfterDays: 90,
  });

  // Language settings
  const [language, setLanguage] = useState({
    interface: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/Paris',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <Avatar
                name={profile.name}
                initials={currentUser.initials}
                color={currentUser.color}
                size="xl"
              />
              <div>
                <Button variant="outline" size="sm">Changer la photo</Button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-taxaidd-black">Canaux de notification</h3>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-gray-500">Recevoir les notifications dans le navigateur</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-taxaidd-black">Types de notifications</h3>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Nouveau projet</p>
                  <p className="text-sm text-gray-500">Quand un nouveau projet est créé</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.newProject}
                  onChange={(e) => setNotifications(prev => ({ ...prev, newProject: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Document uploadé</p>
                  <p className="text-sm text-gray-500">Quand un document est ajouté à un projet</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.documentUploaded}
                  onChange={(e) => setNotifications(prev => ({ ...prev, documentUploaded: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Mention dans un commentaire</p>
                  <p className="text-sm text-gray-500">Quand vous êtes mentionné</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.commentMention}
                  onChange={(e) => setNotifications(prev => ({ ...prev, commentMention: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Rapport hebdomadaire</p>
                  <p className="text-sm text-gray-500">Recevoir un résumé chaque semaine</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReport}
                  onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                  className="w-5 h-5 accent-taxaidd-yellow"
                />
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-taxaidd-black mb-2">Mot de passe</h3>
              <p className="text-sm text-gray-500 mb-4">Dernière modification il y a 30 jours</p>
              <Button variant="outline" size="sm">Changer le mot de passe</Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-taxaidd-black mb-2">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-500 mb-4">Ajoutez une couche de sécurité supplémentaire</p>
              <Button variant="outline" size="sm">Activer 2FA</Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-taxaidd-black mb-2">Sessions actives</h3>
              <p className="text-sm text-gray-500 mb-4">Gérez vos sessions connectées</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Chrome - Windows</p>
                    <p className="text-xs text-gray-500">Paris, France • Actif maintenant</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Session actuelle</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Thème</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => setAppearance(prev => ({ ...prev, theme }))}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      appearance.theme === theme
                        ? 'border-taxaidd-yellow bg-taxaidd-yellow/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize">{theme === 'system' ? 'Système' : theme === 'light' ? 'Clair' : 'Sombre'}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Mode compact</p>
                <p className="text-sm text-gray-500">Réduire l&apos;espacement dans l&apos;interface</p>
              </div>
              <input
                type="checkbox"
                checked={appearance.compactMode}
                onChange={(e) => setAppearance(prev => ({ ...prev, compactMode: e.target.checked }))}
                className="w-5 h-5 accent-taxaidd-yellow"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Afficher les avatars</p>
                <p className="text-sm text-gray-500">Afficher les photos de profil dans les listes</p>
              </div>
              <input
                type="checkbox"
                checked={appearance.showAvatars}
                onChange={(e) => setAppearance(prev => ({ ...prev, showAvatars: e.target.checked }))}
                className="w-5 h-5 accent-taxaidd-yellow"
              />
            </label>
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;organisation</label>
              <input
                type="text"
                value={organization.name}
                onChange={(e) => setOrganization(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domaine par défaut</label>
              <select
                value={organization.defaultDomain}
                onChange={(e) => setOrganization(prev => ({ ...prev, defaultDomain: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              >
                <option value="Fiscal">Fiscal</option>
                <option value="Social">Social</option>
                <option value="Corporate">Corporate</option>
                <option value="IP/IT">IP/IT</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Archivage automatique</p>
                <p className="text-sm text-gray-500">Archiver automatiquement les projets terminés</p>
              </div>
              <input
                type="checkbox"
                checked={organization.autoArchive}
                onChange={(e) => setOrganization(prev => ({ ...prev, autoArchive: e.target.checked }))}
                className="w-5 h-5 accent-taxaidd-yellow"
              />
            </label>

            {organization.autoArchive && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archiver après (jours)</label>
                <input
                  type="number"
                  value={organization.archiveAfterDays}
                  onChange={(e) => setOrganization(prev => ({ ...prev, archiveAfterDays: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
              </div>
            )}
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Connectez TaxAIDD à vos outils préférés</p>

            {[
              { name: 'Microsoft 365', description: 'Synchronisez vos documents OneDrive', connected: true },
              { name: 'Google Workspace', description: 'Connectez Google Drive', connected: false },
              { name: 'Slack', description: 'Recevez des notifications Slack', connected: false },
              { name: 'Dropbox', description: 'Importez depuis Dropbox', connected: false },
            ].map(integration => (
              <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
                <Button variant={integration.connected ? 'outline' : 'primary'} size="sm">
                  {integration.connected ? 'Déconnecter' : 'Connecter'}
                </Button>
              </div>
            ))}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue de l&apos;interface</label>
              <select
                value={language.interface}
                onChange={(e) => setLanguage(prev => ({ ...prev, interface: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format de date</label>
              <select
                value={language.dateFormat}
                onChange={(e) => setLanguage(prev => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
              <select
                value={language.timezone}
                onChange={(e) => setLanguage(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              >
                <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-taxaidd-black mb-2">Configuration SMTP</h3>
              <p className="text-sm text-gray-500 mb-4">Configurez le serveur d&apos;envoi d&apos;emails</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Serveur SMTP"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Port"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                  />
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple">
                    <option>TLS</option>
                    <option>SSL</option>
                    <option>Aucun</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-taxaidd-black mb-2">Email de test</h3>
              <p className="text-sm text-gray-500 mb-4">Envoyez un email de test pour vérifier la configuration</p>
              <Button variant="outline" size="sm">Envoyer un test</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-taxaidd-black">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez vos préférences et configurations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-taxaidd-yellow/20 text-taxaidd-black'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-taxaidd-black">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <Button
                onClick={handleSave}
                icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              >
                {saved ? 'Enregistré' : 'Enregistrer'}
              </Button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
