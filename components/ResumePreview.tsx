import React, { useRef } from 'react';
import { ResumeData, TemplateType } from '../types';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import { Download } from 'lucide-react';
import Button from './Button';
import ReactDOM from 'react-dom/client';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    switch (template) {
      case TemplateType.MINIMAL:
        return <MinimalTemplate data={data} />;
      case TemplateType.CREATIVE:
        return <CreativeTemplate data={data} />;
      case TemplateType.PROFESSIONAL:
        return <ProfessionalTemplate data={data} />;
      case TemplateType.MODERN:
      default:
        return <ModernTemplate data={data} />;
    }
  };

  const handlePrint = () => {
    // We render the resume component into the hidden print-area div in index.html
    // This allows us to print just the resume, not the app UI
    const printArea = document.getElementById('print-area');
    if (printArea) {
      const root = ReactDOM.createRoot(printArea);
      root.render(renderTemplate());
      
      // Wait for render, then print
      setTimeout(() => {
        window.print();
        // Cleanup after print dialog closes (or immediately after trigger)
        // Note: Actual cleanup on print completion is hard to detect cross-browser, 
        // but leaving it in the hidden div is harmless.
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Live Preview</h3>
        <Button variant="primary" onClick={handlePrint} className="gap-2 text-sm">
           <Download size={16} /> Download / Print PDF
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
        
        {/* Resume Container - Scaled to fit */}
        <div className="relative w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
            <div 
                ref={resumeRef}
                className="bg-white shadow-xl origin-top transform md:scale-[0.55] lg:scale-[0.65] xl:scale-[0.85] 2xl:scale-100 transition-transform duration-300 ease-out"
                style={{ 
                    width: '210mm', 
                    height: '297mm',
                    minWidth: '210mm',
                    minHeight: '297mm', 
                }}
            >
                {renderTemplate()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;