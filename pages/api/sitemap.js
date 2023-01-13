export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/xml')

  // Instructing the Vercel edge to cache the file
  res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')

  // generate sitemap here
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      <url>
        <loc>https://www.inkrau.com/</loc>
        <lastmod>2023-01-13</lastmod>
        <priority>0.4</priority>
      </url>
      <url>
      <loc>https://www.inkrau.com/calculator/wh</loc>
      <lastmod>2023-01-13</lastmod>
      <priority>0.3</priority>
      </url>
      <url>
      <loc>https://www.inkrau.com/houseprice</loc>
      <lastmod>2023-01-13</lastmod>
      <priority>0.1</priority>
      </url>
      <url>
      <loc>https://www.inkrau.com/rentalprice</loc>
      <lastmod>2023-01-13</lastmod>
      <priority>0.2</priority>
      </url>      
      </urlset>`

  res.end(xml)
}
