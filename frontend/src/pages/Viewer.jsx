import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { EditorCanvas } from "../components/editor";
import Loader from "../components/Loader";
import { createPeer } from "../utils/peer";

function Viewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight],
    content: "<p>Waiting for live updates...</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!id) {
      alert("No Peer ID found. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }

    const peer = createPeer();
    let conn = null;

    function connectToEditor() {
        if (retryCount >= maxRetries) {
        console.error("Max connection retries reached");
        setConnecting(false);
        return;
    }
      console.log(`Attempting to connect to Editor Peer: ${id} (attempt ${retryCount + 1})`);
      conn = peer.connect(id);

      const timeout = setTimeout(() => {
        if (conn && !conn.open) {
        console.warn("âš ï¸ Connection timeout, retrying...");
        conn.close();
        setRetryCount(prev => prev + 1);
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(connectToEditor, backoffDelay);
        }
    }, 5000)

      conn.on("open", () => {
        clearTimeout(timeout);
        console.log("âœ… Connected to Editor:", id);
        setConnecting(false);
        setRetryCount(0);
      });

      conn.on("data", (data) => {
        console.log("ðŸ“¥ Received update from Editor: ", data);
        try {
            const parsedContent = typeof data === 'string' ? JSON.parse(data) : data
            if(editor && editor.commands && !editor.isDestroyed) {
                editor.commands.setContent(parsedContent)
            }
        } catch(err) {
            console.error("Error parsing received data", err)
        }
        });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        console.log("Retrying in 2 seconds...");
        setTimeout(connectToEditor, 2000); // Retry after 2 seconds
      });

      conn.on("close", () => {
        console.warn("âš ï¸ Connection closed. Retrying...");
        setConnecting(true);
        setTimeout(connectToEditor, 2000);
      });
    }

    connectToEditor();

    return () => {
      if (conn) conn.close();
      peer.destroy();
      if (editor) editor.destroy();
    };
  }, [id, editor, navigate]);

  if (!editor || connecting) {
    return <Loader text="Connecting to live document..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <EditorCanvas editor={editor} />
    </div>
  );
}

export default Viewer;