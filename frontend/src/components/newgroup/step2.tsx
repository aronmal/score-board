import { playernameDuplicatesExists, validate } from "../../helpers/newgroup_helpers";
import { step2Type } from "../../interfaces";
import { useState } from "react";
import { as, ss } from "../../helpers/styles";
import classNames from "classnames";

export default function Step2({ props: { group: { name, doTeams, players }, groupDispatch, playernameColumns, setPlayernameColumns, elem } }: step2Type) {

  const [playername, setPlayername] = useState('');

  function newPlayer() {
    if (!validate(playername))
      return;
    groupDispatch({ type: 'newSinglePlayer', payload: { playername } });
    setPlayername('');
  }

  return <>
    <div className={as.flexRow}>
      <h2>{!doTeams ? 'Spieler hinzufügen zu ' : 'Spieler überprüfen von '}<span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ name }</span> :</h2>
      <input
        className={classNames(ss.playernameColumnsInput, ss.inputBox)}
        type='number'
        min='2'
        max='6'
        value={playernameColumns}
        onChange={e => {if (+e.target.value !== 0) setPlayernameColumns(+e.target.value)}}
      />
    </div>
    {!doTeams ? <div className={classNames(as.flexRow, ss.playerInput)} style={{justifyContent: 'flex-start'}}>
      <input
        autoFocus
        className={ss.inputBox}
        style={{width: '50%'}}
        type='text'
        placeholder='Spielername'
        value={playername}
        onChange={e => {
          if (e.target.value.length <= 30)
            setPlayername(validate(e.target.value));
        }}
        onKeyDown={e => {
          if ((e.code === 'Enter' || e.code === 'NumpadEnter'))
            newPlayer()
        }}
        onBlur={() => newPlayer()}
        />
      <button
        className={ss.addPlayerButton}
        onClick={() => newPlayer()}
      >Hinzufügen</button>
    </div> : <></>}
    <div className={ss.gridTeamPlayernames}>
      {players.map(({ uuid: playerUuid, name, team: teamUuid }) => (
          <div key={ playerUuid } className={ss.playerInTeamDiv}>
            <input
              className={classNames(ss.playernameInTeam, ss.inputBox)}
              style={playernameDuplicatesExists([...players, { uuid: '', name: playername, team: '' }], name) ? {color: 'red'} : {}}
              type="text"
              value={name}
              placeholder='Spielername'
              onChange={e => {
                if (!doTeams || (doTeams && validate(e.target.value)))
                  groupDispatch({ type: 'changePlayername', payload: { playername: validate(e.target.value), playerUuid } })
              }}
              onKeyDown={e => {
                if (!doTeams && (e.code === 'Delete'))
                  groupDispatch({ type: 'removePlayer', payload: { playerUuid, teamUuid } })
              }}
              onBlur={() => {
                if (!doTeams && !name)
                  groupDispatch({ type: 'removePlayer', payload: { playerUuid, teamUuid } })
              }}
            />
            {!doTeams ? 
              <button
                tabIndex={-1}
                className={ss.teamPlayerMinusButton}
                onClick={() => groupDispatch({ type: 'removePlayer', payload: { playerUuid, teamUuid } })}
              ><span>{ '\u2A2F' }</span></button>
            : <></>}
          </div>
      ))}
      {!doTeams ? (
        <div className={ss.playerInTeamDiv}>
          <input
            className={classNames(ss.playernameInTeam, ss.inputBox)}
            style={playernameDuplicatesExists([...players, { uuid: '', name: playername, team: '' }], playername) ? {color: 'red'} : {}}
            type="text"
            value={playername}
            placeholder='Spielername'
            onChange={e => {
              if (!doTeams || (doTeams && validate(e.target.value)))
                setPlayername(validate(e.target.value))
            }}
            onKeyDown={e => {
              if (!doTeams && (e.code === 'Enter' || e.code === 'NumpadEnter')) 
                newPlayer()
            }}
            onBlur={() => newPlayer()}
          />
        </div>
      ) : <></>}
    </div>
    { elem }
  </>
}
