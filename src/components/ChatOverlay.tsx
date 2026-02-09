
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { X, Send, ShieldCheck, AlertTriangle, DollarSign, Lock, ShieldAlert, Mail, Loader2 } from 'lucide-react';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';

interface ChatOverlayProps {
  recipientName: string;
  recipientAvatar: string;
  recipientEmail: string; // Added for sending real emails
  onClose: () => void;
  onNavigateToBooking: () => void;
  onBlockUser: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ 
  recipientName, 
  recipientAvatar, 
  recipientEmail, 
  onClose, 
  onNavigateToBooking, 
  onBlockUser 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'system', 
      text: `This is the start of your direct messaging thread with ${recipientName}. Messages are sent via email.`, 
      timestamp: 'Just now' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FORBIDDEN_KEYWORDS = ['venmo', 'paypal', 'cashapp', 'zelle', 'gmail', 'yahoo', 'whatsapp', 'telegram', 'wire', 'bank transfer'];

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    if (checkContentForViolation(input)) {
        onBlockUser();
        return;
    }

    const lowerInput = input.toLowerCase();
    const containsForbidden = FORBIDDEN_KEYWORDS.some(keyword => lowerInput.includes(keyword));

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    if (containsForbidden) {
      setTimeout(() => {
        const warningMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: 'Safety Alert: For your protection, we have blocked off-platform payment details. All transactions must be processed through KalaKrut\'s secure smart contracts.',
          timestamp: 'Just now',
          isWarning: true
        };
        setMessages(prev => [...prev, warningMsg]);
      }, 500);
      return; // Stop further processing
    }
    
    setIsSending(true);

    try {
      // DEFINITIVE FIX: Use the /send-email endpoint
      const response = await fetch('http://localhost:3001/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              to: recipientEmail,
              subject: `New Message from a KalaKrut User`,
              html: `<p>You have a new message from the KalaKrut portal:</p><blockquote>${newMessage.text}</blockquote><p>Reply directly to this email to continue the conversation.</p>`
          })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Add a system confirmation message
      const confirmationMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: 'Message sent successfully via email.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, confirmationMsg]);
      notify('Message sent!', 'success');

    } catch (error) {
      console.error("Email sending error:", error);
      notify('Failed to send message. Please try again.', 'error');
      // Optionally, mark the sent message as failed
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, error: true } : m));
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-kala-900 border border-kala-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-kala-800 border-b border-kala-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={recipientAvatar} alt="" className="w-10 h-10 rounded-full border border-kala-600 object-cover" />
             <Mail className="absolute -bottom-1 -right-1 w-4 h-4 text-white bg-green-500 rounded-full p-0.5 border border-kala-800" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{recipientName}</h3>
            <p className="text-xs text-kala-400 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3 text-green-400" /> Verified Artist
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-kala-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Policy Alert Banner */}
      <div className="bg-red-900/30 border-b border-red-500/20 px-3 py-2 flex items-start gap-2">
        <ShieldAlert className="w-3 h-3 text-red-400 mt-0.5" />
        <p className="text-[9px] text-red-200">
          {MODERATION_WARNING_TEXT}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-kala-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.isWarning ? (
               <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 max-w-[90%] flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-xs text-red-200 font-medium">{msg.text}</p>
                    <button 
                      onClick={onNavigateToBooking}
                      className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded border border-red-500/30 transition-colors w-full text-left flex items-center justify-center gap-1"
                    >
                       Go to Booking Hub
                    </button>
                  </div>
               </div>
            ) : msg.sender === 'system' ? (
               <div className="w-full text-center text-xs text-kala-500 my-2 italic px-4">
                  {msg.text}
               </div>
            ) : (
              <div className={`max-w-[80%] p-3 rounded-2xl flex flex-col ${
                msg.sender === 'me' 
                ? 'bg-kala-secondary text-kala-900 rounded-tr-none' 
                : 'bg-kala-800 text-slate-200 rounded-tl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${msg.sender === 'me' ? 'text-kala-800/60' : 'text-kala-500'}`}>
                  {msg.error && <span className="text-red-500 font-bold">Failed</span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Official Offer Action */}
      <div className="px-4 pb-2 bg-kala-900">
         <button 
           onClick={onNavigateToBooking}
           className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
         >
           <DollarSign className="w-3 h-3" /> Make Official Offer
         </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-kala-900 border-t border-kala-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-kala-800 border border-kala-700 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:ring-1 focus:ring-kala-secondary focus:border-kala-secondary outline-none transition-all"
            disabled={isSending}
          />
          <button 
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-kala-secondary rounded-full text-kala-900 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
