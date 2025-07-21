// pages/CollaborativeEditor.jsx
import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import SlashCommand from "../extensions/SlashCommand"
import suggestionRenderer from "../utils/suggestionRenderer"
import { useEditorOperations } from "../hooks/useEditorOperations"
import { EditorToolbar, EditorCanvas } from "../components/editor"
import Loader from "../components/Loader"
import { createCollaborativePeer } from "../utils/peer"
import "prosemirror-view/style/prosemirror.css"

function CollaborativeEditor() {
  const { fileId, peerId: urlPeerId } = useParams()
  const navigate = useNavigate()
  const [peerId, setPeerId] = useState(null)
  const [collaborators, setCollaborators] = useState([])
  const [peerManager, setPeerManager] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const { title, setTitle, loading, saving, fetchFile, saveFile } = useEditorOperations(fileId)

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
      const jsonContent = editor.getJSON()
      const payload = {
        type: 'content-update',
        content: jsonContent,
        timestamp: Date.now(),
        peerId: peerId
      }
      
      if (peerManager) {
        peerManager.broadcast(JSON.stringify(payload))
      }
    },
  })

  // Initialize peer and setup connections
  useEffect(() => {
    if (!fileId || !urlPeerId) {
      alert("Invalid collaborative link. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }

    const manager = createCollaborativePeer()
    setPeerManager(manager)

    manager.peer.on("open", (id) => {
      console.log("Collaborative Editor Peer ID:", id)
      setPeerId(id)
      // Auto-connect to the peer from URL
      if (urlPeerId && urlPeerId !== id) {
        connectToCollaborator(urlPeerId);
      }
    })

    // Handle incoming connections
    manager.peer.on("connection", (conn) => {
      console.log("New collaborator connected:", conn.peer)
      
      conn.on("open", () => {
        manager.addConnection(conn)
        setCollaborators(prev => [...prev, conn.peer])
        
        // Send current content to new collaborator
        if (editor) {
          const initPayload = {
            type: 'initial-content',
            content: editor.getJSON(),
            timestamp: Date.now()
          }
          conn.send(JSON.stringify(initPayload))
        }
      })

      conn.on("data", (data) => {
        try {
          const payload = JSON.parse(data)
          handleRemoteUpdate(payload)
        } catch (err) {
          console.error("Error parsing remote data:", err)
        }
      })

      conn.on("close", () => {
        console.log("Collaborator disconnected:", conn.peer)
        manager.removeConnection(conn.peer)
        setCollaborators(prev => prev.filter(p => p !== conn.peer))
      })
    })

    if (editor) {
      fetchFile(editor)
    }

    return () => {
      manager.peer.destroy()
    }
  }, [fileId, urlPeerId, editor, fetchFile, navigate])

  const handleRemoteUpdate = useCallback((payload) => {
    if (!editor || payload.peerId === peerId) return

    switch (payload.type) {
      case 'content-update':
      case 'initial-content':
        editor.commands.setContent(payload.content, false)
        break
      case 'save-request':
        handleSave()
        break
      default:
        console.log("Unknown payload type:", payload.type)
    }
  }, [editor, peerId])

  const connectToCollaborator = (remotePeerId) => {
    if (!peerManager || !remotePeerId) return

    setIsConnecting(true)
    const conn = peerManager.peer.connect(remotePeerId)

    conn.on("open", () => {
      console.log("Connected to collaborator:", remotePeerId)
      peerManager.addConnection(conn)
      setCollaborators(prev => [...prev, remotePeerId])
      setIsConnecting(false)
    })

    conn.on("data", (data) => {
      try {
        const payload = JSON.parse(data)
        handleRemoteUpdate(payload)
      } catch (err) {
        console.error("Error parsing remote data:", err)
      }
    })

    conn.on("close", () => {
      console.log("Disconnected from collaborator:", remotePeerId)
      peerManager.removeConnection(remotePeerId)
      setCollaborators(prev => prev.filter(p => p !== remotePeerId))
    })

    conn.on("error", (err) => {
      console.error("Connection error:", err)
      setIsConnecting(false)
    })
  }

  const handleSave = () => {
    if (saveFile(editor)) {
      // Broadcast save notification to all collaborators
      const payload = {
        type: 'document-saved',
        timestamp: Date.now(),
        peerId: peerId
      }
      if (peerManager) {
        peerManager.broadcast(JSON.stringify(payload))
      }
    }
  }

  const handleShareEditor = () => {
    if (!peerId) return
    const shareLink = `${window.location.origin}/collaborate/${fileId}/${peerId}`
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShareViewer = () => {
    if (!peerId) return;
    const shareLink = `${window.location.origin}/view/${peerId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConnectToPeer = () => {
    const remotePeerId = prompt("Enter collaborator's Peer ID:")
    if (remotePeerId) {
      connectToCollaborator(remotePeerId)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorToolbar
        title={title}
        setTitle={setTitle}
        onSave={handleSave}
        saving={saving}
        onShareViewer={handleShareViewer}
        onShareEditor={handleShareEditor}
        copied={copied}
      />
      
      {/* Collaboration Panel */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Collaborators: {collaborators.length}</span>
            <div className="flex space-x-2">
              {collaborators.map(peerId => (
                <span key={peerId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {peerId.slice(0, 8)}...
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleConnectToPeer}
            disabled={isConnecting}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Peer'}
          </button>
        </div>
      </div>

      <EditorCanvas editor={editor} />
    </div>
  )
}

export default CollaborativeEditor
