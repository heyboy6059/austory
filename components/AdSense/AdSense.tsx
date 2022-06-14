import { FC, useEffect } from 'react'

interface Props {
  adSlotId: string
}
const AdSense: FC<Props> = ({ adSlotId }) => {
  useEffect(() => {
    try {
      ;(window['adsbygoogle'] = window['adsbygoogle'] || []).push({})
      console.log('useEffect for google adsense')
    } catch (err) {
      console.log(err)
    }
  }, [])
  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'inline-block',
        textAlign: 'center',
        width: '100%'
      }}
      data-ad-client="ca-pub-1805879168244149"
      data-ad-slot={adSlotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}

export default AdSense
