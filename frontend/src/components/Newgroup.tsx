import { useEffect, useState, useContext } from 'react';
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
  const [isPublic, setIsPublic] = useState(false);
  const [playernameAllowInput, setPlayernameAllowInput] = useState(true);
  const [playernameInput, setPlayernameInput] = useState('');
  const [playername, setPlayername] = useState('');
  const [players, setPlayers] = useState<{ uuid:string, name:string }[]>([]);
  const [playerlist, setPlayerlist] = useState(<></>);
  const [teams, setTeams] = useState<{ uuid:string, name:string, players: { uuid:string, name:string }[] }[]>([]);
  const [teamlist, setTeamlist] = useState(<></>);
  const [playernameColumns, setPlayernameColumns] = useState(1);
  const elemsCount = 3
  const groupnameError = 'Bitte Name eingeben!'
  const playernameError = 'Name bereits vergeben!'

  function validate(e:string) {
    return e.trim().replace(/[^a-zA-Z\d-_.,!\s\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]/g, '').replace(/\s+/g, ' ').replace(/[-]+/g, '-').replace(/[_]+/g, '_')
  }

  useEffect(() => {
    if (groupnameInput === groupnameError ) {
      setGroupname('')
      return
    }
    setGroupname(validate(groupnameInput))
  }, [groupnameInput])

  useEffect(() => {
    if (playernameInput === playernameError ) {
      setPlayername('')
      return
    }
    setPlayername(validate(playernameInput))
  }, [playernameInput])

  const nextStep = async () => {
    if (currentStep === (elemsCount - 1)){
      const token = await auth(setElem)
      if (!token)
        return;

      const res = await fetch('/api/newgroup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify((description === '' ) ? { groupname, description: 'Keine Beschreibung', isPublic , players, token } : { groupname, description, isPublic , players, token }),
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
      setCurrentStep(e => (e + 1))
    }

    if (currentStep === 1)
      setCurrentStep(e => (e + 1))
  };

  const addPlayer = () => {
    if (!playernameAllowInput)
      return

    if (playername === '') {
      console.log('[WARN] playername is empty!')
      return
    }

    if (!!players.find((e) => e.name === playername)) {
      console.log('[WARN] player already exists!')
      setPlayernameAllowInput(false)
      setPlayernameInput(playernameError)
      setTimeout(() => {
        setPlayernameInput('')
        setPlayernameAllowInput(true)
      }, 2000)
      return
    }
    setPlayers((prev) => {return [...prev,{uuid: uuidv4(), name: playername}]})
    console.log(`added ${playername}`)
    setPlayernameInput('')
  };

  useEffect(() => {
    const removePlayer = (theButton: any) => {
      let match = players.findIndex((e) => e.uuid === theButton.target.parentElement.id)
      setPlayers((prev) => {let old = [...prev]; old.splice(match, 1); return old})
    }
    setPlayerlist(<> {players.map(({ uuid, name }) => (
      <div  id={uuid} key={uuid} className='flex-row'>
        <p>{ name }</p>
        <button className='player-x-button' onClick={e => removePlayer(e)}><span>{'\u2A2F'}</span></button>
      </div>
    )) }</>)
  }, [players])

  const [teamname, setTeamname] =useState('Team 1')
  const addTeam = () => {
    setTeams((prev) => {let old = [...prev]; old.push({ uuid: uuidv4(), name: 'Team 1', players: []}); return old})
  }
  useEffect(() => {
    const removeTeam = (theButton: any) => {
      console.log(theButton.target.parentElement.parentElement.id)
      let match = teams.findIndex((e) => e.uuid === theButton.target.parentElement.parentElement.id)
      console.log(match)
      setTeams((prev) => {let old = [...prev]; old.splice(match, 1); return old})
    }
    const addPlayerToTeam = (theButton: any) => {
      setTeams((prev) => {
        const old = [...prev];
        old.forEach((team) => {
          if (team.uuid === theButton.target.parentElement.parentElement.id) {
            team.players.push({ uuid: uuidv4(), name: 'test'});
          }
        })
        return old;
      })
    }
    setTeamlist(<>
      {teams.map((team) => (
        <div id={ team.uuid } key={ team.uuid } className='flex-col team-div team-div-real'>
          <div className='flex-row'>
            <button className='team-minus-button' onClick={e => removeTeam(e)}><span>-</span></button>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path d="M17.997 18h-11.995l-.002-.623c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209-2.366-4.363-.674-6.838 1.866-6.838 2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zm-22.806 2.214h4.501c-.021-4.906 2.246-2.772 2.246-6.676 0-1.507-.983-2.324-2.248-2.324-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657-1.119.258-1.193.805-1.193 1.751l.002.463z"/></svg>
            <input
              className='teamname-input input-box'
              // style={(playernameInput === playernameError) ? {color: 'red', width: '50%'} : {width: '50%'}}
              type='text'
              // placeholder='Teamname'
              value={teamname}
              onChange={e => {
                if (e.target.value.length <= 20)
                  setTeamname(e.target.value)
                else
                  setTeamname(e => e)
              }}
              />
          </div>
          <div className="grid-team-playernames" style={{ gridTemplateColumns: `repeat(${playernameColumns}, 1fr)` }}>

            {team.players.map((player) => (
              <div id={ player.uuid } key={ player.uuid } className='player-in-team-div'>
                {/* <input className='playername-in-team input-box' type="text" /> */}
                {/* <select className='playername-in-team input-box'>
                  <option value="" disabled selected>Auswählen...</option>
                  {players.map(({ uuid, name}) => (
                      <option key={ uuid } value={ uuid }>{ name }</option>
                    ))}
                </select> */}
                <input className='playername-in-team input-box' type="text" list="namelist" placeholder='Spielername'/>
                <datalist id="namelist">
                  {players.map(({ uuid, name}) => (
                      <option key={ uuid + 'option' } value={ name }>{ name }</option>
                    ))}
                </datalist>
                <button className='team-player-edit-button' onClick={() => console.log('edit')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></svg></button>
                <button className='team-player-minus-button' onClick={() => console.log('minus')}><span>-</span></button>
              </div>
            ))}
            <button className='add-team-button input-box' onClick={e => addPlayerToTeam(e)}>{ '\u002B' }</button>
          </div>
        </div>
      ))}

    {/* {players.map(({ uuid, name }) => (
      {/* <div className="flex-row player-input" style={{justifyContent: 'flex-start'}}>
        <button className='add-player-button' onClick={() => addPlayer()}>{ '\u002B' }</button>
      </div> */
      

      /* <input
        type='text'
        style={(playernameInput === playernameError) ? {color: 'red'} : {}}
        className='teamname-input'
        value={ 'Team 1' }
      /> */}
      </>)
  }, [players,teams,teamname,playernameColumns])

  if (!isLoggedIn) {
    setTimeout(() => {
      setElem(<Navigate to='/' />)
    }, 2000);
    return <div>{elem}</div>
  }

  return (
    <div className='flex-col step-form'>
      {(currentStep === 0) ?
      <>
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
                setGroupnameInput(e.target.value)
              else
                setGroupnameInput(e => e)
            }}
            onKeyDown={e => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter')
                nextStep()
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
                setDescription(e.target.value.replace(/[^a-zA-Z\d-_./()!?,\s\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]/g, ''))
            }}
          />
        </div>
        <div className='flex-row'>
          <p style={{alignSelf: 'start', marginRight: 'auto'}}>Typ:</p>
          <div className='flex-row'>
            <div className='flex-row left'>
              <input
                className='radio'
                type='radio'
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
              <p>Privat</p>
            </div>
            <div className='flex-row left'>
              <input
                className='radio'
                type='radio'
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <p>Öffentlich</p>
            </div>
          </div>
        </div>
      </> : <></>}
      {(currentStep === 2) ?
      <>
        <h2>Spieler hinzufügen zu <span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</span> :</h2>
        {/* <div className="flex-row player-input" style={{justifyContent: 'flex-start'}}>
          <input
            autoFocus
            className='add-player-input input-box'
            style={(playernameInput === playernameError) ? {color: 'red', width: '50%'} : {width: '50%'}}
            type='text'
            placeholder='Spielername'
            value={playernameInput}
            onChange={e => {
              if (e.target.value.length <= 30 && playernameAllowInput)
                setPlayernameInput(e.target.value)
              else
                setPlayernameInput(e => e)
            }}
            onKeyDown={e => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter')
                addPlayer()
            }}
            />
          <button className='add-player-button' onClick={() => addPlayer()}>Hinzufügen</button>
        </div> */}
        <div className='flex-row player-list'>
          {playerlist}
          {(playername === '') ? <></> :
          <div key='00000000-0000-0000-0000-000000000000' className='flex-row'>
            <p>{ playername }</p>
          </div> }
        </div>
      </> : <></>}
      {(currentStep === 1) ?
      <>
        <div className='flex-row'>
          <h2>Teams erstellen:</h2>
          <input
            className='playername-columns-input input-box'
            type='number'
            min='1'
            max='6'
            value={playernameColumns}
            onChange={e => setPlayernameColumns(+e.target.value)}/>
        </div>
        <div className="flex-col team-list">
          { teamlist }
        </div>
        <div className="flex-row team-list">
          <div key='00000000-0000-0000-0000-000000000000' className='flex-col team-div'>
            <div className='flex-row'>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path d="M17.997 18h-11.995l-.002-.623c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209-2.366-4.363-.674-6.838 1.866-6.838 2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zm-22.806 2.214h4.501c-.021-4.906 2.246-2.772 2.246-6.676 0-1.507-.983-2.324-2.248-2.324-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657-1.119.258-1.193.805-1.193 1.751l.002.463z"/></svg>
              <button className='add-team-button input-box' onClick={() => addTeam()}>{ '\u002B' }</button>
            </div>
          </div>
        </div>
      </> : <></>}
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

export default New;