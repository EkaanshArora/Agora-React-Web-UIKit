import React, { useContext, useEffect, useState } from 'react'
import { MinUidConsumer } from './MinUidContext'
import { MaxUidConsumer } from './MaxUidContext'
import RtcContext from './RtcContext'
import { AgoraVideoPlayer } from 'agora-rtc-react'

const PinnedVideo: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const { dispatch } = useContext(RtcContext)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    console.log(width)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden'
      }}
    >
      <MaxUidConsumer>
        {(maxUsers) =>
          // maxUsers[0] ? ( // check if audience & live don't render if uid === local
          maxUsers[0].videoTrack && maxUsers[0].hasVideo ? (
            <AgoraVideoPlayer
              style={{ width: '100%', display: 'flex', flex: 4 }}
              videoTrack={maxUsers[0].videoTrack}
              // key={maxUsers[0].uid}
            />
          ) : (
            <div
              style={{
                backgroundColor: '#ff0',
                display: 'flex',
                flex: 4
              }}
            >
              <p>{maxUsers[0].uid}</p>
            </div>
          )
        }
      </MaxUidConsumer>
      <div
        className='agui-pin-scroll'
        style={{
          overflowY: 'scroll',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#f0f'
        }}
      >
        <MinUidConsumer>
          {(minUsers) =>
            minUsers.map((user) =>
              user.hasVideo && user.videoTrack ? (
                <AgoraVideoPlayer
                  style={{
                    width: '99%',
                    minHeight: '300px',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#0ff'
                  }}
                  onClick={() => {
                    dispatch({ type: 'user-swap', value: user })
                  }}
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
              ) : (
                <div
                  key={user.uid}
                  onClick={() => {
                    dispatch({ type: 'user-swap', value: user })
                  }}
                  style={{
                    backgroundColor: '#ff0',
                    width: '100%',
                    minHeight: '300px'
                  }}
                >
                  <p>{user.uid}</p>
                </div>
              )
            )
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
