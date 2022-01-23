import { Dispatch, SetStateAction } from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import auth from "../Helpers";
import { groupInfoType, newgroupType, playerType, teamType } from "../Interfaces";

export const groupnameError = 'Bitte Name eingeben!'
export const duplicateError = 'Bitte Eingabe überprüfen!'
export const emptyTeamError = 'Teams müssen mindestens einen Spieler haben!'

// const teamByUuid = (teams: teamType[], teamUuid: string) => teams[teams.findIndex(i => i.uuid === teamUuid)];

export const validate = (e:string) => e.replace(/[<>]/g, '')

export const teamnameDuplicatesExists = (teams: teamType[], teamname: string) => teams.filter(e => e.name === teamname).length >= 2

export const playernameDuplicatesExists = (players: playerType[], playername: string) => (playername !== '') && (players.filter(e => e.name === playername).length !== 1)

export const teamsDuplicatesExists = (teams: teamType[]) =>  teams.filter(team => teamnameDuplicatesExists(teams, team.name)).length !== 0

export const playersDuplicatesExists = (players: playerType[]) => players.filter(player => playernameDuplicatesExists(players, player.name)).length !== 0

export const playernameOfUuid = (players: playerType[], playerUuid: string) => players[players.findIndex(i => i.uuid === playerUuid)].name

export const isLastPlayerInTeam = (team: teamType, playerUuid: string) => (team.players[team.players.length - 1] === playerUuid)

export const teamIndexCount = (teams: teamType[]) => {let numbers: number[] = []; teams.forEach(team => {if (/^Team [0-9]+$/.test(team.name)) numbers.push(parseInt(/[0-9]+$/.exec(team.name)![0]))}); return numbers;}

export const elemsCount = (doTeams: boolean) => doTeams ? 3 : 2

export const setGroupname = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, groupnameAllowInput: boolean, groupname: string) => (groupname.length <= 30 && groupnameAllowInput) && setGroupInfo(e => ({...e, groupname}))

export const setDescription = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, description: string) => (description.length <= 300) && setGroupInfo(e => ({...e, description}))

export const setIsPublic = (setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, isPublic: boolean) => setGroupInfo(e => ({...e, isPublic}))

export const addNewPlayer = (setPlayers: Dispatch<SetStateAction<playerType[]>>, playername: string) => {
  if (playername.length > 30)
    return;
  setPlayers(e => [...e,{
    uuid: uuidv4(),
    name: playername,
    team: ''
  }])
};

export const addNewPlayerToTeam = (setPlayers: Dispatch<SetStateAction<playerType[]>>, setTeams: Dispatch<SetStateAction<teamType[]>>, playername: string, playerUuid: string, teamUuid: string) => {
  setPlayers(e => [...e, {
    uuid: playerUuid,
    name: playername,
    team: teamUuid
  }])
  setTeams(e => {
    const match = e.findIndex(i => i.uuid === teamUuid)
    return Object.assign([...e], {
      [match]: {
        ...e[match],
        players: [...e[match].players, playerUuid]
      }
    })
  })
};

export const addPlayerWithUuidToTeam = (setTeams: Dispatch<SetStateAction<teamType[]>>, playerUuid: string, teamUuid: string) => {
  setTeams(e => {
    const match = e.findIndex(i => i.uuid === teamUuid)
    return Object.assign([...e], {
      [match]: {
        ...e[match],
        players: [...e[match].players, playerUuid]
      }
    })
  })
};

export const changePlayername = (setPlayers: Dispatch<SetStateAction<playerType[]>>, playername: string, playerUuid: string) => {
  if (playername.length > 30)
      return;
  setPlayers(e => {
    const match = e.findIndex(i => i.uuid === playerUuid)
    return Object.assign([...e], {
      [match]: {
        ...e[match],
        name: validate(playername)
      }
    })
  })
};

export const removePlayer = (setPlayers: Dispatch<SetStateAction<playerType[]>>, setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string, playerUuid: string) => {
    setPlayers(e => {
      const match = e.findIndex(i => i.uuid === playerUuid)
      return [...e.filter((_, i) => i !== match)];
    })
    if (!teamUuid)
      return;
    setTeams(e => {
      const match = e.findIndex(i => i.uuid === teamUuid)
      return Object.assign([...e], {
        [match]: {
          ...e[match],
          players: [...e[match].players.filter(e => e !== playerUuid)]
        }
      })
    })
};

export const replacePlayerWithUuidTo = (setPlayers: Dispatch<SetStateAction<playerType[]>>, setTeams: Dispatch<SetStateAction<teamType[]>>, playerUuid: string, teamUuid: string, newPlayerUuid: string) => {
    setTeams(e => {
      const teamMatch = e.findIndex(i => i.uuid === teamUuid)
      const playerMatchinTeams = e[teamMatch].players.findIndex(i => i === playerUuid)
      return Object.assign([...e], {
        [teamMatch]: {
          ...e[teamMatch],
          players: Object.assign([...e[teamMatch].players], {
            [playerMatchinTeams]: newPlayerUuid
          })
        }
      })
    })
    setPlayers(e => {
      const oldPlayerMatchinPlayers = e.findIndex(i => i.uuid === playerUuid)
      const newPlayerMatchinPlayers = e.findIndex(i => i.uuid === newPlayerUuid)
      return Object.assign([...e.filter((_, i) => i !== oldPlayerMatchinPlayers)], {
        [newPlayerMatchinPlayers]: {
          ...e[newPlayerMatchinPlayers],
          team: teamUuid
        }
      })
    })
};

export const addTeam = (setTeams: Dispatch<SetStateAction<teamType[]>>) => {
    setTeams(e => {
      const teamIndex = Math.max(...teamIndexCount(e), 0) + 1
      return [...e,{
        uuid: uuidv4(),
        name: `Team ${teamIndex}`,
        players: []
      }]
    })
};

export const changeTeamname = (setTeams: Dispatch<SetStateAction<teamType[]>>, teamname: string, teamUuid: string) => {
    if ((teamname.length > 30) || (validate(teamname) === ''))
        return;
    setTeams(e => {
      const match = e.findIndex(i => i.uuid === teamUuid)
      return Object.assign([...e], {
        [match]: {
          ...e[match],
          name: validate(teamname)
        }
      })
    })
};

export const removeTeam = (setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    setTeams(e => {
      const match = e.findIndex(i => i.uuid === teamUuid)
      return [...e.filter((_, i) => i !== match)]
    })
};

export const nextStep = async (currentStep: number, setElem: Dispatch<SetStateAction<JSX.Element>>, doTeams: boolean, setGroupInfo: Dispatch<SetStateAction<groupInfoType>>, groupInfo: groupInfoType, players: playerType[], teams: teamType[], setGroupnameAllowInput: Dispatch<SetStateAction<boolean>>, groupnameAllowInput: boolean, setCurrentStep: Dispatch<SetStateAction<number>>) => {
    if (currentStep === (elemsCount(doTeams) - 1)) {
      if (playersDuplicatesExists(players)) {
        setElem(<p style={{color: 'red'}}>{ duplicateError }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 3000)
        return;
      }
      const token = await auth(setElem)
      if (!token) {
        setElem(<p style={{color: 'red'}}>{ 'Keine Internetverbindung!' }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 5000)
        return;
      }
      let newgroupReqBody = {
        ...groupInfo,
        description: groupInfo.description ? groupInfo.description : 'Keine Beschreibung',
        players,
        teams: doTeams ? teams : [],
        token
      } as newgroupType;
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
      if (res.status === 201)
        setElem(<Navigate to='/dashboard' />)
      else {
        setElem(<p style={{color: 'red'}}>{ 'Error ' + res.status + ' ' + res.statusText }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 5000)
      }
    }

    if (currentStep === 1 && doTeams) {
      if (playersDuplicatesExists(players) || teamsDuplicatesExists(teams)) {
        setElem(<p style={{color: 'red'}}>{ duplicateError }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 3000)
        return;
      }
      if (teams.filter(e => e.players.length === 0).length !== 0) {
        setElem(<p style={{color: 'red'}}>{ emptyTeamError }</p>)
        setTimeout(() => {
          setElem(<></>)
        }, 3000)
        return;
      }
      setCurrentStep(2)
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
  };