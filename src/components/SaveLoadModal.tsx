import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Upload, Download, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaveLoadModalProps {
  onSave: (name: string) => void;
  onLoad: (file: File) => void;
  hasSavedProgress: boolean;
}

export default function SaveLoadModal({ onSave, onLoad, hasSavedProgress }: SaveLoadModalProps) {
  const [saveName, setSaveName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const trimmedName = saveName.trim();
    
    if (!trimmedName) {
      setError('Please enter a name for your progress');
      return;
    }
    
    onSave(trimmedName);
    setShowSuccess(true);
    setError('');
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
      setSaveName('');
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.love')) {
      setError('Please select a .love file');
      return;
    }
    
    setError('');
    onLoad(file);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-2 hover:border-purple-400 hover:bg-purple-50"
        >
          <Save className="w-4 h-4" />
          Save/Load Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Save className="w-6 h-6 text-purple-600" />
            Save or Load Your Progress
          </DialogTitle>
          <DialogDescription>
            Save your current progress or load a previously saved session
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3"
            >
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Progress saved successfully!</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Save Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Download className="w-4 h-4" />
              Save Current Progress
            </div>
            <div className="space-y-2">
              <Label htmlFor="save-name">Progress Name</Label>
              <Input
                id="save-name"
                placeholder="e.g., My Assessment 2025"
                value={saveName}
                onChange={(e) => {
                  setSaveName(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyPress}
              />
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download as .love file
            </Button>
            {hasSavedProgress && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                Auto-saved in browser storage
              </p>
            )}
          </div>

          <div className="border-t pt-6">
            {/* Load Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Upload className="w-4 h-4" />
                Load Previous Progress
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload a .love file
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or drag and drop
                    </p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".love"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}