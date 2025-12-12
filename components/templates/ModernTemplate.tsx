import React from 'react';
import { ResumeData } from '../../types';

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white flex text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-8">
        <div className="text-center mb-4">
          <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0) : 'A'}
          </div>
          <h2 className="text-xl font-bold leading-tight">{data.personalInfo.fullName || "Your Name"}</h2>
          <p className="text-blue-300 mt-2">{data.personalInfo.jobTitle || "Job Title"}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Contact</h3>
          <ul className="text-sm space-y-3 text-slate-300 break-words">
            {data.personalInfo.email && <li>{data.personalInfo.email}</li>}
            {data.personalInfo.phone && <li>{data.personalInfo.phone}</li>}
            {data.personalInfo.location && <li>{data.personalInfo.location}</li>}
            {data.personalInfo.website && <li>{data.personalInfo.website}</li>}
          </ul>
        </div>

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-800 text-blue-200 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm text-white">{edu.degree}</div>
                  <div className="text-slate-400 text-xs">{edu.school}</div>
                  <div className="text-slate-500 text-xs">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 bg-slate-50">
        {data.summary && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 relative inline-block">
              Profile
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600"></span>
            </h2>
            <p className="text-slate-600 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
             <h2 className="text-2xl font-bold text-slate-900 mb-6 relative inline-block">
              Experience
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600"></span>
            </h2>
            <div className="space-y-8 relative border-l-2 border-slate-200 ml-3 pl-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <span className="absolute -left-[39px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-slate-50"></span>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                      <div className="text-blue-600 font-medium">{exp.company}</div>
                    </div>
                    <div className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;