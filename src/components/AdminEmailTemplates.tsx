
import React, { useState } from 'react';
import { Mail, Edit, Save, Send, Eye, X, Code, AlertTriangle } from 'lucide-react';
import { useToast } from './ToastContext';

// Mock data for email templates. In a real application, you would fetch this from a database.
const mockTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to KalaKrut!',
    body: 'Hi {{name}},\n\nWelcome to KalaKrut. Your account has been created. Your temporary password is: {{password}}.\n\nThanks,\nThe KalaKrut Team',
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    subject: 'Your Password Reset Request',
    body: 'Hi {{name}},\n\nWe received a request to reset your password. Click the link below to reset it:\n{{resetLink}}\n\nIf you did not request a password reset, please ignore this email.\n\nThanks,\nThe KalaKrut Team',
  },
  {
    id: 'dao-proposal-vetoed',
    name: 'DAO Proposal Vetoed',
    subject: 'DAO Proposal Vetoed by Admin',
    body: 'Hello,\n\nThe DAO proposal "{{proposalTitle}}" has been vetoed by an administrator.\n\nReason: {{reason}}\n\nThanks,\nThe KalaKrut Team',
  },
];

const AdminEmailTemplates: React.FC<{ isDemoMode: boolean }> = ({ isDemoMode }) => {
  const { notify } = useToast();
  const [templates, setTemplates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(selectedTemplate.body);
  const [editedSubject, setEditedSubject] = useState(selectedTemplate.subject);
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');

  const handleSelectTemplate = (templateId: string) => {
    if (isEditing) {
      notify('Please save or cancel your current edits before switching.', 'warning');
      return;
    }
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditedBody(template.body);
      setEditedSubject(template.subject);
      setViewMode('preview');
    }
  };

  const handleSave = () => {
    if (isDemoMode) {
      notify("Editing is disabled in Demo Mode.", "warning");
      return;
    }
    // In a real app, this would be an API call to save the template to the database.
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...t, body: editedBody, subject: editedSubject } : t));
    setSelectedTemplate({ ...selectedTemplate, body: editedBody, subject: editedSubject });
    setIsEditing(false);
    notify('Template saved successfully!', 'success');
  };

  const renderPreview = (bodyContent: string) => {
    const mockData = {
        name: 'John Doe',
        password: 'mockPassword123!',
        resetLink: 'https://example.com/reset/mock-token',
        proposalTitle: 'KalaKrut Platform v2.0',
        reason: 'Security concerns'
    };
    
    let processedContent = bodyContent;
    for (const [key, value] of Object.entries(mockData)) {
        processedContent = processedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return processedContent.replace(/\n/g, '<br />');
  };


  const handleSendTest = async () => {
    const toEmail = 'test-recipient@example.com';
    const fromEmail = 'noreply@kalakrut.com';
    const emailText = renderPreview(editedBody).replace(/<br \/>/g, '\n');
    const emailHtml = renderPreview(editedBody);

    if (isDemoMode) {
        console.log("--- SIMULATED EMAIL ---");
        console.log(`To: ${toEmail}`);
        console.log(`Subject: [TEST] ${editedSubject}`);
        console.log(`Body: ${emailText}`);
        console.log("-----------------------");
        notify(`Simulated email sent to ${toEmail}. Check the console.`, 'info');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: toEmail,
                from: fromEmail,
                subject: `[TEST] ${editedSubject}`,
                text: emailText,
                html: emailHtml,
            }),
        });

        if (response.ok) {
            notify('Test email sent successfully!', 'success');
        } else {
            notify('Failed to send test email.', 'error');
        }
    } catch (error) {
        console.error("Email sending error:", error);
        notify('Error sending test email. Is the mail server running?', 'error');
    }
  };

  const renderBody = () => {
    if (viewMode === 'html') {
      return (
        <pre className="text-xs bg-kala-950 p-4 rounded-md overflow-x-auto">
          <code>{renderPreview(editedBody)}</code>
        </pre>
      );
    }
    return (
      <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderPreview(editedBody) }} />
    );
  };

  return (
    <div className="p-6 md:p-8 bg-kala-900 text-white animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Mail className="w-6 h-6 text-kala-secondary" />
          <span>Email Template Management</span>
        </h2>
        {isDemoMode && (
          <div className="flex items-center gap-2 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-full px-3 py-1 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Demo Mode</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Template List */}
        <div className="md:col-span-1 bg-kala-800/50 border border-kala-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 px-2">Templates</h3>
          <ul className="space-y-2">
            {templates.map(template => (
              <li key={template.id}>
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'bg-kala-secondary text-kala-900 font-bold'
                      : 'hover:bg-kala-700'
                  }`}
                >
                  {template.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Template Editor/Viewer */}
        <div className="md:col-span-3 bg-kala-800/50 border border-kala-700 rounded-xl">
          <div className="p-6 border-b border-kala-700">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="text-xl font-bold bg-kala-900 border-b-2 border-kala-600 focus:border-kala-secondary outline-none transition-colors w-full"
                    readOnly={isDemoMode}
                  />
                ) : (
                  <h3 className="text-xl font-bold">{selectedTemplate.subject}</h3>
                )}
                <p className="text-xs text-kala-400 mt-1">ID: {selectedTemplate.id}</p>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold flex items-center gap-2 text-sm" disabled={isDemoMode}>
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => { setIsEditing(false); setEditedBody(selectedTemplate.body); setEditedSubject(selectedTemplate.subject); }} className="p-2 text-kala-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    {!isDemoMode && (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-kala-600 hover:bg-kala-500 rounded-lg text-white font-semibold flex items-center gap-2 text-sm">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h4 className="text-md font-semibold text-kala-300">Template Body</h4>
                     <div className="flex items-center bg-kala-700 rounded-lg p-1">
                        <button onClick={() => setViewMode('preview')} className={`px-2 py-0.5 text-xs rounded-md ${viewMode === 'preview' ? 'bg-kala-600 text-white' : 'text-kala-400'}`}>
                           <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('html')} className={`px-2 py-0.5 text-xs rounded-md ${viewMode === 'html' ? 'bg-kala-600 text-white' : 'text-kala-400'}`}>
                           <Code className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <button
                  onClick={handleSendTest}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Send Test
                </button>
            </div>

            {isEditing ? (
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className="w-full h-96 bg-kala-900 border border-kala-600 rounded-md p-4 text-sm font-mono leading-relaxed focus:border-kala-secondary outline-none transition-colors"
                readOnly={isDemoMode}
              />
            ) : (
              <div className="w-full h-96 bg-kala-900 border border-kala-700/50 rounded-md p-4 text-sm leading-relaxed overflow-y-auto">
                {renderBody()}
              </div>
            )}
            <div className="mt-4 p-3 bg-kala-900/70 rounded-lg border border-kala-700">
                <h5 className="text-xs font-bold text-kala-400 mb-2">Available Placeholders:</h5>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-kala-700 text-kala-300 px-2 py-1 rounded-full font-mono">{'{{name}}'}</span>
                    <span className="text-xs bg-kala-700 text-kala-300 px-2 py-1 rounded-full font-mono">{'{{password}}'}</span>
                    <span className="text-xs bg-kala-700 text-kala-300 px-2 py-1 rounded-full font-mono">{'{{resetLink}}'}</span>
                    <span className="text-xs bg-kala-700 text-kala-300 px-2 py-1 rounded-full font-mono">{'{{proposalTitle}}'}</span>
                    <span className="text-xs bg-kala-700 text-kala-300 px-2 py-1 rounded-full font-mono">{'{{reason}}'}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
// Trigger hot-reload
