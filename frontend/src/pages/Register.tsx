import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/resumeService'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.register(email, password, name)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🎨</div>
        <div className="absolute top-1/4 right-20 text-5xl">✨</div>
        <div className="absolute bottom-20 left-1/4 text-6xl">🎭</div>
        <div className="absolute bottom-1/3 right-1/4 text-5xl">🌟</div>
      </div>

      {/* Register card */}
      <div className="relative z-10 bg-gradient-to-br from-slate-900 to-black border border-pink-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-xl hover:border-pink-500/50 transition">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-5xl">🎨</div>
            <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ResumeNest</div>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Sign Up
          </h1>
          <p className="text-purple-300/70 text-sm font-medium">Build your perfect resume today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm font-medium backdrop-blur">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition backdrop-blur"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition backdrop-blur"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition backdrop-blur"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide transform hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Creating Account...' : '🚀 Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-purple-500/20">
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-purple-400 font-bold hover:text-pink-400 transition hover:underline">
              Login here 🔑
            </a>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-bl-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-tr-3xl opacity-10"></div>
      </div>
    </div>
  )
}
