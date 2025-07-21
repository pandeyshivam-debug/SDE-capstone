import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import SlashCommand from "../extensions/SlashCommand";
import suggestionRenderer from "../utils/suggestionRenderer";
import { useEditorOperations } from "../hooks/useEditorOperations";
import { EditorToolbar, EditorCanvas } from "../components/editor";
import Loader from "../components/Loader";
import "prosemirror-view/style/prosemirror.css";
import socket from "../utils/socket";


function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    title,
    setTitle,
    loading,
    saving,
    fetchFile,
    saveFile
  } = useEditorOperations(id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      SlashCommand.configure({
        suggestion: suggestionRenderer,
      }),
    ],
    content: "<p>Start writing...</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
        const jsonContent = editor.getJSON();
        socket.emit("docUpdate", {
            fileId: id,
            content: jsonContent
        });
    }
  });

  useEffect(() => {
    if (!id) {
      alert("No file ID found. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }
    
    if (editor) {
      fetchFile(editor);
      socket.emit("joinRoom", id);
    }
  }, [id, editor, navigate, fetchFile]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  const handleSave = () => saveFile(editor);

  if (loading) {
    return <Loader text="Opening document..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <EditorToolbar
        title={title}
        setTitle={setTitle}
        saving={saving}
        onSave={handleSave}
      />
      <EditorCanvas editor={editor} />
    </div>
  );
}

export default Editor;
