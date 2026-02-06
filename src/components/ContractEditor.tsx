
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

  const getStatusChip = (status: SmartContractDraft['status']) => {
    switch (status) {
      case 'Approved': return <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20">{status}</span>;
      case 'Rejected': return <span className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-full border border-red-500/20">{status}</span>;
      case 'Negotiation': return <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">{status}</span>;
      default: return <span className="px-2 py-1 text-xs bg-kala-600 text-kala-300 rounded-full border border-kala-500">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <FileCode className="w-6 h-6 text-kala-secondary" />
              <div>
                 <h2 className="text-lg font-bold text-white">Smart Contract Editor</h2>
                 <div className="flex items-center gap-2">
                    <p className="text-xs text-kala-400">ID: {contract.id}</p>
                    {getStatusChip(contract.status)}
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-kala-400 hover:text-white hover:bg-kala-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto">
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

           <div className="w-full md:w-80 bg-kala-800 border-l border-kala-700 p-4 space-y-6 overflow-y-auto">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-kala-700 pb-2">Actions</h3>
              
              {isEditing ? (
                 <div>
                    <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-xl transition-colors">
                       <Save className="w-4 h-4" /> Save & Submit Changes
                    </button>
                    <p className="text-xs text-kala-500 mt-2 text-center">This will notify the other party and update the contract's state.</p>
                 </div>
              ) : (
                <p className="text-xs text-kala-400 bg-kala-900/50 p-3 rounded-lg border border-kala-700">Enable editing mode to make changes.</p>
              )}
              
              {isAdmin && (
                 <div className="space-y-3 pt-4 border-t border-kala-700">
                    <h4 className="text-white font-semibold">Admin Controls</h4>
                    <button onClick={() => onStatusChange('Approved')} className="w-full text-sm text-left flex items-center gap-3 p-3 rounded-lg hover:bg-green-500/10 text-green-400 transition-colors"><CheckCircle className="w-4 h-4" /> Force Approve</button>
                    <button onClick={() => onStatusChange('Rejected')} className="w-full text-sm text-left flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><X className="w-4 h-4"/> Force Reject</button>
                 </div>
              )}

               <div className="space-y-3 pt-4 border-t border-kala-700">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm"><ShieldAlert className="w-4 h-4 text-yellow-400" /> Moderation</h4>
                  <p className="text-xs text-kala-400 bg-kala-900/50 p-3 rounded-lg border border-kala-700">{MODERATION_WARNING_TEXT}</p>
                  <button onClick={handleFlag} className="w-full text-sm flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold px-4 py-3 rounded-xl border border-red-500/20 transition-colors">
                     <AlertTriangle className="w-4 h-4" /> Flag for Violation
                  </button>
               </div>

               <div className="space-y-3 pt-4 border-t border-kala-700">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm"><BrainCircuit className="w-4 h-4 text-purple-400" /> Knowledge Graph</h4>
                  <p className="text-xs text-kala-400">This contract is connected to: <span className="font-bold text-white">{knowledgeGraph.getConnections(contract.artistId || '').join(', ')}</span>.</p>
               </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default ContractEditor;
