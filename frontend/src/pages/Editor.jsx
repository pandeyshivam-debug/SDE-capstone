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
      console.log("Document saved!");
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
    <div className="p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-4 w-full border-b p-2"
        placeholder="Document Title"
      />
      <EditorContent editor={editor} className="border p-4 rounded" />
      <button
        onClick={saveFile}
        className={`mt-4 px-4 py-2 rounded text-white ${
          saving ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export default Editor;
