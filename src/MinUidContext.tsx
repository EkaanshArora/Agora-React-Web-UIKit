import React from 'react'
import { UIKitUser } from './RTCConfigure'

const MinUidContext = React.createContext<UIKitUser[]>([])

export const MinUidProvider = MinUidContext.Provider
export const MinUidConsumer = MinUidContext.Consumer
export default MinUidContext
