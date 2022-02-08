export const VERSION = "1.0.0";

class LocalStorage {
  version: string
  constructor(version:string) {
    this.version = version;
  }
  get(key:string) {
    const item = localStorage.getItem(`${key}-${this.version}`);
    if(item) {
      return JSON.parse(item);
    }
    return ;
  }

  set(key:string, item:any) {
    localStorage.setItem(`${key}-${this.version}`, JSON.stringify(item))
  }
}

export const storage = new LocalStorage(VERSION);