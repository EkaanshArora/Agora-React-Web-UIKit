import React, { useContext } from 'react'
// import PropsContext from './PropsContext'
import RtcContext, { RtcContextInterface } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
// import styles from './Style'
import { LocalContext } from '../../LocalUserContext'
import { UIKitUser } from '../../RTCConfigure'
import { ILocalAudioTrack } from 'agora-rtc-react'

function LocalAudioMute() {
  const { dispatch, mediaStore } = useContext(RtcContext)
  const local = useContext(LocalContext)

  const mute = async (
    user: UIKitUser,
    dispatch: RtcContextInterface['dispatch']
  ) => {
    if (user.uid === 0) {
      const status = user.hasAudio
      // eslint-disable-next-line no-unused-expressions
      ;(mediaStore[user.uid].audioTrack as unknown as ILocalAudioTrack)
        ?.setEnabled(!status)
        .then(() => dispatch({ type: 'local-user-mute-audio', value: !status }))
        .catch((e) => console.log(e))
    }
  }

  return (
    <div>
      <BtnTemplate
        name={local.hasAudio ? 'mic' : 'micOff'}
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalAudioMute
