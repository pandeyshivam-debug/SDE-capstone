import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider, githubProvider } from "../firebase"
import Loader from "../components/Loader"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") // For Sign Up only
  const [isSignUp, setIsSignUp] = useState(false) // Toggle Login/SignUp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // New state for error messages
  const navigate = useNavigate()

  const getBackendToken = async (nameFromFrontend = null) => {
    try {
      const idToken = await auth.currentUser.getIdToken(true)
      const response = await fetch("http://localhost:5000/api/auth/token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameFromFrontend }),
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
    setError(null) // Clear any previous error
    try {
      await signInWithEmailAndPassword(auth, email, password)
      await getBackendToken()
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await getBackendToken(name)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      const displayName = auth.currentUser.displayName
      await getBackendToken(displayName)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGithub = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, githubProvider)
      const displayName = auth.currentUser.displayName
      await getBackendToken(displayName)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader text="Logging you in..." />

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-6 sm:p-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg w-96 border border-gray-700/50">
        <h1 className="text-3xl font-bold text-center text-white mb-2">MyDocs</h1>
        <p className="text-gray-400 text-center mb-6">
          {isSignUp ? "Create an account" : "Sign in to continue"}
        </p>
        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          className="flex flex-col space-y-4"
        >
          {isSignUp && (
            <input
              className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="bg-red-600/20 text-red-400 text-sm rounded p-2">
              {error}
            </div>
          )}
          <button
            className="p-3 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            type="submit"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <p
          className="text-sm text-gray-400 text-center mt-4 cursor-pointer hover:underline"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null) // Clear error when toggling form
          }}
        >
          {isSignUp ? "Already have an account? Login" : "New here? Create account"}
        </p>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="text-gray-500 px-2 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <button
            className="flex items-center justify-center w-full sm:w-1/2 p-3 rounded bg-white text-gray-800 hover:bg-gray-200 transition-colors"
            onClick={handleGoogle}
          >
            <FcGoogle className="mr-2 text-lg" />
            Google
          </button>
          <button
            className="flex items-center justify-center w-full sm:w-1/2 p-3 rounded bg-black text-white hover:bg-[#333] transition-colors"
            onClick={handleGithub}
          >
            <FaGithub className="mr-2 text-lg" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
