import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from 'uuid';
import { playerType, teamType } from "../Interfaces";
import { playernameError } from "./Newgroup";

// const teamByUuid = (teamUuid: string) => teams[teams.findIndex((e) => e.uuid === teamUuid)];

export const validate = (e:string) => e.replace(/[<>]/g, '')
export const checkForTeamnameDuplicates = (teams: teamType[], teamname: string) => (teams.filter(e => e.name === teamname).length >= 2)
export const checkForPlayernameDuplicates = (players: playerType[], playerUuid: string) => (playernameOfUuid(players, playerUuid) !== '') ? (players.filter(e => e.name === playernameOfUuid(players, playerUuid)).length >= 2) : false
export const playernameOfUuid = (players: playerType[], playerUuid: string) => players[players.findIndex(e => e.uuid === playerUuid)].name
export const isLastPlayerInTeam = (team: teamType, playerUuid: string) => (team.players[team.players.length - 1] === playerUuid)

export const addPlayerToTeam = (setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    const playerUuid = uuidv4()
    setPlayers(prev => [...prev, { uuid: playerUuid, name: '', team: teamUuid}])
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => Object.assign([...prev], { [match]: {...prev[match], players: [...prev[match].players, playerUuid]}}))
};

export const changePlayername = (e: ChangeEvent<HTMLInputElement>, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, playerUuid: string) => {
    if (e.target.value.length !<= 20)
        return;
    const match = players.findIndex((e) => e.uuid === playerUuid)
    setPlayers((prev) => Object.assign([...prev], { [match]: {...prev[match], name: validate(e.target.value)}}))
};

export const removePlayerFromTeam = (players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string, playerUuid: string) => {
    if (!!teamUuid) {
        const teamMatch = teams.findIndex((e) => e.uuid === teamUuid)
        setTeams((prev) => Object.assign([...prev], { [teamMatch]: {...prev[teamMatch], players: [...prev[teamMatch].players.filter((v) => v !== playerUuid)]}}))
    }
    const playerMatch = players.findIndex((e) => e.uuid === playerUuid)
    setPlayers((prev) => [...prev.filter((_, i) => i !== playerMatch)])
};

export const replacePlayerWithUuidTo = (e: ChangeEvent<HTMLInputElement>, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string, playerUuid: string) => {
    const oldPlayerMatchinPlayers = players.findIndex(e => e.uuid === playerUuid)
    const newPlayerMatchinPlayers = players.findIndex(v => v.uuid === e.target.value)
    const teamMatch = teams.findIndex(e => e.uuid === teamUuid)
    const playerMatchinTeams = teams[teamMatch].players.findIndex(e => e === playerUuid)
    setTeams(prev => Object.assign([...prev], { [teamMatch]: {...prev[teamMatch], players: Object.assign([...prev[teamMatch].players], { [playerMatchinTeams]: e.target.value})}}))
    setPlayers(prev => Object.assign([...prev.filter((_, i) => i !== oldPlayerMatchinPlayers)], { [newPlayerMatchinPlayers]: {...players[newPlayerMatchinPlayers], team: teamUuid}}))
};

export const addTeam = (setPlayers: Dispatch<SetStateAction<playerType[]>>, setTeams: Dispatch<SetStateAction<teamType[]>>, teamIndexCount: number, setTeamIndexCount: Dispatch<SetStateAction<number>>) => {
    const teamUuid = uuidv4()
    const playerUuid = uuidv4()
    setPlayers(prev => [...prev, { uuid: playerUuid, name: '', team: teamUuid}])
    setTeams((prev) => [...prev,{ uuid: teamUuid, name: `Team ${teamIndexCount}`, players: [playerUuid]}])
    setTeamIndexCount(e => e + 1);
};

export const changeTeamname = (e: ChangeEvent<HTMLInputElement>, teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    if (e.target.value.length !<= 20 || (e.target.value === ''))
        return;
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => Object.assign([...prev], { [match]: {...prev[match], name: validate(e.target.value)}}))
};

export const removeTeam = (teams: teamType[], setTeams: Dispatch<SetStateAction<teamType[]>>, teamUuid: string) => {
    const match = teams.findIndex((e) => e.uuid === teamUuid)
    setTeams((prev) => [...prev.filter((_, i) => i !== match)])
};


export const addSinglePlayer = (playernameAllowInput: boolean, setPlayernameAllowInput: Dispatch<SetStateAction<boolean>>, playername: string, setPlayername: Dispatch<SetStateAction<string>>, players: playerType[], setPlayers: Dispatch<SetStateAction<playerType[]>>) => {
    if (!playernameAllowInput)
        return

    if (!playername) {
        console.log('[WARN] playername is empty!')
        return
    }

    if (!!players.find((e) => e.name === playername)) {
        console.log('[WARN] player already exists!')
        setPlayernameAllowInput(false)
        setPlayername(playernameError)
        setTimeout(() => {
        setPlayername('')
        setPlayernameAllowInput(true)
        }, 2000)
        return
    }
    setPlayers((prev) => [...prev,{uuid: uuidv4(), name: playername, team: ''}])
    console.log(`added ${playername}`)
    setPlayername('')
};