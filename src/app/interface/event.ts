import { EventType } from '../enum/event.type.enum';

export interface Event {
  id : number;
  type : EventType;
  description : String;
  device : string;
  ipAddress : String;
  createdAt : Date;
}
