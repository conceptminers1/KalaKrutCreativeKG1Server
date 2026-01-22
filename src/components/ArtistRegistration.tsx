import React, { useState } from 'react';
import { useToast } from './ToastContext';

interface ArtistRegistrationProps {
  onComplete: () => void;
  onBlockUser: () => void;
}

const ArtistRegistration: React.FC<ArtistRegistrationProps> = ({ onComplete, onBlockUser }) => {
  const { notify } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    genre: '',
    portfolioLink: '',
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.agreeToTerms) {
      notify("You must agree to the terms and conditions.", "error");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate a check for illicit content
    if (formData.bio.toLowerCase().includes("bad word")) {
        onBlockUser();
        return;
    }

    try {
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Welcome to KalaKrut!',
          // Replace with your actual SendGrid Template ID
          templateId: 'd-12345678901234567890123456789012', 
          dynamic_template_data: {
            name: formData.name,
            portfolioLink: formData.portfolioLink,
          },
        }),
      });

      if (response.ok) {
        notify("Registration successful! Check your email for a confirmation.", "success");
        onComplete();
      } else {
        throw new Error('Failed to send confirmation email.');
      }
    } catch (error) {
      console.error("Email sending error:", error);
      notify("There was an issue with your registration. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-kala-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-kala-700">
      <h2 className="text-3xl font-bold text-white mb-6">Artist Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-kala-300">Full Name / Alias</label>
          <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} className="mt-1 block w-full bg-kala-900 border border-kala-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-kala-secondary focus:border-kala-secondary" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-kala-300">Email Address</label>
          <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className="mt-1 block w-full bg-kala-900 border border-kala-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-kala-secondary focus:border-kala-secondary" required />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-kala-300">Short Bio</label>
          <textarea id="bio" name="bio" rows={4} onChange={handleChange} value={formData.bio} className="mt-1 block w-full bg-kala-900 border border-kala-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-kala-secondary focus:border-kala-secondary" required></textarea>
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-kala-300">Primary Genre</label>
          <select id="genre" name="genre" onChange={handleChange} value={formData.genre} className="mt-1 block w-full bg-kala-900 border border-kala-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-kala-secondary focus:border-kala-secondary" required>
            <option value="">Select a Genre</option>
            <option value="Electronic">Electronic</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="portfolioLink" className="block text-sm font-medium text-kala-300">Portfolio/Social Media Link</label>
          <input type="url" id="portfolioLink" name="portfolioLink" onChange={handleChange} value={formData.portfolioLink} className="mt-1 block w-full bg-kala-900 border border-kala-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-kala-secondary focus:border-kala-secondary" placeholder="https://soundcloud.com/your-name" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="agreeToTerms" name="agreeToTerms" onChange={handleChange} checked={formData.agreeToTerms} className="h-4 w-4 bg-kala-900 border-kala-600 text-kala-secondary focus:ring-kala-secondary rounded" />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-kala-300">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-kala-secondary hover:underline">Terms and Conditions</a> and the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-kala-secondary hover:underline">Zero Tolerance Policy</a>.
          </label>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kala-secondary hover:bg-kala-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kala-secondary disabled:bg-gray-600">
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArtistRegistration;
