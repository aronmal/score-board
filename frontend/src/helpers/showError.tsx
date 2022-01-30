import { Dispatch, SetStateAction } from "react";
import { ss } from "./styles";

export default function showError(setElem: Dispatch<SetStateAction<JSX.Element>>, message: string, timeout: number) {
    setElem(<p className={ss.errorP}>{ message }</p>)
    setTimeout(() => {
      setElem(<></>)
    }, timeout)
}