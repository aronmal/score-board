import { Dispatch, SetStateAction } from 'react'
import { playerType, teamType } from '../Interfaces';
import { addPlayerToTeam, addTeam, changePlayername, changeTeamname, checkForPlayernameDuplicates, checkForTeamnameDuplicates, isLastPlayerInTeam, playernameOfUuid, removePlayerFromTeam, removeTeam, replacePlayerWithUuidTo } from './Helpers';

function Step3({ elem, players, setPlayers, teams, setTeams, playernameColumns, setPlayernameColumns, teamIndexCount, setTeamIndexCount }: { elem: JSX.Element, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, playernameColumns: number, setPlayernameColumns: Dispatch<SetStateAction<number>>, teamIndexCount: number, setTeamIndexCount: Dispatch<SetStateAction<number>> }) {

    return (<>
        <div className='flex-row'>
          <h2>Teams erstellen:</h2>
          <input
            className='playername-columns-input input-box'
            type='number'
            min='2'
            max='6'
            value={playernameColumns}
            onChange={e => {
              if (+e.target.value !== 0)
                setPlayernameColumns(+e.target.value);
            }}
          />
        </div>
        <div className='team-content'>
          <div className="flex-col team-list">
            {teams.map((team) => (
              <div key={ team.uuid } className='flex-col team-div team-div-real'>
                <div className='flex-row'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path d="M17.997 18h-11.995l-.002-.623c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209-2.366-4.363-.674-6.838 1.866-6.838 2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zm-22.806 2.214h4.501c-.021-4.906 2.246-2.772 2.246-6.676 0-1.507-.983-2.324-2.248-2.324-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657-1.119.258-1.193.805-1.193 1.751l.002.463z"/></svg>
                  <input
                    className='teamname-input input-box'
                    style={checkForTeamnameDuplicates(teams, team.name) ? {color: 'red'} : {}}
                    type='text'
                    value={team.name}
                    placeholder='Teamname'
                    onChange={e => changeTeamname(e, teams, setTeams, team.uuid)}
                  />
                  <button
                    className='team-minus-button input-box'
                    onClick={() => removeTeam(teams, setTeams, team.uuid)}
                  ><span>-</span></button>
                </div>
                <div className="grid-team-playernames">
                  {team.players.map(playerUuid => (
                    <div key={ playerUuid } className='player-in-team-div'>
                      <input
                        className='playername-in-team input-box'
                        style={checkForPlayernameDuplicates(players, playerUuid) ? {color: 'red'} : {}}
                        type="text"
                        value={playernameOfUuid(players, playerUuid)}
                        list="namelist"
                        placeholder='Spielername'
                        onChange={e => {
                          if ((isLastPlayerInTeam(team, playerUuid)) && !playernameOfUuid(players, playerUuid) && e.target.value)
                            addPlayerToTeam(setPlayers, teams, setTeams, team.uuid);
                          if (!!players.find(v => v.uuid === e.target.value))
                            replacePlayerWithUuidTo(e, players, setPlayers, teams, setTeams, team.uuid, playerUuid);
                          changePlayername(e, players, setPlayers, playerUuid);
                        }}
                        onKeyDown={e => {
                          if ((!isLastPlayerInTeam(team, playerUuid)) && (e.code === 'Delete'))
                            removePlayerFromTeam(players, setPlayers, teams, setTeams, team.uuid, playerUuid);
                        }}
                        onBlur={() => {
                          if ((!isLastPlayerInTeam(team, playerUuid)) && !playernameOfUuid(players, playerUuid))
                            removePlayerFromTeam(players, setPlayers, teams, setTeams, team.uuid, playerUuid);
                        }}
                      />
                      {(!isLastPlayerInTeam(team, playerUuid)) ?
                        <button
                          tabIndex={-1}
                          className='team-player-minus-button'
                          onClick={() => removePlayerFromTeam(players, setPlayers, teams, setTeams, team.uuid, playerUuid)}
                        ><span>{ '\u2A2F' }</span></button>
                      : <></>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <datalist id="namelist">
              {[...players.filter((v) => !v.team)].map(({ uuid, name }) =>
                <option key={ uuid } value={ uuid }>{ name }</option>
              )}
            </datalist>
          </div>
          <div className="flex-row team-list-sample">
            <div className='flex-col team-div'>
              <div className='flex-row'>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path d="M.002 20h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619zm20.498-7c-1.932 0-3.5 1.567-3.5 3.5s1.568 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.568-3.5-3.5-3.5zm1.5 4h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm-4.814 3h-9.183l-.003-.829c0-1.679.133-2.649 2.118-3.107 2.243-.518 4.458-.981 3.394-2.945-3.156-5.82-.901-9.119 2.488-9.119 4.06 0 4.857 4.119 3.085 7.903-1.972.609-3.419 2.428-3.419 4.597 0 1.38.589 2.619 1.52 3.5z"/></svg>
                <button
                  className='add-button-in-team add-team-button input-box'
                  onClick={() => addTeam(setPlayers, setTeams, teamIndexCount, setTeamIndexCount)}
                >{ '\u002B' }</button>
              </div>
            </div>
          </div>
        </div>
        { elem }
      </>)
}

export default Step3