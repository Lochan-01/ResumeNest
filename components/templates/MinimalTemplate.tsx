import React from 'react';
import { ResumeData } from '../../types';

const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-gray-900 p-10 font-serif leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
        <p className="text-lg italic text-gray-600 mb-4">{data.personalInfo.jobTitle || "Professional Title"}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Profile</h2>
          <p className="text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Work Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-600 italic">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-gray-700 font-medium mb-1">{exp.company}</div>
                <p className="text-sm text-gray-800 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <div className="text-gray-700">{edu.school}</div>
                  <div className="text-sm text-gray-500">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Skills</h2>
            <ul className="list-disc list-inside text-sm text-gray-800 columns-2">
              {data.skills.map((skill, index) => (
                <li key={index} className="mb-1">{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;