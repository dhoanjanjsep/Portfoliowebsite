import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({ onFileSelect, accept = "*/*", maxSize = 50 * 1024 * 1024, className = "", children }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > maxSize) {
      alert(`파일 크기가 너무 큽니다. 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 업로드 가능합니다.`);
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-gaming-primary bg-gaming-primary/10' 
            : 'border-gaming-primary/30 hover:border-gaming-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <File className="text-gaming-primary" size={24} />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-gaming-secondary hover:text-gaming-secondary"
              >
                <X size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              크기: {Math.round(selectedFile.size / 1024)} KB
            </p>
          </div>
        ) : (
          <>
            {children || (
              <>
                <Upload className="text-2xl text-gaming-primary mb-2 mx-auto" size={32} />
                <p className="text-sm text-gray-400 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-gray-500">최대 {Math.round(maxSize / 1024 / 1024)}MB</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
