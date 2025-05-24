export class FileInfo {
  filename: string;
  owner: string | null;
  replicationLocations: string[];
  locked: boolean;
  lockedByNodeIp: string | null;
  version: number;
  fileHash: number;


  constructor(filename: string, owner: string | null, replicationLocations: string[], locked: boolean, lockedByNodeIp: string | null, version: number, fileHash: number) {
    this.filename = filename;
    this.owner = owner;
    this.replicationLocations = replicationLocations;
    this.locked = locked;
    this.lockedByNodeIp = lockedByNodeIp;
    this.version = version;
    this.fileHash = fileHash;
  }
}
