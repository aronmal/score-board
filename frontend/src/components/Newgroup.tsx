import { useEffect, useState, useContext, CSSProperties } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import loginContext from './Context';
import auth from './Helpers';


function New() {

  const { isLoggedIn } = useContext(loginContext);
  const [elem, setElem] = useState(<></>)

  const [currentStep, setCurrentStep] = useState(0)
  const [groupnameAllowInput, setGroupnameAllowInput] = useState(true);
  const [groupnameInput, setGroupnameInput] = useState('');
  const [groupname, setGroupname] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [playernameAllowInput, setPlayernameAllowInput] = useState(true);
  const [playername, setPlayername] = useState('');
  const [players, setPlayers] = useState<playerType[]>([]);
  const [teams, setTeams] = useState<teamType[]>([]);
  const [playernameColumns, setPlayernameColumns] = useState(2);
  const [doTeams, setDoTeams] = useState(false);
  const [elemsCount, setElemsCount] = useState(3);
  const [teamIndexCount, setTeamIndexCount] = useState(1);
  const groupnameError = 'Bitte Name eingeben!'
  const playernameError = 'Name bereits vergeben!'

  function validate(e:string) {
    return e.replace(/[<>]/g, '')
  }

  useEffect(() => {
    if (groupnameInput === groupnameError )
      setGroupname('')
    else
      setGroupname(validate(groupnameInput))
  }, [groupnameInput])

  useEffect(() => {
    if (!doTeams)
      setElemsCount(2)
    else
      setElemsCount(3)
  }, [doTeams])

  const addSinglePlayer = () => {
    if (!playernameAllowInput)
      return

    if (playername === '') {
      console.log('[WARN] playername is empty!')
      return
    }

    if (!!players.find((e) => e.name === playername)) {
      console.log('[WARN] player already exists!')
      setPlayernameAllowInput(false)
      setPlayername(playernameError)
      setTimeout(() => {
        setPlayername('')
        setPlayernameAllowInput(true)
      }, 2000)
      return
    }
    setPlayers((prev) => [...prev,{uuid: uuidv4(), name: playername, team: ''}])
    console.log(`added ${playername}`)
    setPlayername('')
    console.log(players)
  };

  async function nextStep() {
    if (currentStep === (elemsCount - 1)){
      const token = await auth(setElem)
      if (!token)
        return;
      let newgroupReqBody = { groupname, isPublic , players: players.filter((v) => v.name !== ''), token } as newgroupType;
      newgroupReqBody.description = (description === '' ) ? 'Keine Beschreibung' : description;
      newgroupReqBody.teams = (doTeams) ? teams : [];
      const res = await fetch('/api/newgroup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newgroupReqBody),
      }).catch((err: Error) => {
        console.log(err)
        setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
        setTimeout(() => {
            setElem(<></>)
        }, 5000)
      });
      if (!res)
        return;
      if (res.status === 201) {
        setElem(<Navigate to='/dashboard' />)
      } else {
        setElem(<p style={{color: 'red'}}>{ 'Error ' + res.status + ' ' + res.statusText }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 5000)
      }
    }

    if (currentStep === 0) {
      if (!groupnameAllowInput)
        return
  
      if (groupname === '') {
        console.log('[WARN] groupname is empty!')
        setGroupnameAllowInput(false)
        setGroupnameInput(groupnameError)
        setTimeout(() => {
          setGroupnameInput('')
          setGroupnameAllowInput(true)
        }, 2000)
        return
      }
      setCurrentStep(1)
    }

    if (currentStep === 1 && doTeams)
      setCurrentStep(2)
  };

  const teamByUuid = (teamUuid: string) => teams[teams.findIndex((e) => e.uuid === teamUuid)];

  const addPlayerToTeam = (teamUuid: string) => {
    const playerUuid = uuidv4()
    setPlayers(prev => [...prev, { uuid: playerUuid, name: '', team: teamUuid}])
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => Object.assign([...prev], { [match]: {...prev[match], players: [...prev[match].players, playerUuid]}}))
  };

  const changePlayername = (e: React.ChangeEvent<HTMLInputElement>, playerUuid: string) => {
    const match = players.findIndex((e) => e.uuid === playerUuid)
    setPlayers((prev) => Object.assign([...prev], { [match]: {...prev[match], name: validate(e.target.value)}}))
  };

  const removePlayerFromTeam = (teamUuid: string, playerUuid: string) => {
    const teamMatch = teams.findIndex((e) => e.uuid === teamUuid)
    const playerMatch = players.findIndex((e) => e.uuid === playerUuid)
    setTeams((prev) => Object.assign([...prev], { [teamMatch]: {...prev[teamMatch], players: [...prev[teamMatch].players.filter((v) => v !== playerUuid)]}}))
    setPlayers((prev) => [...prev.filter((_, i) => i !== playerMatch)])
  };

  const replacePlayerWithUuidTo = (e: React.ChangeEvent<HTMLInputElement>, teamUuid: string, playerUuid: string) => {
    const oldPlayerMatchinPlayers = players.findIndex(e => e.uuid === playerUuid)
    const newPlayerMatchinPlayers = players.findIndex(v => v.uuid === e.target.value)
    const teamMatch = teams.findIndex(e => e.uuid === teamUuid)
    const playerMatchinTeams = teams[teamMatch].players.findIndex(e => e === playerUuid)
    setTeams(prev => Object.assign([...prev], { [teamMatch]: {...prev[teamMatch], players: Object.assign([...prev[teamMatch].players], { [playerMatchinTeams]: e.target.value})}}))
    setPlayers(prev => Object.assign([...prev.filter((_, i) => i !== oldPlayerMatchinPlayers)], { [newPlayerMatchinPlayers]: {...players[newPlayerMatchinPlayers], team: teamUuid}}))
  };

  const addTeam = () => {
    setTeams((prev) => [...prev,{ uuid: uuidv4(), name: `Team ${teamIndexCount}`, players: []}])
    setTeamIndexCount(e => e + 1);
  };

  const changeTeamname = (e: React.ChangeEvent<HTMLInputElement>, teamUuid: string) => {
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => Object.assign([...prev], { [match]: {...prev[match], name: validate(e.target.value)}}))
  };

  const removeTeam = (teamUuid: string) => {
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => [...prev.filter((_, i) => i !== match)])
  };

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className='flex-col step-form' style={{'--playername-columns': playernameColumns} as CSSProperties}>

      {/* General settings of group to be created  */}

      {(currentStep === 0) ? <>
        <h2 style={(groupname === '' || groupname === groupnameError) ? {borderBottom: '.25rem solid transparent'} : {borderBottom: '.25rem solid var(--gbs-color)'}}>{(groupname === '' || groupname === groupnameError) ? 'Neue Gruppe' : groupname}</h2>
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
          />
          <p>Öffentlich</p>
          <input
            className='radio'
            type='radio'
            checked={!isPublic}
            onChange={() => setIsPublic(false)}
          />
          <p>Privat</p>
          <p>Einteilung:</p>
          <input
            className='radio'
            type='radio'
            checked={!doTeams}
            onChange={() => setDoTeams(false)}
          />
          <p>Einzelspieler</p>
          <input
            className='radio'
            type='radio'
            checked={doTeams}
            onChange={() => setDoTeams(true)}
          />
          <p>Teams</p>
        </div>
      </> : <></>}

      {/* Create players or overview created players by 'teams' section */}

      {(((currentStep === 1) && !doTeams) || ((currentStep === 2) && doTeams)) ? <>
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
                addSinglePlayer();
            }}
            />
          <button className='add-player-button' onClick={() => addSinglePlayer()}>Hinzufügen</button>
        </div> : <></>}
        <div className="grid-team-playernames">
          {[...players.filter((v) => v.name !== '')].map(({ uuid: playerUuid, name, team: teamUuid }) => {
            const team = teamByUuid(teamUuid);
            return (
              <div key={ playerUuid } className='player-in-team-div'>
                <input
                  className='playername-in-team input-box'
                  type="text"
                  value={players[players.findIndex(e => e.uuid === playerUuid)].name}
                  list="namelist"
                  placeholder='Spielername'
                  onChange={e => {
                    if (players.findIndex(v => v.uuid === e.target.value) !== -1)
                      replacePlayerWithUuidTo(e, teamUuid, playerUuid);
                    if (e.target.value.length <= 20)
                      changePlayername(e, playerUuid);
                  }}
                  onKeyDown={e => {
                    if ((team.players[team.players.length - 1] === playerUuid) && (e.code === 'Enter' || e.code === 'NumpadEnter'))
                      addPlayerToTeam(teamUuid);
                    if (e.code === 'Delete')
                      removePlayerFromTeam(teamUuid, playerUuid);
                  }}
                />
                <button
                  tabIndex={-1}
                  className='team-player-minus-button'
                  onClick={() => removePlayerFromTeam(teamUuid, playerUuid)}
                ><span>{ '\u2A2F' }</span></button>
              </div>
            )})}
        </div>
      </> : <></>}

      {/* Create teams and assign players */}

      {(currentStep === 1 && doTeams) ? <>
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
            {teams.map((team) => {
              const { uuid: teamUuid, name: teamname, players: teamPlayers } = team;
              return (
              <div key={ teamUuid } className='flex-col team-div team-div-real'>
                <div className='flex-row'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path d="M17.997 18h-11.995l-.002-.623c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209-2.366-4.363-.674-6.838 1.866-6.838 2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zm-22.806 2.214h4.501c-.021-4.906 2.246-2.772 2.246-6.676 0-1.507-.983-2.324-2.248-2.324-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657-1.119.258-1.193.805-1.193 1.751l.002.463z"/></svg>
                  <input
                    className='teamname-input input-box'
                    type='text'
                    value={teamname}
                    onChange={e => {
                      if (e.target.value.length <= 20)
                        changeTeamname(e, teamUuid);
                    }}
                  />
                  <button
                    className='team-minus-button input-box'
                    onClick={() => removeTeam(teamUuid)}
                  ><span>-</span></button>
                </div>
                <div className="grid-team-playernames">
                  {team.players.map(playerUuid => (
                      <div key={ playerUuid } className='player-in-team-div'>
                        <input
                          className='playername-in-team input-box'
                          type="text"
                          value={players[players.findIndex(e => e.uuid === playerUuid)].name}
                          list="namelist"
                          placeholder='Spielername'
                          onChange={e => {
                            if (players.findIndex(v => v.uuid === e.target.value) !== -1)
                              replacePlayerWithUuidTo(e, teamUuid, playerUuid);
                            if (e.target.value.length <= 20)
                              changePlayername(e, playerUuid);
                          }}
                          onKeyDown={e => {
                            if ((team.players[teamPlayers.length - 1] === playerUuid) && (e.code === 'Enter' || e.code === 'NumpadEnter'))
                              addPlayerToTeam(teamUuid);
                            if (e.code === 'Delete')
                              removePlayerFromTeam(teamUuid, playerUuid);
                          }}
                        />
                        <button
                          tabIndex={-1}
                          className='team-player-minus-button'
                          onClick={() => removePlayerFromTeam(teamUuid, playerUuid)}
                        ><span>{ '\u2A2F' }</span></button>
                      </div>
                    ))}
                  <button
                    className='add-button-in-team add-player-to-team-button input-box'
                    onClick={() => addPlayerToTeam(teamUuid)}
                  >{ '\u002B' }</button>
                </div>
              </div>
            )})}
            <datalist id="namelist">
              {[...players.filter((v) => v.team === '')].map(({ uuid, name }) =>
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
                  onClick={() => addTeam()}
                >{ '\u002B' }</button>
              </div>
            </div>
          </div>
        </div>
      </> : <></>}

      {/* Forward and Backword inside the step-form */}

      <div className='steps'>
        {(currentStep === 0) ? <></> :
        <button className='next-step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount}</p>
          <button className='next-step-button' onClick={() => nextStep()}>{(currentStep === (elemsCount - 1)) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
      { elem }
    </div>
  );
}

interface playerType {
  uuid: string,
  name: string,
  team: string,
}

interface teamType {
  uuid: string,
  name: string,
  players: string[],
}

interface newgroupType {
  groupname: string,
  description: string,
  players: playerType[],
  isPublic: boolean,
  teams: teamType[],
  token: string,
}

export default New;
