import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom" 
import Login from "./pages/Login" 
import Dashboard from "./pages/Dashboard" 
import ProtectedRoute from "./components/ProtectedRoute"
import Editor from "./pages/Editor"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  ) 
}

export default App 
