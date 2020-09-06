import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Trash } from '../trash';
import * as firebase from 'firebase/app';
import { AngularFireAuth} from '@angular/fire/auth';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  trashes: Array<Trash> = [];
  currentUserId:string = "";

  constructor(private router:Router, public fser: FirebaseService, public authService : AngularFireAuth) {}

  ngOnInit() {
    console.log("init");
    this.fser.getTrash().subscribe(data => {
      this.trashes = data.map(e => {
        return {
          $key: e.payload.doc.id,
          descriptionRecorded: e.payload.doc.data()['descriptionRecorded'],
          status: e.payload.doc.data()['status'],
          dateRecorded: e.payload.doc.data()['dateRecorded'],
          userIdRecorded: e.payload.doc.data()['userIdRecorded'],
          lat: e.payload.doc.data()['lat'],
          lng: e.payload.doc.data()['lng'],
          descriptionCleaned: e.payload.doc.data()['descriptionCleaned'],
          dateCleaned: e.payload.doc.data()['dateCleaned'],
          userIdCleaned: e.payload.doc.data()['userIdCleaned']
        };
      });
      console.log(this.trashes);
      try   
      {
        this.currentUserId = firebase.auth().currentUser.uid;
      }
      catch (Error)   
      {  
        alert(Error.message);  
        this.router.navigate(['login']);
      }  
    });

  }

  logout(){
    this.authService.signOut()
    .then(res => {
    this.router.navigate(["/login"]);
    }, err => {
    console.log(err);
    })
  }

  removeTrash(slidingItem: IonItemSliding, trash: any) {
    trash.status = "removed";
    this.fser.deleteTask(trash.$key);
    slidingItem.close();
  }


}
