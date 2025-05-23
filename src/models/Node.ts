import {NextAndPrevious} from "@/models/NextAndPrevious";

export class Node {
  id: number;
  name: string;
  online: boolean;
  ip: string;
  nextAndPrevious: NextAndPrevious

  constructor(id: number, name:string, online:boolean, ip:string, nextAndPrevious: NextAndPrevious) {
    this.id = id;
    this.name = name;
    this.online = online;
    this.ip = ip;
    this.nextAndPrevious = nextAndPrevious;
  }
}
