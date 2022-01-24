import { Dispatch, SetStateAction } from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import auth from "../Helpers";
import { groupDispatchType, groupType, newgroupType, nextStepType, playerType, teamType } from "../Interfaces";

export const groupnameError = 'Bitte Name eingeben!'
export const duplicateError = 'Bitte Eingabe überprüfen!'
export const emptyTeamError = 'Teams müssen mindestens einen Spieler haben!'

// const teamByUuid = (teams: teamType[], teamUuid: string) => teams[teams.findIndex(i => i.uuid === teamUuid)];

export const validate = (e:string) => e.replace(/[<>]/g, '')

export const teamnameDuplicatesExists = (teams: teamType[], teamname: string) => teams.filter(e => e.name === teamname).length >= 2

export const playernameDuplicatesExists = (players: playerType[], playername: string) => (playername !== '') && (players.filter(e => e.name === playername).length !== 1)

export const playernameOfUuid = (players: playerType[], playerUuid: string) => players[players.findIndex(i => i.uuid === playerUuid)].name

export const isLastPlayerInTeam = (team: teamType, playerUuid: string) => (team.players[team.players.length - 1] === playerUuid)

export const elemsCount = (doTeams: boolean) => doTeams ? 3 : 2

const teamIndexCount = (teams: teamType[]) => {let numbers: number[] = []; teams.forEach(team => {if (/^Team [0-9]+$/.test(team.name)) numbers.push(parseInt(/[0-9]+$/.exec(team.name)![0]))}); return numbers;}

const teamsDuplicatesExists = (teams: teamType[]) =>  teams.filter(team => teamnameDuplicatesExists(teams, team.name)).length !== 0

const playersDuplicatesExists = (players: playerType[]) => players.filter(player => playernameDuplicatesExists(players, player.name)).length !== 0

export const initialGroup: groupType = {
  groupname: '',
  description: 'Keine Beschreibung',
  isPublic: true,
  doTeams: false,
  players: [],
  teams: [],
}

export const groupReducer = (group: groupType, action: groupDispatchType) => {
  const { players, teams, ..._} = group
  switch (action.type) {

    case 'setGroupname': {
      const { groupname } = action.payload
      if (groupname.length > 30)
        return group;
      const result: groupType = { ...group, groupname }
      return result;
    }

    case 'setDescription': {
      const { description } = action.payload
      if (description.length > 300)
        return group;
      const result: groupType = { ...group, description }
      return result;
    }

    case 'setIsPublic': {
      const { isPublic } = action.payload
      const result: groupType = { ...group, isPublic }
      return result;
    }

    case 'setDoTeams': {
      const { doTeams } = action.payload
      const result: groupType = { ...group, doTeams }
      return result;
    }

    case 'newSinglePlayer': {
      const { playername } = action.payload
      if (playername.length > 30)
        return group;
      const result: groupType = {
        ...group,
        players: [...group.players, {
          uuid: uuidv4(),
          name: playername,
          team: ''
        }]
      }
      return result;
    };
    
    case 'newPlayerInTeam': {
      const { playername, playerUuid, teamUuid } = action.payload
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      const team = teams[teamMatch]
      const result: groupType = {
        ...group,
        players: [...players, {
          uuid: playerUuid,
          name: playername,
          team: teamUuid
        }],
        teams: Object.assign([...teams], {
          [teamMatch]: {
            ...team,
            players: [...team.players, playerUuid]
          }
        })
      }
      return result;
    };
    
    case 'addExistingPlayerToTeam': {
      const { playerUuid, teamUuid } = action.payload
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      const team = teams[teamMatch]
      const result: groupType = {
        ...group,
        teams: Object.assign([...teams], {
          [teamMatch]: {
            ...team,
            players: [...team.players, playerUuid]
          }
        })
      }
      return result;
    };
    
    case 'changePlayername': {
      const { playername, playerUuid } = action.payload
      if (playername.length > 30)
          return group;
      const playerMatch = players.findIndex(i => i.uuid === playerUuid)
      const player = players[playerMatch]
      const result: groupType = {
        ...group,
        players: Object.assign([...players], {
          [playerMatch]: {
            ...player,
            name: playername
          }
        })
      }
      return result;
    };
    
    case 'removePlayer': {
      const { playerUuid, teamUuid } = action.payload
      const playerMatch = players.findIndex(i => i.uuid === playerUuid)
      let result: groupType = {
        ...group,
        players: [...players.filter((_, i) => i !== playerMatch)]
      }
      if (!teamUuid)
        return result;
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      const team = teams[teamMatch]
      result.teams = Object.assign([...teams], {
        [teamMatch]: {
          ...team,
          players: [...team.players.filter(e => e !== playerUuid)]
        }
      })
      return result;
    };
    
    case 'replacePlayerWithUuidTo': {
      const { playerUuid, teamUuid, newPlayerUuid } = action.payload
      const oldPlayerMatch = players.findIndex(i => i.uuid === playerUuid)
      const newPlayerMatch = players.findIndex(i => i.uuid === newPlayerUuid)
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      const team = teams[teamMatch]
      const playerMatchinTeam = team.players.findIndex(i => i === playerUuid)
      let result: groupType = {
        ...group,
        players: Object.assign([...players.filter((_, i) => i !== oldPlayerMatch)], {
          [newPlayerMatch]: {
            ...players[newPlayerMatch],
            team: teamUuid
          }
        }), 
        teams: Object.assign([...teams], {
          [teamMatch]: {
            ...team,
            players: Object.assign([...team.players], {
              [playerMatchinTeam]: newPlayerUuid
            })
          }
        })
      }
      return result;
    };
    
    case 'addTeam': {
      const teamIndex = Math.max(...teamIndexCount(teams), 0) + 1
      let result: groupType = {
        ...group,
        teams: [...teams, {
          uuid: uuidv4(),
          name: `Team ${teamIndex}`,
          players: []
        }]
      }
      return result;
    };

    case 'changeTeamname': {
      const { teamUuid, teamname } = action.payload
      if ((teamname.length > 30) || !validate(teamname))
        return group;
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      const team = teams[teamMatch]
      let result: groupType = {
        ...group,
        teams: Object.assign([...teams], {
          [teamMatch]: {
            ...team,
            name: validate(teamname)
          }
        })
      }
      return result;
    };
    
    case 'removeTeam': {
      const { teamUuid } = action.payload
      const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
      let result: groupType = {
        ...group,
        teams: [...teams.filter((_, i) => i !== teamMatch)]
      }
      return result;
    };

    default:
      return group;
  }
}

export const nextStep = async ({ group, groupDispatch, currentStep, setCurrentStep, setElem }: nextStepType) => {
  if (currentStep === (elemsCount(group.doTeams) - 1)) {
    if (playersDuplicatesExists(group.players)) {
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
    const newgroupReqBody: newgroupType = {
      ...group,
      description: group.description ? group.description : 'Keine Beschreibung',
      token
    };
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

  if (currentStep === 1 && group.doTeams) {
    if (playersDuplicatesExists(group.players) || teamsDuplicatesExists(group.teams)) {
      setElem(<p style={{color: 'red'}}>{ duplicateError }</p>)
      setTimeout(() => {
        setElem(<></>)
      }, 3000)
      return;
    }
    if (group.teams.filter(e => e.players.length === 0).length !== 0) {
      setElem(<p style={{color: 'red'}}>{ emptyTeamError }</p>)
      setTimeout(() => {
        setElem(<></>)
      }, 3000)
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