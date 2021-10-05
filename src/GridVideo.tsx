import React, { useContext, useEffect, useState } from 'react'
import MinUidContext from './MinUidContext'
import MaxUidContext from './MaxUidContext'
import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
const GridVideo: React.FC = () => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  const users = [...max, ...min]
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const isLandscape = width > height

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      // setIsLandscape(width > height)
    }
    window.addEventListener('resize', handleResize)
    // console.log(isLandscape)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: isLandscape
          ? users.length > 9
            ? 'auto auto auto auto'
            : users.length > 4
            ? 'auto auto auto'
            : users.length > 1
            ? 'auto auto'
            : 'auto'
          : users.length > 8
          ? 'auto auto auto'
          : 'auto auto'
      }}
    >
      {users.map((u) =>
        u.hasVideo && u.videoTrack ? (
          <AgoraVideoPlayer
            videoTrack={u.videoTrack as IRemoteVideoTrack}
            style={{ height: '100%', width: '100%' }}
            key={u.uid}
          />
        ) : (
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'palevioletred'
            }}
          />
        )
      )}
    </div>
  )
}

export default GridVideo

// import React, {
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState
// } from 'react'
// import MinUidContext from './MinUidContext'
// import MaxUidContext from './MaxUidContext'
// import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'

// const layout = (len: number, isDesktop: boolean = true) => {
//   console.log('layout')
//   const rows = Math.round(Math.sqrt(len))
//   const cols = Math.ceil(len / rows)
//   const [r, c] = isDesktop ? [rows, cols] : [cols, rows]
//   return {
//     matrix:
//       len > 0
//         ? [
//             ...Array(r - 1)
//               .fill(null)
//               .map(() => Array(c).fill('X')),
//             Array(len - (r - 1) * c).fill('X')
//           ]
//         : [],
//     dims: { r, c }
//   }
// }

// const GridVideo: React.FC = () => {
//   console.log('re render grid')
//   const ref = useRef<HTMLDivElement>(null)
//   const max = useContext(MaxUidContext)
//   const min = useContext(MinUidContext)
//   // const { rtcProps } = useContext(PropsContext)
//   const users =
//     // rtcProps.role === role.Audience
//     // ? [...max, ...min].filter((user) => user.uid !== 'local')
//     // :
//     [...max, ...min]
//   useLayoutEffect(() => {
//     setDim([
//       ref.current?.clientWidth as number,
//       ref.current?.clientHeight as number,
//       (ref.current?.clientWidth as number) >
//         (ref.current?.clientHeight as number)
//     ])
//   })
//   // const onLayout = (e: any) => {
//   //   setDim([
//   //     e.nativeEvent.layout.width,
//   //     e.nativeEvent.layout.height,
//   //     e.nativeEvent.layout.width > e.nativeEvent.layout.height
//   //   ])
//   // }
//   const [dim, setDim]: [
//     [number, number, boolean],
//     Dispatch<SetStateAction<[number, number, boolean]>>
//   ] = useState([
//     window.innerWidth,
//     window.innerHeight,
//     window.innerWidth > window.innerHeight
//     // Dimensions.get('window').width,
//     // Dimensions.get('window').height,
//     // Dimensions.get('window').width > Dimensions.get('window').height
//   ])
//   const isDesktop = dim[0] > dim[1] + 100
//   const { matrix, dims } = useMemo(
//     () => layout(users.length, isDesktop),
//     [users.length, isDesktop]
//   )
//   return (
//     <div
//       style={{
//         width: '100%',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//       ref={ref}
//     >
//       {/* onLayout={onLayout}> */}
//       {matrix.map((r, ridx) => (
//         <div
//           style={{
//             flex: 1,
//             flexDirection: 'row',
//             width: '100%',
//             display: 'flex'
//           }}
//           key={ridx}
//         >
//           {r.map((_, cidx) => (
//             <div
//               style={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//               key={cidx}
//             >
//               <div style={style.gridVideoContainerInner}>
//                 {users[ridx * dims.c + cidx].videoTrack &&
//                 users[ridx * dims.c + cidx].hasVideo ? (
//                   <AgoraVideoPlayer
//                     videoTrack={
//                       users[ridx * dims.c + cidx]
//                         .videoTrack as IRemoteVideoTrack
//                     }
//                     style={{ display: 'flex', flex: 1, width: '100%' }}
//                     key={users[ridx * dims.c + cidx].uid}
//                   />
//                 ) : (
//                   <div />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }

// const style = {
//   full: {
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column'
//   },
//   gridRow: {
//     flex: 1,
//     flexDirection: 'row',
//     width: '100%',
//     display: 'flex'
//   },
//   gridVideoContainerInner: {
//     borderColor: '#f0f',
//     borderWidth: 1,
//     borderStyle: 'solid',
//     flex: 1,
//     margin: 1,
//     display: 'flex'
//   }
// }

// export default GridVideo
