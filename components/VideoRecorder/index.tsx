import { Button, Snackbar, Stack } from '@material-ui/core'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter'
import axios from 'axios'

const constraints = { video: true, audio: true }

type ResponseType = {
  responseTime: number
  filesS3: string
}

const VideoCapture: FunctionComponent = () => {
  const video = useRef<HTMLVideoElement>(null)

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>(
    undefined
  )
  const [chunks, setChunks] = useState<any[]>([])
  const [recording, setRecording] = useState(false)
  const [notification, setNotification] = useState(false)
  const [url, setUrl] = useState('')

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
      type: 'video/mp4'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    a.download = 'react-video-capture.mp4'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const upload = () => {
    const blob = new Blob(chunks, {
      type: 'video/mp4'
    })

    const data = new FormData()
    data.append('file', blob, 'react-video-capture.mp4')

    const headers = new Headers()
    headers.append('Accept', 'application/json')

    axios({
      method: 'POST',
      url: '/upload',
      data
    })
      .then(response => {
        const data = response.data as ResponseType
        setUrl(data.filesS3)
        setNotification(true)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const action = (
    <Button
      color="secondary"
      size="small"
      onClick={() => {
        window.open(url)
      }}
    >
      VER
    </Button>
  )

  return (
    <>
      <Stack alignItems="center" sx={{ position: 'relative' }}>
        <video
          ref={video}
          autoPlay
          muted
          playsInline
          style={{
            maxHeight: '100vh',
            maxWidth: '100vw',
            transform: 'scale(-1, 1)',
            WebkitTransform: 'scale(-1, 1)'
          }}
        />

        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ position: 'absolute', bottom: 0 }}
          p={4}
        >
          {!recording && !chunks.length ? (
            <Button
              variant="contained"
              color="primary"
              onClick={startRecording}
            >
              Start Recording
            </Button>
          ) : chunks.length ? (
            <>
              <Button variant="contained" color="primary" onClick={download}>
                Download
              </Button>
              <Button variant="contained" color="secondary" onClick={upload}>
                Enviar
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </Stack>
      </Stack>

      <Snackbar
        open={notification}
        autoHideDuration={6000}
        onClose={() => setNotification(false)}
        message="Vídeo enviado com sucesso!"
        action={action}
      />
    </>
  )
}

export default VideoCapture
