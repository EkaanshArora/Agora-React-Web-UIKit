import React, { useContext, useState } from 'react'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import { remoteTrackState, UIKitUser } from './RTCConfigure'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import SwapUser from './Controls/SwapUser'

const MinVideoView = (props: { user: UIKitUser }) => {
  const { mediaStore } = useContext(RtcContext)
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return user.hasVideo === remoteTrackState.subbed ? (
    <div
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{ flex: 1, display: 'flex' }}
    >
      <AgoraVideoPlayer
        style={{
          flex: 1,
          display: 'flex'
        }}
        videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
      />
      {isShown && (
        <div style={{ position: 'absolute' }}>
          <RemoteVideoMute UIKitUser={user} />
          <RemoteAudioMute UIKitUser={user} />
          <SwapUser UIKitUser={user} />
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
      {/* <p>{user.uid}</p> */}
      <RemoteVideoMute UIKitUser={user} />
      <RemoteAudioMute UIKitUser={user} />
      <SwapUser UIKitUser={user} />
    </div>
  )
}

export default MinVideoView
