import { useState, useContext, CSSProperties, useReducer, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { loginContext }  from '../../context';
import { newgroupType } from '../../interfaces';
import groupReducer from '../../helpers/groupReducer';
import { elemsCount, initialGroup, playersDuplicatesExists, teamsDuplicatesExists } from '../../helpers/newgroup_helpers';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import auth from '../../helpers/auth';
import showError from '../../helpers/showError';
import { ss } from '../../helpers/styles';

export const groupnameError = 'Die Gruppe braucht einen Namen ; )'
const playersError = 'Die Gruppe braucht mindestens einen Spieler ; )'
export const duplicateError = 'Bitte Eingabe überprüfen!'
export const emptyTeamError = 'Teams müssen mindestens einen Spieler haben!'

export default function New() {

  const { isLoggedIn } = useContext(loginContext);
  
  const [group, groupDispatch] = useReducer(groupReducer, initialGroup);

  const [playernameColumns, setPlayernameColumns] = useState(2);
  const [currentStep, setCurrentStep] = useState(0);
  const [elem, setElem] = useState(<></>);

  const doTeams = group.doTeams

  useEffect(() => {
    setElem(<></>)
  }, [currentStep])

  async function nextStep() {
    const { groupname, players, teams } = group
    if (currentStep === (elemsCount(doTeams) - 1)) {
      if (players.length === 0) {
        showError(setElem, playersError, 3000)
        return;
      }
      if (playersDuplicatesExists(players)) {
        showError(setElem, duplicateError, 3000)
        return;
      }
      const token = await auth(setElem)
      if (!token)
        return;
      const newgroupReqBody: newgroupType = {
        ...group,
        description: group.description? group.description : 'Keine Beschreibung',
        token,
      };
      const res = await fetch('/api/newgroup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newgroupReqBody),
      }).catch((err: Error) => {
        console.log(err)
        showError(setElem, err.toString(), 5000)
      });
      if (!res)
        return;
      if (res.status === 201)
        setElem(<Navigate to='/dashboard' />)
      else {
        showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
      }
    }
  
    if (currentStep === 1 && doTeams) {
      if (playersDuplicatesExists(players) || teamsDuplicatesExists(teams)) {
        showError(setElem, duplicateError, 3000)
        return;
      }
      if (teams.filter(e => e.players.length === 0).length !== 0) {
        showError(setElem, emptyTeamError, 3000)
        return;
      }
      setCurrentStep(2)
    }

    if (currentStep === 0) {
      if (!groupname) {
        console.log('[WARN] groupname is empty!')
        showError(setElem, groupnameError, 3000)
        return;
      }
      setCurrentStep(1)
    }
  };

  function stepFunction() {
    // General settings of group to be created
    if (currentStep === 0)
      return <Step1 props={{ group, groupDispatch, elem }}/>

    // Create single players or overview created players by the 'teams' section
    if ((currentStep === 1 && doTeams === false) || (currentStep === 2 && doTeams === true))
      return <Step2 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns, elem }}/>

    // Create teams and assign players
    if (currentStep === 1 && doTeams === true)
      return <Step3 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns, elem}}/>
  }

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className={`flex-col ${ss.stepForm}`} style={{'--playername-columns': playernameColumns} as CSSProperties}>
      <div className='relative'>
        { stepFunction() }
      </div>
      <div className={ss.steps}>
        {currentStep === 0 ? <></> :
        <button className={ss.nextStepButton} style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className={ss.stepInfo}>Schritt {currentStep + 1} von {elemsCount(doTeams)}</p>
          <button className={ss.nextStepButton} onClick={() => nextStep()}>{currentStep === (elemsCount(doTeams) - 1) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
    </div>
  );
}
