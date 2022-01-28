import { createContext } from "react";
import { loginContextType } from '../interfaces';

const loginContext = createContext({} as loginContextType);

export default loginContext