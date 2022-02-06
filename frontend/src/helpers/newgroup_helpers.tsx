import { groupType, playerType, teamType } from "../interfaces";

// const teamByUuid = (teams: teamType[], teamUuid: string) => teams[teams.findIndex(i => i.uuid === teamUuid)];

export const validate = (e:string) => e.replace(/[<>]/g, '')

export const teamnameDuplicatesExists = (teams: teamType[], teamname: string) => teams.filter(e => e.name === teamname).length >= 2

export const playernameDuplicatesExists = (players: playerType[], playername: string) => (playername !== '') && (players.filter(e => e.name === playername).length !== 1)

export const teamsDuplicatesExists = (teams: teamType[]) =>  teams.filter(team => teamnameDuplicatesExists(teams, team.name)).length !== 0

export const playersDuplicatesExists = (players: playerType[]) => players.filter(player => playernameDuplicatesExists(players, player.name)).length !== 0

export const playernameOfUuid = (players: playerType[], playerUuid: string) => players[players.findIndex(i => i.uuid === playerUuid)].name

// export const isLastPlayerInTeam = (team: teamType, playerUuid: string) => (team.players[team.players.length - 1] === playerUuid)

export const teamIndexCount = (teams: teamType[]) => teams.map(team => (/^Team [0-9]+$/.test(team.name)) ? (parseInt(/[0-9]+$/.exec(team.name)![0])) : 0)

export const elemsCount = (doTeams: boolean) => doTeams ? 3 : 2

export const initialGroup: groupType = {
  uuid: '',
  name: '',
  description: '',
  isPublic: true,
  doTeams: false,
  players: [],
  teams: [],
}