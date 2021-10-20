import React, { useContext } from 'react'
import RtcContext, { DispatchType } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import { LocalContext } from '../../LocalUserContext'
import PropsContext, { LocalUIKitUser } from '../../PropsContext'

function LocalVideoMute() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnStyles } = styleProps || {}
  const { muteLocalVideo } = localBtnStyles || {}
  const { dispatch, localVideoTrack } = useContext(RtcContext)
  const local = useContext(LocalContext)

  const mute = async (user: LocalUIKitUser, dispatch: DispatchType) => {
    if (user.uid === 0) {
      const status = user.hasVideo
      // eslint-disable-next-line no-unused-expressions
      localVideoTrack
        ?.setEnabled(!status)
        .then(() =>
          dispatch({
            type: 'local-user-mute-video',
            value: [!status]
          })
        )
        .catch((e) => console.log(e))
    }
  }

  return (
    <div>
      <BtnTemplate
        style={muteLocalVideo}
        name={local.hasVideo ? 'videocam' : 'videocamOff'}
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalVideoMute
