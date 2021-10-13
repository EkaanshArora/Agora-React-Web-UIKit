import React, { useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import SwapUser from './Controls/SwapUser'
import PropsContext, { remoteTrackState, UIKitUser } from './PropsContext'
import VideoPlaceholder from './VideoPlaceholder'

const MinVideoView = (props: { user: UIKitUser }) => {
  const { mediaStore } = useContext(RtcContext)
  const { styleProps } = useContext(PropsContext)
  const { minViewStyles, videoMode, minViewOverlayContainer } = styleProps || {}
  const renderModeProp = videoMode?.min
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return (
    <div
      style={{
        ...{ display: 'flex', flex: 1 },
        ...minViewStyles
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {user.hasVideo === remoteTrackState.subbed ? (
        <div
          style={{
            ...{ display: 'flex', flex: 1 }
          }}
        >
          <AgoraVideoPlayer
            style={{ flex: 1, display: 'flex' }}
            config={{
              fit: renderModeProp !== undefined ? renderModeProp : 'cover'
            }}
            videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
          />
          {isShown && (
            <div
              style={{
                ...{
                  position: 'absolute',
                  margin: 4,
                  display: 'flex',
                  flexDirection: 'row'
                },
                ...minViewOverlayContainer
              }}
            >
              <RemoteVideoMute UIKitUser={user} />
              <RemoteAudioMute UIKitUser={user} />
              <SwapUser UIKitUser={user} />
            </div>
          )}
        </div>
      ) : (
        <VideoPlaceholder user={user} isShown={isShown} showButtons showSwap />
      )}
    </div>
  )
}

export default MinVideoView
