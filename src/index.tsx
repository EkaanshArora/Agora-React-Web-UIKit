import React, { useState } from 'react'
// import styles from './styles.module.css'
import AgoraUIKit from './AgoraUIKit'
// import { layout } from './PropsContext'

export const ExampleComponent: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(true)

  return videocall ? (
    <div style={{ display: 'flex', flex: 1, height: '100%' }}>
      <AgoraUIKit
        rtcProps={{
          appId: '',
          channel: 'test'
          // layout: layout.grid
        }}
        callbacks={{ Endcall: () => setVideocall(false) }}
      />
    </div>
  ) : (
    <div onClick={() => setVideocall(true)}>
      <p>start</p>
    </div>
  )
}
