import { Dispatch, SetStateAction } from "react";

export interface loginContextType {
  isLoggedIn: boolean,
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
};

export type userType = {
    uuid: string,
    username: string,
    email: string,
    groups: groupType[],
    templates: groupType[],
};

export type userDataType = {
  uuid: string;
  username: string;
  email: string;
  groups: {
      uuid: string;
      name: string;
      doTeams: boolean;
      playerCount: number;
      teamCount: number;
  }[];
};

export type playerType = {
  uuid: string,
  name: string,
  team: string,
};

export type teamType = {
  uuid: string,
  name: string,
  players: string[],
};

export type groupType = {
  uuid: string,
  name: string,
  description: string,
  isPublic: boolean,
  doTeams: boolean,
  players: playerType[],
  teams: teamType[],
};

export type newgroupType = groupType & { token: string };

type setGroupnameType = { type: 'setGroupname', payload: { name: string } };
type setDescriptionType = { type: 'setDescription', payload: { description: string } };
type setIsPublicType = { type: 'setIsPublic', payload: { isPublic: boolean } };
type setDoTeamsType = { type: 'setDoTeams', payload: { doTeams: boolean } };
type newSinglePlayerType = { type: 'newSinglePlayer', payload: { playername: string } };
type newPlayerInTeamType = { type: 'newPlayerInTeam', payload: { playername: string, playerUuid: string, teamUuid: string } };
type addExistingPlayerToTeamType = { type: 'addExistingPlayerToTeam', payload: { playerUuid: string, teamUuid: string } };
type changePlayernameType = { type: 'changePlayername', payload: { playername: string, playerUuid: string } };
type removePlayerType = { type: 'removePlayer', payload: { playerUuid: string, teamUuid: string } };
type replacePlayerWithUuidToType = { type: 'replacePlayerWithUuidTo', payload: { playerUuid: string, teamUuid: string, newPlayerUuid: string } };
type addTeamType = { type: 'addTeam', payload: null };
type changeTeamnameType = { type: 'changeTeamname', payload: { teamUuid: string, teamname: string } };
type removeTeamType = { type: 'removeTeam', payload: { teamUuid: string } };

export type groupDispatchType = setGroupnameType | setDescriptionType | setIsPublicType | setDoTeamsType | newSinglePlayerType | newPlayerInTeamType | addExistingPlayerToTeamType | changePlayernameType | removePlayerType | replacePlayerWithUuidToType | addTeamType | changeTeamnameType | removeTeamType;

export type step1Type = {
  props: {
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
    elem: JSX.Element,
  }
};

export type step2Type = {
  props: {
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
    playernameColumns: number,
    setPlayernameColumns: Dispatch<SetStateAction<number>>,
    elem: JSX.Element,
  }
};

export type step3Type = {
  props: {
    group: groupType,
    groupDispatch: Dispatch<groupDispatchType>,
    playernameColumns: number,
    setPlayernameColumns: Dispatch<SetStateAction<number>>,
    elem: JSX.Element,
  }
};

export type nextStepType = {
  group: groupType,
  groupDispatch: Dispatch<groupDispatchType>,
  currentStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  setElem: Dispatch<SetStateAction<JSX.Element>>,
}

export type stepFormStyleType = {
  gridSplit: string,
  gridTeamPlayernames: string,
  gridRadios: string,
  playernameColumnsInput: string,
  stepForm: string,
  inputBox: string,
  radio: string,
  addPlayerButton: string,
  playerInput: string,
  teamContent: string,
  teamListSample: string,
  teamDiv: string,
  teamDivReal: string,
  addButtonInTeam: string,
  addTeamButton: string,
  teamnameInput: string,
  errorInput: string,
  playernameInTeam: string,
  teamMinusButton: string,
  teamPlayerMinusButton: string,
  playerInTeamDiv: string,
  errorP: string,
  steps: string,
  nextStepButton: string,
  stepInfo: string,
}

export type appStyleType = {
  flexRow: string,
  flexRowJustify: string,
  flexCol: string,
  relative: string,
  logoA: string,
  active: string,
  card: string,
  teamListSample: string,
  teamDiv: string,
  cardA: string,
  navlink: string,
  content: string,
  contentDiv: string,
  link: string,
  banner: string,
  topHeader: string,
  logoIcon: string,
  time: string,
  logoP: string,
  theFooter: string,
  secret: string,
}