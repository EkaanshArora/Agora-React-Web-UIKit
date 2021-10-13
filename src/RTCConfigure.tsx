import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer
} from 'react'
import { RtcProvider } from './RtcContext'
import PropsContext, {
  RtcPropsInterface,
  UIKitUser,
  remoteTrackState,
  mediaStore
} from './PropsContext'
import { MaxUidProvider } from './MaxUidContext'
import {
  createClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  createMicrophoneAndCameraTracks,
  UID,
  IAgoraRTCClient
} from 'agora-rtc-react'
import { MinUidProvider } from './MinUidContext'

const useClient = createClient({ codec: 'vp8', mode: 'rtc' }) // pass in another client if use h264
const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {} }
)

// type x = IAgoraRTCClient['on']
// type y = Parameters<x>
// // have an array of events
// const a = ['on', 'off', 'once', 'emit'] as const

//! !!!! fix type
type events =
  | 'connection-state-change'
  | 'user-joined'
  | 'user-left'
  | 'user-published'
  | 'user-unpublished'
  | 'user-info-updated'
  | 'media-reconnect-start'
  | 'media-reconnect-end'
  | 'stream-type-changed'
  | 'stream-fallback'
  | 'channel-media-relay-state'
  | 'channel-media-relay-event'
  | 'volume-indicator'
  | 'crypt-error'
  | 'token-privilege-will-expire'
  | 'token-privilege-did-expire'
  | 'network-quality'
  | 'live-streaming-error'
  | 'live-streaming-warning'
  | 'stream-inject-status'
  | 'exception'
  | 'is-using-cloud-proxy'
interface callbacks {
  (event: events): (args: any) => void
}

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const { callbacks, rtcProps } = useContext(PropsContext)
  const [ready, setReady] = useState<boolean>(false)
  const [channelJoined, setChannelJoined] = useState<boolean>(false)
  let joinRes: ((arg0: boolean) => void) | null = null // Resolve for canJoin -> to set canJoin to true
  const canJoin = useRef(
    //
    new Promise<boolean | void>((resolve, reject) => {
      joinRes = resolve
      console.log(reject)
    })
  )

  let client: IAgoraRTCClient
  if (props.customRtcClient) {
    // if prop then use custom client
    client = props.customRtcClient
  } else {
    client = useClient()
  }

  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null)

  const { ready: trackReady, tracks, error } = useTracks()

  const mediaStore = useRef<mediaStore>({})

  useEffect(() => {
    console.log('!tracksReady', trackReady, error)
    if (tracks !== null) {
      setLocalAudioTrack(tracks[0])
      setLocalVideoTrack(tracks[1])
      console.log('!update-video', tracks)
      mediaStore.current[0] = {
        audioTrack: tracks[0],
        videoTrack: tracks[1]
      }
      dispatch({ type: 'update-user-video', value: tracks })
    } else if (error) {
      console.error(error)
      // setReady(false)
    }
    return () => {
      if (tracks) {
        // eslint-disable-next-line no-unused-expressions
        tracks[0]?.close()
        // eslint-disable-next-line no-unused-expressions
        tracks[1]?.close()
      }
    }
  }, [trackReady, error]) //, ready])

  let { callActive } = props
  if (callActive === undefined) {
    callActive = true
  }

  const reducer = (
    state: stateType,
    // !!!!!! fix this type b: any
    action: React.ReducerAction<(a: stateType, b: any) => stateType>
  ) => {
    // !!!!!! fix this type
    let stateUpdate: Partial<stateType> = initState
    const uids: UID[] = [...state.max, ...state.min].map(
      (u: UIKitUser) => u.uid
    )
    console.log('!UIDs', uids)
    switch (action.type) {
      case 'update-user-video':
        console.log('!update-user-video', action.value[1], true)
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              }
            } else {
              return user
            }
          })
        }
        break
      case 'user-joined':
        if (uids.indexOf(action.value[0].uid) === -1) {
          const minUpdate: stateType['min'] = [
            ...state.min,
            {
              uid: action.value[0].uid,
              hasAudio: remoteTrackState.no,
              hasVideo: remoteTrackState.no
            }
          ]
          if (minUpdate.length === 1 && state.max[0].uid === 0) {
            stateUpdate = {
              max: minUpdate,
              min: state.max
            }
          } else {
            stateUpdate = {
              min: minUpdate,
              max: state.max
            }
          }
          console.log('new user joined!\n', action.value[0].uid)
        }
        break
      case 'user-unpublished':
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.no
                    : state.max[0].hasAudio,
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.no
                    : state.max[0].hasVideo
              }
            ],
            min: state.min
          }
        } else {
          const UIKitUser = state.min.find(
            (user: UIKitUser) => user.uid === action.value[0].uid
          )
          if (UIKitUser) {
            const minUpdate: stateType['min'] = [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value[0].uid
              ),
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.no
                    : UIKitUser.hasAudio,
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.no
                    : UIKitUser.hasVideo
              }
            ]
            stateUpdate = {
              min: minUpdate,
              max: state.max
            }
          }
        }
        console.log(
          '!user unpublished',
          action.value[0].uid,
          action.value[1],
          action.value[0].hasAudio,
          action.value[0].hasVideo
        )
        break
      case 'user-published':
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [
              {
                uid: action.value[0].uid,
                hasAudio:
                  action.value[1] === 'audio'
                    ? remoteTrackState.subbed
                    : state.max[0].hasAudio,
                hasVideo:
                  action.value[1] === 'video'
                    ? remoteTrackState.subbed
                    : state.max[0].hasVideo
              }
            ],
            min: state.min
          }
        } else {
          stateUpdate = {
            min: state.min.map((user) => {
              if (user.uid !== action.value[0].uid) {
                return user
              } else {
                return {
                  uid: user.uid,
                  hasAudio:
                    action.value[1] === 'audio'
                      ? remoteTrackState.subbed
                      : user.hasAudio,
                  hasVideo:
                    action.value[1] === 'video'
                      ? remoteTrackState.subbed
                      : user.hasVideo
                }
              }
            }),
            max: state.max
          }
        }
        console.log(
          '!user published',
          action.value[0].uid,
          action.value[0].videoTrack,
          action.value[0].hasVideo
        )
        break
      case 'user-left':
        if (state.max[0].uid === action.value[0].uid) {
          const minUpdate = [...state.min]
          stateUpdate = {
            max: [minUpdate.pop() as UIKitUser],
            min: minUpdate
          }
        } else {
          stateUpdate = {
            min: state.min.filter((user) => user.uid !== action.value[0].uid),
            max: state.max
          }
        }
        break
      case 'user-swap':
        if (state.max[0].uid === action.value.uid) {
        } else {
          stateUpdate = {
            max: [action.value],
            min: [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value.uid
              ),
              state.max[0]
            ]
          }
        }
        break
      case 'local-user-mute-video':
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio,
                hasVideo: action.value
                  ? remoteTrackState.subbed
                  : remoteTrackState.yes
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio,
                hasVideo: action.value
                  ? remoteTrackState.subbed
                  : remoteTrackState.yes
              }
            } else {
              return user
            }
          })
        }
        break
      case 'local-user-mute-audio':
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value,
                hasVideo: user.hasVideo
              }
            } else {
              return user
            }
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value,
                hasVideo: user.hasVideo
              }
            } else {
              return user
            }
          })
        }
        break
      case 'remote-user-mute-video':
        // window['track'] = action.value.videoTrack
        // window['client'] = client
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasVideo: action.value[1]
                  ? remoteTrackState.yes
                  : remoteTrackState.subbed,
                hasAudio: user.hasAudio
              }
            else return user
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasVideo: action.value[1]
                  ? remoteTrackState.yes
                  : remoteTrackState.subbed,
                hasAudio: user.hasAudio
              }
            else return user
          })
        }
        break
      case 'remote-user-mute-audio':
        stateUpdate = {
          min: state.min.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasAudio: action.value[1]
                  ? remoteTrackState.yes
                  : remoteTrackState.subbed,
                hasVideo: user.hasVideo
              }
            else return user
          }),
          max: state.max.map((user: UIKitUser) => {
            if (user.uid === action.value[0].uid)
              return {
                uid: user.uid,
                hasAudio: action.value[1]
                  ? remoteTrackState.yes
                  : remoteTrackState.subbed,
                hasVideo: user.hasVideo
              }
            else return user
          })
        }
        break
      case 'leave-channel':
        stateUpdate = initState
        break
    }
    console.log(callbacks, callbacks[action.type])

    // if (callbacks && callbacks[action.type]) {
    //   callbacks[action.type].apply(null, action.value)
    //   console.log('callback executed', callbacks[action.type])
    // }

    console.log('!state-update', { ...state, ...stateUpdate }, stateUpdate)
    return { ...state, ...stateUpdate }
  }

  const initState = {
    max: [
      {
        uid: 0,
        hasAudio: remoteTrackState.no,
        hasVideo: remoteTrackState.no
      }
    ] as UIKitUser[],
    min: [] as UIKitUser[]
  }
  type stateType = { max: UIKitUser[]; min: UIKitUser[] }
  const [uidState, dispatch] = useReducer<React.Reducer<stateType, any>>(
    reducer,
    initState
  )

  useEffect(() => {
    async function init() {
      try {
        console.log(client)
        client.on('user-joined', async (...args) => {
          const [remoteUser] = args
          console.log('!user-joined', remoteUser)
          mediaStore.current[remoteUser.uid] = {}
          dispatch({
            type: 'user-joined',
            value: args
          })
        })

        client.on('user-published', async (...args) => {
          // Get current peer IDs
          const [remoteUser, mediaType] = args
          console.log('!user-published', remoteUser.uid)
          client
            .subscribe(remoteUser, mediaType)
            .then((e) => {
              console.log('!sub', e)
              mediaStore.current[remoteUser.uid][mediaType + 'Track'] =
                remoteUser[mediaType + 'Track']
              if (mediaType === 'audio') {
                // eslint-disable-next-line no-unused-expressions
                remoteUser.audioTrack?.play()
              }
              dispatch({
                type: 'user-published',
                value: args
              })
            })
            .catch((e) => console.log(e))
        })

        client.on('user-unpublished', async (...args) => {
          const [remoteUser, mediaType] = args
          console.log('!user-unpublished', remoteUser.uid)
          if (mediaType === 'audio') {
            // eslint-disable-next-line no-unused-expressions
            remoteUser.audioTrack?.stop()
          }
          dispatch({
            type: 'user-unpublished',
            value: args
          })
        })

        client.on('connection-state-change', async (...args) => {
          const [curState, prevState, reason] = args
          console.log('!connection', prevState, curState, reason)
          if (curState === 'CONNECTED') {
            setChannelJoined(true)
          } else if (curState === 'DISCONNECTED') {
            dispatch({ type: 'leave-channel', value: null })
          } else {
            setChannelJoined(false)
          }
        })

        client.on('user-left', (...args) => {
          dispatch({
            type: 'user-left',
            value: args
          })
        })

        const events = Object.keys(callbacks as callbacks)
        // for () {
        events.map((e) => {
          console.log('!!!!', e, callbacks[e])
          client.on(e, (...args: any[]) => {
            callbacks[e].apply(null, args)
          })
        })
        // }
        ;(joinRes as (arg0: boolean) => void)(true)
        setReady(true)
      } catch (e) {
        console.log(e)
      }
    }

    // const leave = async () => {
    //   await (client as IAgoraRTCClient).leave()
    //   await client?.removeAllListeners()
    // }

    if (joinRes) {
      init()
      return () => {
        try {
          client.removeAllListeners()
        } catch (e) {
          console.log(e)
        }
      }
    } else return () => {}
  }, [rtcProps.appId]) //, ready])

  useEffect(() => {
    async function publish() {
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

  // mute function???
  // useEffect(() => {
  //   const [x, setX] = useState([false, uidState.max[0].hasVideo]) // user's state
  //   if (!x[0]) {
  //     localVideoTrack?.setEnabled(false)
  //     setX([true, false])
  //     dispatch({ type: 'local-mute', action: true })
  //   } else if (x[0] && x[1] !== uidState.max[0].hasVideo) {
  //     setX([false, uidState.max[0].hasVideo])
  //   }
  // }, [uidState.max[0].hasVideo])

  // Dynamically switches channel when channel prop changes
  useEffect(() => {
    async function join(): Promise<void> {
      await canJoin.current
      if (client) {
        const uid = await client.join(
          rtcProps.appId,
          rtcProps.channel,
          rtcProps.token || null,
          rtcProps.uid || 0
        )
        console.log('!uid', uid)
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
  ])

  return (
    <RtcProvider
      value={{
        client: client,
        mediaStore: mediaStore.current,
        localVideoTrack: localVideoTrack,
        localAudioTrack: localAudioTrack,
        dispatch: dispatch
      }}
    >
      <MaxUidProvider value={uidState.max}>
        <MinUidProvider value={uidState.min}>
          {/* <MinUidProvider value={uidState.min}> */}
          {ready ? props.children : null}
        </MinUidProvider>
      </MaxUidProvider>
    </RtcProvider>
  )
}

export default RtcConfigure
