import { useState } from 'react'
import axios from 'axios'

interface RewriterResult {
  original: string
  rewritten: string
  alternatives: string[]
  tips: string[]
}

interface Props {
  onSelect: (text: string) => void
  onClose: () => void
}

export default function BulletRewriter({ onSelect, onClose }: Props) {
  const [input, setState] = useState('')
  const [result, setResult] = useState<RewriterResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRewrite = async () => {
    if (!input.trim()) {
      setError('Please enter a bullet point to rewrite')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        'http://localhost:3000/api/suggestions/rewrite',
        { bullet: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to rewrite bullet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">✨ Bullet Point Rewriter</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          {!result && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter your bullet point
                </label>
                <textarea
                  value={input}
                  onChange={(e) => {
                    setState(e.target.value)
                    setError('')
                  }}
                  placeholder="e.g., Helped with the project design and development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleRewrite}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium transition"
                >
                  {loading ? 'Rewriting...' : 'Rewrite & Strengthen'}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Rewritten Version */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-green-900 mb-2">✅ Rewritten (Recommended)</h3>
                <p className="text-green-800 text-sm leading-relaxed">{result.rewritten}</p>
                <button
                  onClick={() => {
                    onSelect(result.rewritten)
                    onClose()
                  }}
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                >
                  Use This Version
                </button>
              </div>

              {/* Alternatives */}
              {result.alternatives.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">🔄 Alternative Versions</h3>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <p className="text-sm text-blue-900 mb-2">{alt}</p>
                        <button
                          onClick={() => {
                            onSelect(alt)
                            onClose()
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 font-medium"
                        >
                          Use This
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {result.tips.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">💡 Tips for Improvement</h3>
                  <ul className="space-y-1">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-amber-800">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setResult(null)
                    setState('')
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  ← Rewrite Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
