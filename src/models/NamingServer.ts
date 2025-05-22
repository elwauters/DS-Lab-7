export class NamingServer {
  id: number;
  name: string;
  online: boolean;
  numberOfNodes: number;
  ip: string;

  constructor(id: number, name:string, online:boolean, numberOfNodes:number, ip:string) {
    this.id = id;
    this.name = name;
    this.online = online;
    this.numberOfNodes = numberOfNodes;
    this.ip = ip;
  }
}
