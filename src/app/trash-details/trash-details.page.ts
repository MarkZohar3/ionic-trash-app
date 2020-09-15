import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trash } from '../trash';
import { AngularFireAuth} from '@angular/fire/auth';
import { FirebaseService } from '../firebase.service';
import { IonItemSliding } from '@ionic/angular';
import * as firebase from 'firebase/app';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { dateTime } from '../dateTime';
import { AngularFirestore } from '@angular/fire/firestore';
import { TrashDetailsPageRoutingModule } from './trash-details-routing.module';


@Component({
  selector: 'app-trash-details',
  templateUrl: './trash-details.page.html',
  styleUrls: ['./trash-details.page.scss'],
})
export class TrashDetailsPage implements OnInit {

  key: any;
  lat: number;
  lng: number;
  status: string;
  desc:string = "";
  trashes: Array<any> = [];
  trash: any = { $key: 'new', descriptionRecorded: '', status: '', dateRecorded: '', 
  userIdRecorded: '', lat: '', lng: '', dateCleaned:'', descriptionCleaned: '',userIdCleaned:'' };
  currentUserId:string;

  public base64Image: string;


  constructor(private route: ActivatedRoute, 
    private router: Router, 
    public fser: FirebaseService, 
    public authService : AngularFireAuth, 
    public af: AngularFirestore, 
    /*private camera: Camera,*/ 
    public platform: Platform) 
    { 
    

     this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.key= this.router.getCurrentNavigation().extras.state.coordinates[0];
        if(this.key == "new"){
          this.lat= this.router.getCurrentNavigation().extras.state.coordinates[1];
          this.lng= this.router.getCurrentNavigation().extras.state.coordinates[2];
          console.log(this.lat+ ", " + this.lng);
          console.log("new trash");
        }
        else{
          console.log("old trash");
          console.log(this.key);
          //fser.getOneTrash(this.key);

          this.af.collection('trashes').doc(this.key).valueChanges()
          .subscribe(singleDoc =>{
            this.trash = singleDoc;
            console.log(this.trash)
          });
          
        }        
      }
      else this.router.navigate(['tabs']);
      
    });

  }

  ngOnInit() {
    try{
      this.currentUserId= firebase.auth().currentUser.uid;
    }  
    catch(Error){
      alert(Error.message);  
      this.router.navigate(['login']);
    }
    //this.loadTrashes();
  }
/*
  loadTrashes(){
    this.fser.getTrash().subscribe(data => {
      this.trashes = data.map(e => {
        return {
          $key: e.payload.doc.id,
          description: e.payload.doc.data()['description'],
          status: e.payload.doc.data()['status'],
          date : e.payload.doc.data()['date'],
          userId: e.payload.doc.data()['userId']
        };
      });
      console.log(this.trashes);
    });
  }*/


  btnRecordTrash(){
    let date : Date = new Date();
    let datetime : dateTime = {year: date.getFullYear(), 
      month: date.getMonth(), day: date.getDate(),
      hour: date.getHours(), minute: date.getMinutes(), 
      second: date.getSeconds(), fulldate: date };
    let trash : Trash = { $key: new Date().valueOf(), 
      descriptionRecorded: this.desc, status: 'recorded', 
      dateRecorded: datetime, userIdRecorded: firebase.auth().currentUser.uid, 
      lat: this.lat, lng: this.lng, dateCleaned:null, 
      descriptionCleaned:'',userIdCleaned:'' }
    this.addTrash(trash);
    this.router.navigate(['tabs']);
  }

  btnMarkCleaned(){
    let date : Date = new Date();
    let datetime : dateTime = {year: date.getFullYear(), month: date.getMonth(), 
      day: date.getDate(),hour: date.getHours(), minute: date.getMinutes(), 
      second: date.getSeconds(), fulldate: date };
    this.trash.dateCleaned = datetime;
    this.trash.descriptionCleaned = this.desc;
    this.trash.userIdCleaned = firebase.auth().currentUser.uid;
    this.trash.status = "cleaned";
    console.log(this.trash.descriptionCleaned + ', ' + this.trash.status);
    this.fser.updateTrash(this.key, this.trash);
    this.router.navigate(['tabs']);
  }




  addTrash(trash : Trash) {
    this.fser.createTrash(trash).then(resp => {
      console.log("createTask: then - " + resp);
    })
      .catch(error => {
        console.log("createTask: catch - " + error);
      });
  }





  takePicture() {
    /*this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.camera.getPicture({
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
          // Handle error
        })
      }
    })*/
  }

  goBack(){
    this.router.navigate(['tabs']);
  }

}
