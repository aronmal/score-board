import { groupType } from "../interfaces";

export default function isGroup(obj: groupType | any): obj is groupType {
    return (obj && obj.uuid && typeof obj.uuid === 'string');
}