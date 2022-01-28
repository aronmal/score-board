import { useEffect, useState } from "react";
import auth from "../helpers/auth";
import reqData from "../helpers/reqData";
import { userType } from "../interfaces";

function Dashboard() {

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

    return (
        <div style={{fontSize: '2em'}}>
            <h2>{'Hallo '}<span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ data.username || '' }</span> :</h2>
            <br />
            <p>Das ist dein Dashboard</p>
            <br />
            <p>Your Data:</p>
            <br />
            { JSON.stringify(data) }
            { elem }
        </div>
    )
}

export default Dashboard