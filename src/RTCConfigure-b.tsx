import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer
} from 'react'
import { RtcProvider } from './RtcContext'
import PropsContext, { RtcPropsInterface } from './PropsContext'
import { MaxUidProvider } from './MaxUidContext'
import {
  createClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
  ILocalAudioTrack,
  createMicrophoneAndCameraTracks,
  UID
} from 'agora-rtc-react'
// useeffect -> if audience enablelocalvideo(false);

/**
 * The RtcConfigre component handles the logic for the video experience.
 * It's a collection of providers to wrap your components that need access to user data or engine dispatch
 */

const useClient = createClient({ codec: 'vp8', mode: 'rtc' })
const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {} }
)

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const { rtcProps } = useContext(PropsContext)
  const [ready, setReady] = useState<boolean>(false)
  const [channelJoined, setChannelJoined] = useState<boolean>(false)
  let joinRes: ((arg0: boolean) => void) | null = null
  const canJoin = useRef(
    new Promise<boolean | void>((resolve, reject) => {
      joinRes = resolve
      console.log(reject)
    })
  )

  const client = useClient()
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null)

  const { ready: trackReady, tracks } = useTracks()

  useEffect(() => {
    console.log('!ineffect', localVideoTrack, trackReady, tracks)
    if (tracks !== null) {
      setLocalAudioTrack(tracks[0])
      setLocalVideoTrack(tracks[1])
    }
  }, [trackReady])

  let { callActive } = props
  if (callActive === undefined) {
    callActive = true
  }

  // const [uidState] = useState<IAgoraRTCRemoteUser[]>([])

  // const initialState: UidStateInterface = {
  //   min: [],
  //   max: [
  //     {
  //       uid: 'local',
  //       audio: rtcProps.enableAudio !== false,
  //       video: rtcProps.enableVideo !== false
  //     }
  //   ]
  // }

  const reducer: React.Reducer<
    IAgoraRTCRemoteUser[],
    {
      type: 'user-published' | 'user-left' | 'mute-local-video' | 'user-swap'
      value: IAgoraRTCRemoteUser | any
    }
  > = (
    state: IAgoraRTCRemoteUser[],
    action: {
      type: 'user-published' | 'user-left' | 'mute-local-video' | 'user-swap'
      value: IAgoraRTCRemoteUser | any
    }
  ) => {
    let stateUpdate: IAgoraRTCRemoteUser[] = []
    console.log('!state', state, action)
    const uids: UID[] = state.map((user) => user.uid)
    switch (action.type) {
      case 'user-published':
        if (uids.indexOf(action.value.uid) === -1) {
          stateUpdate = [...state, action.value] // By default add to minimized
          console.log('!add user', action.value.uid, uids)
        } else {
          stateUpdate = [...state] // By default add to minimized
        }
        break
      case 'user-left':
        stateUpdate = state.filter((u) => u.uid !== action.value.uid)
        console.log('user left!', action.value.uid, stateUpdate, state)
        break
      //     case 'UserOffline':
      //       if (
      //         state.max[0].uid === (action as ActionType<'UserOffline'>).value[0]
      //       ) {
      //         // If max has the remote video
      //         const minUpdate = [...state.min]
      //         stateUpdate = {
      //           max: [minUpdate.pop()],
      //           min: minUpdate
      //         }
      //       } else {
      //         stateUpdate = {
      //           min: state.min.filter(
      //             (user) =>
      //               user.uid !== (action as ActionType<'UserOffline'>).value[0]
      //           )
      //         }
      //       }
      //       break
      //     case 'SwapVideo':
      //       console.log('swap: ', state, action.value[0])
      //       stateUpdate = swapVideo(state, action.value[0] as UidInterface)
      //       break
      //     case 'TokenPrivilegeWillExpire':
      //       const UID = rtcProps.uid || 0
      //       console.log('TokenPrivilegeWillExpire: ', action.value[0], UID)
      //       fetch(
      //         rtcProps.tokenUrl +
      //           '/rtc/' +
      //           rtcProps.channel +
      //           '/publisher/uid/' +
      //           UID
      //       )
      //         .then((response) => {
      //           response.json().then((data) => {
      //             client?.renewToken(data.rtcToken)
      //           })
      //         })
      //         .catch(function (err) {
      //           console.log('Fetch Error', err)
      //         })
      //       break
      //     case 'ActiveSpeaker':
      //       console.log('speak: ', action.value[0])
      //       if (state.max[0].uid !== action.value[0]) {
      //         const users = [...state.max, ...state.min]
      //         const swapUid = action.value[0] as number
      //         users.forEach((user) => {
      //           if (user.uid === swapUid) {
      //             stateUpdate = swapVideo(state, user)
      //           }
      //         })
      //       }
      //       break
      //     case 'UserMuteRemoteAudio':
      //       const audioMute = (user: UidInterface) => {
      //         if (user.uid === (action.value[0] as UidInterface).uid) {
      //           user.audio = !action.value[1]
      //         }
      //         return user
      //       }
      //       stateUpdate = {
      //         min: state.min.map(audioMute),
      //         max: state.max.map(audioMute)
      //       }
      //       break
      //     case 'UserMuteRemoteVideo':
      //       const videoMute = (user: UidInterface) => {
      //         if (user.uid === (action.value[0] as UidInterface).uid) {
      //           user.video = !action.value[1]
      //         }
      //         return user
      //       }
      //       stateUpdate = {
      //         min: state.min.map(videoMute),
      //         max: state.max.map(videoMute)
      //       }
      //       break
      //     case 'LocalMuteAudio':
      //       ;(client as RtcEngine).muteLocalAudioStream(
      //         (action as ActionType<'LocalMuteAudio'>).value[0]
      //       )
      //       const LocalAudioMute = (user: UidInterface) => {
      //         if (user.uid === 'local') {
      //           user.audio = !(action as ActionType<'LocalMuteAudio'>).value[0]
      //         }
      //         return user
      //       }
      //       stateUpdate = {
      //         min: state.min.map(LocalAudioMute),
      //         max: state.max.map(LocalAudioMute)
      //       }
      //       break
      // case 'mute-local-video':
      //   localVideoTrack
      //     ?.setMuted(!localVideoTrack.muted)
      //     .then((e) => console.log('!muteSuc', e))
      //   stateUpdate = state
      //   break
      //     case 'LocalMuteVideo':
      //       ;(client as RtcEngine).muteLocalVideoStream(
      //         (action as ActionType<'LocalMuteAudio'>).value[0]
      //       )
      //       const LocalVideoMute = (user: UidInterface) => {
      //         if (user.uid === 'local') {
      //           user.video = !(action as ActionType<'LocalMuteVideo'>).value[0]
      //         }
      //         return user
      //       }
      //       stateUpdate = {
      //         min: state.min.map(LocalVideoMute),
      //         max: state.max.map(LocalVideoMute)
      //       }
      //       break
      //     case 'SwitchCamera':
      //       ;(client as RtcEngine).switchCamera()
      //       break
      //     case 'LeaveChannel':
      //       stateUpdate = {
      //         min: [],
      //         max: [
      //           {
      //             uid: 'local',
      //             audio: rtcProps.enableAudio !== false,
      //             video: rtcProps.enableVideo !== false
      //           }
      //         ]
      //       }
      //   }

      //   // Handle event listeners
      //   if (callbacks && callbacks[action.type]) {
      //     // @ts-ignore
      //     callbacks[action.type].apply(null, action.value)
      //     console.log('callback executed')
      //   } else {
      //     // console.log('callback not found', action);
    }

    return stateUpdate
  }
  const [uidState, dispatch] = useReducer(reducer, [])
  // const swapVideo = (state: UidStateInterface, ele: UidInterface) => {
  //   const newState: UidStateInterface = {
  //     min: [],
  //     max: []
  //   }
  //   newState.min = state.min.filter((e) => e !== ele)
  //   if (state.max[0].uid === 'local') {
  //     newState.min.unshift(state.max[0])
  //   } else {
  //     newState.min.push(state.max[0])
  //   }
  //   newState.max = [ele]
  //   return newState
  // }

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        console.log(client)
        // await client.enableVideo()

        /* Listeners */
        // client.on('user-published', (args) => {
        //   // Get current peer IDs
        //   dispatch({
        //     type: 'user-published',
        //     value: args
        //   })
        // })
        client.on('user-published', async (remoteUser, mediaType) => {
          // Get current peer IDs
          console.log('!user-published', remoteUser.uid)
          if (mediaType === 'video') {
            await client.subscribe(remoteUser, 'video')
            dispatch({
              type: 'user-published',
              value: remoteUser
            })
          }
        })

        client.on(
          'connection-state-change',
          async (curState, prevState, reason) => {
            // Get current peer IDs
            console.log('!connection', curState, prevState, reason)
            if (curState === 'CONNECTED') {
              setChannelJoined(true)
            } else {
              setChannelJoined(false)
            }
          }
        )
        console.log(client)
        // client.on('error', (args: any) => {
        //   console.log('error', args)
        // })

        client.on('user-left', (args) => {
          // If remote user leaves
          // ;(dispatch as DispatchType<'UserOffline'>)({
          dispatch({
            type: 'user-left',
            value: args
          })
        })

        // client.on('', (...args) => {
        //   // If local user leaves channel
        //   ;(dispatch as DispatchType<'LeaveChannel'>)({
        //     type: 'LeaveChannel',
        //     value: args
        //   })
        // })

        /* ActiveSpeaker */
        // if (rtcProps.activeSpeaker && rtcProps.layout !== layout.grid) {
        //   console.log('ActiveSpeaker enabled')
        //   await client.enableAudioVolumeIndication(1000, 3, false)
        //   client.addListener('ActiveSpeaker', (...args) => {
        //     ;(dispatch as DispatchType<'ActiveSpeaker'>)({
        //       type: 'ActiveSpeaker',
        //       value: args
        //     })
        //   })
        // }

        // /* Token URL */
        // if (rtcProps.tokenUrl) {
        //   client.addListener('TokenPrivilegeWillExpire', (...args) => {
        //     ;(dispatch as DispatchType<'TokenPrivilegeWillExpire'>)({
        //       type: 'TokenPrivilegeWillExpire',
        //       value: args
        //     })
        //   })
        // }
        ;(joinRes as (arg0: boolean) => void)(true)
        setReady(true)
      } catch (e) {
        console.log(e)
      }
    }

    if (joinRes) {
      init()
      // return async () => {
      //   try {
      //     await (client as IAgoraRTCClient).leave()
      //     await client?.removeAllListeners()
      //   } catch (e) {
      //     console.log(e)
      //   }
      // }
    }
  }, [rtcProps.appId])

  // Dynamically switches channel when channel prop changes
  useEffect(() => {
    async function publish(): Promise<void> {
      let pubRes
      if (localVideoTrack && localAudioTrack && channelJoined) {
        console.log(
          '!pub',
          localVideoTrack,
          localAudioTrack,
          pubRes,
          callActive
        )
        pubRes = await client.publish([localAudioTrack, localVideoTrack])
      }
    }
    console.log('!pub', localVideoTrack, localAudioTrack, callActive)
    if (callActive) {
      publish()
    }
  }, [callActive, localVideoTrack, localAudioTrack, channelJoined])

  useEffect(() => {
    async function join(): Promise<void> {
      await canJoin.current
      if (client) {
        /* Live Streaming */
        // if (rtcProps.mode === mode.LiveBroadcasting) {
        //   await client.setChannelProfile(ChannelProfile.LiveBroadcasting)
        //   await client.setClientRole(
        //     rtcProps.role === role.Audience
        //       ? ClientRole.Audience
        //       : ClientRole.Broadcaster
        //   )
        // } else {
        //   await client.setChannelProfile(ChannelProfile.Communication)
        // }
        /* enableVideo */
        // if (rtcProps.enableVideo === false) {
        //   client?.muteLocalVideoStream(true)
        // } else {
        //   client?.muteLocalVideoStream(false)
        // }
        // /* enableAudio */
        // if (rtcProps.enableAudio === false) {
        //   client?.muteLocalAudioStream(true)
        // } else {
        //   client?.muteLocalAudioStream(false)
        // }
        // /* Token URL */
        // if (rtcProps.tokenUrl) {
        //   const UID = rtcProps.uid || 0
        //   fetch(
        //     rtcProps.tokenUrl +
        //       '/rtc/' +
        //       rtcProps.channel +
        //       '/publisher/uid/' +
        //       UID
        //   )
        //     .then((response) => {
        //       response.json().then((data) => {
        //         client?.joinChannel(
        //           data.rtcToken,
        //           rtcProps.channel,
        //           null,
        //           UID
        //         )
        //       })
        //     })
        //     .catch(function (err) {
        //       console.log('Fetch Error', err)
        //     })
        // } else {
        const uid = await client.join(rtcProps.appId, rtcProps.channel, null, 0)
        console.log('!uid', uid)
        // setUidState((ps) => {
        //   return [...ps, client]
        // })
        // }
      } else {
        console.error('trying to join before RTC Engine was initialized')
      }
    }
    if (callActive) {
      join()
      console.log('Attempted join: ', rtcProps.channel)
    } else {
      console.log('In precall - waiting to join')
    }
    return (): void => {
      if (callActive) {
        console.log('Leaving channel')
        canJoin.current = client
          .leave()
          .catch((err: unknown) => console.log(err))
      }
    }
  }, [
    rtcProps.channel,
    rtcProps.uid,
    rtcProps.token,
    callActive,
    rtcProps.tokenUrl
    // rtcProps.role, (don't rejoin channel, uses toggleRole function to switch role)
    // rtcProps.enableVideo, (don't rejoin channel, only used for initialization)
    // rtcProps.enableAudio, (don't rejoin channel, only used for initialization)
  ])

  /* Dual Stream */
  // useEffect(() => {
  //   const toggleDualStream = async () => {
  //     if (rtcProps.dualStreamMode) {
  //       await client?.enableDualStreamMode(true)
  //       await client?.setRemoteSubscribeFallbackOption(
  //         rtcProps.dualStreamMode
  //       )
  //       await client?.setLocalPublishFallbackOption(
  //         rtcProps.dualStreamMode
  //       )
  //     } else {
  //       await client?.enableDualStreamMode(false)
  //     }
  //   }
  //   toggleDualStream()
  // }, [rtcProps.dualStreamMode])

  /* Live Stream Role */
  // useEffect(() => {
  //   const toggleRole = async () => {
  //     if (rtcProps.mode === mode.LiveBroadcasting) {
  //       await client?.setChannelProfile(ChannelProfile.LiveBroadcasting)
  //       await client?.setClientRole(
  //         rtcProps.role === role.Audience
  //           ? ClientRole.Audience
  //           : ClientRole.Broadcaster
  //       )
  //     }
  //   }
  //   toggleRole()
  // }, [rtcProps.mode, rtcProps.role])

  return (
    <RtcProvider
      value={{
        client: client,
        localVideoTrack: localVideoTrack,
        localAudioTrack: localAudioTrack,
        dispatch: dispatch
      }}
    >
      <MaxUidProvider value={uidState}>
        {/* <MinUidProvider value={uidState.min}> */}
        {
          // Render children once RTCEngine has been initialized
          ready ? props.children : null
        }
        {/* </MinUidProvider> */}
      </MaxUidProvider>
    </RtcProvider>
  )
}

export default RtcConfigure
