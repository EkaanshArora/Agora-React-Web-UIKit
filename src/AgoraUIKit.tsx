/**
 * @module AgoraUIKit
 */
import React from 'react'
import RtcConfigure from './RTCConfigure'
import { PropsProvider, PropsInterface, layout } from './PropsContext'
import LocalControls from './Controls/LocalControls'
import PinnedVideo from './PinnedVideo'
import GridVideo from './GridVideo'
import TracksConfigure from './TracksConfigure'

/**
 * High level component to render the UI Kit
 * @param props {@link PropsInterface}
 */
const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const { styleProps, rtcProps } = props
  const { UIKitContainer } = styleProps || {}

  return (
    <PropsProvider value={props}>
      <div
        style={{
          ...{
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          },
          ...UIKitContainer
        }}
      >
        {rtcProps.role === 'audience' ? (
          <RtcConfigure callActive={props.rtcProps.callActive}>
            {props.rtcProps?.layout === layout.grid ? (
              <GridVideo />
            ) : (
              <PinnedVideo />
            )}
            <LocalControls />
          </RtcConfigure>
        ) : (
          <TracksConfigure>
            <RtcConfigure callActive={props.rtcProps.callActive}>
              {props.rtcProps?.layout === layout.grid ? (
                <GridVideo />
              ) : (
                <PinnedVideo />
              )}
              <LocalControls />
            </RtcConfigure>
          </TracksConfigure>
        )}
      </div>
    </PropsProvider>
  )
}

export default AgoraUIKit
