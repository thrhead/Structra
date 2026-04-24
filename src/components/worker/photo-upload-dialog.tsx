'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface PhotoUploadDialogProps {
  jobId: string;
  stepId: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function PhotoUploadDialog({
  jobId,
  stepId,
  onUploadSuccess,
}: PhotoUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan az olmalıdır');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobId', jobId);
      formData.append('stepId', stepId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload başarısız');
      }

      const data = await response.json();
      
      toast.success('Fotoğraf başarıyla yüklendi');
      onUploadSuccess?.(data.secure_url);
      
      // Reset state
      setFile(null);
      setPreview(null);
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fotoğraf yüklemesi başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Camera className="h-4 w-4" />
          Fotoğraf Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
        <DialogHeader className="space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-2">
            <Camera className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">Fotoğraf Yükle</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Adım tamamlandığında fotoğraf ekleyin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Preview */}
          {preview ? (
            <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-3">
                <button
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-400/50 transition-all duration-300 dark:bg-slate-900/50 dark:hover:bg-indigo-950/20">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resim seçmek için tıklayın
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Yükleniyor...
                </div>
            ) : (
                'Fotoğrafı Yükle'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
