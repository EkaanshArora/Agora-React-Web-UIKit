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
    const status = UIKitUser.hasVideo === remoteTrackState.subbed
    if (status && remoteUser) {
      try {
        client.unsubscribe(remoteUser, 'video').then(() => {
          dispatch({ type: 'remote-user-mute-video', value: [UIKitUser, true] })
        })
      } catch (error) {
        console.error(error)
      }
    } else if (remoteUser) {
      try {
        client.subscribe(remoteUser, 'video').then(() => {
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
      <BtnTemplate name='videocam' disabled onClick={() => {}} />
    )
  ) : null
}

export default RemoteVideoMute
