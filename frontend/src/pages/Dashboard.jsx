import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

function Dashboard() {
  // useNavigate hook to navigate after logging out
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <button
          className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          onClick={handleLogout}
        >
          Logout
        </button>
    </div>
  )
}

export default Dashboard;