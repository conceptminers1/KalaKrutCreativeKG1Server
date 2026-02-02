
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RosterMember } from '../types'; // Assuming RosterMember is the type for a user/artist

interface ChatContextType {
  isChatOpen: boolean;
  recipient: RosterMember | null;
  openChat: (recipient: RosterMember) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipient, setRecipient] = useState<RosterMember | null>(null);

  const openChat = (recipient: RosterMember) => {
    setRecipient(recipient);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setRecipient(null);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, recipient, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
