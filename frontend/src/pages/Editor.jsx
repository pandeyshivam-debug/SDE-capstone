import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import SlashCommand from "../extensions/SlashCommand";
import suggestionRenderer from "../utils/suggestionRenderer";
import { useEditorOperations } from "../hooks/useEditorOperations";
import { EditorToolbar, EditorCanvas } from "../components/editor";
import Loader from "../components/Loader";
import { createPeer } from "../utils/peer";
import "prosemirror-view/style/prosemirror.css";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState(null);
  const [connections, setConnections] = useState([]);
  const [copied, setCopied] = useState(false); // 🆕 For copied feedback

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
      const payload = JSON.stringify(jsonContent);
      connections.forEach((conn) => {
        if (conn.open) {
          conn.send(payload);
        }
      });
    },
  });

  useEffect(() => {
    if (!id) {
      alert("No file ID found. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }

    if (editor) {
      fetchFile(editor);
    }

    const peer = createPeer();

    peer.on("open", (id) => {
      console.log("Editor Peer ID:", id);
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      console.log("Viewer connected:", conn.peer);
      setConnections((prev) => [...prev, conn]);

      conn.on("open", () => {
        console.log("DataChannel open with Viewer:", conn.peer);
        if (editor) {
          const content = editor.getJSON();
          conn.send(`${JSON.stringify(content)}`);
          console.log("Sent initial content to Viewer");
        }
      });

      conn.on("close", () => {
        console.log("Viewer disconnected:", conn.peer);
        setConnections((prev) => prev.filter(c => c.peer !== conn.peer));
      });
    });

    return () => {
      peer.destroy();
    };
  }, [id, editor, fetchFile, navigate]);

  const handleSave = () => saveFile(editor);

  // const handleShare = () => {
  //   if (!peerId) return;
  //   const shareLink = `${window.location.origin}/view/${peerId}`;
  //   navigator.clipboard.writeText(shareLink).then(() => {
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000); // Reset after 2s
  //   });
  // };
  const handleShareEditor = () => {
    if (!peerId) return;
    const shareLink = `${window.location.origin}/collaborate/${id}/${peerId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareViewer = () => {
    if (!peerId) return;
    const shareLink = `${window.location.origin}/view/${peerId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


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
        onShareViewer={handleShareViewer}
        onShareEditor={handleShareEditor}
        copied={copied}
      />
      <EditorCanvas editor={editor} />
    </div>
  );
}

export default Editor;