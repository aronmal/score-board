import { Dispatch, SetStateAction } from "react";

function showError(setElem: Dispatch<SetStateAction<JSX.Element>>, message: string, timeout: number) {
    setElem(<p className="error-p">{ message }</p>)
    setTimeout(() => {
      setElem(<></>)
    }, timeout)
}

export default showError