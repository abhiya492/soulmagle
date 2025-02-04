/* eslint-disable @typescript-eslint/no-unused-vars */
// components/VideoChat/VideoChat.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import io from 'socket.io-client'
import SimplePeer from 'simple-peer'

const socket = io('http://localhost:5000')

export default function VideoChat() {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const peer = new SimplePeer({ initiator: true, trickle: false })
    setPeer(peer)

    peer.on('signal', (data) => {
      socket.emit('offer', data)
    })

    socket.on('offer', (data: string | SimplePeer.SignalData) => {
      peer.signal(data)
    })

    peer.on('stream', (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    })

    return () => {
      peer.destroy()
    }
  }, [])

  return (
    <div>
      <Webcam ref={webcamRef} />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  )
}