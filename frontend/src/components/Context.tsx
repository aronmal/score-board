import { createContext } from "react";

interface ContextStateType {
    setIsLoggedIn: Function
    isLoggedIn: boolean
}

const loginContext = createContext({} as ContextStateType)
export default loginContext