import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'

function New() {

  const [form, setForm] = useState({});
  const [teamname, setTeamname] = useState('');
  const [teamnamePlaceholder, setTeamnamePlaceholder] = useState('Geben Sie einen Teamnamen ein');
  const [description, setDescription] = useState('');
  const [ispublic, setIspublic] = useState(false);
  const [player, setPlayer] = useState('');
  const [playerPlaceholder, setPlayerPlaceholder] = useState('Geben Sie einen Spielernamen ein');
  const [players, setPlayers] = useState([{id: 0}]);
  const [playerlist, setPlayerlist] = useState(<></>)
  
  // interface players {
  //   array: {
  //     id : number,
  //     name : string
  //   }
  // }

  const addPlayer = () => {
    if (player==='')  {
      console.log('[WARN] player empty!')
      setPlayerPlaceholder('Bitte Spielernamen eingeben!!!')
      setTimeout(() => {
        setPlayerPlaceholder('Geben Sie einen Spielernamen ein')
      }, 2000)
    } else {
      if (players[0].id !== 0) {
        setPlayers((prev) => {return [...prev,{id: players.length + 1, name: player}]})
      } else {
        setPlayers(() => {return [{id: 1, name: player}]})
      }
      console.log(`added ${player}`)
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
  }};
  const preventReload = (e: any) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (players[0].id !== 0) {
      setPlayerlist(<> {players.map(({ id, name }: { id?:number, name?:string }) => (
        <div key={id} className='flex-row'>
          <p> {`${name}`} </p>
          <button>{'X'}</button>
        </div>
      )) }</>)
    } else {
      setPlayerlist(<></>)
    }
  }, [players])

  useEffect(() => {
    console.log(form);
  }, [form])

  return (
    <div className='flex-col new'>
      {/* <Link to='/'>
        <div className='flex-row card'>
          <p>Back to Home</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className='svg-symbol' d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link> */}
      <h2>Neues Team erstellen</h2>
      <form onSubmit={e => preventReload(e)}>
        <fieldset>
          <legend>{(teamname==='') ? 'Neues Team' : teamname}</legend>
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
                />
                <label>Privat</label>
              </div>
              <div className='flex-row left'>
                <input
                type="checkbox"
                checked={ispublic}
                onChange={e => {(e.target.checked===true) ? setIspublic(e.target.checked) : setIspublic(!e.target.checked)}}
                />
                <label>Öffentlich</label>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Spieler</legend>
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
                />
                <button style={{margin: '1em'}} onClick={() => addPlayer()}>Hinzufügen</button>
            </div>
          </div>
          <div>
            {playerlist}
          </div>
        </fieldset>
        <button onClick={() => handleSubmit()}>Team erstellen</button>
        <p>{ teamname }</p>
        <p>{ description }</p>
        <p>{ JSON.stringify(ispublic) }</p>
        <p>{ player }</p>
        <p>{ JSON.stringify(players) }</p>
        <p>{ JSON.stringify(form) }</p>
      </form>
    </div> 
  );
}

export default New;