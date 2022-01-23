import { changePlayername, playernameDuplicatesExists, removePlayer, validate, addNewPlayer } from "./Helpers";
import { step2Type } from "../Interfaces";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Step2({ groupInfo: { groupname, ..._ }, players, setPlayers, setTeams, doTeams, playernameColumns, setPlayernameColumns }: step2Type) {

  const [playername, setPlayername] = useState('');

  return (<>
    <div className='flex-row'>
      <h2>{!doTeams ? 'Spieler hinzufügen zu ' : 'Spieler überprüfen von '}<span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</span> :</h2>
      <input
        className='playername-columns-input input-box'
        type='number'
        min='2'
        max='6'
        value={playernameColumns}
        onChange={e => {if (+e.target.value !== 0) setPlayernameColumns(+e.target.value)}}
      />
    </div>
    {!doTeams ? <div className="flex-row player-input" style={{justifyContent: 'flex-start'}}>
      <input
        autoFocus
        className='add-player-input input-box'
        style={{width: '50%'}}
        type='text'
        placeholder='Spielername'
        value={playername}
        onChange={e => {
          if (e.target.value.length <= 30)
            setPlayername(validate(e.target.value));
        }}
        onKeyDown={e => {
          if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            addNewPlayer(setPlayers, playername);
            setPlayername('')
          }
        }}
        />
      <button
        className='add-player-button'
        onClick={() => {
            addNewPlayer(setPlayers, playername)
            setPlayername('')
        }}
      >Hinzufügen</button>
    </div> : <></>}
    <div className="grid-team-playernames">
      {players.map(({ uuid: playerUuid, name: name, team: teamUuid }) => (
          <div key={ playerUuid } className='player-in-team-div'>
            <input
              className='playername-in-team input-box'
              style={playernameDuplicatesExists([...players, { uuid: '', name: playername, team: '' }], name) ? {color: 'red'} : {}}
              type="text"
              value={name}
              placeholder='Spielername'
              onChange={e => {
                if (!doTeams || (doTeams && validate(e.target.value)))
                  changePlayername(setPlayers, validate(e.target.value), playerUuid)
              }}
              onKeyDown={e => {
                if (!doTeams && (e.code === 'Delete'))
                  removePlayer(setPlayers, setTeams, teamUuid, playerUuid);
              }}
              onBlur={() => {
                if (!doTeams && !name)
                  removePlayer(setPlayers, setTeams, teamUuid, playerUuid);
              }}
            />
            {!doTeams ? 
              <button
                tabIndex={-1}
                className='team-player-minus-button'
                onClick={() => removePlayer(setPlayers, setTeams, teamUuid, playerUuid)}
              ><span>{ '\u2A2F' }</span></button>
            : <></>}
          </div>
      ))}
      {!doTeams ? (
        <div className='player-in-team-div'>
          <input
            className='playername-in-team input-box'
            style={playernameDuplicatesExists([...players, { uuid: '', name: playername, team: '' }], playername) ? {color: 'red'} : {}}
            type="text"
            value={playername}
            placeholder='Spielername'
            onChange={e => {
              if (!doTeams || (doTeams && validate(e.target.value)))
                setPlayername(validate(e.target.value))
            }}
            onKeyDown={e => {
              if (!doTeams && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
                addNewPlayer(setPlayers, playername)
                setPlayername('')
              }
            }}
          />
        </div>
      ) : <></>}
    </div>
  </>)
}

export default Step2
