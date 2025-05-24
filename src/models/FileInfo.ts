export class FileInfo {
  fileName: string;
  owner: string | null;
  replicationLocations: string[];
  locked: boolean;
  lockedByNodeIp: string | null;
  version: number;


  constructor(fileName: string, owner: string | null, replicationLocations: string[], locked: boolean, lockedByNodeIp: string | null, version: number) {
    this.fileName = fileName;
    this.owner = owner;
    this.replicationLocations = replicationLocations;
    this.locked = locked;
    this.lockedByNodeIp = lockedByNodeIp;
    this.version = version;
  }
}
