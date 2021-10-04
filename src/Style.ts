// import {StyleSheet} from 'react-native';

export default {
  max: {
    flex: 1
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25
  },
  buttonText: {
    color: '#fff'
  },
  fullView: {
    width: '100%',
    height: '100%'
  },
  minView: {
    width: 240,
    height: 135
  },
  minContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 0,
    margin: 0,
    height: 135
  },
  Controls: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    width: '100%',
    height: 70,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  minOverlay: {
    // ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'black',
    opacity: 0.7,
    height: '100%'
  },
  minCloseBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 46,
    height: 46,
    borderRadius: 23,
    position: 'absolute',
    right: 5,
    top: 5
  },
  controlBtn: {
    width: 46,
    height: 46,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftRemoteBtn: {
    borderTopLeftRadius: 23,
    borderBottomLeftRadius: 23,
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  rightRemoteBtn: {
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
    borderLeftWidth: 1,
    borderColor: '#fff'
  },
  remoteBtnContainer: {
    width: '100%',
    display: 'flex',
    // marginVertical: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    height: '100%',
    alignItems: 'center'
  },
  localBtn: {
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#007aff',
    backgroundColor: '#007aff'
  },
  endCall: {
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#f14',
    width: 46,
    height: 46,
    backgroundColor: '#f14'
  }
}
