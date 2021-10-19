import { Button, Stack } from '@material-ui/core'
import { FunctionComponent, useEffect, useRef, useState } from 'react'

const constraints = { video: true, audio: true }

const VideoCapture: FunctionComponent = () => {
  const video = useRef<HTMLVideoElement>(null)

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>(
    undefined
  )
  const [chunks, setChunks] = useState<any[]>([])
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        if (video.current) {
          video.current.srcObject = stream
        }

        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = function (ev) {
          setChunks(state => [...state, ev.data])
        }

        setMediaRecorder(recorder)
      })
      .catch(function (err) {
        console.log(err.name, err.message)
      })
  }, [])

  const startRecording = () => {
    if (mediaRecorder) {
      setRecording(true)
      mediaRecorder.start()
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      setRecording(false)
      mediaRecorder.stop()
    }
  }

  const download = () => {
    const blob = new Blob(chunks, {
      type: 'video/webm'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    a.download = 'react-video-capture.webm'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Stack alignItems="center" sx={{ position: 'relative' }}>
      <video
        ref={video}
        autoPlay
        muted
        playsInline
        style={{ maxHeight: '100vh', maxWidth: '100vw' }}
      />

      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        sx={{ position: 'absolute', bottom: 0 }}
        p={4}
      >
        {!recording && !chunks.length ? (
          <Button variant="contained" color="primary" onClick={startRecording}>
            Start Recording
          </Button>
        ) : chunks.length ? (
          <Button variant="contained" color="primary" onClick={download}>
            Download
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={stopRecording}>
            Stop Recording
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default VideoCapture
