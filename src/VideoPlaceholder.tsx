import React, { useContext } from 'react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import PropsContext, { VideoPlaceholderProps } from './PropsContext'
import SwapUser from './Controls/SwapUser'

const VideoPlaceholder = (props: VideoPlaceholderProps) => {
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { maxViewStyles, maxViewOverlayContainer } = styleProps || {}
  const { user, isMaxVideo } = props
  const { CustomVideoPlaceholder } = rtcProps

  return !CustomVideoPlaceholder ? (
    <div
      key={user.uid}
      style={{
        ...{
          flex: 1,
          display: 'flex',
          backgroundColor: '#007bff33',
          flexDirection: 'row'
        },
        ...maxViewStyles
      }}
    >
      <div style={{ flex: 10, display: 'flex' }}>
        <img
          style={{
            width: 100,
            height: 100,
            alignSelf: 'center',
            justifySelf: 'center',
            margin: 'auto',
            display: 'flex'
          }}
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg=='
        />
      </div>
      {props.isShown && (
        <div
          style={
            !isMaxVideo
              ? {
                  ...{
                    margin: 4,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  },
                  ...maxViewOverlayContainer
                }
              : {
                  ...{
                    position: 'absolute',
                    margin: 5,
                    flexDirection: 'column',
                    display: 'flex'
                  },
                  ...maxViewOverlayContainer
                }
          }
        >
          {props.showButtons && (
            <React.Fragment>
              <RemoteVideoMute UIKitUser={user} />
              <RemoteAudioMute UIKitUser={user} />
              {props.showSwap && <SwapUser UIKitUser={user} />}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  ) : (
    CustomVideoPlaceholder && CustomVideoPlaceholder({ ...props }, null)
  )
}

export default VideoPlaceholder
