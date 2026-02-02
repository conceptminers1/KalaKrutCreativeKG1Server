
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

// Define the shape of the toast context
interface ToastContextType {
  notify: (message: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
}

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Define the props for the provider component
interface ToastProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warn' = 'info') => {
    const options: ToastOptions = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warn':
        toast.warn(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  }, []);

  // The context value MUST provide the function
  const value = { notify };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
