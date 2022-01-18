import { Dispatch, SetStateAction } from "react";
import { playerType, teamType } from "../Interfaces";
import { addSinglePlayer, changePlayername, checkForPlayernameDuplicates, playernameOfUuid, removePlayerFromTeam, validate } from "./Helpers";
import { playernameError } from "./Newgroup";

function Step2({ groupname, playername, setPlayername, playernameAllowInput, setPlayernameAllowInput, players, setPlayers, teams, setTeams, doTeams, playernameColumns, setPlayernameColumns }: { groupname: string, playername: string, setPlayername: Dispatch<SetStateAction<string>>, playernameAllowInput: boolean, setPlayernameAllowInput: Dispatch<SetStateAction<boolean>>, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, doTeams: boolean, playernameColumns: number, setPlayernameColumns: Dispatch<SetStateAction<number>> }) {
    return (<>
        <div className='flex-row'>
          {!doTeams ? <h2>Spieler hinzufügen zu <span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</span> :</h2> : <></>}
          {doTeams ? <h2>Spieler von <span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</span> :</h2> : <></>}
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
            style={(playername === playernameError) ? {color: 'red', width: '50%'} : {width: '50%'}}
            type='text'
            placeholder='Spielername'
            value={playername}
            onChange={e => {
              if (e.target.value.length <= 30 && playernameAllowInput) {
                if (playername === playernameError )
                  setPlayername('');
                else
                  setPlayername(validate(e.target.value));
              }
            }}
            onKeyDown={e => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter')
                addSinglePlayer(playernameAllowInput, setPlayernameAllowInput, playername, setPlayername, players, setPlayers);
            }}
            />
          <button className='add-player-button' onClick={() => addSinglePlayer(playernameAllowInput, setPlayernameAllowInput, playername, setPlayername, players, setPlayers)}>Hinzufügen</button>
        </div> : <></>}
        <div className="grid-team-playernames">
          {[...players.filter((v) => !!v.name)].map(({ uuid: playerUuid, name: _name, team: teamUuid }) => {
            return (
              <div key={ playerUuid } className='player-in-team-div'>
                <input
                  className='playername-in-team input-box'
                  style={checkForPlayernameDuplicates(players, playerUuid) ? {color: 'red'} : {}}
                  type="text"
                  value={playernameOfUuid(players, playerUuid)}
                  placeholder='Spielername'
                  onChange={e => changePlayername(e, players, setPlayers, playerUuid)}
                  onKeyDown={e => {
                    if (e.code === 'Delete')
                      removePlayerFromTeam(players, setPlayers, teams, setTeams, teamUuid, playerUuid);
                  }}
                />
                <button
                  tabIndex={-1}
                  className='team-player-minus-button'
                  onClick={() => removePlayerFromTeam(players, setPlayers, teams, setTeams, teamUuid, playerUuid)}
                ><span>{ '\u2A2F' }</span></button>
              </div>
            )})}
        </div>
      </>)
}

export default Step2
