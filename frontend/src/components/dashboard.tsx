import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { loginContext } from "../context";
import auth from "../helpers/auth";
import reqData from "../helpers/reqData";
import { ss } from "../helpers/styles";
import { userType } from "../interfaces";

export default function Dashboard() {

    const { isLoggedIn } = useContext(loginContext);

    const [data, setData] = useState<userType>({} as userType);
    const [elem, setElem] = useState(<></>);

    useEffect(() => {
        dataReq()
    }, [])

    async function dataReq() {
        const token = (await auth(setElem))
        if (!token)
            return;
        const yourData = await reqData(token, setElem)
        if (!yourData)
            return;
        setData(() => yourData)
    }

    if (!isLoggedIn) return <Navigate to='/' />;

    return (
        <div className={`flex-col ${ss.stepForm}`}>
            <div className="flex-col relative">
                <h2>{'Hallo '}<span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ data.username || 'Nutzer' }</span> :</h2>
                <br />
                <p>Das ist dein Dashboard</p>
                { console.log('Your Data: ' + JSON.stringify(data)) }
                { elem }
            </div>
        </div>
    )
}