import { useState, useContext, CSSProperties, useReducer } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from '../Context';
import { auth, showError } from '../Helpers';
import { newgroupType } from '../Interfaces';
import { elemsCount, groupReducer, initialGroup, playersDuplicatesExists, teamsDuplicatesExists } from './Helpers';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export const groupnameError = 'Bitte Name eingeben!'
export const duplicateError = 'Bitte Eingabe überprüfen!'
export const emptyTeamError = 'Teams müssen mindestens einen Spieler haben!'

function New() {

  const { isLoggedIn } = useContext(loginContext);
  
  const [group, groupDispatch] = useReducer(groupReducer, initialGroup);

  const [playernameColumns, setPlayernameColumns] = useState(2);
  const [currentStep, setCurrentStep] = useState(0);
  const [elem, setElem] = useState(<></>);

  const doTeams = group.doTeams

  async function nextStep() {
    if (currentStep === (elemsCount(group.doTeams) - 1)) {
      if (playersDuplicatesExists(group.players)) {
        showError(setElem, duplicateError, 3000)
        return;
      }
      const token = await auth(setElem)
      if (!token) {
        return;
      }
      const newgroupReqBody: newgroupType = {
        ...group,
        token
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
  
    if (currentStep === 1 && group.doTeams) {
      if (playersDuplicatesExists(group.players) || teamsDuplicatesExists(group.teams)) {
        showError(setElem, duplicateError, 3000)
        return;
      }
      if (group.teams.filter(e => e.players.length === 0).length !== 0) {
        showError(setElem, emptyTeamError, 3000)
        return;
      }
      setCurrentStep(2)
    }

    if (currentStep === 0) {
      if (!group.groupname) {
        console.log('[WARN] groupname is empty!')
        groupDispatch({ type: 'setGroupname', payload: { groupname: groupnameError }})
        setTimeout(() => {
          groupDispatch({ type: 'setGroupname', payload: { groupname: '' }})
        }, 2000)
        return;
      }
      setCurrentStep(1)
    }
  };

  const stepFunction = () => {
    switch ({currentStep, doTeams }) {
      // General settings of group to be created
      default:
        return <Step1 props={{ group, groupDispatch }}/>

      // Create single players or overview created players by the 'teams' section
      case { currentStep: 1, doTeams: false } || { currentStep: 2, doTeams: true }:
        return <Step2 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns }}/>

      // Create teams and assign players
      case { currentStep: 1, doTeams: true }:
        return <Step3 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns, elem}}/>
    }
  }

  // if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className='flex-col step-form' style={{'--playername-columns': playernameColumns} as CSSProperties}>
      { stepFunction() }
      <div className='steps'>
        {currentStep === 0 ? <></> :
        <button className='next-step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount(doTeams)}</p>
          <button className='next-step-button' onClick={() => nextStep()}>{currentStep === (elemsCount(doTeams) - 1) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
    </div>
  );
}

export default New;
