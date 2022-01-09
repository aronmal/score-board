import { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import loginContext from './Context';
import auth from './Helpers';
import './Newgroup.css';


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
  const [playerlist, setPlayerlist] = useState(<></>)
  const elemsCount = 2
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
      if (res.status === 200) {
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
        <button onClick={e => removePlayer(e)}>{'\u2A2F'}</button>
      </div>
    )) }</>)
  }, [players])


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
          <label style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</label>
          <input
            style={(groupnameInput === groupnameError) ? {color: 'red'} : {}}
            type='text'
            placeholder='Neue Gruppe'
            value={groupnameInput}
            onChange={e => {
              if (e.target.value.length <= 30 && groupnameAllowInput) {
                setGroupnameInput(e.target.value)
                return
              }
              setGroupnameInput(e => e)
            }}
            />
        </div>
        <div className='flex-col'>
          <label style={{marginBottom: '.5em'}}>Beschreibung:</label>
          <textarea
            placeholder='(optional)'
            value={description}
            onChange={e => {
              if (e.target.value.length <= 200) {
                setDescription(e.target.value.replace(/[^a-zA-Z\d-_./()!?,\s\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]/g, ''))}}}
          />
        </div>
        <div className='flex-row'>
          <label style={{alignSelf: 'start', marginRight: '5em'}}>Typ:</label>
          <div className='flex-row'>
            <div className='flex-row left'>
              <input
              className='radio'
              type='radio'
              checked={!isPublic}
              onChange={e => {!e.target.checked ? setIsPublic(e.target.checked) : setIsPublic(!e.target.checked)}}
              onKeyDown={(e) => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                  !e.currentTarget.checked ? setIsPublic(e.currentTarget.checked) : setIsPublic(!e.currentTarget.checked)
                }
              }}
              />
              <label>Privat</label>
            </div>
            <div className='flex-row left'>
              <input
              className='radio'
              type='radio'
              checked={isPublic}
              onChange={e => {e.target.checked ? setIsPublic(e.target.checked) : setIsPublic(!e.target.checked)}}
              onKeyDown={(e) => {
                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                  e.currentTarget.checked ? setIsPublic(e.currentTarget.checked) : setIsPublic(!e.currentTarget.checked)
                }
              }}
              />
              <label>Öffentlich</label>
            </div>
          </div>
        </div>
      </> : <></>}
      {(currentStep === 1) ?
      <>
        <h2>Spieler hinzufügen zu <span style={{borderBottom: '.25rem solid var(--gbs-color)'}}>{ groupname }</span> :</h2>
        <div className="flex-row player-input" style={{justifyContent: 'flex-start'}}>
          <input
            className='add-player-input'
            style={(playernameInput === playernameError) ? {color: 'red', width: '50%'} : {width: '50%'}}
            type='text'
            placeholder='Spielername'
            value={playernameInput}
            onChange={e => {
              if (e.target.value.length <= 30 && playernameAllowInput) {
                setPlayernameInput(e.target.value)
                return
              }
              setPlayernameInput(e => e)
            }}
            onKeyDown={e => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter')
                addPlayer()
            }}
            />
          <button className='add-player-button' onClick={() => addPlayer()}>Hinzufügen</button>
        </div>
        <div className='flex-row player-list'>
          {playerlist}
          {(playername === '') ? <></> :
          <div key='00000000-0000-0000-0000-000000000000' className='flex-row'>
            <p>{ playername }</p>
          </div> }
        </div>
      </> : <></>}
      <div className='steps'>
        {(currentStep === 0) ? <></> :
        <button className='step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount}</p>
          <button className='step-button' onClick={() => nextStep()}>{(currentStep === (elemsCount - 1)) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
      { elem }
    </div> 
  );
}

export default New;