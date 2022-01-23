import { Dispatch, SetStateAction } from "react";

export interface loginContextType {
  isLoggedIn: boolean,
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

export interface playerType {
  uuid: string,
  name: string,
  team: string,
}

export interface teamType {
  uuid: string,
  name: string,
  players: string[],
}

// export interface groupType {
//   groupname: string,
//   description: string,
//   players: playerType[],
//   isPublic: boolean,
//   teams: teamType[],
//   token: string,
// }

export interface groupInfoType {
  groupname: string,
  description: string,
  isPublic: boolean,
}

export interface newgroupType {
  groupname: string,
  description: string,
  players: playerType[],
  isPublic: boolean,
  teams: teamType[],
  token: string,
}

export interface step1Type {
  nextStep: () => Promise<void>,
  groupInfo: groupInfoType,
  setGroupInfo: Dispatch<SetStateAction<groupInfoType>>,
  groupnameAllowInput: boolean,
  doTeams: boolean,
  setDoTeams: Dispatch<SetStateAction<boolean>>
}

export interface step2Type {
  groupInfo: groupInfoType,
  players: playerType[],
  setPlayers: Dispatch<SetStateAction<playerType[]>>,
  teams: teamType[],
  setTeams: Dispatch<SetStateAction<teamType[]>>,
  doTeams: boolean,
  playernameColumns: number,
  setPlayernameColumns: Dispatch<SetStateAction<number>>
}

export interface step3Type {
  elem: JSX.Element,
  players: playerType[],
  setPlayers: Dispatch<SetStateAction<playerType[]>>,
  teams: teamType[],
  setTeams: Dispatch<SetStateAction<teamType[]>>,
  playernameColumns: number,
  setPlayernameColumns: Dispatch<SetStateAction<number>>
}