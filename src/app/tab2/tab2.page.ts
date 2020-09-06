import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Trash } from '../trash';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  trashes: Array<Trash> = [];
  thisMonthRecorded : number = 0;
  thisDayRecorded : number = 0;
  thisHourRecorded : number = 0;
  thisMonthCleaned : number = 0;
  thisDayCleaned : number = 0;
  thisHourCleaned : number = 0;
  constructor(private router:Router, public fser: FirebaseService){}
  
  ngOnInit() {
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
      this.procesStats();
    });


  }

  procesStats() {
    this.thisMonthRecorded= 0;
    this.thisDayRecorded = 0;
    this.thisHourRecorded = 0;
    this.thisMonthCleaned = 0;
    this.thisDayCleaned = 0;
    this.thisHourCleaned = 0;
    let date = new Date();
    this.trashes.forEach(trash => {
      if (trash.dateRecorded.month == date.getMonth() && trash.dateRecorded.year == date.getFullYear()) {
        this.thisMonthRecorded++
        if (trash.dateRecorded.day == date.getDate()) {
          this.thisDayRecorded++;
          if (trash.dateRecorded.hour == date.getUTCHours()) {
            this.thisHourRecorded++;
          }
        }
      }

      if (trash.dateCleaned != null) {
        if (trash.dateCleaned.month == date.getMonth() && trash.dateCleaned.year == date.getFullYear()) {
          this.thisMonthCleaned++
          if (trash.dateCleaned.day == date.getDate()) {
            this.thisDayCleaned++;
            if (trash.dateCleaned.hour == date.getUTCHours()) {
              this.thisHourCleaned++;
            }
          }
        }
      }

    });
  }

}