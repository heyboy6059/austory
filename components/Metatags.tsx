import Head from 'next/head'
import { ROOT_INKRAU_URL } from '../common/constants'

export default function Metatags({
  title = 'inKRAU 인크라우',
  description = '데이터로 이해하는 호주',
  image = 'https://www.inkrau.com/content_link_default_banner.png',
  imgAlt = 'inKRAU image',
  type = 'article',
  link = ROOT_INKRAU_URL
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
      <meta property="og:image:alt" content={imgAlt} />
      <meta property="og:image:url" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={link} />
      <meta property="fb:app_id" content="1771190823175517" />
    </Head>
  )
}
