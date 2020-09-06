export class UserSingleton {
    private static instance: UserSingleton;
    private _username: string;
    private _uid: string;
    private constructor() { }
    static getInstance() {
      if (!UserSingleton.instance) {
        UserSingleton.instance = new UserSingleton();
        UserSingleton.instance._username = "";
        UserSingleton.instance._uid="";
      }
      return UserSingleton.instance;
    }
    get username(): string {
      return this._username;
    }
    set username(u) {
      this._username = u;
    }
    get uid(): string {
        return this._uid;
      }
    set uid(u) {
        this._uid = u;
    }
}