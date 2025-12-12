import React from 'react';
import { ResumeData } from '../../types';

const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-gray-800 font-sans p-0 flex flex-col">
      {/* Header Banner */}
      <div className="bg-[#FF6B6B] text-white p-10 flex flex-col md:flex-row justify-between items-end">
        <div>
           <h1 className="text-5xl font-extrabold tracking-tight mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
           <p className="text-xl font-medium opacity-90">{data.personalInfo.jobTitle || "Creative Professional"}</p>
        </div>
        <div className="text-right text-sm font-medium opacity-90 mt-4 md:mt-0">
          <div>{data.personalInfo.email}</div>
          <div>{data.personalInfo.phone}</div>
          <div>{data.personalInfo.location}</div>
        </div>
      </div>

      <div className="flex-1 flex p-8 gap-8">
        {/* Left Column */}
        <div className="w-2/3 pr-4">
           {data.summary && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-[#FF6B6B]">
              <h2 className="text-[#FF6B6B] font-bold text-lg mb-2 uppercase tracking-wide">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
           )}

           {data.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#4ECDC4]"></span>
                Experience
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#4ECDC4] transition-colors">{exp.role}</h3>
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[#FF6B6B] font-bold text-sm mb-3">{exp.company}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
           )}
        </div>

        {/* Right Column */}
        <div className="w-1/3 space-y-8">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-[#FFE66D] pb-2 inline-block">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-[#FFE66D] pb-2 inline-block">Education</h2>
              <div className="space-y-4">
                 {data.education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-bold text-gray-900">{edu.degree}</div>
                      <div className="text-sm text-[#4ECDC4] font-bold">{edu.school}</div>
                      <div className="text-xs text-gray-500 mt-1">{edu.year}</div>
                    </div>
                 ))}
              </div>
            </div>
          )}
          
          {data.personalInfo.website && (
             <div className="mt-8 pt-6 border-t border-gray-100 text-center">
               <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Portfolio</div>
               <div className="font-bold text-[#FF6B6B] truncate">{data.personalInfo.website}</div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;