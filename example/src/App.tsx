import React, { useState } from 'react'
import AgoraUIKit
// , { layout }
from 'agora-react-uikit'

const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(true)

  return (
    <div style={{width: '100vw', height: '100vh', display: 'flex'}}>
      {videocall ? (
          <AgoraUIKit
            rtcProps={{
              appId: '',
              channel: 'test',
              // layout: layout.grid
            }}
            callbacks={{
              Endcall: () => setVideocall(false)
            }}
          />
      ) : (
          <h1 style={{cursor: 'pointer'}} onClick={() => setVideocall(true)}>start call</h1>
      )}
    </div>
  )
}


export default App
