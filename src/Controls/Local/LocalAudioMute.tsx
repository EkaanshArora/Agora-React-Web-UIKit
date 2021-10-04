import React, { useContext } from 'react'
// import PropsContext from './PropsContext'
import RtcContext, { RtcContextInterface } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
// import styles from './Style'
import { LocalContext } from '../../LocalUserContext'
import { UIKitUser } from '../../RTCConfigure'
import { ILocalAudioTrack } from 'agora-rtc-react'

function LocalAudioMute() {
  const mute = async (
    user: UIKitUser,
    dispatch: RtcContextInterface['dispatch']
  ) => {
    let res
    if (user.uid === 0) {
      dispatch({ type: 'local-user-mute-audio', value: 'muting' })
      if (user.hasAudio === false) {
        res = (user.audioTrack as unknown as ILocalAudioTrack)
          ?.setEnabled(true)
          .then(() => dispatch({ type: 'local-user-mute-audio', value: true }))
          .catch((e) => console.log(e))
      } else if (user.hasAudio === true) {
        res = (user.audioTrack as unknown as ILocalAudioTrack)
          ?.setEnabled(false)
          .then(() => dispatch({ type: 'local-user-mute-audio', value: false }))
          .catch((e) => console.log(e))
      } else res = '!click - waiting'
    }
    console.log('!rs', res)
  }

  const { dispatch } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return (
    <div>
      <BtnTemplate
        name={local.hasAudio ? 'mic' : 'micOff'}
        onClick={() => mute(local, dispatch)}
      />
      {/* <p style={{ margin: 0 }}>{local.hasAudio + ''}</p> */}
    </div>
  )
}

export default LocalAudioMute
