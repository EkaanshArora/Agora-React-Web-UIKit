import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'

function EndCall() {
  const { dispatch } = useContext(RtcContext)

  return (
    <BtnTemplate
      name='callEnd'
      onClick={() =>
        dispatch({
          type: 'Endcall',
          value: []
        })
      }
    />
  )
}

export default EndCall
