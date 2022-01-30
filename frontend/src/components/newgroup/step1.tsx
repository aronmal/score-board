import { validate } from "../../helpers/newgroup_helpers";
import { ss } from "../../helpers/styles";
import { step1Type } from "../../interfaces";
import { duplicateError, groupnameError } from "./newgroup";

export default function Step1({ props: { group: { groupname, description, isPublic, doTeams }, groupDispatch, elem } }: step1Type) {
    return <>
        {(!groupname) ?
            <h2 style={{borderBottom: '.25rem solid transparent'}}>{ 'Neue Gruppe' }</h2>
            :
            <h2 style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</h2>
        }
        <div className='flex-row'>
            <p style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</p>
            <input
            className={`${ss.inputBox} ${((elem.props.children === groupnameError) ? ss.errorInput : '')}`}
            style={groupname === duplicateError ? {color: 'red'} : {}}
            type='text'
            placeholder='Neue Gruppe'
            value={groupname}
            onChange={e => groupDispatch({ type: 'setGroupname', payload: { groupname: validate(e.target.value) } })}
            />
        </div>
        <div className='flex-col'>
            <p style={{marginBottom: '.5em'}}>Beschreibung:</p>
            <textarea
            className={ss.inputBox}
            placeholder='(optional)'
            value={description}
            onChange={e => groupDispatch({ type: 'setDescription', payload: { description: validate(e.target.value) } })}
            />
        </div>
        <div className={ss.gridRadios}>
            <p>Sichtbarkeit:</p>
            <input
            className={ss.radio}
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
            className={ss.radio}
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
            className={ss.radio}
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
            className={ss.radio}
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
        { elem }
    </>
}