import type { NextPage } from 'next'
import Head from 'next/head'
import VideoRecorder from '../components/VideoRecorder'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Video Recorder</title>
      </Head>

      <main>
        <VideoRecorder />
      </main>
    </div>
  )
}

export default Home
