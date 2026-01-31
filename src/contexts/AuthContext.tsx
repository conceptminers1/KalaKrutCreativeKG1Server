
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { useData } from './DataContext';
import { RosterMember, UserRole, ArtistProfile } from '../types';

// Define the shape of the authentication context
interface AuthContextType {
  currentUser: RosterMember | null;
  loading: boolean;
  login: (role: UserRole, method: 'web2' | 'web3', credentials: any) => Promise<void>;
  logout: () => void;
  signup: (profile: ArtistProfile) => Promise<void>;
  setCurrentUser: (user: RosterMember | null) => void; // For profile updates
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<RosterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const dataContext = useData();

  // Effect to check for a logged-in user on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('kk_currentUser');
      if (storedUser) {
        const user: RosterMember = JSON.parse(storedUser);
        // Additional check: ensure user from localStorage still exists in the main user list
        // This prevents issues if a user is deleted while their session is active in localStorage
        if (dataContext.users.find(u => u.id === user.id)) {
          setCurrentUser(user);
        } else {
           localStorage.removeItem('kk_currentUser');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('kk_currentUser');
    } finally {
      setLoading(false);
    }
  }, [dataContext.users]);

  // Login function
  const login = useCallback(async (role: UserRole, method: 'web2' | 'web3', credentials: any) => {
    setLoading(true);
    const { email, password, isDemo } = credentials;

    if (isDemo) {
        // In demo mode, we just create a temporary session for the selected role
        const demoUser: RosterMember = {
            id: `demo_${role.toLowerCase()}_${Date.now()}`,
            name: `Demo ${role}`,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=Demo+${role}&background=random`,
            location: 'Virtual Space',
            verified: true,
            rating: 5,
            assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
            subscriberOnly: { email: 'demo@kalakrut.io', phone: 'N/A', agentContact: 'System' },
            isMock: true,
            onboardingComplete: true // Assume demo users are fully onboarded
        };
        setCurrentUser(demoUser);
        localStorage.setItem('kk_currentUser', JSON.stringify(demoUser));
        toast.success(`Logged in as Demo ${role}`, { description: 'Explore the platform with sample data.' });
        setLoading(false);
        return;
    }

    // Live mode login logic
    const user = dataContext.findUserByEmail(email);

    if (user && user.password === password) {
        if(user.role !== role) {
            toast.error('Role Mismatch', { description: `Your account is registered as a ${user.role}, not a ${role}.` });
            setLoading(false);
            return;
        }
        setCurrentUser(user);
        localStorage.setItem('kk_currentUser', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
    } else if (user && user.password !== password) {
        toast.error('Invalid Credentials', { description: 'The password you entered is incorrect.' });
    } else {
        // User not found, treat as a registration attempt
        toast.info('New User? Creating Account...', { description: 'You will be guided through the onboarding process.' });
        const newProfile: ArtistProfile = {
            id: `user_${Date.now()}`,
            name: email.split('@')[0], // Simple name generation
            email,
            password,
            role,
            onboardingComplete: false,
        };
        await signup(newProfile);
    }
    setLoading(false);
  }, [dataContext]);

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('kk_currentUser');
    toast.success('You have been logged out.');
  }, []);

  // Signup function
  const signup = useCallback(async (profile: ArtistProfile) => {
    if (dataContext.findUserByEmail(profile.email)) {
        toast.error('Registration Failed', { description: 'An account with this email already exists.' });
        return;
    }
    
    // Add user via DataContext
    dataContext.addUser(profile);
    
    // Find the newly created user to set it as current user
    const newUser = dataContext.findUserByEmail(profile.email);
    
    if (newUser) {
        setCurrentUser(newUser);
        localStorage.setItem('kk_currentUser', JSON.stringify(newUser));
        toast.success(`Account created for ${newUser.name}!`, { description: 'Please complete your profile.' });
    } else {
        toast.error("Error creating account", { description: "Could not log you in after registration."})
    }
  }, [dataContext]);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    signup,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
