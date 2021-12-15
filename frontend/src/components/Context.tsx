import { createContext } from "react";

interface ContextStateType {
    setData: Function
    data: ContextType
}

export interface ContextType {
    login: boolean
}

const loginContext = createContext({} as ContextStateType)
export default loginContext