import React, { useContext, useEffect, useRef, useState } from 'react'
import { MinUidConsumer } from './MinUidContext'
import { MaxUidConsumer } from './MaxUidContext'
import MaxVideoView from './MaxVideoView'
import MinVideoView from './MinVideoView'
import PropsContext from './PropsContext'
import styles from './styles.module.css'

const PinnedVideo: React.FC = () => {
  const { styleProps } = useContext(PropsContext)
  const { minViewContainer } = styleProps || {}
  const parentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const isLandscape = width > height

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth)
        setHeight(parentRef.current.offsetHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth)
      setHeight(parentRef.current.offsetHeight)
    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={parentRef}
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: isLandscape ? 'row' : 'column-reverse',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: isLandscape ? 5 : 4
        }}
      >
        <MaxUidConsumer>
          {(maxUsers) => (
            // maxUsers[0] ? ( // check if audience & live don't render if uid === local
            <MaxVideoView user={maxUsers[0]} />
          )}
        </MaxUidConsumer>
      </div>
      <div
        className={styles.scrollbar}
        style={{
          overflowY: isLandscape ? 'scroll' : 'hidden',
          overflowX: !isLandscape ? 'scroll' : 'hidden',
          display: 'flex',
          flex: 1,
          flexDirection: isLandscape ? 'column' : 'row'
        }}
      >
        <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) => (
              <div
                style={{
                  ...{
                    minHeight: isLandscape ? '35vh' : '99%',
                    minWidth: isLandscape ? '99%' : '40vw',
                    margin: 2,
                    display: 'flex'
                  },
                  ...minViewContainer
                }}
                key={user.uid}
              >
                <MinVideoView user={user} />
              </div>
            ))
          }
        </MinUidConsumer>
      </div>
    </div>
  )
}

export default PinnedVideo

// import React, { useContext } from 'react'
// import { AgoraVideoPlayer, ICameraVideoTrack } from 'agora-rtc-react'
// import RtcContext, { RtcContextInterface } from './RtcContext'
// import MaxUidContext from './MaxUidContext'
// import MinUidConsumer from './MinUidContext'
// import { UIKitUser } from './RTCConfigure'

// const PinnedVideo: React.FC = () => {
//   const data = useContext(RtcContext)
//   const maxUser = useContext(MaxUidContext)
//   const minUsers = useContext(MinUidConsumer)
//   const remoteUsers = [...maxUser, ...minUsers]
//   console.log('!state-pinrerender', { remoteUsers }, { maxUser }, { minUsers })
//   return (
//     <div style={{ flex: 1 }}>
//       {remoteUsers.map((user) =>
//         // (fixed) major bug -> if we remove user.videoTrack check everyting stops working
//         // fixed by deep copy of remoteUsers
//         user.hasVideo ? (
//           <div key={user.uid}>
//             <AgoraVideoPlayer
//               style={{ width: 400, height: 200 }}
//               videoTrack={user.videoTrack as unknown as ICameraVideoTrack}
//             />
//             <div>v: {user.uid + ' ' + user.hasVideo}</div>
//             <Button user={user} data={data} />
//           </div>
//         ) : (
//           <div key={user.uid}>
//             {/* {console.log('!blast', user.hasVideo, user.uid, user.videoTrack, user)} */}
//             <div>novid: {user.uid + ' ' + user.hasVideo}</div>
//             <Button user={user} data={data} />
//           </div>
//         )
//       )}
//     </div>
//   )
// }

// const Button = (props: { user: UIKitUser; data: RtcContextInterface }) => {
//   const { user, data } = props

//   const mute = async (user: UIKitUser, data: RtcContextInterface) => {
//     let res
//     if (user.uid === 0) {
//       // console.log('!!dispatch muting')
//       // ;(window as unknown as any).videoTrack = user.videoTrack
//       data.dispatch({ type: 'local-user-mute', value: 'muting' })
//       if (user.hasVideo === false) {
//         res = data.localVideoTrack
//           ?.setEnabled(true)
//           .then(() => {
//             // console.log('!!dispatch mute')
//             data.dispatch({ type: 'local-user-mute', value: true })
//           })
//           .catch((e) => console.log(e))
//       } else if (user.hasVideo === true) {
//         res = data.localVideoTrack
//           ?.setEnabled(false)
//           .then(() => {
//             data.dispatch({ type: 'local-user-mute', value: false })
//             // console.log('!!dispatch mute')
//           })
//           .catch((e) => console.log(e))
//       } else res = '!click - waiting'
//     }
//     console.log('!rs', res)
//   }

//   return user.uid === 0 ? (
//     <div
//       tabIndex={0}
//       style={{
//         cursor: 'pointer',
//         borderWidth: 2,
//         borderColor: 'red',
//         borderStyle: 'solid'
//       }}
//       onClick={() => mute(user, data)}
//       onKeyPress={(e) => e.key === 'Enter' && mute(user, data)}
//     >
//       mute/unmute
//     </div>
//   ) : null
// }

// export default PinnedVideo
