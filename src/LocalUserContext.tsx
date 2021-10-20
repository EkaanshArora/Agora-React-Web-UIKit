import React, { useContext, createContext } from 'react'
import MaxUidContext from './MaxUidContext'
import MinUidContext from './MinUidContext'
import { LocalUIKitUser } from './PropsContext'

export const LocalContext = createContext<LocalUIKitUser>({} as LocalUIKitUser)
export const LocalProvider = LocalContext.Provider
export const LocalConsumer = LocalContext.Consumer

interface LocalUserContextInterface {
  children: React.ReactNode
}

const LocalUserContext: React.FC<LocalUserContextInterface> = (props) => {
  const max = useContext(MaxUidContext)
  const min = useContext(MinUidContext)
  // if(min && min[0] && max )
  // const localUser: UIKitUser = max[0].uid === 0 ? max[0] : min[0]
  let localUser: LocalUIKitUser
  if (max[0].uid === 0) {
    localUser = max[0] as LocalUIKitUser
  } else {
    localUser = min.find((u) => u.uid === 0) as LocalUIKitUser
  }
  console.log(localUser.uid)
  return (
    <LocalContext.Provider value={localUser}>
      {props.children}
    </LocalContext.Provider>
  )
}

export default LocalUserContext
