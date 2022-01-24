import { Dispatch, SetStateAction } from "react";

export interface loginContextType {
  isLoggedIn: boolean,
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
};

export interface playerType {
  uuid: string,
  name: string,
  team: string,
};

export interface teamType {
  uuid: string,
  name: string,
  players: string[],
};

export interface groupType {
  groupname: string,
  description: string,
  isPublic: boolean,
  doTeams: boolean,
  players: playerType[],
  teams: teamType[],
};

export interface newgroupType extends groupType {
  token: string
};

type setGroupnameType = { type: 'setGroupname', payload: { groupname: string } };
type setDescriptionType = { type: 'setDescription', payload: { description: string } };
type setIsPublicType = { type: 'setIsPublic', payload: { isPublic: boolean } };
type setDoTeamsType = { type: 'setDoTeams', payload: { doTeams: boolean } };
type newSinglePlayerType = { type: 'newSinglePlayer', payload: { playername: string } };
type newPlayerInTeamType = { type: 'newPlayerInTeam', payload: { playername: string, playerUuid: string, teamUuid: string } };
type addExistingPlayerToTeamType = { type: 'addExistingPlayerToTeam', payload: { playerUuid: string, teamUuid: string } };
type changePlayernameType = { type: 'changePlayername', payload: { playername: string, playerUuid: string } };
type removePlayerType = { type: 'removePlayer', payload: { playerUuid: string, teamUuid?: string } };
type replacePlayerWithUuidToType = { type: 'replacePlayerWithUuidTo', payload: { playerUuid: string, teamUuid: string, newPlayerUuid: string } };
type addTeamType = { type: 'addTeam', payload: null };
type changeTeamnameType = { type: 'changeTeamname', payload: { teamUuid: string, teamname: string } };
type removeTeamType = { type: 'removeTeam', payload: { teamUuid: string } };

export type groupDispatchType = setGroupnameType | setDescriptionType | setIsPublicType | setDoTeamsType | newSinglePlayerType | newPlayerInTeamType | addExistingPlayerToTeamType | changePlayernameType | removePlayerType | replacePlayerWithUuidToType | addTeamType | changeTeamnameType | removeTeamType;

export interface step1Type {
  props: {
    nextStep: () => Promise<void>,
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
  }
};

export interface step2Type {
  props: {
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
    playernameColumns: number,
    setPlayernameColumns: Dispatch<SetStateAction<number>>,
  }
};

export interface step3Type {
  props: {
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
    playernameColumns: number,
    setPlayernameColumns: Dispatch<SetStateAction<number>>,
    elem: JSX.Element,
  }
};

export interface nextStepType {
  group: groupType,
  groupDispatch: Dispatch<groupDispatchType>,
  currentStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  setElem: Dispatch<SetStateAction<JSX.Element>>,
}