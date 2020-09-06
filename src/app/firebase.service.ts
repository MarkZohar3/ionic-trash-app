import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Trash } from './trash';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;
  constructor(
    public af: AngularFirestore,
  ) { }
  getTrash() {
    //let currentUser = firebase.auth().currentUser;
    return this.af.collection('trashes').snapshotChanges();
    //return this.af.collection('people');
  }
  createTrash(t: Trash) {
    //let currentUser = firebase.auth().currentUser;
    return this.af.collection('trashes').add(t);
  }
  updateTrash(TrashID: any, t: Trash) {
    //let currentUser = firebase.auth().currentUser;
    this.af.collection('trashes').doc(TrashID).set(t);
    //this.af.doc('tasks/' + TaskID).update(t);
  }

  getOneTrash(key: any) {
    //let currentUser = firebase.auth().currentUser;
    //console.log(this.af.collection('trashes').doc(key).valueChanges());
    this.af.collection('trashes').doc(key).valueChanges()
    .subscribe(singleDoc =>{
      console.log(singleDoc)
    });
    //this.af.collection('trashes', ref => ref.where('size', '==', 'large'))
    //this.af.doc('tasks/' + TaskID).update(t);
  }

  deleteTask(TaskID: any) {
    //let currentUser = firebase.auth().currentUser;
    this.af.collection('trashes').doc(TaskID).delete();
    //this.af.collection('people').doc(currentUser.uid).collection('trash').doc(TaskID).delete();
    //this.af.doc('tasks/' + TaskID).delete();
  }
  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  createUser(u: User) {
    //let currentUser = firebase.auth().currentUser;
    return this.af.collection('userData').add(u);
  }

  getUser(){
    //console.log(this.af.collection('userData', ref => ref.where('userId', '==', "0V8gWqPEIpX2hHHU5rZjyLfB43o1")));
    //return this.af.collection('userData', ref => ref.where('userId', '==', "0V8gWqPEIpX2hHHU5rZjyLfB43o1"));
   return this.af.collection('userData').snapshotChanges();
  }
}