import { Dispatch, SetStateAction } from "react";

export interface loginContextType {
  isLoggedIn: boolean,
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

export interface newgroupContextType {
  elem: JSX.Element,
  setElem: Dispatch<SetStateAction<JSX.Element>>,
  players: playerType[],
  setPlayers: Dispatch<SetStateAction<playerType[]>>,
  teams: teamType[],
  setTeams: Dispatch<SetStateAction<teamType[]>>,
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

export interface newgroupType {
  groupname: string,
  description: string,
  players: playerType[],
  isPublic: boolean,
  teams: teamType[],
  token: string,
}