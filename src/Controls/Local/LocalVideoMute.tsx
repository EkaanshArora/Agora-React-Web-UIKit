import React, { useContext } from 'react'
// import PropsContext from './PropsContext'
import RtcContext, { RtcContextInterface } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
// import styles from './Style'
import { LocalContext } from '../../LocalUserContext'
import { UIKitUser } from '../../RTCConfigure'
import { ILocalVideoTrack } from 'agora-rtc-react'

function LocalVideoMute() {
  const mute = async (
    user: UIKitUser,
    dispatch: RtcContextInterface['dispatch']
  ) => {
    if (user.uid === 0) {
      const status = user.hasVideo
      // eslint-disable-next-line no-unused-expressions
      ;(user.videoTrack as ILocalVideoTrack)
        ?.setEnabled(!status)
        .then(() => dispatch({ type: 'local-user-mute-video', value: !status }))
        .catch((e) => console.log(e))
    }
  }

  const { dispatch } = useContext(RtcContext)
  const local = useContext(LocalContext)

  return (
    <div>
      <BtnTemplate
        name={local.hasVideo ? 'videocam' : 'videocamOff'}
        onClick={() => mute(local, dispatch)}
      />
    </div>
  )
}

export default LocalVideoMute

// import React, { useContext } from 'react'
// // import PropsContext from './PropsContext'
// import RtcContext, { RtcContextInterface } from '../../RtcContext'
// import BtnTemplate from '../BtnTemplate'
// // import styles from './Style'
// import { LocalContext } from '../../LocalUserContext'
// import { UIKitUser } from '../../RTCConfigure'
// import { ILocalVideoTrack } from 'agora-rtc-react'

// function LocalVideoMute() {
//   const mute = async (
//     user: UIKitUser,
//     dispatch: RtcContextInterface['dispatch']
//   ) => {
//     let res
//     if (user.uid === 0) {
//       dispatch({ type: 'local-user-mute-video', value: 'muting' })
//       if (user.hasVideo === false) {
//         res = (user.videoTrack as unknown as ILocalVideoTrack)
//           ?.setEnabled(true)
//           .then(() => dispatch({ type: 'local-user-mute-video', value: true }))
//           .catch((e) => console.log(e))
//       } else if (user.hasVideo === true) {
//         res = (user.videoTrack as unknown as ILocalVideoTrack)
//           ?.setEnabled(false)
//           .then(() => dispatch({ type: 'local-user-mute-video', value: false }))
//           .catch((e) => console.log(e))
//       } else res = '!click - waiting'
//     }
//     console.log('!rs', res)
//   }

//   const { dispatch } = useContext(RtcContext)
//   const local = useContext(LocalContext)

//   return (
//     <div>
//       <BtnTemplate
//         name={local.hasVideo ? 'videocam' : 'videocamOff'}
//         onClick={() => mute(local, dispatch)}
//       />
//       {/* <p style={{ margin: 0 }}>{local.hasVideo + ''}</p> */}
//     </div>
//   )
// }

// export default LocalVideoMute
