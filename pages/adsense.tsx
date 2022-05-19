import Box from '@mui/material/Box'
import Head from 'next/head'
import { FC, useEffect } from 'react'
import { FlexCenterDiv } from '../common/uiComponents'

const AdSense: FC = () => {
  useEffect(() => {
    try {
      ;(window['adsbygoogle'] = window['adsbygoogle'] || []).push({})
      console.log('hit adsbygoogle useEffect')
    } catch (err) {
      console.log(err)
    }
  }, [])

  // useEffect(() => {
  //     const ads = document.getElementsByClassName("adsbygoogle").length;
  //     for (let i = 0; i < ads; i++) {
  //       try {
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //       } catch (e) { }
  //     }
  // }, []);

  //   useEffect(() => {
  //     try {
  //       ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }, [])

  return (
    <FlexCenterDiv>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1805879168244149"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div>
        <div>애드센스 광고 테스트</div>
        <div style={{ border: '1px solid black' }}>
          <Box>
            {/* <ins
              className="adsbygoogle"
              style={{
                display: 'block',
                textAlign: 'center'
              }}
              data-ad-client="ca-pub-1805879168244149"
              data-ad-slot="3559760421"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins> */}
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-1805879168244149"
              data-ad-slot="3559760421"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            {/* <ins
              className="adsbygoogle adbanner-customize"
              style={{
                display: 'block'
              }}
              data-ad-client="ca-pub-1805879168244149"
              data-ad-slot="3559760421"
            /> */}
          </Box>
        </div>
      </div>
    </FlexCenterDiv>
  )
}

export default AdSense
