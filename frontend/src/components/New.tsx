import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'

function New() {

  const [currentStep, setCurrentStep] = useState(0)
  const [redirectElem, setRedirectElem] = useState(<></>)
  const [form, setForm] = useState({});
  const [teamname, setTeamname] = useState('');
  const [teamnamePlaceholder, setTeamnamePlaceholder] = useState('Geben Sie einen Teamnamen ein');
  const [description, setDescription] = useState('');
  const [ispublic, setIspublic] = useState(false);
  const [player, setPlayer] = useState('');
  const [playerPlaceholder, setPlayerPlaceholder] = useState('Geben Sie einen Spielernamen ein');
  const [players, setPlayers] = useState<{ id?:number, name?:string }[]>([]);
  const [playerlist, setPlayerlist] = useState(<></>)
  const elemsCount = 2

  // (?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])

  const addPlayer = () => {
    if (true) {
      if (!players.find((e) => e.name === player)) {
        setPlayers((prev) => {return [...prev,{id: players.length + 1, name: player}]})
        console.log(`added ${player}`)
        setPlayer('')
      } else if (players.find((e) => e.name === player)) {
        console.log('[WARN] player already exists!')
        setPlayerPlaceholder('Spielername bereits vergeben!!!')
        setTimeout(() => {
          setPlayerPlaceholder('Geben Sie einen Spielernamen ein')
        }, 2000)
        setPlayer('')
      } else {
        console.log('[WARN] unknown player name error!')
        setPlayerPlaceholder('Unbekannter Fehler bei Eingabe!!!')
        setTimeout(() => {
          setPlayerPlaceholder('Geben Sie einen Spielernamen ein')
        }, 2000)
        setPlayer('')
      }
    } else if (false)  {
      console.log('[WARN] player not valid!')
      setPlayerPlaceholder('Bitte gültigen Spielernamen eingeben!!!')
      setTimeout(() => {
        setPlayerPlaceholder('Geben Sie einen Spielernamen ein')
      }, 2000)
      setPlayer('')
    } else {
      console.log('[WARN] unknown player name error!')
      setPlayerPlaceholder('Unbekannter Fehler bei Eingabe!!!')
      setTimeout(() => {
        setPlayerPlaceholder('Geben Sie einen Spielernamen ein')
      }, 2000)
      setPlayer('')
    } 
  }

  const handleSubmit = () => {
    if (teamname==='')  {
      console.log('[WARN] teamname empty!')
      setTeamnamePlaceholder('Bitte Teamnamen eingeben!!!')
      setTimeout(() => {
        setTeamnamePlaceholder('Geben Sie einen Teamnamen ein')
      }, 2000)
    } else {
    setForm({ teamname, description, ispublic , players});
    setTimeout(() => {
      setRedirectElem(<Navigate to='/' />)
    }, 3000)
    console.log('[WARN] Alarm!!!')
  }};

  useEffect(() => {
    const removePlayer = (theButton: any) => {
      let match = players.findIndex((e) => e.name === theButton.target.parentElement.children[0].innerText)
      setPlayers((prev) => {let old = [...prev]; old.splice(match, 1); return old})
    }
    setPlayerlist(<> {players.map(({ id, name }) => (
      <div key={id} className='flex-row'>
        <p> {`${name}`} </p>
        <button onClick={e => removePlayer(e)}>{'X'}</button>
      </div>
    )) }</>)
  }, [players])

  return (
    <div className='flex-col new'>
      <h1>Schritt {currentStep + 1} von {elemsCount}</h1>
      {(currentStep === 0) ?
      <>
        <h2>{(teamname==='') ? 'Neues Team erstellen' : teamname}</h2>
        <div className='grid-1-4'>
          <label>Name des Teams:</label>
          <input
            style={(teamnamePlaceholder==='Geben Sie einen Teamnamen ein') ? {} : {color: 'red'}}
            type="text"
            placeholder={teamnamePlaceholder}
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
          <label id='typ'>Typ:</label>
          <div>
            <div className='flex-row left'>
              <input
              type="checkbox"
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
              type="checkbox"
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
        <h2>Spieler hinzufügen</h2>
        <div className='grid-1-4'>
          <label>Neuer Spieler:</label>
          <div className='flex-row'>
            <input
              style={(playerPlaceholder==='Geben Sie einen Spielernamen ein') ? {} : {color: 'red'}}
              type="text"
              placeholder={playerPlaceholder}
              value={player}
              onChange={e => {
                setPlayer(e.target.value)}
              }
              onKeyDown={e => {
                if(e.code === 'Enter' || e.code === 'NumpadEnter')
                  addPlayer()
              }}
              />
              <button style={{margin: '1em'}} onClick={() => addPlayer()}>Hinzufügen</button>
          </div>
        </div>
        <div>
          {playerlist}
        </div>
      </> : <></>}
      <div className='flex-row' style={{justifyContent: 'space-between'}}>
        {(currentStep === 0) ? <></> : <button onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <p>{ JSON.stringify(form) }</p>
        <button onClick={() => (currentStep === (elemsCount - 1)) ? handleSubmit() : setCurrentStep(e => (e + 1))}>{(currentStep === (elemsCount - 1)) ? 'Team erstellen' : 'Weiter'}</button>
      </div>
      { redirectElem }
    </div> 
  );
}

export default New;