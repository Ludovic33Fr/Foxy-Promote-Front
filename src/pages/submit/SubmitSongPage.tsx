import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Music, AlertCircle, FileMusic, X } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';

const SubmitSongPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRemainingUploads } = useSubscription();

  const remainingUploads = getRemainingUploads();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check if it's an audio file
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }

    // Check file size (limit to 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File size should be less than 20MB');
      return;
    }

    setFile(selectedFile);

    // Auto-set title from filename if not already set
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your track');
      return;
    }

    try {
      setIsUploading(true);
      
      // Mock upload delay - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard after successful upload
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload track. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const genres = [
    'Electronic', 'Hip-Hop', 'Pop', 'Rock', 'R&B', 'Jazz',
    'Classical', 'Country', 'Folk', 'Metal', 'Indie', 'Other'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submit Your Track</h1>
          <p className="text-muted-foreground mt-1">
            Upload your track for AI analysis and feedback
          </p>
        </div>

        {remainingUploads <= 0 ? (
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload limit reached</h3>
            <p className="text-muted-foreground mb-4">
              You've used all your track uploads for this month.
              Consider upgrading your plan to upload more tracks.
            </p>
            <Button
              onClick={() => navigate('/pricing')}
              variant="outline"
            >
              View Pricing Plans
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer
                    ${file ? 'bg-primary/5 border-primary/50' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  {file ? (
                    <>
                      <FileMusic className="h-12 w-12 text-primary mb-4" />
                      <p className="text-lg font-medium mb-1">{file.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        leftIcon={<X className="h-4 w-4" />}
                      >
                        Remove File
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-1">Drop your audio file here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (MP3, WAV up to 20MB)
                      </p>
                    </>
                  )}
                  
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Track Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="Enter track title"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium mb-1">
                      Genre
                    </label>
                    <select
                      id="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      required
                    >
                      <option value="">Select a genre</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-6 py-3 bg-red-100 dark:bg-red-900/30 border-t border-border">
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="px-6 py-4 bg-muted border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{remainingUploads}</span> upload{remainingUploads !== 1 ? 's' : ''} remaining this month
                </div>
                <Button
                  type="submit"
                  isLoading={isUploading}
                  disabled={!file || isUploading}
                  leftIcon={<Music className="h-4 w-4" />}
                >
                  Submit Track
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default SubmitSongPage;