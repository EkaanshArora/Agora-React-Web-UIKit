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
  mediaStore,
  layout
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
// const useScreenClient = createClient({ codec: 'vp8', mode: 'rtc' }) // pass in another client if use h264
const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {} }
)

// type x = IAgoraRTCClient['on']
// type y = Parameters<x>
// // have an array of events
// const a = ['on', 'off', 'once', 'emit'] as const

// !!!!! fix type
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
// interface ScreenStream {
//   audio?: ILocalAudioTrack
//   video?: ILocalVideoTrack
// }

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const uid = useRef<UID>()
  // let inScreenshare = false
  // let screenStream: ScreenStream = {}
  // const screenClient = useScreenClient()
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
  let localVideoTrackHasPublished = false
  let localAudioTrackHasPublished = false
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

  useEffect(() => {
    if (channelJoined && rtcProps.token) {
      client
        .renewToken(rtcProps.token)
        .then((e) => console.log('renewed token', e))
    }
  }, [rtcProps.token, channelJoined])

  let { callActive } = props
  if (callActive === undefined) {
    callActive = true
  }

  const reducer = (
    state: stateType,
    // !!!!!! fix type b: any
    action: React.ReducerAction<(a: stateType, b: any) => stateType>
  ) => {
    // !!!!!! fix type
    let stateUpdate: Partial<stateType> = initState
    const uids: UID[] = [...state.max, ...state.min].map(
      (u: UIKitUser) => u.uid
    )
    switch (action.type) {
      case 'update-user-video':
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
      case 'ActiveSpeaker':
        if (state.max[0].uid === action.value[0]) {
          stateUpdate = { ...state }
        } else {
          stateUpdate = {
            max: [
              state.min.find(
                (user) => user.uid === action.value[0]
              ) as UIKitUser
            ],
            min: [
              ...state.min.filter(
                (user: UIKitUser) => user.uid !== action.value[0]
              ),
              state.max[0]
            ]
          }
        }
        break
      // if (action.value[0] === undefined) {
      //   stateUpdate = { ...state }
      // } else {
      //   if (uid.current === undefined) {
      //     stateUpdate = { ...state }
      //   } else if (
      //     uid.current === action.value[0] &&
      //     state.max[0].uid === 0
      //   ) {
      //     stateUpdate = { ...state }
      //   } else if (uid.current === action.value[0]) {
      //     stateUpdate = {
      //       max: [state.min.find((user) => user.uid === 0) as UIKitUser],
      //       min: [
      //         ...state.min.filter((user: UIKitUser) => user.uid !== 0),
      //         state.max[0]
      //       ]
      //     }
      //   } else {
      //     if (action.value[0] !== undefined) {
      //       if (state.max[0].uid !== action.value[0]) {
      //         stateUpdate = {
      //           max: [
      //             state.min.find(
      //               (user) => user.uid === action.value[0]
      //             ) as UIKitUser
      //           ],
      //           min: [
      //             ...state.min.filter(
      //               (user: UIKitUser) => user.uid !== action.value[0]
      //             ),
      //             state.max[0]
      //           ]
      //         }
      //       } else {
      //         stateUpdate = { ...state }
      //       }
      //     } else {
      //       stateUpdate = { ...state }
      //     }
      //   }
      // }
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
          // if (screenClient.uid === remoteUser.uid) {
          //   dispatch({
          //     type: 'user-published',
          //     value: args
          //   })
          // } else {
          client
            .subscribe(remoteUser, mediaType)
            .then((e) => {
              console.log('!sub', e)
              mediaStore.current[remoteUser.uid][mediaType + 'Track'] =
                remoteUser[mediaType + 'Track']
              if (mediaType === 'audio') {
                // eslint-disable-next-line no-unused-expressions
                remoteUser.audioTrack?.play()
              } else {
                if (props.enableDualStream && props.dualStreamMode) {
                  client.setStreamFallbackOption(
                    remoteUser.uid,
                    props.dualStreamMode
                  )
                }
              }
              dispatch({
                type: 'user-published',
                value: args
              })
            })
            .catch((e) => console.log(e))
          // }
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
      if (props.enableDualStream) {
        await client.enableDualStream()
      }
      // handle publish fail if track is not enabled
      if (localAudioTrack?.enabled && channelJoined) {
        if (!localAudioTrackHasPublished) {
          await client.publish([localAudioTrack]).then(() => {
            localAudioTrackHasPublished = true
          })
        }
      }
      if (localVideoTrack?.enabled && channelJoined) {
        if (!localVideoTrackHasPublished) {
          await client.publish([localVideoTrack]).then(() => {
            localVideoTrackHasPublished = true
          })
        }
      }
    }
    console.log('!pub', localVideoTrack, localAudioTrack, callActive)
    if (callActive) {
      publish()
    }
  }, [
    callActive,
    localVideoTrack?.enabled,
    localAudioTrack?.enabled,
    channelJoined
  ])

  useEffect(() => {
    async function enableActiveSpeaker() {
      if (rtcProps.activeSpeaker && rtcProps.layout !== layout.grid) {
        client.on('volume-indicator', (volumes) => {
          const highestvolumeObj = volumes.reduce(
            (
              highestVolume: {
                level: number
                uid: UID
              },
              volume
            ) => {
              if (highestVolume === null) {
                return volume
              } else {
                if (volume.level > highestVolume.level) {
                  return volume
                }
                return highestVolume
              }
            },
            null
          )
          const activeSpeaker = highestvolumeObj
            ? highestvolumeObj.uid
            : undefined
          const mapActiveSpeakerToZero =
            activeSpeaker === uid.current ? 0 : activeSpeaker
          if (activeSpeaker !== undefined) {
            dispatch({
              type: 'ActiveSpeaker',
              value: [mapActiveSpeakerToZero]
            })
          }
        })
        await client.enableAudioVolumeIndicator()
      }
    }
    if (callActive) {
      enableActiveSpeaker()
    }
    return () => {
      client.removeAllListeners('volume-indicator')
    }
  }, [rtcProps.activeSpeaker, rtcProps.layout])

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
        uid.current = await client.join(
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
  }, [rtcProps.channel, rtcProps.uid, callActive, rtcProps.tokenUrl])

  // const isSingleTrack = (
  //   x: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack]
  // ): x is ILocalVideoTrack => {
  //   if ((x as [ILocalVideoTrack, ILocalAudioTrack]).length) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }
  // const startScreenshare = async (): Promise<void> => {
  //   if (!inScreenshare) {
  //     try {
  //       console.log('[screenshare]: creating stream')
  //       const screenTracks = await AgoraRTC.createScreenVideoTrack({})
  //       if (isSingleTrack(screenTracks)) {
  //         screenStream.video = screenTracks
  //       } else {
  //         screenStream.video = screenTracks[0]
  //         screenStream.audio = screenTracks[1]
  //       }
  //     } catch (e) {
  //       console.log('[screenshare]: Error during intialization');
  //       throw e
  //     }

  //     await screenClient.join(
  //       rtcProps.appId,
  //       rtcProps.channel,
  //       rtcProps.token || null,
  //       0
  //       // rtcProps.uid || 0
  //     )

  //     inScreenshare = true
  //     await screenClient.publish(
  //       screenStream.audio
  //         ? [screenStream.video, screenStream.audio]
  //         : screenStream.video,
  //     )

  //     screenStream.video.on('track-ended', () => {
  //       // dispatch({ type: 'screenshare-ended', action: [] })

  //       screenClient.leave()
  //       // eslint-disable-next-line no-unused-expressions
  //       screenStream.audio?.close()
  //       // eslint-disable-next-line no-unused-expressions
  //       screenStream.video?.close()
  //       screenStream = {}

  //       inScreenshare = false
  //     })
  //   } else {
  //     // dispatch({ type: 'screenshare-ended', action: [] })
  //     screenClient.leave()
  //     try {
  //       // eslint-disable-next-line no-unused-expressions
  //       screenStream.audio?.close()
  //       // eslint-disable-next-line no-unused-expressions
  //       screenStream.video?.close()
  //       screenStream = {}
  //     } catch (err) {
  //       console.log(err)
  //       throw err
  //     }
  //     inScreenshare = false
  //   }
  // }

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
