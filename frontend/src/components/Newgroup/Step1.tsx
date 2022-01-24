import { groupnameError, validate } from "./Helpers";
import { step1Type } from "../Interfaces";

function Step1({ props: { nextStep, group: { groupname, description, isPublic, doTeams }, groupDispatch } }: step1Type) {
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
            onChange={e => groupDispatch({ type: 'setGroupname', payload: { groupname: validate(e.target.value) } })}
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
            onChange={e => groupDispatch({ type: 'setDescription', payload: { description: validate(e.target.value) } })}
            />
        </div>
        <div className='grid-radios'>
            <p>Sichtbarkeit:</p>
            <input
            className='radio'
            type='radio'
            checked={isPublic}
            onChange={() => groupDispatch({ type: 'setIsPublic', payload: { isPublic: true } })}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    groupDispatch({ type: 'setIsPublic', payload: { isPublic: true } })
            }}
            />
            <p>Öffentlich</p>
            <input
            className='radio'
            type='radio'
            checked={!isPublic}
            onChange={() => groupDispatch({ type: 'setIsPublic', payload: { isPublic: false } })}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    groupDispatch({ type: 'setIsPublic', payload: { isPublic: false } })
            }}
            />
            <p>Privat</p>
            <p>Einteilung:</p>
            <input
            className='radio'
            type='radio'
            checked={!doTeams}
            onChange={() => groupDispatch({ type: 'setDoTeams', payload: { doTeams: false } })}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    groupDispatch({ type: 'setDoTeams', payload: { doTeams: false } })
            }}
            />
            <p>Einzelspieler</p>
            <input
            className='radio'
            type='radio'
            checked={doTeams}
            onChange={() => groupDispatch({ type: 'setDoTeams', payload: { doTeams: true } })}
            onKeyDown={e => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter')
                    groupDispatch({ type: 'setDoTeams', payload: { doTeams: true } })
            }}
            />
            <p>Teams</p>
        </div>
    </>)
}

export default Step1;