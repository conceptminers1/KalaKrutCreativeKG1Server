'''
import React, { useState } from 'react';
import { useToast } from './ToastContext';
import { Mail, Edit, Save, Plus, Trash2, Send, ChevronDown } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  templateId: string; // SendGrid Template ID
  description: string;
}

const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl_001',
    name: 'User Registration',
    subject: 'Welcome to KalaKrut, {{name}}!',
    templateId: 'd-12345678901234567890123456789012',
    description: 'Sent to new users upon successful registration. Requires `name` and `portfolioLink`.'
  },
  {
    id: 'tpl_002',
    name: 'DAO Proposal Submitted',
    subject: 'New DAO Proposal: {{proposalTitle}}',
    templateId: 'd-abcdefghijklmnopqrstuvwxyz123456',
    description: 'Notifies DAO members when a new proposal is submitted for voting.'
  },
  {
    id: 'tpl_003',
    name: 'Admin Action: Approval',
    subject: 'Your Submission has been Approved',
    templateId: 'd-654321zyxwutsrqponmlkjihgfedcba',
    description: 'Generic approval email for actions like contract updates, profile changes etc.'
  }
];

const AdminEmailTemplates: React.FC = () => {
  const { notify } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
    notify(`Template '${selectedTemplate.name}' saved successfully!`, 'success');
    setIsEditing(false);
  };

  return (
    <div className="bg-kala-800 p-8 rounded-lg shadow-lg w-full mx-auto border border-kala-700">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Mail className="w-8 h-8 text-kala-secondary" />
        Manage Email Templates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="md:col-span-1 bg-kala-900 p-4 rounded-lg border border-kala-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Templates</h3>
            <button className="p-2 bg-kala-secondary/10 text-kala-secondary rounded-full hover:bg-kala-secondary/20">
                <Plus className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-2">
            {templates.map(template => (
              <li key={template.id}>
                <button 
                  onClick={() => handleSelectTemplate(template)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${selectedTemplate?.id === template.id ? 'bg-kala-700' : 'hover:bg-kala-800/50'}`}>
                  <p className="font-bold text-white">{template.name}</p>
                  <p className="text-xs text-kala-400">ID: {template.templateId}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Template Details */}
        <div className="md:col-span-2 bg-kala-900 p-6 rounded-lg border border-kala-700">
          {selectedTemplate ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTemplate.name}</h3>
                  <p className="text-sm text-kala-400 mt-1">SendGrid ID: {selectedTemplate.templateId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20" title="Send Test Email">
                        <Send className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20" 
                        title={isEditing ? 'Save Changes' : 'Edit Template'}>
                        {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                    </button>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-kala-300 mb-1">Template Name</label>
                        <input 
                            type="text" 
                            value={selectedTemplate.name}
                            onChange={e => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                            className="w-full bg-kala-800 border border-kala-600 rounded-md py-2 px-3 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-kala-300 mb-1">Email Subject</label>
                        <input 
                            type="text" 
                            value={selectedTemplate.subject}
                            onChange={e => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                            className="w-full bg-kala-800 border border-kala-600 rounded-md py-2 px-3 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-kala-300 mb-1">Description</label>
                        <textarea 
                            rows={3}
                            value={selectedTemplate.description}
                            onChange={e => setSelectedTemplate({...selectedTemplate, description: e.target.value})}
                            className="w-full bg-kala-800 border border-kala-600 rounded-md py-2 px-3 text-white"
                        ></textarea>
                    </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-kala-300 bg-kala-800/50 p-4 rounded-md border border-kala-700/50">
                    <p><strong className="text-kala-200">Subject:</strong> {selectedTemplate.subject}</p>
                    <p className="text-xs font-mono text-yellow-400/50">Remember: `{{placeholder}}` values are filled in by the backend service when the email is sent.</p>
                    <hr className="border-kala-700"/>
                    <p><strong className="text-kala-200">Description:</strong></p>
                    <p>{selectedTemplate.description}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto w-12 h-12 text-kala-600" />
              <h3 className="mt-2 text-lg font-medium text-white">Select a template</h3>
              <p className="mt-1 text-sm text-kala-400">Choose a template from the list to view or edit its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
'''