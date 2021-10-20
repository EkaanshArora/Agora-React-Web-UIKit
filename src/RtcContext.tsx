import React from 'react'
import {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack
} from 'agora-rtc-react'
import { CallbacksInterface, mediaStore } from './PropsContext'

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

export type DispatchType = <
  T extends keyof CallbacksInterface,
  V extends Parameters<CallbacksInterface[T]>
>(action: {
  type: T
  value: V
}) => void

export interface RtcContextInterface {
  client: IAgoraRTCClient
  localVideoTrack: ILocalVideoTrack | null
  localAudioTrack: ILocalAudioTrack | null
  mediaStore: mediaStore
  dispatch: DispatchType
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface
)

export interface ActionInterface<T extends keyof CallbacksInterface> {
  type: T
  value: Parameters<CallbacksInterface[T]>
}
export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<T>

export const RtcProvider = RtcContext.Provider
export const RtcConsumer = RtcContext.Consumer
export default RtcContext
