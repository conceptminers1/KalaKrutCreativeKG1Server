import React, { useState } from 'react';
import { SmartContractDraft, UserRole } from '../types';
import { X, Save, ShieldAlert, CheckCircle, FileCode, Edit3, AlertTriangle, BrainCircuit } from 'lucide-react';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { knowledgeGraph } from '../services/knowledgeGraphService'; // Import knowledge graph

interface ContractEditorProps {
  contract: SmartContractDraft & { artistId?: string }; // Assume contract might have artistId
  userRole: UserRole;
  onClose: () => void;
  onSave: (updatedContent: string) => void;
  onStatusChange: (status: SmartContractDraft['status'], notes?: string) => void;
  onBlockUser: () => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({ 
  contract, 
  userRole, 
  onClose, 
  onSave, 
  onStatusChange,
  onBlockUser 
}) => {
  const [content, setContent] = useState(contract.content);
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState(contract.adminNotes || '');

  const isAdmin = userRole === UserRole.ADMIN;
  const canEdit = isAdmin || (contract.status === 'Negotiation' && contract.lastEditedBy === 'Admin');

  const handleSave = () => {
    if (checkContentForViolation(content)) {
       onBlockUser();
       onClose();
       return;
    }
    onSave(content);
    setIsEditing(false);
    if (isAdmin) {
       onStatusChange('Negotiation', 'Edited by Admin - Pending User Approval');
    } else {
       onStatusChange('Pending Review', 'Edited by User - Pending Admin Review');
    }
  };

  const handleFlag = () => {
     onBlockUser();
     onStatusChange('Rejected', 'Flagged for Policy Violation');
     onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
           {/* ... Header ... */}
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
           <div className="flex-1 p-0 relative">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isEditing}
                className={`w-full h-full bg-[#0d1117] text-slate-300 font-mono text-sm p-6 outline-none resize-none ${isEditing ? 'border-2 border-kala-secondary/50' : ''}`}
              />
              {!isEditing && canEdit && (
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="absolute top-4 right-4 bg-kala-800 hover:bg-kala-700 text-white px-4 py-2 rounded-lg text-xs font-bold border border-kala-600 flex items-center gap-2 shadow-lg"
                 >
                    <Edit3 className="w-3 h-3" /> Enable Editing
                 </button>
              )}
           </div>

           <div className="w-full md:w-64 bg-kala-800 border-l border-kala-700 p-4 space-y-6 overflow-y-auto">
              {/* ... Admin/User Actions ... */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContractEditor;
