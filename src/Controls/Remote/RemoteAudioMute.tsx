import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { remoteTrackState, UIKitUser } from '../../RTCConfigure'

function RemoteAudioMute(props: { UIKitUser: UIKitUser }) {
  const { client, dispatch } = useContext(RtcContext)
  const { UIKitUser } = props
  const isDisabled = UIKitUser.hasAudio === remoteTrackState.no

  const mute = async () => {
    const remoteUser = client.remoteUsers?.find((u) => u.uid === UIKitUser.uid)
    const status = UIKitUser.hasAudio === remoteTrackState.subbed
    if (status && remoteUser) {
      try {
        client.unsubscribe(remoteUser, 'audio').then(() => {
          dispatch({ type: 'remote-user-mute-audio', value: [UIKitUser, true] })
        })
      } catch (error) {
        console.error(error)
      }
    } else if (remoteUser) {
      try {
        client.subscribe(remoteUser, 'audio').then(() => {
          dispatch({
            type: 'remote-user-mute-audio',
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
            UIKitUser.hasAudio === remoteTrackState.subbed ? 'mic' : 'micOff'
          }
          onClick={() => mute()}
        />
      </div>
    ) : (
      <BtnTemplate name='mic' disabled onClick={() => {}} />
    )
  ) : null
}

export default RemoteAudioMute
