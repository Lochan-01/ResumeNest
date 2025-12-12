export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
    location: string;
    jobTitle: string;
  };
  summary: string;
  skills: string[]; // Keep as simple string array for now, but template can parse categorizations if user types "Category: Skill"
  experience: Experience[];
  education: Education[];
  projects: Project[];
  achievements: string[];
  certificates: string[];
}

export enum TemplateType {
  MODERN = 'MODERN',
  MINIMAL = 'MINIMAL',
  CREATIVE = 'CREATIVE',
  PROFESSIONAL = 'PROFESSIONAL'
}

export type AIActionType = 'FIX_SPELLING' | 'ENHANCE_TONE' | 'GENERATE_SUMMARY';