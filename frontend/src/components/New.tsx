import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


function New() {

  const [currentStep, setCurrentStep] = useState(0)
  const [redirectElem, setRedirectElem] = useState(<></>)
  const [form, setForm] = useState({});
  const [teamname, setTeamname] = useState('');
  const [description, setDescription] = useState('');
  const [ispublic, setIspublic] = useState(false);
  const [playername, setPlayername] = useState('');
  const [players, setPlayers] = useState<{ uuid:string, name:string }[]>([]);
  const [playerlist, setPlayerlist] = useState(<></>)
  const elemsCount = 2
  const teamnameError = 'Bitte Teamnamen eingeben!'
  const playernameError = 'Name bereits vergeben!'

  // (?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])
  function validate(e:string) {
    return e.trim().replace(/[^a-zA-Z\d-_.,\s\u00c4,\u00e4\u00d6,\u00f6\u00dc,\u00fc\u00df]/g, '').replace(/\s+/g, ' ').replace(/[-]+/g, '-').replace(/[_]+/g, '_')
  }
  const addPlayer = () => {

    let playerChecked = validate(playername)

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
  };

  useEffect(() => {
  console.table(form)
  }, [form])

  const nextStep = () => {
    if (currentStep === (elemsCount - 1)){
      setForm({ teamname, description, ispublic , players});
      setTimeout(() => {
        setRedirectElem(<Navigate to='/' />)
      }, 3000)
    } else {
      if (currentStep === 0) {
        if (teamname === '')  {
          console.log('[WARN] teamname empty!')
          setTeamname(teamnameError)
          setTimeout(() => {
            setTeamname('')
          }, 2000)
        } else if (teamname !== teamnameError) {
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
        <button onClick={e => removePlayer(e)}>{'X'}</button>
      </div>
    )) }</>)
  }, [players])

  return (
    <div className='flex-col step-form'>
      <h2>Schritt {currentStep + 1} von {elemsCount}</h2>
      {(currentStep === 0) ?
      <>
        <h1>{(teamname === '' || teamname === teamnameError) ? 'Neues Team erstellen' : validate(teamname)}</h1>
        <div className='grid-1-4'>
          <label>Name des Teams:</label>
          <input
            style={(teamname === teamnameError) ? {color: 'red'} : {}}
            type='text'
            placeholder='Geben Sie einen Teamnamen ein'
            value={teamname}
            onChange={e => setTeamname(e.target.value)}
            />
        </div>
        <div className='flex-col'>
          <label>Beschreibung:</label>
          <textarea
            placeholder='Geben Sie einen Beschreibung ein (optional)'
            value={description}
            onChange={e => setDescription(e.target.value)}
            ></textarea>
        </div>
        <div className='grid-1-4'>
          <label style={{alignSelf: 'start'}}>Typ:</label>
          <div>
            <div className='flex-row left'>
              <input
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
        <h1>Spieler hinzufügen</h1>
        <div className='grid-1-4'>
          <label>Neuer Spieler:</label>
          <div className='flex-row'>
            <input
              style={(playername === playernameError) ? {color: 'red'} : {}}
              type='text'
              placeholder='Geben Sie einen Spielernamen ein'
              value={playername}
              onChange={e => {
                setPlayername(e.target.value)}
              }
              onKeyDown={e => {
                if(e.code === 'Enter' || e.code === 'NumpadEnter')
                  addPlayer()
              }}
              />
              <button className='add-player-button' style={{margin: '1em'}} onClick={() => addPlayer()}>Hinzufügen</button>
          </div>
        </div>
        <div className='flex-row player-list'>
          {playerlist}
          {(playername === '' || playername === playernameError) ? <></> :
          <div key='00000000-0000-0000-0000-000000000000' className='flex-row'>
            <p> { validate(playername)} </p>
          </div> }
        </div>
      </> : <></>}
      <div className='steps'>
        {(currentStep === 0) ? <></> :
        <button className='step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        {/* <p style={{opacity: '0%'}}>{ JSON.stringify(form) }</p> */}
        <button className='step-button' style={{float: 'right'}} onClick={() => nextStep()}>{(currentStep === (elemsCount - 1)) ? 'Team erstellen' : 'Weiter'}</button>
      </div>
      { redirectElem }
    </div> 
  );
}

export default New;