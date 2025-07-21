// utils/peer.js
import Peer from "peerjs"

export function createPeer(peerId = undefined) {
  return new Peer(peerId, {
    host: "localhost",
    port: 9000,
    path: '/',
    secure: false,
  })
}

export function createCollaborativePeer(peerId = undefined) {
  const peer = createPeer(peerId)
  const connections = new Map()
  
  return {
    peer,
    connections,
    broadcast: (data) => {
      connections.forEach((conn) => {
        if (conn.open) {
          conn.send(data)
        }
      })
    },
    addConnection: (conn) => {
      connections.set(conn.peer, conn)
    },
    removeConnection: (peerId) => {
      connections.delete(peerId)
    }
  }
}
