import { Dispatch, SetStateAction } from "react";

export default function showError(setElem: Dispatch<SetStateAction<JSX.Element>>, message: string, timeout: number) {
    setElem(<p className="errorP">{ message }</p>)
    setTimeout(() => {
      setElem(<></>)
    }, timeout)
}