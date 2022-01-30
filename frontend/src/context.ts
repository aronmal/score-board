import { createContext } from "react";
import { loginContextType } from './interfaces';

export const loginContext = createContext({} as loginContextType);