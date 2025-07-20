import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider, githubProvider } from "../firebase"
import Loader from "../components/Loader"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") // Added for Sign Up
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getBackendToken = async (nameFromFrontend = null) => {
    console.log("Getting backend token...")
    try {
      const idToken = await auth.currentUser.getIdToken(true) // Firebase ID token
      const response = await fetch("http://localhost:5000/api/auth/token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: nameFromFrontend })
      })
      const data = await response.json()
      localStorage.setItem("backendToken", data.token)
      localStorage.setItem("role", data.role)
    } catch (err) {
      console.error("Error getting backend token:", err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      await getBackendToken() // Don't send name on Login
      navigate("/dashboard")
    } catch (err) {
      console.error(err.message) // fixed typo
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await getBackendToken(name) // Send name on Sign Up
      navigate("/dashboard")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      const displayName = auth.currentUser.displayName
      await getBackendToken(displayName) // Send Google display name
      navigate("/dashboard")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGithub = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, githubProvider)
      const displayName = auth.currentUser.displayName
      await getBackendToken(displayName) // Send GitHub username
      navigate("/dashboard")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader text="Logging you in..." />

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-8 bg-white rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login / Sign Up</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          {/* Name input (used only for Sign Up) */}
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Name (for Sign Up)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            type="submit"
          >
            Login
          </button>
          <button
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            type="button"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 flex flex-col space-y-2">
          <button
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            onClick={handleGoogle}
          >
            Sign in with Google
          </button>
          <button
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            onClick={handleGithub}
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
