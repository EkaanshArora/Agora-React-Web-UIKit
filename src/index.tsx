/**
 * @module agora-rn-uikit
 */
import AgoraUIKit from './AgoraUIKit'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import SwapUser from './Controls/SwapUser'

export default AgoraUIKit
export { layout } from './PropsContext'
export { RemoteVideoMute, RemoteAudioMute, SwapUser }

export type {
  RtcPropsInterface,
  StylePropInterface,
  PropsInterface,
  VideoPlaceholderProps
} from './PropsContext'
