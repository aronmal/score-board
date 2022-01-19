import { groupnameError } from "./Newgroup";
import { setDescription, setGroupname, setIsPublic, validate } from "./Helpers";
import { Dispatch, SetStateAction } from "react";
import { groupInfoType } from "../Interfaces";

function Step1({ nextStep, groupInfo: { groupname, description, isPublic }, setGroupInfo, groupnameAllowInput, doTeams, setDoTeams }: { nextStep: () => Promise<void>, groupInfo: groupInfoType, setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, groupnameAllowInput: boolean, doTeams: boolean, setDoTeams: Dispatch<SetStateAction<boolean>> }) {
    return (<>
        <h2 style={(!groupname || groupname === groupnameError) ? {borderBottom: '.25rem solid transparent'} : {borderBottom: '.25rem solid var(--gbs-color)'}}>{(!groupname || groupname === groupnameError) ? 'Neue Gruppe' : groupname}</h2>
        <div className='flex-row'>
            <p style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</p>
            <input
            className='input-box'
            style={(groupname === groupnameError) ? {color: 'red'} : {}}
            type='text'
            placeholder='Neue Gruppe'
            value={groupname}
            onChange={e => setGroupname(setGroupInfo, groupnameAllowInput, validate(e.target.value))}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    nextStep();
            }}
            />
        </div>
        <div className='flex-col'>
            <p style={{marginBottom: '.5em'}}>Beschreibung:</p>
            <textarea
            className='input-box'
            placeholder='(optional)'
            value={description}
            onChange={e => setDescription(setGroupInfo, validate(e.target.value))}
            />
        </div>
        <div className='grid-radios'>
            <p>Sichtbarkeit:</p>
            <input
            className='radio'
            type='radio'
            checked={isPublic}
            onChange={() => setIsPublic(setGroupInfo, true)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    setIsPublic(setGroupInfo, true)
            }}
            />
            <p>Öffentlich</p>
            <input
            className='radio'
            type='radio'
            checked={!isPublic}
            onChange={() => setIsPublic(setGroupInfo, false)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    setIsPublic(setGroupInfo, false)
            }}
            />
            <p>Privat</p>
            <p>Einteilung:</p>
            <input
            className='radio'
            type='radio'
            checked={!doTeams}
            onChange={() => setDoTeams(false)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    setDoTeams(false)
            }}
            />
            <p>Einzelspieler</p>
            <input
            className='radio'
            type='radio'
            checked={doTeams}
            onChange={() => setDoTeams(true)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    setDoTeams(true)
            }}
            />
            <p>Teams</p>
        </div>
    </>)
}

export default Step1;

