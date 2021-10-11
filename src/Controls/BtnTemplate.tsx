import React from 'react'
import Icons from './Icons'
interface BtnTemplateInterface {
  name: string
  color?: string
  onClick: () => void
  disabled?: boolean
  // style?: StyleProp<ViewStyle>
}

const BtnTemplate = (props: BtnTemplateInterface) => {
  const { onClick, name, disabled } = props

  return (
    <div
      style={{
        width: 35,
        height: 35,
        borderRadius: '100%',
        backgroundColor: 'rgba(1,1,1,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        cursor: disabled ? 'auto' : 'pointer'
      }}
      onClick={onClick}
    >
      <svg
        style={{ width: 24, height: 24 }}
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        opacity={disabled ? '0.5' : '1'}
        stroke='#fff'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='feather feather-video'
      >
        {Icons[name]}
      </svg>
    </div>
  )
}

export default BtnTemplate
