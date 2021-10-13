import React, { useContext } from 'react'
// import { View } from 'react-native'
// import styles from './Style'
import EndCall from './Local/EndCall'
import LocalAudioMute from './Local/LocalAudioMute'
import LocalVideoMute from './Local/LocalVideoMute'
// import SwitchCamera from './Local/SwitchCamera'
// import RemoteControls from './RemoteControls'
// import { MaxUidConsumer } from './MaxUidContext'
// import PropsContext from './PropsContext'
import LocalUserContextComponent from '../LocalUserContext'
import PropsContext from '../PropsContext'

function Controls() {
  const { styleProps } = useContext(PropsContext)
  const { localBtnContainer } = styleProps || {}
  // const showButton = props.showButton !== undefined ? props.showButton : true
  return (
    <LocalUserContextComponent>
      <div
        style={{
          ...{
            backgroundColor: '#007bff',
            width: '100%',
            height: 70,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
          },
          ...localBtnContainer
        }}
      >
        <LocalVideoMute />
        <LocalAudioMute />
        <EndCall />
      </div>
    </LocalUserContextComponent>
  )
}

export default Controls
