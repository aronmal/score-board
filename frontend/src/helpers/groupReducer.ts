import { v4 as uuidv4 } from 'uuid';
import { groupDispatchType, groupType } from "../interfaces";
import { teamIndexCount } from './newgroup_helpers';

export default function groupReducer(group: groupType, action: groupDispatchType) {
    const { players, teams } = group
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
        if ((teamname.length > 30) || !teamname)
          return group;
        const teamMatch = teams.findIndex(i => i.uuid === teamUuid)
        const team = teams[teamMatch]
        let result: groupType = {
          ...group,
          teams: Object.assign([...teams], {
            [teamMatch]: {
              ...team,
              name: teamname
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