import React from 'react'
// import PropsContext, { IconsInterface } from './../PropsContext'
// import styles from '../Style'
import icons from './Icons'

// interface BtnTemplateInterface {
// name: keyof IconsInterface
// color?: string
// onPress?: TouchableOpacityProps['onPress']
// style?: StyleProp<ViewStyle>
// }
interface BtnTemplateInterface {
  name: string
  // color?: string
  onClick: () => void
  disabled?: boolean
  // style?: StyleProp<ViewStyle>
}

const BtnTemplate: React.FC<BtnTemplateInterface> = (props: {
  onClick: () => void
  name: string
  disabled?: boolean
}) => {
  // const { styleProps } = useContext(PropsContext)
  // const { BtnTemplateStyles, iconSize, customIcon } = styleProps || {}

  return (
    <div
      style={{
        width: 35,
        height: 35,
        borderRadius: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        cursor: props.disabled ? 'auto' : 'pointer'
      }}
      onClick={props.onClick}
    >
      <img
        style={{
          margin: 'auto',
          display: 'flex',
          verticalAlign: 'middle',
          opacity: props.disabled ? 0.3 : 1,
          // filter: sepia(1),
          width: 25, // iconSize || 25,
          height: 25 // iconSize || 25
          // tintColor: theme || props.color || '#fff',
        }}
        src={
          icons[props.name]
          // customIcon?.[props.name] ? customIcon[props.name] : icons[props.name]
        }
      />
    </div>
  )
}

export default BtnTemplate
