import { useState, useContext, CSSProperties } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from '../Context';
import { groupInfoType, playerType, teamType } from '../Interfaces';
import { elemsCount, nextStep } from './Helpers';
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
  const [playernameAllowInput, setPlayernameAllowInput] = useState(true);
  const [groupInfo, setGroupInfo] = useState<groupInfoType>({groupname: '', description: '', isPublic: true})
  const [playername, setPlayername] = useState('');
  const [players, setPlayers] = useState<playerType[]>([]);
  const [teams, setTeams] = useState<teamType[]>([]);
  const [playernameColumns, setPlayernameColumns] = useState(2);
  const [doTeams, setDoTeams] = useState(false);

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className='flex-col step-form' style={{'--playername-columns': playernameColumns} as CSSProperties}>
          {/* General settings of group to be created  */}
      {(currentStep === 0) ? <Step1 nextStep={() => nextStep(currentStep, setElem, doTeams, setGroupInfo, groupInfo, players, teams, setGroupnameAllowInput, groupnameAllowInput, setCurrentStep)} groupInfo={groupInfo} setGroupInfo={setGroupInfo} groupnameAllowInput={groupnameAllowInput} doTeams={doTeams} setDoTeams={setDoTeams}/> : <></>}
          {/* Create players or overview created players by 'teams' section */}
      {(((currentStep === 1) && !doTeams) || ((currentStep === 2) && doTeams)) ? <Step2 groupInfo={groupInfo} playername={playername} setPlayername={setPlayername} playernameAllowInput={playernameAllowInput} setPlayernameAllowInput={setPlayernameAllowInput} players={players} setPlayers={setPlayers} teams={teams} setTeams={setTeams} doTeams={doTeams} playernameColumns={playernameColumns} setPlayernameColumns={setPlayernameColumns}/> : <></>}
          {/* Create teams and assign players */}
      {(currentStep === 1 && doTeams) ? <Step3 elem={elem} players={players} setPlayers={setPlayers} teams={teams} setTeams={setTeams} playernameColumns={playernameColumns} setPlayernameColumns={setPlayernameColumns}/> : <></>}
          {/* Forward and Backword inside the step-form */}
      <div className='steps'>
        {(currentStep === 0) ? <></> :
        <button className='next-step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount(doTeams)}</p>
          <button className='next-step-button' onClick={() => nextStep(currentStep, setElem, doTeams, setGroupInfo, groupInfo, players, teams, setGroupnameAllowInput, groupnameAllowInput, setCurrentStep)}>{(currentStep === (elemsCount(doTeams) - 1)) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
    </div>
  );
}

export default New;
