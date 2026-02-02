
import React, { useState, useTransition } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, Music, Link, Twitter, Instagram, Globe, PlusCircle, Trash2, ArrowRight, 
  UploadCloud, X, Loader2, Disc, UserPlus, FileText, Briefcase, Handshake, MapPin, Search, Lock
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from '../contexts/ToastContext';
import { MODERATION_WARNING_TEXT } from '../services/moderationService';
import { searchArtist } from '../services/musicBrainzService';

const socialLinkSchema = z.object({
  platform: z.string().nonempty("Platform is required"),
  url: z.string().url("Must be a valid URL"),
});

const portfolioItemSchema = z.object({
  title: z.string().nonempty("Title is required"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
});

const artistRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  artistName: z.string().min(2, "Artist/band name is required"),
  genre: z.string().nonempty("Genre is required"),
  location: z.string().nonempty("Location is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  avatar: z.any().refine(file => file?.length == 1, "Avatar image is required."),
  socialLinks: z.array(socialLinkSchema).optional(),
  portfolio: z.array(portfolioItemSchema).optional(),
  role: z.nativeEnum(UserRole),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ArtistRegistrationFormValues = z.infer<typeof artistRegistrationSchema>;

interface ArtistRegistrationProps {
  onRegister: (data: ArtistRegistrationFormValues) => void;
  onBackToHome: () => void;
  isLiveMode?: boolean;
}

const ArtistRegistration: React.FC<ArtistRegistrationProps> = ({ onRegister, onBackToHome, isLiveMode = false }) => {
  const { notify } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [musicBrainzSearch, setMusicBrainzSearch] = useState('');
  const [musicBrainzResults, setMusicBrainzResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ArtistRegistrationFormValues>({
    resolver: zodResolver(artistRegistrationSchema),
    defaultValues: {
      socialLinks: [],
      portfolio: [],
      role: UserRole.ARTIST, // Default role
    },
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
    control,
    name: "portfolio",
  });

  const selectedRole = watch("role");

  const handleMusicBrainzSearch = async () => {
    if (!musicBrainzSearch) return;
    setIsSearching(true);
    try {
      const results = await searchArtist(musicBrainzSearch);
      setMusicBrainzResults(results);
    } catch (error) {
      notify('Error searching MusicBrainz. Please try again.', 'error');
    }
    setIsSearching(false);
  };

  const handleSelectArtist = (artist: any) => {
    setValue('artistName', artist.name);
    setValue('bio', artist.disambiguation || '');
    setMusicBrainzResults([]);
  };

  const onSubmit: SubmitHandler<ArtistRegistrationFormValues> = (data) => {
    startTransition(() => {
      setIsLoading(true);
      console.log(data);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        notify("Registration successful! Welcome to KalaKrut.", "success");
        onRegister(data);
      }, 1500);
    });
  };

  const InputField = ({ name, label, type = "text", icon: Icon, error, required = true }: any) => (
    <div className="relative">
      <label htmlFor={name} className="block text-xs font-medium text-kala-400 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-kala-500" />
        </div>
        <input
          id={name}
          type={type}
          {...register(name)}
          required={required}
          className={`w-full bg-kala-900 border ${error ? 'border-red-500' : 'border-kala-700'} rounded-md pl-10 pr-3 py-2 text-sm text-white focus:border-kala-secondary focus:ring-0 outline-none transition-colors`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );

  const FileInputField = ({ name, label, icon: Icon, error, accept }: any) => (
    <div className="relative">
      <label htmlFor={name} className="block text-xs font-medium text-kala-400 mb-1">{label}</label>
      <div className={`flex items-center w-full bg-kala-900 border ${error ? 'border-red-500' : 'border-kala-700'} rounded-md text-sm text-white focus:border-kala-secondary focus:ring-0 outline-none transition-colors`}>
        <div className="pl-3 pr-2 border-r border-kala-700">
          <Icon className="w-4 h-4 text-kala-500" />
        </div>
        <input
          id={name}
          type="file"
          accept={accept}
          {...register(name)}
          className="w-full p-2 text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-kala-700 file:text-kala-300 hover:file:bg-kala-600"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );

  const roleConfig = {
    [UserRole.ARTIST]: {
      title: "Artist / Band",
      icon: Music,
      fields: ["artistName", "genre"]
    },
    [UserRole.VENUE]: {
      title: "Venue / Promoter",
      icon: Briefcase,
      fields: ["venueName", "capacity"]
    },
    [UserRole.SERVICE_PROVIDER]: {
      title: "Service Provider",
      icon: Handshake,
      fields: ["serviceType", "companyName"]
    }
  };

  const getRoleSpecificTitle = () => {
    switch(selectedRole) {
      case UserRole.ARTIST: return "Artist/Band Name";
      case UserRole.VENUE: return "Venue/Company Name";
      case UserRole.SERVICE_PROVIDER: return "Service/Brand Name";
      default: return "Creative Name";
    }
  };

  return (
    <div className="min-h-screen bg-kala-900 text-slate-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-kala-800/50 border border-kala-700 rounded-2xl shadow-2xl my-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] bg-kala-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <button onClick={onBackToHome} className="absolute top-4 right-4 text-kala-500 hover:text-white">
           <X />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-kala-secondary bg-kala-secondary/10 p-3 rounded-full"/>
            <h1 className="text-3xl font-bold text-white">Join the KalaKrut Collective</h1>
            <p className="text-kala-400 mt-2">Register your creative profile to start connecting and collaborating.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Role Selection */}
            <div className="p-4 bg-kala-900 rounded-lg border border-kala-700">
              <h3 className="text-sm font-bold text-white mb-3">I am a...</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.values(UserRole) as Array<UserRole>).map(role => {
                  const isRoleDisabled = isLiveMode && (role === UserRole.ADMIN || role === UserRole.DAO_MEMBER);
                  return (
                    <button
                      key={role}
                      type="button"
                      disabled={isRoleDisabled}
                      onClick={() => !isRoleDisabled && setValue('role', role)}
                      className={`p-3 rounded-md text-sm text-left border transition-all flex flex-col items-center justify-center h-24 gap-2 relative ${ selectedRole === role ? 'bg-kala-secondary/10 text-kala-secondary border-kala-secondary' : isRoleDisabled ? 'bg-kala-800/50 border-kala-700/50 text-kala-500 cursor-not-allowed' : 'bg-kala-800 border-kala-700 hover:bg-kala-700' }`}
                      title={isRoleDisabled ? 'Admin & DAO roles are assigned by Super Admins' : `Register as ${role}`}
                    >
                      {isRoleDisabled && <div className="absolute top-1 right-1"><Lock className="w-3 h-3 text-kala-500"/></div>}
                      <User className="w-6 h-6 mb-1"/> 
                      <span className="font-bold">{role}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6 p-6 bg-kala-900 rounded-lg border border-kala-700">
                <h3 className="text-lg font-bold text-white border-b border-kala-700 pb-2 mb-4">Core Information</h3>
                <InputField name="name" label="Your Full Name" icon={User} error={errors.name} />
                <InputField name="email" label="Email Address" type="email" icon={User} error={errors.email} />
                <InputField name="password" label="Password" type="password" icon={User} error={errors.password} />
                <InputField name="confirmPassword" label="Confirm Password" type="password" icon={User} error={errors.confirmPassword} />
                
                <h3 className="text-lg font-bold text-white border-b border-kala-700 pb-2 mb-4 pt-4">Profile Details</h3>
                <InputField name="artistName" label={getRoleSpecificTitle()} icon={Disc} error={errors.artistName} />
                <InputField name="genre" label="Primary Genre / Service" icon={Music} error={errors.genre} />
                <InputField name="location" label="Location (City, Country)" icon={MapPin} error={errors.location} />
                
                {/* MusicBrainz Search */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-kala-400">Find on MusicBrainz (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={musicBrainzSearch}
                      onChange={(e) => setMusicBrainzSearch(e.target.value)}
                      placeholder="Enter artist name to search..."
                      className="w-full bg-kala-900 border border-kala-700 rounded-md px-3 py-2 text-sm text-white focus:border-kala-secondary focus:ring-0 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleMusicBrainzSearch}
                      disabled={isSearching}
                      className="px-4 py-2 bg-kala-700 text-white rounded-md hover:bg-kala-600 disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                  {musicBrainzResults.length > 0 && (
                    <div className="border border-kala-700 rounded-md max-h-40 overflow-y-auto">
                      {musicBrainzResults.map((artist: any) => (
                        <div
                          key={artist.id}
                          onClick={() => handleSelectArtist(artist)}
                          className="p-2 hover:bg-kala-700 cursor-pointer text-sm"
                        >
                          <p className="font-bold">{artist.name}</p>
                          <p className="text-xs text-kala-400">{artist.disambiguation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FileInputField name="avatar" label="Avatar/Profile Picture" icon={UploadCloud} error={errors.avatar} accept="image/*" />
                
                <div>
                  <label htmlFor="bio" className="block text-xs font-medium text-kala-400 mb-1">Bio / Description</label>
                  <textarea
                    id="bio"
                    {...register("bio")}
                    rows={5}
                    className={`w-full bg-kala-900 border ${errors.bio ? 'border-red-500' : 'border-kala-700'} rounded-md px-3 py-2 text-sm text-white focus:border-kala-secondary focus:ring-0 outline-none transition-colors`}
                    placeholder={`Tell us about your work, style, and what you do as a ${selectedRole}...`}
                  />
                  {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
                  <p className="text-xs text-kala-500 mt-2 p-2 bg-kala-900/50 rounded">{MODERATION_WARNING_TEXT}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 p-6 bg-kala-900 rounded-lg border border-kala-700">
                <h3 className="text-lg font-bold text-white border-b border-kala-700 pb-2 mb-4">Social & Portfolio Links</h3>

                {/* Social Links */}
                <div>
                  {socialFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 mb-3">
                      <InputField name={`socialLinks.${index}.platform`} label="Platform" icon={Globe} error={errors.socialLinks?.[index]?.platform} />
                      <InputField name={`socialLinks.${index}.url`} label="URL" icon={Link} error={errors.socialLinks?.[index]?.url} />
                      <button type="button" onClick={() => removeSocial(index)} className="px-3 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 mb-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendSocial({ platform: ' ', url: ' ' })} className="text-xs flex items-center gap-2 text-kala-secondary font-bold">
                    <PlusCircle className="w-4 h-4" /> Add Social Link
                  </button>
                </div>

                <div className="border-t border-kala-700"></div>

                {/* Portfolio Links */}
                <div>
                  {portfolioFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 mb-3">
                      <InputField name={`portfolio.${index}.title`} label="Title" icon={FileText} error={errors.portfolio?.[index]?.title} />
                      <InputField name={`portfolio.${index}.url`} label="URL" icon={Link} error={errors.portfolio?.[index]?.url} />
                      <button type="button" onClick={() => removePortfolio(index)} className="px-3 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 mb-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendPortfolio({ title: ' ', url: ' ' })} className="text-xs flex items-center gap-2 text-kala-secondary font-bold">
                    <PlusCircle className="w-4 h-4" /> Add Portfolio Link
                  </button>
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="p-6 bg-kala-900 rounded-lg border border-kala-700">
               <div className="flex items-start gap-4">
                  <input 
                     id="termsAccepted" 
                     type="checkbox" 
                     {...register("termsAccepted")} 
                     className="mt-1 h-4 w-4 rounded border-gray-300 text-kala-secondary focus:ring-kala-secondary"
                  />
                  <div>
                     <label htmlFor="termsAccepted" className="font-medium text-white">Agree to Terms</label>
                     <p className="text-xs text-kala-400">By registering, you agree to KalaKrut's <a href="#" className="text-kala-secondary hover:underline">Terms of Service</a> and <a href="#" className="text-kala-secondary hover:underline">DAO Constitution</a>.</p>
                     {errors.termsAccepted && <p className="text-xs text-red-500 mt-1">{errors.termsAccepted.message}</p>}
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading || isPending}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-kala-secondary text-kala-900 font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Registering Profile...</>
                  ) : (
                    <>Complete Registration <ArrowRight className="w-5 h-5" /></>
                  )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistRegistration;
