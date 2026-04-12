
import React, { useState } from 'react';
import { Upload, FileText, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { extractTextFromPDF } from '../lib/pdf';
import { analyzeJD } from '../lib/gemini';
import { JobDescription } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onJDsAnalyzed: (jds: JobDescription[]) => void;
}

export function FileUpload({ onJDsAnalyzed }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    const analyzedJDs: JobDescription[] = [];
    
    try {
      for (const file of files) {
        toast.info(`Analyzing ${file.name}...`);
        const text = await extractTextFromPDF(file);
        const jd = await analyzeJD(text, file.name);
        analyzedJDs.push(jd);
      }
      onJDsAnalyzed(analyzedJDs);
      setFiles([]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Analysis failed. Please check your files.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`relative group transition-all duration-500 ${files.length > 0 ? 'mb-6' : ''}`}>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <label 
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-white hover:bg-slate-50 hover:border-accent-gray/40 ${
            isUploading ? 'opacity-50 pointer-events-none' : 'border-slate-200'
          }`}
        >
          <div className="bg-accent-gray text-white p-4 rounded-2xl mb-4 shadow-lg shadow-accent-gray/20 group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Drop your JDs here</h3>
            <p className="text-sm text-slate-400 font-medium">PDF files only • Multiple files supported</p>
          </div>
        </label>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((file, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(i)} 
                    className="p-2 hover:bg-accent-rose/10 rounded-xl transition-colors"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4 text-slate-300 hover:text-accent-rose" />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <Button 
              className="w-full h-14 rounded-2xl text-base font-bold bg-accent-gray hover:bg-accent-gray/90 text-white shadow-lg shadow-accent-gray/20 transition-all active:scale-[0.98]" 
              onClick={processFiles} 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing Intelligence...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Analyze {files.length} Document{files.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
