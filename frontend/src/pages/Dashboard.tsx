import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../services/resumeService'

interface Resume {
  _id: string
  title?: string
  firstName: string
  lastName: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const data = await resumeService.getResumes()
      // The backend returns { success: true, resumes: [...] }
      setResumes(data.resumes || data.data || [])
      setError('')
    } catch (err: any) {
      console.error('Error fetching resumes:', err)
      setError('Failed to load resumes')
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await resumeService.deleteResume(id)
      setResumes(resumes.filter(r => r._id !== id))
      alert('Resume deleted successfully')
    } catch (err) {
      alert('Failed to delete resume')
    }
  }

  const handleEditResume = (id: string) => {
    navigate(`/editor/${id}`)
  }

  const handleCreateNew = () => {
    navigate('/editor')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎨</div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ResumeNest</h1>
          </div>
          <div className="flex gap-4">
            {user ? (
              <>
                <span className="text-purple-300 font-semibold text-lg">👤 {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition font-bold transform hover:scale-105 active:scale-95"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="px-6 py-2 text-purple-300 font-semibold hover:text-purple-100 transition border border-purple-500/30 rounded-lg hover:border-purple-500 backdrop-blur">
                  Login
                </a>
                <a href="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-bold">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Your Professional Story Awaits
                </span>
              </h1>
              <p className="text-purple-200/80 text-lg max-w-2xl">
                Craft stunning resumes with AI-powered suggestions, multiple templates, and instant PDF export
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              ✨ Create New Resume
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <a href="/editor" className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 p-8 rounded-2xl hover:border-purple-500/60 transition group cursor-pointer block hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur">
              <div className="text-6xl mb-4 group-hover:scale-110 transition transform">📝</div>
              <h2 className="text-2xl font-bold text-purple-300 mb-3 group-hover:text-purple-200 transition">
                Start from Scratch
              </h2>
              <p className="text-purple-200/60 group-hover:text-purple-200/80 transition">
                Build a new resume with our powerful editor
              </p>
            </a>

            <a href="/templates" className="bg-gradient-to-br from-slate-800 to-slate-900 border border-pink-500/30 p-8 rounded-2xl hover:border-pink-500/60 transition group cursor-pointer block hover:shadow-lg hover:shadow-pink-500/20 backdrop-blur">
              <div className="text-6xl mb-4 group-hover:scale-110 transition transform">🎨</div>
              <h2 className="text-2xl font-bold text-pink-300 mb-3 group-hover:text-pink-200 transition">
                Choose Template
              </h2>
              <p className="text-pink-200/60 group-hover:text-pink-200/80 transition">
                Select from professionally designed templates
              </p>
            </a>
          </div>

          {/* My Resumes Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              📊 My Resumes
            </h2>

            {loading ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4 animate-spin">✨</div>
                <p className="text-purple-300/80 text-lg">Loading your resumes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-7xl mb-6">📭</div>
                <p className="text-purple-300 text-xl mb-6 font-semibold">You haven't created any resumes yet</p>
                <button
                  onClick={handleCreateNew}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition transform hover:scale-105 active:scale-95"
                >
                  Create Your First Resume 🚀
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-purple-500/40 rounded-xl p-6 hover:border-purple-400/70 transition group hover:shadow-lg hover:shadow-purple-500/30 backdrop-blur"
                  >
                    <h3 className="text-xl font-bold text-purple-300 mb-3 group-hover:text-purple-200 transition line-clamp-1">
                      {resume.title || `${resume.firstName} ${resume.lastName}`}
                    </h3>
                    <p className="text-sm text-purple-200/70 mb-2">📧 {resume.email}</p>
                    {resume.updatedAt && (
                      <p className="text-xs text-purple-200/50 mb-5">
                        Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleEditResume(resume._id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition text-sm font-bold transform hover:scale-105 active:scale-95"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume._id)}
                        className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition text-sm font-bold border border-red-500/30 hover:border-red-500/60 transform hover:scale-105 active:scale-95"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-pink-500/20 rounded-2xl p-8 mt-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">
              ✨ Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">📋</span>
                <div>
                  <p className="text-purple-200 font-bold">Multiple professional templates</p>
                  <p className="text-purple-200/60 text-sm">Modern, Classic, Minimal</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">🤖</span>
                <div>
                  <p className="text-purple-200 font-bold">AI-powered bullet rewriter</p>
                  <p className="text-purple-200/60 text-sm">Strengthen your achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">👁️</span>
                <div>
                  <p className="text-purple-200 font-bold">Real-time live preview</p>
                  <p className="text-purple-200/60 text-sm">See changes instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">📄</span>
                <div>
                  <p className="text-purple-200 font-bold">High-quality PDF export</p>
                  <p className="text-purple-200/60 text-sm">Download in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">☁️</span>
                <div>
                  <p className="text-purple-200 font-bold">Cloud storage</p>
                  <p className="text-purple-200/60 text-sm">Access all your resumes anywhere</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-700/30 transition group">
                <span className="text-3xl group-hover:scale-125 transition transform">🎯</span>
                <div>
                  <p className="text-purple-200 font-bold">ATS optimization</p>
                  <p className="text-purple-200/60 text-sm">Pass applicant tracking systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
