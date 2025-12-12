import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, User, Briefcase, GraduationCap, PenTool, FolderGit2, Award, FileBadge } from 'lucide-react';
import AIAssistButton from './AIAssistButton';

interface ResumeFormProps {
  data: ResumeData;
  updateData: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, updateData }) => {
  const [activeSection, setActiveSection] = useState<string>('personal');

  const handleChange = (section: keyof ResumeData, field: string, value: any) => {
    updateData({
      ...data,
      [section]: {
        ...data[section as any],
        [field]: value
      }
    });
  };

  const handleDeepChange = (value: string) => {
      updateData({...data, summary: value});
  }

  // --- Experience Handlers ---
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateData({ ...data, experience: [...data.experience, newExp] });
  };
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    updateData({ ...data, experience: newExp });
  };
  const removeExperience = (index: number) => {
    updateData({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };

  // --- Education Handlers ---
  const addEducation = () => {
      const newEdu: Education = {
          id: Date.now().toString(),
          degree: '',
          school: '',
          year: ''
      };
      updateData({...data, education: [...data.education, newEdu]});
  }
  const updateEducation = (index: number, field: keyof Education, value: string) => {
      const newEdu = [...data.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      updateData({ ...data, education: newEdu });
  }
  const removeEducation = (index: number) => {
      updateData({ ...data, education: data.education.filter((_, i) => i !== index) });
  }

  // --- Project Handlers ---
  const addProject = () => {
      const newProj: Project = {
          id: Date.now().toString(),
          title: '',
          technologies: '',
          description: '',
          link: ''
      };
      updateData({...data, projects: [...data.projects, newProj]});
  }
  const updateProject = (index: number, field: keyof Project, value: string) => {
      const newProj = [...data.projects];
      newProj[index] = { ...newProj[index], [field]: value };
      updateData({ ...data, projects: newProj });
  }
  const removeProject = (index: number) => {
      updateData({ ...data, projects: data.projects.filter((_, i) => i !== index) });
  }

  // --- Lists Handlers (Achievements / Certificates) ---
  const updateList = (type: 'achievements' | 'certificates', value: string) => {
     // Split by new line for simple editing
     const list = value.split('\n');
     updateData({ ...data, [type]: list });
  }

  const updateSkills = (value: string) => {
    updateData({ ...data, skills: value.split('\n') });
  };

  const SectionHeader = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <button
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-4 rounded-xl mb-3 transition-all duration-300 ${activeSection === id ? 'bg-teal-600 shadow-lg shadow-teal-500/30 text-white' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-semibold">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
      
      {/* Personal Info */}
      <SectionHeader id="personal" icon={User} title="Personal Details" />
      {activeSection === 'personal' && (
        <div className="space-y-4 mb-6 glass-panel p-4 rounded-xl animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.fullName}
              onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Job Title"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.jobTitle}
              onChange={(e) => handleChange('personalInfo', 'jobTitle', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.email}
              onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.phone}
              onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location (City, Country)"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.location}
              onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
            />
             <input
              type="text"
              placeholder="LinkedIn / Website"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.website}
              onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
            />
             <input
              type="text"
              placeholder="LinkedIn URL"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-500"
              value={data.personalInfo.linkedin}
              onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
            />
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-slate-400">Career Objective / Summary</label>
                <div className="flex gap-2">
                    <AIAssistButton 
                        inputData={data.personalInfo.jobTitle}
                        context={JSON.stringify(data.experience)}
                        onUpdate={(val) => handleDeepChange(val)}
                        action="GENERATE_SUMMARY"
                        tooltip="Generate a summary"
                    />
                     <AIAssistButton 
                        inputData={data.summary}
                        onUpdate={(val) => handleDeepChange(val)}
                        action="FIX_SPELLING"
                        tooltip="Fix grammar"
                    />
                </div>
            </div>
            <textarea
              placeholder="Brief professional summary..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none placeholder-slate-500"
              value={data.summary}
              onChange={(e) => handleDeepChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Skills */}
      <SectionHeader id="skills" icon={PenTool} title="Skills" />
      {activeSection === 'skills' && (
         <div className="glass-panel p-4 rounded-xl mb-6">
            <label className="text-sm text-slate-400 mb-2 block">List skills (One per line for best formatting)</label>
            <textarea
              placeholder="Programming Languages: C | C++ | Python&#10;Technical Skills: Data Structures | Algorithms"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none placeholder-slate-500"
              value={data.skills.join('\n')}
              onChange={(e) => updateSkills(e.target.value)}
            />
         </div>
      )}

      {/* Experience */}
      <SectionHeader id="experience" icon={Briefcase} title="Work Experience" />
      {activeSection === 'experience' && (
        <div className="space-y-6 mb-6">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="glass-panel p-4 rounded-xl relative group">
              <button 
                onClick={() => removeExperience(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Role / Job Title"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
                 <input
                  type="text"
                  placeholder="Start Date"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                 <input
                  type="text"
                  placeholder="End Date"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                />
              </div>
              <div className="relative">
                 <div className="flex justify-end gap-2 mb-1 absolute right-2 top-2 z-10">
                     <AIAssistButton 
                        inputData={exp.description}
                        onUpdate={(val) => updateExperience(index, 'description', val)}
                        action="ENHANCE_TONE"
                        tooltip="Enhance bullet points"
                    />
                 </div>
                <textarea
                    placeholder="• Implemented scalable validation... (Use new lines for bullets)"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none h-32 resize-none placeholder-slate-500"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Position
          </button>
        </div>
      )}

      {/* Projects */}
      <SectionHeader id="projects" icon={FolderGit2} title="Projects" />
      {activeSection === 'projects' && (
        <div className="space-y-6 mb-6">
          {data.projects.map((proj, index) => (
            <div key={proj.id} className="glass-panel p-4 rounded-xl relative group">
              <button 
                onClick={() => removeProject(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={proj.title}
                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Technologies used (e.g. React, Node)"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                  value={proj.technologies}
                  onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                />
              </div>
              <div className="relative">
                 <div className="flex justify-end gap-2 mb-1 absolute right-2 top-2 z-10">
                     <AIAssistButton 
                        inputData={proj.description}
                        onUpdate={(val) => updateProject(index, 'description', val)}
                        action="ENHANCE_TONE"
                        tooltip="Enhance description"
                    />
                 </div>
                <textarea
                    placeholder="• Built a web search assistant... (Use new lines for bullets)"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none h-32 resize-none placeholder-slate-500"
                    value={proj.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            onClick={addProject}
            className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      )}

      {/* Education */}
      <SectionHeader id="education" icon={GraduationCap} title="Education" />
      {activeSection === 'education' && (
        <div className="space-y-4 mb-6">
            {data.education.map((edu, index) => (
                <div key={edu.id} className="glass-panel p-4 rounded-xl relative group">
                    <button 
                        onClick={() => removeEducation(index)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Degree (e.g. B.E CSE)"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="School / University"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                            value={edu.school}
                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        />
                         <input
                            type="text"
                            placeholder="Year / CGPA"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none placeholder-slate-500"
                            value={edu.year}
                            onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        />
                    </div>
                </div>
            ))}
             <button
                onClick={addEducation}
                className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add Education
            </button>
        </div>
      )}

      {/* Achievements */}
      <SectionHeader id="achievements" icon={Award} title="Achievements" />
      {activeSection === 'achievements' && (
         <div className="glass-panel p-4 rounded-xl mb-6">
            <label className="text-sm text-slate-400 mb-2 block">One achievement per line</label>
            <textarea
              placeholder="• Winner of Hackathon 2024..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none placeholder-slate-500"
              value={data.achievements.join('\n')}
              onChange={(e) => updateList('achievements', e.target.value)}
            />
         </div>
      )}

      {/* Certificates */}
      <SectionHeader id="certificates" icon={FileBadge} title="Certificates" />
      {activeSection === 'certificates' && (
         <div className="glass-panel p-4 rounded-xl mb-6">
            <label className="text-sm text-slate-400 mb-2 block">One certificate per line</label>
            <textarea
              placeholder="• Introduction to Cloud Computing - IBM..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none placeholder-slate-500"
              value={data.certificates.join('\n')}
              onChange={(e) => updateList('certificates', e.target.value)}
            />
         </div>
      )}

    </div>
  );
};

export default ResumeForm;