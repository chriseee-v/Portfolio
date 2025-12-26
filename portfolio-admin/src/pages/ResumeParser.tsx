import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Layout from '../components/Layout'
import api, { setAuthToken } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function ResumeParser() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [populating, setPopulating] = useState(false)
  const [populateResult, setPopulateResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setParsedData(null)
      setError(null)
    }
  }

  const handleParse = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (token) {
        setAuthToken(token)
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/admin/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setParsedData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to parse resume')
    } finally {
      setLoading(false)
    }
  }

  const handlePopulate = async (overwrite: boolean = false) => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setPopulating(true)
    setError(null)
    
    try {
      if (token) {
        setAuthToken(token)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('overwrite', overwrite.toString())

      const response = await api.post('/api/admin/populate-from-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setPopulateResult(response.data)
      alert(`Successfully populated:\n- ${response.data.created.projects} projects\n- ${response.data.created.experiences} experiences`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to populate database')
    } finally {
      setPopulating(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Populate via Resume</h1>
          <p className="text-gray-600 mt-2">
            Upload your resume PDF to automatically extract and populate projects, experiences, and skills
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume PDF
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PDF files only</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleParse}
                disabled={!file || loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Parsing...' : 'Parse Resume'}
              </button>
              {parsedData && (
                <>
                  <button
                    onClick={() => handlePopulate(false)}
                    disabled={populating}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {populating ? 'Populating...' : 'Populate Database (Skip Existing)'}
                  </button>
                  <button
                    onClick={() => handlePopulate(true)}
                    disabled={populating}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                  >
                    {populating ? 'Populating...' : 'Populate Database (Overwrite)'}
                  </button>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {populateResult && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Created {populateResult.created.projects} projects and {populateResult.created.experiences} experiences
                    </p>
                    {populateResult.errors && populateResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 font-medium">Errors:</p>
                        <ul className="text-xs text-green-700 list-disc list-inside">
                          {populateResult.errors.map((err: string, idx: number) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Parsed Data Preview */}
        {parsedData && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Parsed Data Preview</h2>
            
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Projects:</span>
                    <span className="ml-2 font-semibold">{parsedData.summary.projects_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Experiences:</span>
                    <span className="ml-2 font-semibold">{parsedData.summary.experiences_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Skills:</span>
                    <span className="ml-2 font-semibold">{parsedData.summary.skills_count}</span>
                  </div>
                </div>
              </div>

              {/* Projects Preview */}
              {parsedData.data.projects.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Projects ({parsedData.data.projects.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {parsedData.data.projects.map((project: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded p-3">
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-600">{project.role} • {project.year}</div>
                        <div className="text-sm text-gray-500 mt-1">{project.description}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.stack?.slice(0, 5).map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences Preview */}
              {parsedData.data.experiences.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Experiences ({parsedData.data.experiences.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {parsedData.data.experiences.map((exp: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded p-3">
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-sm text-gray-600">{exp.company} • {exp.year}</div>
                        <div className="text-sm text-gray-500 mt-1">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

