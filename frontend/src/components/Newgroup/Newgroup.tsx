import { useState, useEffect, useContext, CSSProperties } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from '../Context';
import auth from '../Helpers';
import { newgroupType, playerType, teamType } from '../Interfaces';
import { validate } from './Helpers';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export const groupnameError = 'Bitte Name eingeben!'
export const playernameError = 'Name bereits vergeben!'

function New() {

  const { isLoggedIn } = useContext(loginContext);

  const [currentStep, setCurrentStep] = useState(0)
  const [elem, setElem] = useState(<></>)
  
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



const nextStep = async () => {
    if (currentStep === (elemsCount - 1)){
        const token = await auth(setElem)
        if (!token)
        return;
        let newgroupReqBody = { groupname, isPublic , players: players.filter((v) => !!v.name), token } as newgroupType;
        newgroupReqBody.description = (!description) ? 'Keine Beschreibung' : description;
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

        if (!groupname) {
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

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className='flex-col step-form' style={{'--playername-columns': playernameColumns} as CSSProperties}>
          {/* General settings of group to be created  */}
      {(currentStep === 0) ? <Step1 groupname={groupname} groupnameInput={groupnameInput} setGroupnameInput={setGroupnameInput} groupnameAllowInput={groupnameAllowInput} description={description} setDescription={setDescription} isPublic={isPublic} setIsPublic={setIsPublic} doTeams={doTeams} setDoTeams={setDoTeams}/> : <></>}
          {/* Create players or overview created players by 'teams' section */}
      {(((currentStep === 1) && !doTeams) || ((currentStep === 2) && doTeams)) ? <Step2 groupname={groupname} playername={playername} setPlayername={setPlayername} playernameAllowInput={playernameAllowInput} setPlayernameAllowInput={setPlayernameAllowInput} players={players} setPlayers={setPlayers} teams={teams} setTeams={setTeams} doTeams={doTeams} playernameColumns={playernameColumns} setPlayernameColumns={setPlayernameColumns}/> : <></>}
          {/* Create teams and assign players */}
      {(currentStep === 1 && doTeams) ? <Step3 elem={elem} players={players} setPlayers={setPlayers} teams={teams} setTeams={setTeams} playernameColumns={playernameColumns} setPlayernameColumns={setPlayernameColumns} teamIndexCount={teamIndexCount} setTeamIndexCount={setTeamIndexCount}/> : <></>}
          {/* Forward and Backword inside the step-form */}
      <div className='steps'>
        {(currentStep === 0) ? <></> :
        <button className='next-step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount}</p>
          <button className='next-step-button' onClick={() => nextStep()}>{(currentStep === (elemsCount - 1)) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
    </div>
  );
}

export default New;
