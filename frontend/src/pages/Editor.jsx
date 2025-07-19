import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { EditorContent, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import "prosemirror-view/style/prosemirror.css"
import axios from "../utils/axiosInstance"

import {
  Bold,
  Italic,
  Strikethrough,
  Heading,
  List,
  Quote,
  Code
} from "lucide-react";

function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState("Untitled");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false); // Add this state
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: "<p>Loading...</p>",
  });

  // Fetch file content
  const fetchFile = async () => {
    try {
      const res = await axios.get(`/files/${id}`);
      setTitle(res.data.title || "Untitled");
      if (editor && res.data.content) {
        editor.commands.setContent(res.data.content);
      }
    } catch (err) {
      console.error("Error loading file:", err);
      navigate("/dashboard");
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
  }, [id, editor, navigate]);

  const saveFile = async () => {
    if (!editor) return;
    setSaving(true);
    try {
      const contentJSON = editor.getJSON();
      await axios.put(`/files/${id}`, {
        title: title || "Untitled",
        content: contentJSON,
      });
      setTimeout(() => setSaving(false), 1000);
    } catch (err) {
      console.error("Error saving file:", err);
      alert("Failed to save document.");
    }
    setSaving(false);
  };

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
          className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <div className="flex justify-center flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded p-8 relative">
          {/* Notion-style BubbleMenu */}
          {editor && (
            <BubbleMenu
              editor={editor}
              className="flex items-center bg-white border shadow-lg rounded-lg p-1 space-x-1"
            >
              {/* Bold */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("bold") ? "bg-gray-200" : ""
                }`}
              >
                <Bold size={16} />
              </button>

              {/* Italic */}
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("italic") ? "bg-gray-200" : ""
                }`}
              >
                <Italic size={16} />
              </button>

              {/* Strikethrough */}
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("strike") ? "bg-gray-200" : ""
                }`}
              >
                <Strikethrough size={16} />
              </button>

              {/* Headings Dropdown - FIXED */}
              <div className="relative">
                <button 
                  onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Heading size={16} />
                </button>
                {showHeadingDropdown && (
                  <div className="absolute top-10 left-0 bg-white border rounded shadow-lg z-10 min-w-[60px]">
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          console.log('Heading clicked:', level);
                          console.log('Editor state:', editor.state.selection);
                          console.log('Selected text:', editor.state.doc.textBetween(
                            editor.state.selection.from, 
                            editor.state.selection.to
                          ));
                          
                          const result = editor.chain().focus().toggleHeading({ level }).run();
                          console.log('Command result:', result);
                          
                          // 👇 ADD THIS NEW LINE HERE
                          setTimeout(() => {
                            console.log('Editor HTML:', editor.getHTML());
                          }, 100);
                          
                          setShowHeadingDropdown(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                          editor.isActive("heading", { level }) ? "bg-gray-200" : ""
                        }`}
                      >
                        H{level}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        editor.chain().focus().setParagraph().run();
                        setShowHeadingDropdown(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-t"
                    >
                      Normal
                    </button>
                  </div>
                )}
              </div>

              {/* Bullet List */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("bulletList") ? "bg-gray-200" : ""
                }`}
              >
                <List size={16} />
              </button>

              {/* Blockquote */}
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("blockquote") ? "bg-gray-200" : ""
                }`}
              >
                <Quote size={16} />
              </button>

              {/* Code */}
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("code") ? "bg-gray-200" : ""
                }`}
              >
                <Code size={16} />
              </button>
            </BubbleMenu>
          )}

          <EditorContent
            editor={editor}
            className="min-h-[70vh] focus:outline-none prose prose-lg max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;
