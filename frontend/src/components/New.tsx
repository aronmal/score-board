import { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import loginContext from './Context';
import './New.css';


function New() {


  const { data } = useContext(loginContext);
  const [elem, setElem] = useState(<p>You are not logged in!</p>)

  const [currentStep, setCurrentStep] = useState(0)
  const [redirectElem, setRedirectElem] = useState(<></>)
  const [form, setForm] = useState({});
  const [groupname, setGroupname] = useState('');
  const [description, setDescription] = useState('');
  const [ispublic, setIspublic] = useState(false);
  const [playername, setPlayername] = useState('');
  const [players, setPlayers] = useState<{ uuid:string, name:string }[]>([]);
  const [playerlist, setPlayerlist] = useState(<></>)
  const elemsCount = 2
  const groupnameError = 'Bitte Gruppennamen eingeben!'
  const playernameError = 'Name bereits vergeben!'

  // (?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])
  function validate(e:string) {
    return e.trim().replace(/[^a-zA-Z\d-_.,\s\u00c4,\u00e4\u00d6,\u00f6\u00dc,\u00fc\u00df]/g, '').replace(/\s+/g, ' ').replace(/[-]+/g, '-').replace(/[_]+/g, '_')
  }
  const addPlayer = () => {

    let playerChecked = validate(playername)

    if (playerChecked !== '' && playerChecked !== playernameError) {
      if (!players.find((e) => e.name === playerChecked)) {
        setPlayers((prev) => {return [...prev,{uuid: uuidv4(), name: playerChecked}]})
        console.log(`added ${playerChecked}`)
        setPlayername('')
      } else {
        console.log('[WARN] player already exists!')
        setPlayername(playernameError)
        setTimeout(() => {
          setPlayername('')
        }, 2000)
      }
    } else {
      console.log('[WARN] player is not valid!')
    }
  };

  useEffect(() => {
  console.table(form)
  }, [form])

  const nextStep = () => {

    let groupnameChecked = validate(groupname)

    if (currentStep === (elemsCount - 1)){
      setForm({ groupnameChecked, description, ispublic , players});
      setTimeout(() => {
        setRedirectElem(<Navigate to='/' />)
      }, 3000)
    } else {
      if (currentStep === 0) {
        if (groupnameChecked === '')  {
          console.log('[WARN] groupname empty!')
          setGroupname(groupnameError)
          setTimeout(() => {
            setGroupname('')
          }, 2000)
        } else if (groupnameChecked !== groupnameError) {
          setCurrentStep(e => (e + 1))
        }
      } else {
        setCurrentStep(e => (e + 1))
      }
    }
  };

  useEffect(() => {
    const removePlayer = (theButton: any) => {
      let match = players.findIndex((e) => e.name === theButton.target.parentElement.children[0].innerText)
      setPlayers((prev) => {let old = [...prev]; old.splice(match, 1); return old})
    }
    setPlayerlist(<> {players.map(({ uuid, name }) => (
      <div key={uuid} className='flex-row'>
        <p> { name } </p>
        <button onClick={e => removePlayer(e)}>{'\u2A2F'}</button>
      </div>
    )) }</>)
  }, [players])


  if (data.login === false) {

    setTimeout(() => {
      setElem(<Navigate to='/' />)
    }, 2000);

    return (
      <div>
          {elem}
      </div>
    )
  }

  return (
    <div className='flex-col step-form'>
      {(currentStep === 0) ?
      <>
        <h2 style={(groupname === '' || groupname === groupnameError) ? {borderBottom: '.25rem solid var(--gbs-color)'} : {}}>{(groupname === '' || groupname === groupnameError) ? 'Neue Gruppe' : validate(groupname)}</h2>
        <div className='flex-row'>
          <label style={{alignSelf: 'center', marginRight: '1em'}}>Name der Gruppe:</label>
          <input
            style={(groupname === groupnameError) ? {color: 'red'} : {}}
            type='text'
            placeholder='Neue Gruppe'
            value={groupname}
            onChange={e => {
              if (e.target.value.length <= 30) {
                setGroupname(e.target.value)
              } else {
                setGroupname(e => e)
              }
            }}
            />
        </div>
        <div className='flex-col'>
          <label style={{marginBottom: '.5em'}}>Beschreibung:</label>
          <textarea
            placeholder='(optional)'
            value={description}
            onChange={e => setDescription(e.target.value)}
            ></textarea>
        </div>
        <div className='flex-row'>
          <label style={{alignSelf: 'start', marginRight: '5em'}}>Typ:</label>
          <div className='flex-row'>
            <div className='flex-row left'>
              <input
              className='checkbox'
              type='checkbox'
              checked={!ispublic}
              onChange={e => {(e.target.checked===false) ? setIspublic(e.target.checked) : setIspublic(!e.target.checked)}}
              onKeyDown={(e) => {
                if(e.code === 'Enter' || e.code === 'NumpadEnter') {
                  (e.currentTarget.checked===false) ? setIspublic(e.currentTarget.checked) : setIspublic(!e.currentTarget.checked)
                }
              }}
              />
              <label>Privat</label>
            </div>
            <div className='flex-row left'>
              <input
              className='checkbox'
              type='checkbox'
              checked={ispublic}
              onChange={e => {(e.target.checked===true) ? setIspublic(e.target.checked) : setIspublic(!e.target.checked)}}
              onKeyDown={(e) => {
                if(e.code === 'Enter' || e.code === 'NumpadEnter') {
                  (e.currentTarget.checked===true) ? setIspublic(e.currentTarget.checked) : setIspublic(!e.currentTarget.checked)
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
        <h2>Spieler hinzufügen :</h2>
        <div className="flex-row" style={{justifyContent: 'flex-start'}}>
          <input
            className='add-player-input'
            style={(playername === playernameError) ? {color: 'red', width: '50%'} : {width: '50%'}}
            type='text'
            placeholder='Spielername'
            value={playername}
            onChange={e => {
              if (e.target.value.length <= 30) {
                setPlayername(e.target.value)
              } else {
                setPlayername(e => e)
              }
            }}
            onKeyDown={e => {
              if(e.code === 'Enter' || e.code === 'NumpadEnter')
                addPlayer()
            }}
            />
            <button className='add-player-button' onClick={() => addPlayer()}>Hinzufügen</button>
        </div>
        <div className='flex-row player-list'>
          {playerlist}
          {(validate(playername) === '' || validate(playername) === playernameError) ? <></> :
          <div key='00000000-0000-0000-0000-000000000000' className='flex-row'>
            <p> { validate(playername)} </p>
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
      { redirectElem }
    </div> 
  );
}

export default New;