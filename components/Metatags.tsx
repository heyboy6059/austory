import Head from 'next/head'

export default function Metatags({
  title = 'inKRAU 인크라우',
  description = '앞서가는 일잘러들의 호주 커뮤니티',
  image = 'https://www.inkrau.com/content_link_default_banner.png'
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="inKRAU" />
      <meta name="twitter:site" content="inKRAU" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}
