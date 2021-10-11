import React, { useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import { remoteTrackState, UIKitUser } from './RTCConfigure'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'

const VideoAndButtons = (props: { user: UIKitUser }) => {
  const { mediaStore } = useContext(RtcContext)
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return user.hasVideo === remoteTrackState.subbed ? (
    <div
      style={{
        display: 'flex',
        flex: 1
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <AgoraVideoPlayer
        style={{
          width: '100%',
          display: 'flex',
          flex: 1
        }}
        videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
      />
      {isShown && (
        <div style={{ position: 'absolute' }}>
          <RemoteVideoMute UIKitUser={user} />
          <RemoteAudioMute UIKitUser={user} />
        </div>
      )}
    </div>
  ) : (
    <div
      key={user.uid}
      style={{
        flex: 1,
        display: 'flex',
        backgroundColor: 'papayawhip'
      }}
    >
      <RemoteVideoMute UIKitUser={user} />
      <RemoteAudioMute UIKitUser={user} />
    </div>
  )
}

export default VideoAndButtons
