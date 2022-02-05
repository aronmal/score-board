import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { loginContext } from "../context";
import auth from "../helpers/auth";
import reqData from "../helpers/reqData";
import { as, ss } from "../helpers/styles";
import { userDataType } from "../interfaces";

export default function Dashboard() {

    const { isLoggedIn } = useContext(loginContext);

    const [data, setData] = useState<userDataType>({} as userDataType)
    const [elem, setElem] = useState(<></>);

    useEffect(() => {
        dataReq()
    }, [])

    async function dataReq() {
        const token = await auth(setElem)
        if (!token)
            return;
        const yourData = await reqData(token, setElem)
        if (!yourData)
            return;
        setData(() => yourData)
    }

    if (!isLoggedIn) return <Navigate to='/' />;

    return (
        <div className={classNames(as.flexCol, ss.stepForm)}>
            <div className={classNames(as.flexCol, as.relative)}>
                {Object.keys(data).length === 0 ? <h2>Loading...</h2> : <>
                    <h2>{'Hallo '}<span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ data.username }</span> :</h2>
                    <p>Das ist dein Dashboard</p>
                    {Object.keys(data).length > 0 ? data.groups.map(group =>
                        <p>{ `${group.name} => ${group.playerCount} Player` + (group.doTeams ? `, ${group.teamCount} Teams` : '')}</p>
                    ) : <></>}
                    { console.log('Your Data: ' + JSON.stringify(data)) }
                </>}
                { elem }
            </div>
        </div>
    )
}