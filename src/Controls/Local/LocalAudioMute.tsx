import React, { useContext } from 'react'
import RtcContext, { RtcContextInterface } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { UIKitUser } from '../../PropsContext'

function LocalAudioMute() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalAudio } = localBtnStyles || {}
  const { dispatch, localAudioTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  const mute = async (
    user: UIKitUser,
    dispatch: RtcContextInterface['dispatch']
  ) => {
    if (user.uid === 0) {
      const status = user.hasAudio
      // eslint-disable-next-line no-unused-expressions
      localAudioTrack
        ?.setEnabled(!status)
        .then(() => dispatch({ type: 'local-user-mute-audio', value: !status }))
        .catch((e) => console.log(e))
    }
  }

  return (
    <div>
      <BtnTemplate
        style={muteLocalAudio}
        name={local.hasAudio ? 'mic' : 'micOff'}
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalAudioMute
