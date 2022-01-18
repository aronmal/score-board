import { groupnameError } from "./Newgroup";
import { validate } from "./Helpers";
import { Dispatch, SetStateAction } from "react";

function Step1({ groupname, groupnameInput, setGroupnameInput, groupnameAllowInput, description, setDescription, isPublic, setIsPublic, doTeams, setDoTeams }: { groupname: string, groupnameInput: string, setGroupnameInput: Dispatch<SetStateAction<string>>, groupnameAllowInput: boolean, description: string, setDescription: Dispatch<SetStateAction<string>>, isPublic: boolean, setIsPublic: Dispatch<SetStateAction<boolean>>, doTeams: boolean, setDoTeams: Dispatch<SetStateAction<boolean>> }) {
    return (<>
        <h2 style={(!groupname || groupname === groupnameError) ? {borderBottom: '.25rem solid transparent'} : {borderBottom: '.25rem solid var(--gbs-color)'}}>{(!groupname || groupname === groupnameError) ? 'Neue Gruppe' : groupname}</h2>
        <div className='flex-row'>
            <p style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</p>
            <input
            className='input-box'
            style={(groupnameInput === groupnameError) ? {color: 'red'} : {}}
            type='text'
            placeholder='Neue Gruppe'
            value={groupnameInput}
            onChange={e => {
                if (e.target.value.length <= 30 && groupnameAllowInput)
                setGroupnameInput(e.target.value);
            }}
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
            onChange={e => {
                if (e.target.value.length <= 200)
                setDescription(validate(e.target.value));
            }}
            />
        </div>
        <div className='grid-radios'>
            <p>Sichtbarkeit:</p>
            <input
            className='radio'
            type='radio'
            checked={isPublic}
            onChange={() => setIsPublic(true)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                setIsPublic(true)
            }}
            />
            <p>Öffentlich</p>
            <input
            className='radio'
            type='radio'
            checked={!isPublic}
            onChange={() => setIsPublic(false)}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                setIsPublic(false)
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
function nextStep() {
    throw new Error("Function not implemented.");
}

