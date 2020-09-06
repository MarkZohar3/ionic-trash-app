import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserSingleton } from "./userSingleton";
import { User} from "./user";

@Injectable({
  providedIn: 'root'
})


export class FireauthService {
  users: Array<User> = [];
  constructor(
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth
  ) { }
  

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email,
        value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }
  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email,
        value.password)
        .then(res => {
          resolve(res);
          console.log("doLogin:\nId: " + res.user.uid);
          this.initUser(res.user);
        }, err => {
          reject(err);
        })
    })
  }




  initUser(value){

    this.firebaseService.getUser().subscribe(data => {
      this.users = data.map(e => {
        return {
          userId: e.payload.doc.data()["userId"],
          username: e.payload.doc.data()["username"]
        };
      });
      console.log(this.users);
    });
    const userSingleton = UserSingleton.getInstance();
    userSingleton.uid = value.uid;
    
    this.firebaseService.getUser();
    //console.log(value);
    //console.log("User created:\nId: " + userSingleton.uid + ", Username: " + value.username);
  }


}