import { createContext } from "react";
import { loginContextType } from './Interfaces';

const loginContext = createContext({} as loginContextType);

export default loginContext