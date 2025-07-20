import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import axios from "../utils/axiosInstance"
import Loader from "../components/Loader"
import { Plus, LogOut } from "lucide-react"

function Dashboard() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/files")
      setFiles(res.data)
    } catch (err) {
      console.error("Error fetching files", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleNewDocument = async () => {
    try {
      const res = await axios.post("/files", {
        title: "Untitled Document",
        content: "",
      })
      navigate(`/editor/${res.data.id}`)
    } catch (err) {
      console.error("Error creating file", err)
    }
  }

  const handleLogout = () => {
    auth.signOut()
    localStorage.removeItem("backendToken")
    localStorage.removeItem("role")
    navigate("/")
  }

  if (loading) return <Loader text="Loading your workspace..." />

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white shadow">
        <h1 className="text-2xl font-bold">MyDocs</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
          <button
            onClick={handleNewDocument}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
          >
            <Plus size={18} /> New Document
          </button>
        </div>

        {/* Documents Grid */}
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-lg">No documents yet</p>
            <p className="text-sm">Click "New Document" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => navigate(`/editor/${file.id}`)}
                className="cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md transition group"
              >
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600">
                  {file.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated:{" "}
                  {new Date(file.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
