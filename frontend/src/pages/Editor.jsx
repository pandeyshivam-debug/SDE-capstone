import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import axios from "../utils/axiosInstance"
import { useNavigate } from "react-router-dom"

function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState("Untitled");
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      alert("No file ID found. Returning to dashboard.")
      navigate("/dashboard")
    }
  }, [id, navigate])

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  })

  // Load existing file content
  const fetchFile = async () => {
    try {
      const res = await axios.get("/files")
      setTitle(res.data.title);
      editor?.commands.setContent(res.data.content)
    } catch (err) {
      console.error("Error loading file:", err)
    }
  };

  useEffect(() => {
    if (editor) {
      fetchFile()
    }
  }, [editor])

  const saveFile = async () => {
    if (!id) {
      console.error("No ID found when trying to save.");
      return
    }
    try {
      await axios.put(`/files/${id}`, {
        title,
        content: editor.getHTML(),
      })
      alert("Document saved!")
    } catch (err) {
      console.error("Error saving file:", err)
    }
  }

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="p-4">
      <input
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-4 w-full border-b p-2"
      />
      <EditorContent editor={editor} className="border p-4 rounded" />
      <button
        onClick={saveFile}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save
      </button>
    </div>
  )
}

export default Editor;
