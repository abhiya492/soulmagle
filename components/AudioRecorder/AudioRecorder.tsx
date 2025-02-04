// components/AudioRecorder/AudioRecorder.tsx
'use client'

import { useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export default function AudioRecorder({ userId }: { userId: number }) {
  const [processing, setProcessing] = useState(false)
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })

  const handleSubmit = async () => {
    setProcessing(true)
    try {
      const blob = await fetch(mediaBlobUrl!).then(r => r.blob())
      const formData = new FormData()
      formData.append('audio', blob)
      
      await fetch('/api/match/process-audio', {
        method: 'POST',
        body: JSON.stringify({ userId, audio: blob }),
        headers: { 'Content-Type': 'application/json' }
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <button onClick={handleSubmit} disabled={processing}>
        {processing ? 'Processing...' : 'Submit'}
      </button>
    </div>
  )
}