import { BrowserRouter as Router, Routes, Route} from "react-router-dom" 
import Login from "./pages/Login" 
import Dashboard from "./pages/Dashboard" 
import ProtectedRoute from "./components/ProtectedRoute"
import Editor from "./pages/Editor"
import Viewer from "./pages/Viewer"

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
        <Route path="/view/:id" element={<Viewer />} />
      </Routes>
    </Router>
  ) 
}

export default App 
