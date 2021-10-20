/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/upload',
        destination: process.env.NEXT_PUBLIC_UPLOAD_URL
      }
    ]
  }
}
