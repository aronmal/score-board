import { Dispatch, SetStateAction } from "react";
import { stepFormStyleType } from "../interfaces";
import stepStyle from '../styles/stepForm.module.css';
const ss = stepStyle as stepFormStyleType;

export default function showError(setElem: Dispatch<SetStateAction<JSX.Element>>, message: string, timeout: number) {
    setElem(<p className={ss.errorP}>{ message }</p>)
    setTimeout(() => {
      setElem(<></>)
    }, timeout)
}