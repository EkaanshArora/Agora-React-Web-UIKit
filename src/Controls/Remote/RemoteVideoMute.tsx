import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'

function RemoteVideoMute(props: { remoteUser: IAgoraRTCRemoteUser }) {
  const { client, dispatch } = useContext(RtcContext)
  const { remoteUser } = props
  const isDisabled = !remoteUser.hasVideo

  const mute = async () => {
    const status = remoteUser.videoTrack !== undefined
    console.log('!', remoteUser.hasVideo, remoteUser.videoTrack)
    if (status) {
      try {
        client.unsubscribe(remoteUser, 'video').then(() => {
          console.log('!unsubscribe video success')
          // dispatch to update the state
          dispatch({ type: 'remote-user-mute-video', value: remoteUser })
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        client.subscribe(remoteUser, 'video').then(() => {
          console.log('!sub video success')
          dispatch({ type: 'remote-user-mute-video', value: remoteUser })
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return remoteUser.uid !== 0 ? (
    !isDisabled ? (
      <div>
        <BtnTemplate
          name={
            remoteUser.videoTrack !== undefined ? 'videocam' : 'videocamOff'
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
