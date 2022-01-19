import { Dispatch, SetStateAction } from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import auth from "../Helpers";
import { groupInfoType, newgroupType, playerType, teamType } from "../Interfaces";
import { groupnameError, playernameError } from "./Newgroup";

// const teamByUuid = (teams: teamType[], teamUuid: string) => teams[teams.findIndex(e => e.uuid === teamUuid)];

export const validate = (e:string) => e.replace(/[<>]/g, '')
export const checkForTeamnameDuplicates = (teams: teamType[], teamname: string) => (teams.filter(e => e.name === teamname).length >= 2)
export const checkForPlayernameDuplicates = (players: playerType[], playerUuid: string) => (playernameOfUuid(players, playerUuid) !== '') ? (players.filter(e => e.name === playernameOfUuid(players, playerUuid)).length >= 2) : false
export const playernameOfUuid = (players: playerType[], playerUuid: string) => players[players.findIndex(e => e.uuid === playerUuid)].name
export const isLastPlayerInTeam = (team: teamType, playerUuid: string) => (team.players[team.players.length - 1] === playerUuid)
export const teamIndexCount = (teams: teamType[]) => {let numbers: number[] = []; teams.forEach(team => {if (/^Team [0-9]+$/.test(team.name)) numbers.push(parseInt(/[0-9]+$/.exec(team.name)![0]))}); return numbers;}
export const elemsCount = (doTeams: boolean) => (doTeams) ? 3 : 2

export const setGroupname = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, groupnameAllowInput: boolean, groupname: string) => {
    if (groupname.length > 30 && groupnameAllowInput)
        return;
    setGroupInfo(e => ({...e, groupname}))
};

export const setDescription = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, description: string) => {
    if (description.length > 200)
        return;
    setGroupInfo(e => ({...e, description}))
};

export const setIsPublic = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, isPublic: boolean) => {
    setGroupInfo(e => ({...e, isPublic}))
};

export const addPlayerToTeam = (setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    const playerUuid = uuidv4()
    setPlayers(e => [...e, { uuid: playerUuid, name: '', team: teamUuid}])
    const match = teams.findIndex(e => e.uuid === teamUuid)
    setTeams((e) => Object.assign([...e], { [match]: {...e[match], players: [...e[match].players, playerUuid]}}))
};

export const changePlayername = (players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, playername: string, playerUuid: string) => {
    if (playername.length > 20)
        return;
    const match = players.findIndex(e => e.uuid === playerUuid)
    setPlayers((e) => Object.assign([...e], { [match]: {...e[match], name: validate(playername)}}))
};

export const removePlayerFromTeam = (players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string, playerUuid: string) => {
    const teamMatch = teams.findIndex(e => e.uuid === teamUuid)
    setTeams(e => Object.assign([...e], { [teamMatch]: {...e[teamMatch], players: [...e[teamMatch].players.filter(e => e !== playerUuid)]}}))
    const playerMatch = players.findIndex(e => e.uuid === playerUuid)
    setPlayers(e => [...e.filter((_, i) => i !== playerMatch)])
};

export const replacePlayerWithUuidTo = (players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string, playerUuid: string, newPlayerUuid: string) => {
    const teamMatch = teams.findIndex(e => e.uuid === teamUuid)
    const playerMatchinTeams = teams[teamMatch].players.findIndex(e => e === playerUuid)
    setTeams(e => Object.assign([...e], { [teamMatch]: {...e[teamMatch], players: Object.assign([...e[teamMatch].players], { [playerMatchinTeams]: newPlayerUuid})}}))
    const oldPlayerMatchinPlayers = players.findIndex(e => e.uuid === playerUuid)
    const newPlayerMatchinPlayers = players.findIndex(e => e.uuid === newPlayerUuid)
    setPlayers(e => Object.assign([...e.filter((_, i) => i !== oldPlayerMatchinPlayers)], { [newPlayerMatchinPlayers]: {...players[newPlayerMatchinPlayers], team: teamUuid}}))
};

export const addTeam = (setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>) => {
    const teamUuid = uuidv4()
    const playerUuid = uuidv4()
    setPlayers(e => [...e, { uuid: playerUuid, name: '', team: teamUuid}])
    const teamIndex = Math.max(...teamIndexCount(teams), 0) + 1
    const newTeamname = `Team ${teamIndex}`
    setTeams((e) => [...e,{ uuid: teamUuid, name: newTeamname, players: [playerUuid]}])
};

export const changeTeamname = (teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamname: string, teamUuid: string) => {
    if ((teamname.length > 20) || (validate(teamname) === ''))
        return;
    const match = teams.findIndex(e => e.uuid === teamUuid)
    setTeams((e) => Object.assign([...e], { [match]: {...e[match], name: validate(teamname)}}))
};

export const removeTeam = (teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    const match = teams.findIndex(e => e.uuid === teamUuid)
    setTeams((e) => [...e.filter((_, i) => i !== match)])
};


export const addSinglePlayer = (playernameAllowInput: boolean, setPlayernameAllowInput: Dispatch<SetStateAction<boolean>>, playername: string, setPlayername: Dispatch<SetStateAction<string>>, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>) => {
    if (!playernameAllowInput || !playername)
        return;

    if (!!players.find(e => e.name === playername)) {
        console.log('[WARN] player already exists!')
        setPlayernameAllowInput(false)
        setPlayername(playernameError)
        setTimeout(() => {
        setPlayername('')
        setPlayernameAllowInput(true)
        }, 2000)
        return
    }
    setPlayers((e) => [...e,{uuid: uuidv4(), name: playername, team: ''}])
    console.log(`added ${playername}`)
    setPlayername('')
};


export const nextStep = async (currentStep: number, setElem: Dispatch<SetStateAction<JSX.Element>>, doTeams: boolean, setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, groupInfo: groupInfoType, players: playerType[], teams: teamType[], setGroupnameAllowInput: Dispatch<SetStateAction<boolean>>, groupnameAllowInput: boolean, setCurrentStep: Dispatch<SetStateAction<number>>) => {
    if (currentStep === (elemsCount(doTeams) - 1)){
      const token = await auth(setElem)
      if (!token) {
        setElem(<p style={{color: 'red'}}>{ 'Keine Internetverbindung!' }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 5000)
        return;
      }
      let newgroupReqBody = { ...groupInfo, players: players.filter(e => !!e.name), token } as newgroupType;
      if (!newgroupReqBody.description) newgroupReqBody.description = 'Keine Beschreibung';
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
        return;
      if (!groupInfo.groupname) {
        console.log('[WARN] groupname is empty!')
        setGroupnameAllowInput(false)
        setGroupname(setGroupInfo, groupnameAllowInput, groupnameError)
        setTimeout(() => {
            setGroupname(setGroupInfo, groupnameAllowInput, '')
          setGroupnameAllowInput(true)
        }, 2000)
        return;
      }
      setCurrentStep(1)
    }

    if (currentStep === 1 && doTeams)
      setCurrentStep(2)
  };