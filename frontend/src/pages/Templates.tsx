export default function Templates() {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design',
      preview: '🎨',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and professional',
      preview: '📋',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: '✨',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Resume Templates
        </h1>
        <p className="text-gray-600 mb-12">
          Choose a template and start building your resume
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template) => (
            <a
              key={template.id}
              href={`/editor?template=${template.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition block"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-40 flex items-center justify-center text-6xl">
                {template.preview}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {template.description}
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                  Use Template
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
