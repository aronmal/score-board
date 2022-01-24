import { useState, useContext, CSSProperties, useReducer } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from '../Context';
import { elemsCount, groupReducer, initialGroup, nextStep } from './Helpers';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

function New() {

  const { isLoggedIn } = useContext(loginContext);
  
  const [group, groupDispatch] = useReducer(groupReducer, initialGroup);

  const [playernameColumns, setPlayernameColumns] = useState(2);
  const [currentStep, setCurrentStep] = useState(0);
  const [elem, setElem] = useState(<></>);

  const doTeams = group.doTeams

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <div className='flex-col step-form' style={{'--playername-columns': playernameColumns} as CSSProperties}>
          {/* General settings of group to be created  */}
      {currentStep === 0 ? <Step1 props={{ nextStep: () => nextStep({ group, groupDispatch, currentStep, setCurrentStep, setElem }), group, groupDispatch }}/> : <></>}
          {/* Create players or overview created players by 'teams' section */}
      {((currentStep === 1) && !doTeams) || (currentStep === 2 && doTeams) ? <Step2 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns }}/> : <></>}
          {/* Create teams and assign players */}
      {(currentStep === 1) && doTeams ? <Step3 props={{ group, groupDispatch, playernameColumns, setPlayernameColumns, elem}}/> : <></>}
          {/* Forward and Backword inside the step-form */}
      <div className='steps'>
        {currentStep === 0 ? <></> :
        <button className='next-step-button' style={{float: 'left'}} onClick={() => setCurrentStep(e => (e - 1))}>Zurück</button>}
        <div className='flex-row' style={{float: 'right'}}>
          <p className='step-info'>Schritt {currentStep + 1} von {elemsCount(doTeams)}</p>
          <button className='next-step-button' onClick={() => nextStep({ group, groupDispatch, currentStep, setCurrentStep, setElem })}>{currentStep === (elemsCount(doTeams) - 1) ? 'Gruppe erstellen' : 'Weiter \u279C'}</button>
        </div>
      </div>
    </div>
  );
}

export default New;
