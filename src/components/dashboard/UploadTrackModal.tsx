import { useState, useRef } from 'react';
import { X, Upload, Music, Info } from 'lucide-react';
import Button from '../ui/Button';
import { useSubscription } from '../../context/SubscriptionContext';
import AiConsentModal, { hasAiConsent } from '../consent/AiConsentModal';
import { track } from '../../utils/analytics';

export interface UploadMeta {
  startedAt: number;
  durationSec?: number;
  fileFormat: 'mp3' | 'wav';
}

interface UploadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File, meta: UploadMeta) => Promise<void>;
}

function detectFileFormat(file: File): 'mp3' | 'wav' {
  if (file.type === 'audio/wav' || /\.wav$/i.test(file.name)) return 'wav';
  return 'mp3';
}

function probeAudioDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    const cleanup = () => URL.revokeObjectURL(url);
    audio.addEventListener('loadedmetadata', () => {
      const d = isFinite(audio.duration) ? Math.round(audio.duration) : undefined;
      cleanup();
      resolve(d);
    }, { once: true });
    audio.addEventListener('error', () => { cleanup(); resolve(undefined); }, { once: true });
    audio.src = url;
  });
}

const UploadTrackModal = ({ isOpen, onClose, onUpload }: UploadTrackModalProps) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAiConsent, setShowAiConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getRemainingUploads } = useSubscription();

  const remainingUploads = getRemainingUploads();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }
    
    // Check file size (limit to 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size should be less than 20MB');
      return;
    }
    
    setFile(file);
    
    // Auto-set title from filename if not already set
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setTitle(fileName);
    }
  };

  const attemptRef = useRef(0);

  const doUpload = async () => {
    if (!file) return;
    const fileFormat = detectFileFormat(file);
    const durationSec = await probeAudioDuration(file);
    const startedAt = Date.now();
    attemptRef.current += 1;
    track('track_upload_started', {
      attempt_number: attemptRef.current,
      fileSize: file.size,
      fileFormat,
    });
    try {
      setIsUploading(true);
      await onUpload(title, file, { startedAt, durationSec, fileFormat });
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload track. Please try again.');
    } finally {
      setIsUploading(false);
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

    if (!hasAiConsent()) {
      setShowAiConsent(true);
      return;
    }

    await doUpload();
  };

  if (!isOpen) return null;

  return (
    <>
    <AiConsentModal
      isOpen={showAiConsent}
      onAccept={() => {
        setShowAiConsent(false);
        doUpload();
      }}
      onClose={() => setShowAiConsent(false)}
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-card w-full max-w-lg rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Upload Track</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {remainingUploads <= 0 ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="mt-3 text-lg font-medium">Upload limit reached</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You've used all your track uploads for this month.
                <br />
                Consider upgrading your plan to upload more tracks.
              </p>
              <div className="mt-4">
                <Button 
                  variant="primary"
                  onClick={() => {
                    onClose();
                    // Navigate to pricing page
                    window.location.href = '/pricing';
                  }}
                >
                  View Pricing Plans
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Track Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  placeholder="Enter track title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Audio File
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    ${file ? 'bg-primary/5 border-primary/50' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {file ? (
                    <>
                      <Music className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-xs text-primary hover:text-primary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Drag and drop your audio file here</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse (MP3, WAV, up to 20MB)
                      </p>
                    </>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mb-4">
                <Info className="h-4 w-4 mr-1" />
                <span>You have {remainingUploads} upload{remainingUploads !== 1 ? 's' : ''} remaining this month</span>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isUploading}
                  disabled={!file || isUploading}
                >
                  Upload Track
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
    </>
  );
};

export default UploadTrackModal;
