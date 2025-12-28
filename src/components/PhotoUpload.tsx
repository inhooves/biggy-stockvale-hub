import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  maxSizeMB: number;
  required?: boolean;
  error?: string;
}

const PhotoUpload = ({ label, value, onChange, maxSizeMB, required, error }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [maxSizeMB, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearPhoto = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border animate-scale-in">
          <img 
            src={value} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full hover:bg-destructive/80 transition-colors"
          >
            <X size={16} className="text-destructive-foreground" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative w-full h-40 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer",
            "flex flex-col items-center justify-center gap-2",
            isDragging 
              ? "border-primary bg-primary/10" 
              : "border-muted hover:border-primary/50 hover:bg-card",
            error && "border-destructive"
          )}
        >
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          
          {isLoading ? (
            <Loader2 size={32} className="text-primary animate-spin" />
          ) : (
            <>
              <div className="p-3 rounded-full bg-secondary">
                {isDragging ? (
                  <ImageIcon size={24} className="text-primary" />
                ) : (
                  <Upload size={24} className="text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isDragging ? 'Drop your photo here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  JPG/PNG, max {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default PhotoUpload;
