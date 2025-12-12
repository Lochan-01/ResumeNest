import React from 'react';
import { ResumeData } from '../../types';

const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-black p-8 font-sans text-[10.5pt] leading-snug">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase mb-1">{data.personalInfo.fullName || "YOUR NAME"}</h1>
        <div className="text-sm flex justify-center flex-wrap gap-1 items-center">
           {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
           {data.personalInfo.email && (
             <>
               <span className="mx-1">|</span>
               <a href={`mailto:${data.personalInfo.email}`} className="text-blue-700 underline">{data.personalInfo.email}</a>
             </>
           )}
           {data.personalInfo.linkedin && (
             <>
               <span className="mx-1">|</span>
               <span className="text-blue-700 underline">{data.personalInfo.linkedin}</span>
             </>
           )}
           {data.personalInfo.website && (
             <>
               <span className="mx-1">|</span>
               <span className="text-blue-700 underline">{data.personalInfo.website}</span>
             </>
           )}
        </div>
      </div>

      <hr className="border-t border-black mb-3" />

      {/* Career Objective */}
      {data.summary && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm mb-1">CAREER OBJECTIVE</h2>
          <p className="text-justify">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">SKILLS</h2>
          <div className="mt-1">
             <ul className="list-none pl-0 space-y-0.5">
               {data.skills.map((skill, idx) => (
                 <li key={idx} className="flex">
                   <span className="mr-1">•</span>
                   <span>{skill}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">EDUCATION</h2>
          <div className="mt-1 space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                 <div className="flex-1">
                    <span className="mr-1">•</span>
                    <span className="font-medium">{edu.school}</span>
                    {edu.degree && <span> – <b>{edu.degree}</b></span>}
                 </div>
                 <div className="text-right whitespace-nowrap ml-4">
                    <span>{edu.year}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">WORK EXPERIENCE</h2>
          <div className="mt-1 space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{exp.company} – {exp.role}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-none pl-0 mt-1">
                    {exp.description.split('\n').map((line, i) => {
                        const trimLine = line.trim();
                        if(!trimLine) return null;
                        return (
                            <li key={i} className="flex items-start text-justify">
                                <span className="mr-2">•</span>
                                <span>{trimLine.startsWith('•') ? trimLine.substring(1).trim() : trimLine}</span>
                            </li>
                        )
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

       {/* Projects */}
       {data.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">PROJECTS</h2>
          <div className="mt-1 space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="font-bold">
                    {proj.title} {proj.technologies && <span className="font-normal italic">({proj.technologies})</span>}
                </div>
                <ul className="list-none pl-0 mt-0.5">
                    {proj.description.split('\n').map((line, i) => {
                        const trimLine = line.trim();
                        if(!trimLine) return null;
                        return (
                            <li key={i} className="flex items-start text-justify">
                                <span className="mr-2">•</span>
                                <span>{trimLine.startsWith('•') ? trimLine.substring(1).trim() : trimLine}</span>
                            </li>
                        )
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="mb-3">
           <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">ACHIEVEMENTS</h2>
           <ul className="list-none pl-0 mt-1">
             {data.achievements.map((ach, idx) => (
               <li key={idx} className="flex items-start text-justify mb-0.5">
                 <span className="mr-2">•</span>
                 <span>{ach}</span>
               </li>
             ))}
           </ul>
        </div>
      )}

      {/* Certificates */}
      {data.certificates.length > 0 && (
        <div className="mb-3">
           <h2 className="font-bold uppercase text-sm mb-1 border-b border-gray-300 pb-0.5">CERTIFICATES</h2>
           <ul className="list-none pl-0 mt-1">
             {data.certificates.map((cert, idx) => (
               <li key={idx} className="flex items-start text-justify mb-0.5">
                 <span className="mr-2">•</span>
                 <span>{cert}</span>
               </li>
             ))}
           </ul>
        </div>
      )}

    </div>
  );
};

export default ProfessionalTemplate;