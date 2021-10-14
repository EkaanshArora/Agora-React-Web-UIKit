import React, { useContext } from 'react'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import PropsContext, { UIKitUser } from './PropsContext'
import SwapUser from './Controls/SwapUser'

const VideoPlaceholder = (props: {
  user: UIKitUser
  isShown: boolean
  showButtons?: boolean
  showSwap?: boolean
}) => {
  const { styleProps } = useContext(PropsContext)
  const { maxViewStyles, maxViewOverlayContainer } = styleProps || {}
  const { user } = props

  return (
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
      {props.isShown && (
        <div
          style={{
            ...{
              position: 'absolute',
              margin: 5,
              flexDirection: 'row',
              display: 'flex'
            },
            ...maxViewOverlayContainer
          }}
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
  )
}

export default VideoPlaceholder