export class Node {
  id: number;
  name: string;
  online: boolean;
  ip: string;
  previous: string
  next: string;

  constructor(id: number, name:string, online:boolean, ip:string, previous:string, next:string) {
    this.id = id;
    this.name = name;
    this.online = online;
    this.ip = ip;
    this.previous = previous;
    this.next = next;
  }
}
