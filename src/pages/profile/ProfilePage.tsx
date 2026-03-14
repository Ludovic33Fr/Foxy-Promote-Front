import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, Bell, LogOut, CheckCircle, Globe, Instagram, Music } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { getCurrentPlan } = useSubscription();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mock API call - would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo profile - would be from API in real app
        const mockProfile: UserProfile = {
          id: user?.id || '',
          email: user?.email || '',
          artistName: user?.artistName || '',
          profilePicture: user?.profilePicture,
          createdAt: user?.createdAt || new Date().toISOString(),
          onboardingCompleted: true,
          genre: 'House',
          experience: 'intermediate',
          goals: ['Improve mixing skills', 'Get on playlists', 'Connect with other artists'],
          socialLinks: {
            instagram: 'artistname',
            soundcloud: 'artistname',
            spotify: 'artistname'
          }
        };
        
        setProfile(mockProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const currentPlan = getCurrentPlan();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Profile not found</h2>
            <p className="text-muted-foreground mt-2">
              We couldn't load your profile. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-8">
              <div className="p-6 border-b border-border">
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary text-xl font-semibold mb-4">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt={profile.artistName} className="w-full h-full object-cover" />
                    ) : (
                      profile.artistName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h2 className="text-lg font-semibold">{profile.artistName}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  
                  <div className="mt-2 px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {currentPlan?.name} Plan
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <nav className="space-y-1">
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-3 h-5 w-5 flex-shrink-0" />
                    Profile
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'account'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('account')}
                  >
                    <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                    Account Settings
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'billing'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('billing')}
                  >
                    <CreditCard className="mr-3 h-5 w-5 flex-shrink-0" />
                    Billing
                  </button>
                  
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'notifications'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="mr-3 h-5 w-5 flex-shrink-0" />
                    Notifications
                  </button>
                </nav>
              </div>
              
              <div className="p-4 border-t border-border">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Artist Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your profile information
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="artistName" className="block text-sm font-medium mb-1">
                          Artist Name
                        </label>
                        <input
                          id="artistName"
                          type="text"
                          defaultValue={profile.artistName}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="genre" className="block text-sm font-medium mb-1">
                          Primary Genre
                        </label>
                        <select
                          id="genre"
                          defaultValue={profile.genre}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        >
                          <option>Electronic</option>
                          <option>Hip-Hop</option>
                          <option>Pop</option>
                          <option>Rock</option>
                          <option>R&B</option>
                          <option>House</option>
                          <option>Techno</option>
                          <option>Ambient</option>
                          <option>Jazz</option>
                          <option>Classical</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        placeholder="Tell us about yourself as an artist..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Experience Level
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                          <label
                            key={level}
                            className={`flex items-center p-3 rounded-md border cursor-pointer transition-all
                              ${profile.experience === level 
                                ? 'border-primary bg-primary/10 text-foreground' 
                                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            <input
                              type="radio"
                              name="experience"
                              value={level}
                              defaultChecked={profile.experience === level}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2
                              ${profile.experience === level 
                                ? 'border-primary' 
                                : 'border-muted-foreground'
                              }`}
                            >
                              {profile.experience === level && (
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <span className="capitalize">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Social Links
                      </label>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-pink-500/10 flex items-center justify-center mr-3">
                            <Instagram className="h-5 w-5 text-pink-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Instagram username"
                            defaultValue={profile.socialLinks?.instagram}
                            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mr-3">
                            <Music className="h-5 w-5 text-orange-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="SoundCloud username"
                            defaultValue={profile.socialLinks?.soundcloud}
                            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-green-500/10 flex items-center justify-center mr-3">
                            <svg
                              className="h-5 w-5 text-green-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.36.12-.78-.12-.9-.48-.12-.36.12-.78.48-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.36 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            placeholder="Spotify artist name"
                            defaultValue={profile.socialLinks?.spotify}
                            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center mr-3">
                            <Globe className="h-5 w-5 text-blue-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Website URL"
                            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Account Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings and email preferences
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <div className="flex">
                        <input
                          id="email"
                          type="email"
                          defaultValue={profile.email}
                          className="flex-1 px-3 py-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          disabled
                        />
                        <div className="px-3 py-2 bg-muted border border-l-0 border-border rounded-r-md text-muted-foreground flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          Verified
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Billing & Subscription</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription and payment methods
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="text-base font-medium mb-3">Current Plan</h3>
                    <div className="bg-muted p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{currentPlan?.name} Plan</h4>
                            <p className="text-sm text-muted-foreground">
                              {currentPlan && currentPlan.price > 0 
                                ? `$${currentPlan.price}/${currentPlan.interval}` 
                                : 'Free tier'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        {currentPlan?.id === 'free' ? (
                          <Button
                            onClick={() => navigate('/pricing')}
                          >
                            Upgrade Plan
                          </Button>
                        ) : (
                          <Button variant="outline">
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {currentPlan?.id !== 'free' && (
                    <div>
                      <h3 className="text-base font-medium mb-3">Payment Method</h3>
                      
                      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center mr-3">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1434CB">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <path fill="#FFF" d="M4 10h16v2H4z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Notification Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage how we contact you
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-base font-medium">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Track Analysis</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when your track analysis is complete
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Label Interest</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when a label shows interest in your music
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Features</p>
                          <p className="text-sm text-muted-foreground">
                            Get updates about new TrackTraxx features
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing & Promotions</p>
                          <p className="text-sm text-muted-foreground">
                            Receive special offers and promotions
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;