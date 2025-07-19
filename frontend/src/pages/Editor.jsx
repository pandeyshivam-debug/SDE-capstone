import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import axios from "../utils/axiosInstance"

function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState("Untitled");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (!id) {
  //     alert("No file ID found. Returning to dashboard.")
  //     navigate("/dashboard")
  //   }
  // }, [id, navigate])

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Loading...</p>",
  })

  // Load existing file content
  const fetchFile = async () => {
    try {
      const res = await axios.get(`/files/${id}`)
      setTitle(res.data.title || "Untitled");
      if (editor && res.data.content) {
        editor.commands.setContent(res.data.content); // Tiptap JSON
      }
    } catch (err) {
      console.error("Error loading file:", err)
      navigate("/dashboard")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      alert("No file ID found. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }
    if (editor) {
      fetchFile();
    }
  }, [id, editor, navigate])

  // useEffect(() => {
  //   if (editor) {
  //     fetchFile()
  //   }
  // }, [editor])

  const saveFile = async () => {
    if (!editor) return;

    setSaving(true);
    try {
      const contentJSON = editor.getJSON(); // Save as JSON
      await axios.put(`/files/${id}`, {
        title: title || "Untitled",
        content: contentJSON,
      });
      setTimeout(() => setSaving(false), 1000)
      // console.log("Document saved!");
    } catch (err) {
      console.error("Error saving file:", err);
      alert("Failed to save document.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 shadow bg-white">
        <div className="flex items-center space-x-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium px-2 py-1 rounded focus:outline-none focus:ring w-64"
            placeholder="Document Title"
          />
          {saving && (
            <span className="text-sm text-gray-500 animate-pulse">
              Saving...
            </span>
          )}
        </div>
        <button
          onClick={saveFile}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      {/* Editor Container */}
      <div className="flex justify-center flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded p-8">
          <EditorContent
            editor={editor}
            className="min-h-[70vh] focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default Editor;
