import React, { useEffect, useState } from 'react'
import { MinUidConsumer } from './MinUidContext'
import { MaxUidConsumer } from './MaxUidContext'
import { AgoraVideoPlayer } from 'agora-rtc-react'

const PinnedVideo: React.FC = () => {
  // const { rtcProps } = useContext(PropsContext)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MaxUidConsumer>
        {(maxUsers) =>
          // maxUsers[0] ? ( // check if audience & live don't render if uid === local
          maxUsers[0].videoTrack && maxUsers[0].hasVideo ? (
            <AgoraVideoPlayer
              style={{ width: '100%', height: '100%' }}
              videoTrack={maxUsers[0].videoTrack}
              key={maxUsers[0].uid}
            />
          ) : null
        }
      </MaxUidConsumer>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          padding: 0,
          margin: 0,
          height: 300,
          width: width,
          display: 'flex',
          flexDirection: 'row'
          // ...(styleProps?.minViewContainer as Object)
        }}
      >
        <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) =>
              user.hasVideo && user.videoTrack ? (
                <AgoraVideoPlayer
                  style={{ width: '100%', height: '100%' }}
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
              ) : null
            )
          }
        </MinUidConsumer>
      </div>
      {/* <LocalControls /> */}
    </div>
  )
}

export default PinnedVideo
