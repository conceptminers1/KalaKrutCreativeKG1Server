
import React, { useState } from 'react';
import { UploadCloud, File, Film, Music, Image as ImageIcon, Loader2, CheckCircle, Database, Wallet, ShieldAlert } from 'lucide-react';
import { IPFSAsset } from '../types';
import { useWallet } from '../WalletContext';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { useToast } from './ToastContext';

interface CreativeStudioProps {
  onBlockUser: () => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onBlockUser }) => {
  const { notify } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { isConnected, connect } = useWallet();
  const [assets, setAssets] = useState<IPFSAsset[]>([
    {
      id: '1',
      name: 'Album_Artwork_Final.png',
      type: 'Image',
      size: '2.4 MB',
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      url: '#',
      status: 'Pinned',
      timestamp: '2023-10-14 14:30'
    },
    {
      id: '2',
      name: 'Demo_Track_Master.wav',
      type: 'Audio',
      size: '45 MB',
      cid: 'QmZ4tDuvesjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      url: '#',
      status: 'Minted',
      timestamp: '2023-10-12 09:15'
    }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      // Moderate file name before upload
      if (checkContentForViolation(files[0].name)) {
         onBlockUser();
         return;
      }
      simulateUpload(files[0]);
    }
  };

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
      notify("Please connect your wallet to Mint NFTs on the blockchain.", "warning");
      await connect();
      return;
    }
    // Simulate minting
    notify("Minting transaction started...", "info");
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Minted' } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UploadCloud className="text-kala-secondary" /> Creative Studio
          </h2>
          <p className="text-kala-400 text-sm">Upload content to Cloud/IPFS and mint NFTs.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-kala-500 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
          <Database className="w-3 h-3" /> Storage Used: 4.2 GB / 10 GB
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-3">
         <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
         <p className="text-xs text-red-200">{MODERATION_WARNING_TEXT}</p>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
          isDragging 
          ? 'border-kala-secondary bg-kala-secondary/10' 
          : 'border-kala-700 bg-kala-800/30 hover:bg-kala-800/50'
        }`}
      >
        {isUploading ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-kala-secondary animate-spin mx-auto mb-4" />
            <p className="text-white font-bold">Uploading to IPFS...</p>
            <p className="text-xs text-kala-500 mt-2">Encrypting and distributing chunks</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-kala-800 rounded-full flex items-center justify-center mb-4 text-kala-400">
               <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drag & Drop Files Here</h3>
            <p className="text-kala-400 text-sm mb-6">Supports Audio (WAV/MP3), Video (MP4), Images (PNG/JPG) & 3D Models</p>
            <button className="bg-kala-700 hover:bg-kala-600 text-white font-bold px-6 py-2 rounded-lg transition-colors">
               Browse Files
            </button>
          </>
        )}
      </div>

      {/* Asset List */}
      <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-kala-700 bg-kala-900/30">
           <h3 className="font-bold text-white">Recent Uploads</h3>
        </div>
        <div className="divide-y divide-kala-700">
          {assets.map((asset) => (
            <div key={asset.id} className="p-4 flex items-center justify-between hover:bg-kala-800/50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    asset.type === 'Image' ? 'bg-purple-500/20 text-purple-400' :
                    asset.type === 'Audio' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                     {asset.type === 'Image' ? <ImageIcon className="w-5 h-5" /> :
                      asset.type === 'Audio' ? <Music className="w-5 h-5" /> :
                      <File className="w-5 h-5" />}
                  </div>
                  <div>
                     <h4 className="text-white font-medium text-sm">{asset.name}</h4>
                     <div className="flex items-center gap-3 text-xs text-kala-500 mt-0.5">
                        <span>{asset.size}</span>
                        <span className="font-mono bg-kala-900 px-1 rounded">{asset.cid.substring(0, 12)}...</span>
                        <span>{asset.timestamp}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                     asset.status === 'Minted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                     'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {asset.status.toUpperCase()}
                  </span>
                  {asset.status !== 'Minted' && (
                    <button 
                      onClick={() => handleMint(asset.id)}
                      className={`text-xs text-kala-900 font-bold px-3 py-1.5 rounded transition-colors shadow-lg flex items-center gap-1 ${
                        isConnected 
                        ? 'bg-kala-secondary hover:bg-cyan-400 shadow-cyan-900/10'
                        : 'bg-kala-500 hover:bg-kala-400 shadow-black/20'
                      }`}
                    >
                       {!isConnected && <Wallet className="w-3 h-3" />} Mint NFT
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;
