API Choices
- new prop, renderTracks that replaces audience check in tracksconfig
- move tracksconfigure to rtcConfigure?
TODO:
- Improve Typescript
- rename isShown to buttonsDisplayed for videoplaceholder
- Optional (enableAudio/enableVideo)
- Switch Camera
- Add screenshare
- Support for custom tracks

Done:
- Live Streaming (mode/role)
- Support for tokenUrl
- activeSpeaker
- dualStreamMode
- callActive (can be used for precall)
- auto renew tokens
- use custom rtc client
- grid/pinned layout
- auto resize layouts (portrait/landscape)
- video placeholder
- recompose the app
- join using appId, channel, uid, token
- Bundle CSS with UIKit
- Export sub components from module
- Fix remote controls scrolling position (refactor into component)
- unsubscribe when remote mute
- 
_____________________________

- iFrame
    - Add classname
_____________________________

Screenshare
- Selective subscription
- new component, rendered on btn click, onmount do init/join/etc
- don't sub to screenuid, store it in context, update state on join 


// Create => mode ? return <Live> : return <Rtc>
// Live => Render provider and set values
// prop: rtc -> no role, if live role is required
<Create mode={rtc/live} role={} > // create 2 contexts -> 
// internally returns two components based on Prop
<Join tracks={[]}>
    <RtcProvider></RtcProvider>
</Join>
// createlive.tsx (configure component)


discuss
- tracks init error
- TS
    -   event names, callback fn
- calling endcall button fn
- remote mute
- local mute




```
State = [
    max: [
        {
            rtcRemoteUser
        }
    ],
    min : [
        {
            rtcRemoteUser
        }
    ]
]
```

LocalUser => rtcRemoteUser manually

UIKitRemoteUser => Reactive hasVideo/hasAudio using events => use enums instead of bool

let uikituserone = {videoTracks: rtcremoteuser.videotrack, hasvideo: true}
on.(usermuted) => false

user-left => remove array


- unmuted => muting execute the mute & then update state from useEffect to unmuted
- onPress => useEffect => mute => success => reducer
    - can we have an internal state inProgress that waits till dispatch is complete
    - onpress => useEffect - inProgress: true, mute(), dispatch() => dispatch completes, inProgress: false
- remote user 2 states
- two useEffect called onPress


- pass in another client if use h264