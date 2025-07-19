import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
// import { auth } from "../firebase"
// import { signOut } from "firebase/auth"
import axios from '../utils/axiosInstance'

function Dashboard() {
  // useNavigate hook to navigate after logging out
  const [files, setFiles] = useState([])
  const navigate = useNavigate()

  // const handleLogout = async () => {
  //   await signOut(auth);
  //   navigate("/");
  // }

  const fetchFiles = async () => {
    // const token = localStorage.getItem('backend-token') //using axios instead :)
    try{
      const res = await axios.get("/files")
      setFiles(res.data)
    } catch(err) {
      console.error("Error fetching files", err)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleNewDocument = async () => {
    const token = localStorage.getItem('backend-token')
    try {
      const res = await axios.post("/files", {
      title: "Untitled Document",
      content: "",
    })
      console.log("New file created:", res.data)
      navigate(`/editor/${res.data.id}`)
    } catch(err) {
      console.error("Error creating file", err)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Documents</h1>
{/*NEW DOCUMENT BUTTON*/ }
      <button
        onClick={handleNewDocument}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        New Document
      </button>

      <ul>
        {files.map((file) => (
          <li
            key={file.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/editor/${file.id}`)}
          >
            {file.title} (Last updated: {new Date(file.updatedAt).toLocaleString()})
          </li>
        ))}
      </ul>

    </div>

    // <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    //   <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
    //     <button
    //       className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
    //       onClick={handleLogout}
    //     >
    //       Logout
    //     </button>
    // </div>
  )
}

export default Dashboard