import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { remoteTrackState, UIKitUser } from '../../RTCConfigure'

function RemoteVideoMute(props: { UIKitUser: UIKitUser }) {
  const { client, dispatch } = useContext(RtcContext)
  const { UIKitUser } = props
  const isDisabled = UIKitUser.hasVideo === remoteTrackState.no

  const mute = async () => {
    const remoteUser = client.remoteUsers?.find((u) => u.uid === UIKitUser.uid)
    console.log('!remoteUser', remoteUser)
    const status = UIKitUser.hasVideo === remoteTrackState.subbed
    // console.log('!', remoteUser.hasVideo, remoteUser.videoTrack)
    if (status && remoteUser) {
      try {
        client.unsubscribe(remoteUser, 'video').then(() => {
          console.log('!unsubscribe video success')
          // dispatch to update the state
          dispatch({ type: 'remote-user-mute-video', value: [UIKitUser, true] })
        })
      } catch (error) {
        console.error(error)
      }
    } else if (remoteUser) {
      try {
        client.subscribe(remoteUser, 'video').then(() => {
          console.log('!sub video success')
          dispatch({
            type: 'remote-user-mute-video',
            value: [UIKitUser, false]
          })
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return UIKitUser.uid !== 0 ? (
    !isDisabled ? (
      <div>
        <BtnTemplate
          name={
            UIKitUser.hasVideo === remoteTrackState.subbed
              ? 'videocam'
              : 'videocamOff'
          }
          onClick={() => mute()}
        />
      </div>
    ) : (
      <BtnTemplate name='disabled' onClick={() => {}} />
    )
  ) : null
}

export default RemoteVideoMute
