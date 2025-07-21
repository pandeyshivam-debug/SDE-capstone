import Peer from "peerjs"

export function createPeer(peerId = undefined) {
    return new Peer(peerId, {
        host: "localhost",
        port: 9000,
        path: '/',
        secure: false,
    })
}
