module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost:3000',
      'lh3.googleusercontent.com',
      'inkrau.vercel.app',
      'via.placeholder.com',
      'firebasestorage.googleapis.com',
      'inkrau.com'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  }
}
