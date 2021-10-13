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