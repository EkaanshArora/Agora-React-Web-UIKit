import React from 'react'
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-react'

export interface TracksContextInterface {
  localVideoTrack: ILocalVideoTrack | null
  localAudioTrack: ILocalAudioTrack | null
}

const TracksContext = React.createContext<TracksContextInterface>(
  {} as TracksContextInterface
)

export const TracksProvider = TracksContext.Provider
export const TracksConsumer = TracksContext.Consumer
export default TracksContext
