import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-8 bg-white rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login / Sign Up</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            className="p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
  );
}

export default Login;
