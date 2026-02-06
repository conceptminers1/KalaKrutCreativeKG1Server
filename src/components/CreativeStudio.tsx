
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, BrainCircuit, Mic, Music, Film, Brush, Sparkles, Wand2, Search, Share2, Save, Trash2, PlusCircle, CheckCircle,
    UploadCloud, File as FileIcon, Loader2, Database, Wallet, ShieldAlert, Image as ImageIcon 
} from 'lucide-react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '../contexts/ToastContext';
import Layers from './Layers';
import { IPFSAsset } from '../types';
import { useWallet } from '../contexts/WalletContext';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';

interface CreativeStudioProps {
  onBack: () => void;
  onBlockUser: () => void;
}

const ItemTypes = {
  TOOL: 'tool',
  RESOURCE: 'resource',
};

// AI Tool Components (from new version)
interface ToolProps {
  name: string;
  icon: React.ElementType;
}

const Tool: React.FC<ToolProps> = ({ name, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TOOL,
    item: { name, icon: Icon },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex flex-col items-center justify-center p-4 bg-kala-800 rounded-lg border border-kala-700 hover:bg-kala-700/50 cursor-pointer transition-all duration-200 transform hover:scale-105"
    >
      <Icon className="w-8 h-8 text-kala-secondary mb-2" />
      <span className="text-sm text-center text-slate-300">{name}</span>
    </div>
  );
};

interface CanvasToolProps extends ToolProps {
    id: number;
}

const CanvasTool: React.FC<CanvasToolProps> = ({ id, name, icon: Icon }) => {
    return (
         <div className="flex items-center gap-3 p-3 bg-kala-950 rounded-lg border border-kala-700/50 shadow-md">
            <Icon className="w-6 h-6 text-kala-accent" />
            <span className="text-slate-200 font-medium">{name}</span>
        </div>
    )
}

// Main Component
const CreativeStudio: React.FC<CreativeStudioProps> = ({ onBack, onBlockUser }) => {
  const { notify } = useToast();
  
  // State from new version
  const [canvasTools, setCanvasTools] = useState<CanvasToolProps[]>([]);
  const [projectName, setProjectName] = useState('My Awesome Project');

  // State from old version
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { isConnected, connect } = useWallet();
  const [assets, setAssets] = useState<IPFSAsset[]>([
    { id: '1', name: 'Album_Artwork_Final.png', type: 'Image', size: '2.4 MB', cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', url: '#', status: 'Pinned', timestamp: '2023-10-14 14:30' },
    { id: '2', name: 'Demo_Track_Master.wav', type: 'Audio', size: '45 MB', cid: 'QmZ4tDuvesjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', url: '#', status: 'Minted', timestamp: '2023-10-12 09:15' }
  ]);

  // Drop handler for AI tools (from new version)
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TOOL,
    drop: (item: ToolProps) => {
        const newTool = { ...item, id: Date.now() };
        setCanvasTools((prevTools) => [...prevTools, newTool]);
        notify(`${item.name} added to your canvas!`, 'success');
    },
  }));

  // Handlers from new version
  const handleClearCanvas = () => {
    setCanvasTools([]);
    notify('Canvas cleared.', 'info');
  };
  
  const handleSaveProject = () => {
    notify(`Project "${projectName}" saved successfully!`, 'success');
  };

  // Handlers from old version for file uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (checkContentForViolation(files[0].name)) {
         onBlockUser();
         return;
      }
      simulateUpload(files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files && files.length > 0) {
        if (checkContentForViolation(files[0].name)) {
            onBlockUser();
            return;
        }
        simulateUpload(files[0]);
    }
  }

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      const newAsset: IPFSAsset = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('image') ? 'Image' : file.type.includes('audio') ? 'Audio' : 'Document',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        cid: `QmNew${Math.random().toString(36).substring(7)}...`,
        url: '#',
        status: 'Pinned',
        timestamp: new Date().toLocaleString()
      };
      setAssets(prev => [newAsset, ...prev]);
      setIsUploading(false);
      notify('File uploaded to IPFS', 'success');
    }, 2500);
  };

  const handleMint = async (assetId: string) => {
    if (!isConnected) {
      notify("Please connect your wallet to Mint NFTs.", "warning");
      await connect();
      return;
    }
    notify("Minting transaction started...", "info");
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Minted' } : a));
  };


  const tools: ToolProps[] = [
    { name: 'AI Idea Gen', icon: BrainCircuit },
    { name: 'AI Lyricist', icon: Mic },
    { name: 'AI Composer', icon: Music },
    { name: 'AI Storyboard', icon: Film },
    { name: 'AI Art Style', icon: Brush },
    { name: 'AI Enhancer', icon: Sparkles },
    { name: 'Magic Mix', icon: Wand2 },
    { name: 'Asset Search', icon: Search },
  ];

  return (
      <div className="min-h-screen bg-kala-900 text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
            {/* --- Merged Header --- */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
            >
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Creative Studio</h1>
                        <p className="text-slate-400">Drag AI tools, upload assets, and build your project.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 text-xs text-kala-500 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                        <Database className="w-3 h-3" /> Storage Used: 4.2 GB / 10 GB
                    </div>
                    <button onClick={handleSaveProject} className="px-4 py-2 bg-kala-secondary text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-kala-secondary/80 transition-colors">
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </motion.div>
            
            {/* Warning Banner from old version */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200">{MODERATION_WARNING_TEXT}</p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Toolbox & Resources --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-kala-950/70 p-6 rounded-xl border border-kala-800 space-y-8"
                >
                    {/* AI Toolbox */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wand2 className="text-kala-accent"/> AI Toolbox</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                            {tools.map((tool) => (<Tool key={tool.name} name={tool.name} icon={tool.icon} />))}
                        </div>
                    </div>

                    {/* My Resources / Upload Zone */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Layers className="text-kala-accent"/> My Resources</h2>
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all relative ${
                            isDragging 
                            ? 'border-kala-secondary bg-kala-secondary/10' 
                            : 'border-kala-700 bg-kala-800/30 hover:bg-kala-800/50'
                            }`}
                        >
                            {isUploading ? (
                                <div className="text-center"><Loader2 className="w-10 h-10 text-kala-secondary animate-spin mx-auto mb-3" /><p className="text-white font-semibold">Uploading to IPFS...</p></div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-kala-800 rounded-full flex items-center justify-center mb-3 text-kala-400"><UploadCloud className="w-6 h-6" /></div>
                                    <h3 className="text-base font-bold text-white mb-1">Drag & Drop or</h3>
                                     <input type="file" id="file-upload" className="sr-only" onChange={handleFileSelect}/>
                                     <label htmlFor="file-upload" className="text-sm text-kala-secondary font-semibold hover:underline cursor-pointer">Browse Files</label>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Asset List */}
                    <div className="space-y-2">
                        {assets.map((asset) => (
                            <div key={asset.id} className="p-2.5 bg-kala-900 rounded-lg flex items-center justify-between hover:bg-kala-800/80 transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-md ${ asset.type === 'Image' ? 'bg-purple-500/20 text-purple-400' : asset.type === 'Audio' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400' }`}>
                                     {asset.type === 'Image' ? <ImageIcon className="w-4 h-4" /> : asset.type === 'Audio' ? <Music className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
                                  </div>
                                  <div>
                                     <h4 className="text-white font-medium text-sm leading-tight">{asset.name}</h4>
                                     <p className="text-xs text-kala-500 mt-0.5">{asset.size}</p>
                                  </div>
                               </div>
                                <div className="flex items-center gap-2">
                                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ asset.status === 'Minted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20' }`}>{asset.status.toUpperCase()}</span>
                                     {asset.status !== 'Minted' && (
                                        <button onClick={() => handleMint(asset.id)} className={`text-xs text-kala-900 font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${ isConnected ? 'bg-kala-secondary hover:bg-cyan-400' : 'bg-kala-500 hover:bg-kala-400' }`}>
                                           {!isConnected && <Wallet className="w-3 h-3" />} Mint
                                        </button>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- Right Column: Main Canvas & Output --- */}
                <motion.div
                    ref={drop}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-kala-950/70 p-6 rounded-xl border border-kala-800 min-h-[500px] flex flex-col"
                >
                    <div className="flex justify-between items-center mb-4">
                        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-transparent text-2xl font-bold text-white border-none focus:ring-0 p-0"/>
                        <button onClick={handleClearCanvas} className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"><Trash2 size={14}/>Clear Canvas</button>
                    </div>

                    <div className="flex-grow p-4 bg-kala-900 rounded-lg border-2 border-dashed border-kala-800/80 relative">
                        {canvasTools.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-kala-800 flex items-center justify-center mb-4"><PlusCircle className="w-8 h-8 text-kala-700" /></div>
                                <p className="text-slate-400 font-semibold">Drag AI tools here to start</p>
                                <p className="text-sm text-slate-500">Combine AI modules to build your creative workflow</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {canvasTools.map((tool) => (<CanvasTool key={tool.id} {...tool} />))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Sparkles size={16} className="text-kala-accent" /> AI Output</h3>
                        <div className="p-4 h-32 bg-kala-900 rounded-lg text-slate-400 text-sm overflow-y-auto font-mono border border-kala-800">
                           <p className='flex items-center gap-2'><CheckCircle size={14} className="text-green-500"/> Awaiting instructions. Drag in a tool to begin.</p>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    </div>
  );
};

// Wrapper for DndProvider
const CreativeStudioWrapper = (props: CreativeStudioProps) => (
    <DndProvider backend={HTML5Backend}>
        <CreativeStudio {...props} />
    </DndProvider>
)

export default CreativeStudioWrapper;
