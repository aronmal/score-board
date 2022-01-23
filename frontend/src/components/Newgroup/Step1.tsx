import { groupnameError, setDescription, setGroupname, setIsPublic, validate } from "./Helpers";
import { step1Type } from "../Interfaces";

function Step1({ nextStep, groupInfo: { groupname, description, isPublic }, setGroupInfo, groupnameAllowInput, doTeams, setDoTeams }: step1Type) {
    return (<>
        {(!groupname || (groupname === groupnameError)) ?
            <h2 style={{borderBottom: '.25rem solid transparent'}}>{ 'Neue Gruppe' }</h2>
            :
            <h2 style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</h2>
        }
        <div className='flex-row'>
            <p style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</p>
            <input
            className='input-box'
            style={groupname === groupnameError ? {color: 'red'} : {}}
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