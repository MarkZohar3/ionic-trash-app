import { dateTime } from './dateTime';

export class Trash {
    $key: any;
    descriptionRecorded: string;
    status: string;
    dateRecorded: dateTime;
    userIdRecorded: string; 
    lat: number;
    lng: number;
    dateCleaned: dateTime;
    descriptionCleaned: string;
    userIdCleaned: string;
}