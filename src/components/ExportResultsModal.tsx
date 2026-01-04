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
import { FileDown, FileImage, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportResultsModalProps {
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportResultsModal({ resultsRef }: ExportResultsModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'jpg' | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const captureElement = async (element: HTMLElement) => {
    // Fix for oklch color space - force conversion to RGB
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#f9fafb',
      onclone: (clonedDoc) => {
        // Convert all oklch colors to RGB before capturing
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const styles = window.getComputedStyle(el);
          
          // Convert background colors
          if (styles.backgroundColor && styles.backgroundColor.includes('oklch')) {
            htmlEl.style.backgroundColor = 'rgb(249, 250, 251)'; // fallback color
          }
          
          // Convert text colors
          if (styles.color && styles.color.includes('oklch')) {
            htmlEl.style.color = 'rgb(0, 0, 0)';
          }
          
          // Convert border colors
          if (styles.borderColor && styles.borderColor.includes('oklch')) {
            htmlEl.style.borderColor = 'rgb(209, 213, 219)';
          }
        });
      }
    });
    
    return canvas;
  };

  const exportAsPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsExporting(true);
    setExportType('pdf');

    try {
      const canvas = await captureElement(resultsRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      // Split into multiple pages if needed
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('love-language-results.pdf');
      
      // Close modal after successful export
      setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error creating PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportAsJPG = async (multipleSlides: boolean) => {
    if (!resultsRef.current) return;
    
    setIsExporting(true);
    setExportType('jpg');

    try {
      if (multipleSlides) {
        const sections = resultsRef.current.querySelectorAll('.results-section');
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i] as HTMLElement;
          const canvas = await captureElement(section);

          const link = document.createElement('a');
          link.download = `love-language-slide-${i + 1}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        const canvas = await captureElement(resultsRef.current);

        const link = document.createElement('a');
        link.download = 'love-language-results.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      }
      
      // Close modal after successful export
      setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      console.error('Error exporting JPG:', error);
      alert('Error creating images. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
        >
          <FileDown className="w-5 h-5" />
          Export Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileDown className="w-6 h-6 text-blue-600" />
            Export Your Results
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to save and share your love language profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* PDF Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAsPDF}
            disabled={isExporting}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileDown className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Export as PDF
                </h3>
                <p className="text-sm text-gray-600">
                  Professional document format, perfect for printing or sharing
                </p>
              </div>
              {isExporting && exportType === 'pdf' && (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              )}
            </div>
          </motion.button>

          {/* Single JPG Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportAsJPG(false)}
            disabled={isExporting}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileImage className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Export as Single Image
                </h3>
                <p className="text-sm text-gray-600">
                  One long image with all your results, great for social media
                </p>
              </div>
              {isExporting && exportType === 'jpg' && (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              )}
            </div>
          </motion.button>

          {/* Multiple JPG Slides Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportAsJPG(true)}
            disabled={isExporting}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                <FileImage className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Export as Multiple Slides
                </h3>
                <p className="text-sm text-gray-600">
                  Each section as a separate image, perfect for presentations
                </p>
              </div>
              {isExporting && exportType === 'jpg' && (
                <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
              )}
            </div>
          </motion.button>
        </div>

        {isExporting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">
              Generating your export... This may take a moment.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}