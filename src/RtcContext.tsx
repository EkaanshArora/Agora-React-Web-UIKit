import React from 'react'
import {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser
} from 'agora-rtc-react'
import { mediaStore } from './RTCConfigure'

export interface UidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string
  audio: boolean
  video: boolean
}

export interface UidStateInterface {
  min: Array<UidInterface>
  max: Array<UidInterface>
}

export interface RtcContextInterface {
  client: IAgoraRTCClient
  localVideoTrack: ILocalVideoTrack | null
  localAudioTrack: ILocalAudioTrack | null
  mediaStore: mediaStore
  dispatch: React.Dispatch<{
    type:
      | 'user-published'
      | 'user-left'
      | 'mute-local-video'
      | 'local-user-mute-video'
      | 'local-user-mute-audio'
      | 'remote-user-mute-video'
      | 'remote-user-mute-audio'
      | 'user-swap'
      | 'Endcall'
    value: IAgoraRTCRemoteUser | any
  }>
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface
)

export const RtcProvider = RtcContext.Provider
export const RtcConsumer = RtcContext.Consumer
export default RtcContext
