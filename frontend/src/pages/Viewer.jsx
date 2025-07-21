import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import socket from "../utils/socket";
import { EditorCanvas } from "../components/editor";
import Loader from "../components/Loader";

function Viewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight],
    content: "<p>Waiting for document...</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!id) {
      alert("No file ID found. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }

    socket.emit("joinRoom", id);

    socket.on("receiveUpdate", (content) => {
      if (editor) {
        editor.commands.setContent(content);
      }
    });

    return () => {
      socket.off("receiveUpdate");
      if (editor) editor.destroy();
    };
  }, [id, editor, navigate]);

  if (!editor) {
    return <Loader text="Loading live document..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <EditorCanvas editor={editor} />
    </div>
  );
}

export default Viewer;
