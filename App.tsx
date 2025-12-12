import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateType } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AuthPage from './components/AuthPage';
import { FileText, LogOut } from 'lucide-react';
import { authService } from './services/authService';
import { resumeService } from './services/resumeService';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    location: '',
    jobTitle: ''
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  achievements: [],
  certificates: []
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.PROFESSIONAL);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [savedResumes, setSavedResumes] = useState<Array<any>>([]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedResumes([]);
      return;
    }

    (async () => {
      try {
        const list = await resumeService.list();
        setSavedResumes(list);
      } catch (err) {
        console.error('Failed to load saved resumes', err);
      }
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#020617]">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ResumeNest
            </h1>
            <p className="text-xs text-slate-500">Build smarter, faster.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Template Switcher (Desktop) */}
            <div className="hidden md:flex bg-white/5 rounded-full p-1 border border-white/10">
            {(Object.keys(TemplateType) as Array<keyof typeof TemplateType>).map((t) => (
                <button
                key={t}
                onClick={() => setActiveTemplate(TemplateType[t])}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    activeTemplate === TemplateType[t] 
                    ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
                >
                {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
            ))}
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <select
                className="bg-slate-900/40 border border-white/10 rounded-md px-2 py-1 text-sm text-slate-200"
                onChange={async (e) => {
                  const id = e.target.value;
                  if (!id) return;
                  try {
                    const res = await resumeService.get(id);
                    if (res && res.data) {
                      setResumeData(res.data);
                    }
                  } catch (err) {
                    console.error('Load resume error', err);
                  }
                }}
              >
                <option value="">Load saved...</option>
                {savedResumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.title || 'Untitled'}</option>
                ))}
              </select>

              <button
                onClick={async () => {
                  const title = window.prompt('Save resume as (title):', 'My Resume');
                  if (!title) return;
                  try {
                    await resumeService.save(title, resumeData);
                    const list = await resumeService.list();
                    setSavedResumes(list);
                    alert('Saved successfully');
                  } catch (err) {
                    console.error('Save resume error', err);
                    alert('Failed to save resume');
                  }
                }}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-md text-sm"
              >
                Save
              </button>
            </div>

            <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Sign Out"
            >
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container mx-auto p-4 md:p-6 lg:h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {/* Mobile Tabs */}
          <div className="lg:hidden flex bg-white/5 p-1 rounded-lg mb-4">
             <button 
                onClick={() => setMobileTab('editor')}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${mobileTab === 'editor' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
             >
                Editor
             </button>
             <button 
                onClick={() => setMobileTab('preview')}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${mobileTab === 'preview' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
             >
                Preview
             </button>
          </div>

          {/* Left Panel: Editor */}
          <div className={`w-full lg:w-1/2 flex flex-col gap-4 transition-opacity duration-300 ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-1 flex-1 overflow-hidden backdrop-blur-sm">
                <ResumeForm data={resumeData} updateData={setResumeData} />
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className={`w-full lg:w-1/2 flex flex-col gap-4 transition-opacity duration-300 ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
             
             {/* Mobile Template Switcher */}
             <div className="lg:hidden flex justify-center gap-2 overflow-x-auto pb-2">
                {(Object.keys(TemplateType) as Array<keyof typeof TemplateType>).map((t) => (
                    <button
                    key={t}
                    onClick={() => setActiveTemplate(TemplateType[t])}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        activeTemplate === TemplateType[t] 
                        ? 'bg-teal-600 border-teal-600 text-white' 
                        : 'border-white/20 text-slate-400'
                    }`}
                    >
                    {t}
                    </button>
                ))}
             </div>

             <ResumePreview data={resumeData} template={activeTemplate} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;