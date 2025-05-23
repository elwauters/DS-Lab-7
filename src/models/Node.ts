export class Node {
  id: number;
  name: string;
  online: boolean;
  ip: string;
  nextId: string;
  previousId: string;

  constructor(id: number, name:string, online:boolean, ip:string, nextId: string, previousId: string) {
    this.id = id;
    this.name = name;
    this.online = online;
    this.ip = ip;
    this.nextId = nextId;
    this.previousId = previousId;
  }
}
