import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { FirebaseService } from '../firebase.service';
import { Trash } from '../trash';
import { point } from 'leaflet';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  users: Array<User> = [];
  trashes: Array<Trash> = [];
  userScore: Array<any> = [];

  constructor(public fser: FirebaseService) { }

  ngOnInit() {

    this.fser.getUser().subscribe(data => {
      this.users = data.map(e => {
        return {
          userId: e.payload.doc.data()["userId"],
          username: e.payload.doc.data()["username"]
        };
      });
      console.log("initUser ");
      console.log(this.users);
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
        console.log("Calculate points:");
    this.calculatePoints(this.users,this.trashes);
    console.log(this.userScore);
      });
    });


    
    

  }

  calculatePoints(users: Array<User> = [], trashes: Array<Trash> = []) {
    this.userScore = [];
    users.forEach(user => {
      let points = 0;
      console.log(user.username + " " + points);
      trashes.forEach(trash => {        
        if (user.userId == trash.userIdCleaned) points += 3;
        if (user.userId == trash.userIdRecorded) points ++;
        console.log(user.username + " " + points);
      })
      let score = [user.username,points];
      this.userScore.push(score)
    });
  }



}
