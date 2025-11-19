import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resumeService } from '../services/resumeService'
import BulletRewriter from '../components/BulletRewriter'

interface ResumeData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  summary: string
  template: 'modern' | 'classic' | 'minimal'
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    year: string
    gpa?: string
  }>
  projects: Array<{
    name: string
    link: string
    date: string
    description: string
    technologies: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    link: string
  }>
  skills: string[]
  links: Array<{
    platform: string
    url: string
  }>
}

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [showRewriter, setShowRewriter] = useState(false)
  const [rewriterContext, setRewriterContext] = useState<{ field: string; index: number } | null>(null)

  const [resume, setResume] = useState<ResumeData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    template: 'modern',
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', field: '', year: '', gpa: '' }],
    projects: [],
    certifications: [],
    skills: [],
    links: [{ platform: 'LinkedIn', url: '' }, { platform: 'GitHub', url: '' }, { platform: 'Portfolio', url: '' }]
  })

  const [skillInput, setSkillInput] = useState('')

  const handlePersonalChange = (field: string, value: string) => {
    setResume(prev => ({ ...prev, [field]: value }))
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...resume.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setResume(prev => ({ ...prev, experience: newExperience }))
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...resume.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setResume(prev => ({ ...prev, education: newEducation }))
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...resume.links]
    newLinks[index] = { ...newLinks[index], url: value }
    setResume(prev => ({ ...prev, links: newLinks }))
  }

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    }))
  }

  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', year: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setResume(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (index: number) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', link: '', date: '', description: '', technologies: '' }]
    }))
  }

  const removeProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...resume.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setResume(prev => ({ ...prev, projects: newProjects }))
  }

  const addCertification = () => {
    setResume(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', link: '' }]
    }))
  }

  const removeCertification = (index: number) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const newCertifications = [...resume.certifications]
    newCertifications[index] = { ...newCertifications[index], [field]: value }
    setResume(prev => ({ ...prev, certifications: newCertifications }))
  }

  const handleBulletSelect = (rewrittenText: string) => {
    if (rewriterContext?.field === 'experience') {
      handleExperienceChange(rewriterContext.index, 'description', rewrittenText)
    } else if (rewriterContext?.field === 'project') {
      handleProjectChange(rewriterContext.index, 'description', rewrittenText)
    }
    setRewriterContext(null)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (id) {
        await resumeService.updateResume(id, resume as any)
      } else {
        await resumeService.createResume(resume as any)
      }
      alert('Resume saved successfully!')
    } catch (error) {
      alert('Failed to save resume')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setLoading(true)
      const previewElement = document.getElementById('resume-preview')
      if (!previewElement) {
        alert('Preview not found')
        setLoading(false)
        return
      }

      // Get html2pdf from window
      const html2pdf = (window as any).html2pdf

      if (!html2pdf) {
        alert('PDF library not loaded. Please refresh the page and try again.')
        setLoading(false)
        return
      }

      // Create options for direct download with HIGH QUALITY
      const element = previewElement
      const filename = `${resume.firstName}_${resume.lastName}_Resume.pdf`

      // Configure html2pdf options with enhanced quality settings
      const options = {
        margin: 5,
        filename: filename,
        image: { type: 'jpeg', quality: 1.0 }, // Maximum quality
        html2canvas: { 
          scale: 3, // Increased from 2 to 3 for crisp text
          useCORS: true, 
          logging: false,
          letterRendering: true, // Better text rendering
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false // No compression for quality
        },
        pagebreak: { avoid: 'tr', mode: 'avoid-all' }
      }

      // Generate and download PDF directly
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          setLoading(false)
          alert('Resume downloaded successfully! 📥')
        })
        .catch((error: any) => {
          console.error('PDF download error:', error)
          setLoading(false)
          alert('Error downloading PDF. Please try again.')
        })
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download PDF')
      setLoading(false)
    }
  }

  const renderModernTemplate = () => (
    <div className="space-y-3">
      <div className="pb-3 border-b-2 border-blue-500">
        <h3 className="text-lg font-bold text-blue-900">{resume.firstName} {resume.lastName}</h3>
        <p className="text-xs text-purple-300">{resume.location}</p>
        <p className="text-xs text-blue-600 flex flex-wrap gap-2">
          <span>📧 {resume.email}</span>
          <span>📞 {resume.phone}</span>
        </p>
      </div>

      {resume.links.some(l => l.url) && (
        <div className="pb-2">
          {resume.links.map((link, i) => link.url && (
            <div key={i} className="text-xs text-blue-600">
              🔗 {link.platform}: {link.url}
            </div>
          ))}
        </div>
      )}

      {resume.summary && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase">Summary</div>
          <p className="text-xs text-purple-300 leading-snug">{resume.summary}</p>
        </div>
      )}

      {resume.experience.some(e => e.company) && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">Experience</div>
          {resume.experience.map((exp, i) => exp.company && (
            <div key={i} className="text-xs mb-2 pb-2 border-b border-gray-200">
              <div className="font-bold text-blue-700">• {exp.position}</div>
              <div className="text-purple-300">{exp.company}</div>
              <div className="text-gray-600 text-xs">{exp.startDate} → {exp.endDate || 'Present'}</div>
              {exp.description && <div className="text-purple-300 mt-1 leading-snug">○ {exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.education.some(e => e.school) && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">Education</div>
          {resume.education.map((edu, i) => edu.school && (
            <div key={i} className="text-xs mb-2">
              <div className="font-bold text-blue-700">• {edu.degree} in {edu.field}</div>
              <div className="text-purple-300">{edu.school}</div>
              {edu.year && <div className="text-gray-600">{edu.year}</div>}
              {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.projects.some(p => p.name) && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">Projects</div>
          {resume.projects.map((proj, i) => proj.name && (
            <div key={i} className="text-xs mb-2 pb-2 border-b border-gray-200">
              <div className="font-bold text-blue-700">• {proj.name}</div>
              {proj.date && <div className="text-gray-600">{proj.date}</div>}
              {proj.description && <div className="text-purple-300 mt-1 leading-snug">○ {proj.description}</div>}
              {proj.technologies && <div className="text-gray-600 text-xs">Tech: {proj.technologies}</div>}
              {proj.link && <div className="text-blue-600 text-xs">🔗 {proj.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.certifications.some(c => c.name) && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">Certifications</div>
          {resume.certifications.map((cert, i) => cert.name && (
            <div key={i} className="text-xs mb-1">
              <div className="font-bold text-blue-700">• {cert.name}</div>
              {cert.issuer && <div className="text-purple-300">{cert.issuer}</div>}
              {cert.link && <div className="text-blue-600">🔗 {cert.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.skills.length > 0 && (
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">Skills</div>
          <div className="text-xs flex flex-wrap gap-1">
            {resume.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderClassicTemplate = () => (
    <div className="space-y-4 font-serif">
      <div className="text-center pb-4 border-b-4 border-gray-800">
        <h3 className="text-lg font-bold text-gray-800">{resume.firstName} {resume.lastName}</h3>
        <p className="text-sm text-purple-300">{resume.location}</p>
        <p className="text-sm text-purple-300">{resume.email} | {resume.phone}</p>
      </div>

      {resume.links.some(l => l.url) && (
        <div className="text-center pb-2">
          {resume.links.map((link, i) => link.url && (
            <div key={i} className="text-xs text-purple-300">
              {link.platform}: {link.url}
            </div>
          ))}
        </div>
      )}

      {resume.summary && (
        <div>
          <p className="text-sm text-gray-800 text-justify leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {resume.experience.some(e => e.company) && (
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-purple-500/50 pb-1">WORK EXPERIENCE</div>
          {resume.experience.map((exp, i) => exp.company && (
            <div key={i} className="mb-3 text-sm">
              <div className="font-bold text-gray-800">{exp.position}</div>
              <div className="text-purple-300 italic">{exp.company}</div>
              <div className="text-gray-600">{exp.startDate} – {exp.endDate || 'Present'}</div>
              {exp.description && <div className="text-purple-300 leading-relaxed text-justify">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.education.some(e => e.school) && (
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-purple-500/50 pb-1">EDUCATION</div>
          {resume.education.map((edu, i) => edu.school && (
            <div key={i} className="mb-3 text-sm">
              <div className="font-bold text-gray-800">{edu.degree} in {edu.field}</div>
              <div className="text-purple-300">{edu.school}</div>
              {edu.year && <div className="text-gray-600">{edu.year}</div>}
              {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.projects.some(p => p.name) && (
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-purple-500/50 pb-1">PROJECTS</div>
          {resume.projects.map((proj, i) => proj.name && (
            <div key={i} className="mb-3 text-sm">
              <div className="font-bold text-gray-800">{proj.name}</div>
              {proj.date && <div className="text-gray-600">{proj.date}</div>}
              {proj.description && <div className="text-purple-300 leading-relaxed text-justify">{proj.description}</div>}
              {proj.technologies && <div className="text-purple-300">Technologies: {proj.technologies}</div>}
              {proj.link && <div className="text-gray-600">{proj.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.certifications.some(c => c.name) && (
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-purple-500/50 pb-1">CERTIFICATIONS</div>
          {resume.certifications.map((cert, i) => cert.name && (
            <div key={i} className="mb-3 text-sm">
              <div className="font-bold text-gray-800">{cert.name}</div>
              {cert.issuer && <div className="text-purple-300">{cert.issuer}</div>}
              {cert.link && <div className="text-gray-600">{cert.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.skills.length > 0 && (
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-purple-500/50 pb-1">SKILLS</div>
          <p className="text-sm text-gray-800 text-justify">{resume.skills.join(', ')}</p>
        </div>
      )}
    </div>
  )

  const renderMinimalTemplate = () => (
    <div className="space-y-4">
      <div className="pb-4">
        <h3 className="text-xl font-light text-gray-900 tracking-wide">
          {resume.firstName} {resume.lastName}
        </h3>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{resume.location}</span>
          <span>{resume.email}</span>
          <span>{resume.phone}</span>
        </div>
      </div>

      {resume.links.some(l => l.url) && (
        <div className="text-xs text-gray-600 space-y-1">
          {resume.links.map((link, i) => link.url && (
            <div key={i}>{link.platform}: {link.url}</div>
          ))}
        </div>
      )}

      {resume.summary && (
        <div>
          <p className="text-xs text-gray-800 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {resume.experience.some(e => e.company) && (
        <div>
          <h4 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">Experience</h4>
          {resume.experience.map((exp, i) => exp.company && (
            <div key={i} className="mb-3 text-xs">
              <div className="flex justify-between">
                <div className="font-semibold text-gray-900">{exp.position}</div>
                <div className="text-gray-600">{exp.startDate} – {exp.endDate || 'Present'}</div>
              </div>
              <div className="text-purple-300">{exp.company}</div>
              {exp.description && <div className="text-purple-300 mt-1 leading-snug">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.education.some(e => e.school) && (
        <div>
          <h4 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">Education</h4>
          {resume.education.map((edu, i) => edu.school && (
            <div key={i} className="mb-2 text-xs">
              <div className="font-semibold text-gray-900">{edu.degree} in {edu.field}</div>
              <div className="flex justify-between text-purple-300">
                <span>{edu.school}</span>
                {edu.year && <span>{edu.year}</span>}
              </div>
              {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.projects.some(p => p.name) && (
        <div>
          <h4 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">Projects</h4>
          {resume.projects.map((proj, i) => proj.name && (
            <div key={i} className="mb-3 text-xs">
              <div className="font-semibold text-gray-900">{proj.name}</div>
              {proj.date && <div className="text-gray-600">{proj.date}</div>}
              {proj.description && <div className="text-purple-300 mt-1 leading-snug">{proj.description}</div>}
              {proj.technologies && <div className="text-gray-600 text-xs">Tech: {proj.technologies}</div>}
              {proj.link && <div className="text-gray-600">{proj.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.certifications.some(c => c.name) && (
        <div>
          <h4 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">Certifications</h4>
          {resume.certifications.map((cert, i) => cert.name && (
            <div key={i} className="mb-2 text-xs">
              <div className="font-semibold text-gray-900">{cert.name}</div>
              {cert.issuer && <div className="text-purple-300">{cert.issuer}</div>}
              {cert.link && <div className="text-gray-600">{cert.link}</div>}
            </div>
          ))}
        </div>
      )}

      {resume.skills.length > 0 && (
        <div>
          <h4 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">Skills</h4>
          <p className="text-xs text-gray-800">{resume.skills.join(' • ')}</p>
        </div>
      )}
    </div>
  )

  const getTemplateRenderer = () => {
    switch (resume.template) {
      case 'classic':
        return renderClassicTemplate()
      case 'minimal':
        return renderMinimalTemplate()
      default:
        return renderModernTemplate()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎨</div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ResumeNest</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition transform hover:scale-105 active:scale-95"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 h-[calc(100vh-150px)]">
          {/* Editor Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-purple-500/20 rounded-2xl p-8 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-purple-500/30 overflow-x-auto">
              {['personal', 'experience', 'education', 'projects', 'certifications', 'skills', 'links'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium whitespace-nowrap transition ${activeTab === tab
                    ? 'border-b-2 border-purple-500 text-purple-300'
                    : 'text-purple-200/60 hover:text-purple-200'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={resume.firstName}
                      onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                      placeholder="Lochan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={resume.lastName}
                      onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                      placeholder="S"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                    placeholder="abcd@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={resume.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                    placeholder="+91 8762653036"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={resume.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                    placeholder="Mysore, Karnataka, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Professional Summary</label>
                  <textarea
                    value={resume.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                    placeholder="Brief professional summary..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Select Template</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['modern', 'classic', 'minimal'].map(tmpl => (
                      <button
                        key={tmpl}
                        onClick={() => setResume(prev => ({ ...prev, template: tmpl as any }))}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                          resume.template === tmpl
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-slate-600 bg-slate-700/30 text-purple-200/60 hover:border-purple-500/50'
                        }`}
                      >
                        {tmpl.charAt(0).toUpperCase() + tmpl.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Work Experience</h3>

                {resume.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                          placeholder="Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                          placeholder="Job Title"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-purple-300">Description</label>
                        <button
                          onClick={() => {
                            setRewriterContext({ field: 'experience', index })
                            setShowRewriter(true)
                          }}
                          className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
                          title="Strengthen this bullet point with AI"
                        >
                          ✨ Strengthen
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        placeholder="Describe your role and accomplishments..."
                        rows={3}
                      />
                    </div>

                    {resume.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300 text-sm mt-2 transition"
                      >
                        Remove Experience
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition transform hover:scale-105 active:scale-95"
                >
                  + Add Experience
                </button>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Education</h3>

                {resume.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 pb-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">School/University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        placeholder="Vidyardhaka College Of Engineering - Mysore"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                          placeholder="B.E. / B.Tech"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-300 mb-2">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-purple-300 mb-2">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        placeholder="2027"
                      />
                    </div>

                    {resume.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-300 text-sm mt-2 transition"
                      >
                        Remove Education
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition transform hover:scale-105 active:scale-95"
                >
                  + Add Education
                </button>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Projects</h3>
                {resume.projects.map((project, index) => (
                  <div key={index} className="border border-purple-500/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Project {index + 1}</h4>
                      <button
                        onClick={() => removeProject(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Project Link (URL)"
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., Aug 2025)"
                      value={project.date}
                      onChange={(e) => handleProjectChange(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-purple-300">Description</label>
                        <button
                          onClick={() => {
                            setRewriterContext({ field: 'project', index })
                            setShowRewriter(true)
                          }}
                          className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
                          title="Strengthen this bullet point with AI"
                        >
                          ✨ Strengthen
                        </button>
                      </div>
                      <textarea
                        placeholder="Project Description (Key achievements and features)"
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Technologies (e.g., React | Node.js | MongoDB)"
                      value={project.technologies}
                      onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                >
                  + Add Project
                </button>
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Certifications</h3>
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="border border-purple-500/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Certification {index + 1}</h4>
                      <button
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Certification Link (URL)"
                      value={cert.link}
                      onChange={(e) => handleCertificationChange(index, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
                <button
                  onClick={addCertification}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                >
                  + Add Certification
                </button>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Skills & Certifications</h3>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Add Skills (Press Enter)</label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={addSkill}
                    className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., React, TypeScript, MongoDB..."
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {resume.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-bold mb-4">Popular Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'Java', 'SQL', 'CSS', 'HTML'].map(skill => (
                      <button
                        key={skill}
                        onClick={() => {
                          if (!resume.skills.includes(skill)) {
                            setResume(prev => ({
                              ...prev,
                              skills: [...prev.skills, skill]
                            }))
                          }
                        }}
                        className="px-3 py-1 bg-gray-200 text-purple-300 rounded-full hover:bg-gray-300 text-sm"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Online Profiles</h3>

                {resume.links.map((link, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-purple-300 mb-2">{link.platform}</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder={`https://${link.platform.toLowerCase()}.com/yourprofile`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-purple-500/30">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-medium transition transform hover:scale-105 active:scale-95"
              >
                📄 Download PDF
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-medium transition transform hover:scale-105 active:scale-95"
              >
                {loading ? 'Saving...' : '💾 Save Resume'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                  {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)} Template
                </div>
              </div>

              <div id="resume-preview" className="text-sm text-gray-800">
                {getTemplateRenderer()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bullet Rewriter Modal */}
      {showRewriter && (
        <BulletRewriter
          onSelect={handleBulletSelect}
          onClose={() => {
            setShowRewriter(false)
            setRewriterContext(null)
          }}
        />
      )}
    </div>
  )
}
