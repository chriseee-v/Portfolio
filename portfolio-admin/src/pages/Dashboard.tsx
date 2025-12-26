import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FolderKanban, Briefcase, FileText, LogOut, Upload } from 'lucide-react'
import Layout from '../components/Layout'

export default function Dashboard() {
  const { logout } = useAuth()

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio content</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/projects"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
          >
            <FolderKanban className="w-8 h-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600 text-sm">Manage your portfolio projects</p>
          </Link>

          <Link
            to="/experiences"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
          >
            <Briefcase className="w-8 h-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Experiences</h2>
            <p className="text-gray-600 text-sm">Manage your work experience</p>
          </Link>

          <Link
            to="/blogs"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
          >
            <FileText className="w-8 h-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
            <p className="text-gray-600 text-sm">Manage your blog articles</p>
          </Link>

          <Link
            to="/resume-parser"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 border-2 border-dashed border-indigo-300"
          >
            <Upload className="w-8 h-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Populate via Resume</h2>
            <p className="text-gray-600 text-sm">Upload resume PDF to auto-populate data</p>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

