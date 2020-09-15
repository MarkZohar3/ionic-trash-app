import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Router, NavigationExtras } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import {Trash} from "../trash";

declare let L;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  map: Leaflet.Map;
  trashes: Array<Trash> = [];
  locationIcon: any;
  trashRecordedIcon : any;
  trashCleanedIcon: any;
  constructor(private router:Router, public fser: FirebaseService){}

  ionViewDidEnter() {
    this.defineIcons();
    this.initMap();
    this.locateUser();
    this.mapClick();
    this.getTrashes();
  }


  locateUser(){
    this.map.locate({setView:true, maxZoom: 16}).on("locationfound", (e: any)=> {
      const marker = Leaflet.marker([e.latitude,e.longitude], { icon: this.locationIcon });
      this.map.addLayer(marker);
    });
  }



  initMap() {
    this.map = new Leaflet.Map('mapId2').setView([38.736946, -9.142685], 13);
    
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

  }


  getTrashes(){
    //GET TRASHES 
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
      this.bindMarkersToTrashes();
    });
  }

  bindMarkersToTrashes(){

      //LOAD MARKERS
      console.log("Adding " + this.trashes.length + " trashes");
      for (var i = 0; i < this.trashes.length; i++) {
        console.log("Trash " + i + " lat:" + this.trashes[i].lat);
        const marker = Leaflet.marker([this.trashes[i].lat, this.trashes[i].lng], {
          title: this.trashes[i].$key
        }).addTo(this.map);

        if (this.trashes[i].status == "recorded") marker.setIcon(this.trashRecordedIcon);
        else marker.setIcon(this.trashCleanedIcon);
        
        marker.on('click', (e) => {
          let coordinates: any[] = [marker.options.title];
          let navigationExtras: NavigationExtras = { state: { coordinates: coordinates } };
          console.log("markerClick:");
          console.log(coordinates[0]);
          this.router.navigate(['trash-details'], navigationExtras);
        });
        this.map.addLayer(marker);
      }
  }


  mapClick(){
    this.map.on("click", (e)=>{this.onMapClick(e)})
  }

  onMapClick(e) {
    console.log(e.latlng.lng, e.latlng.lat);
    let coordinates: any[] = ["new", Number(e.latlng.lat),Number(e.latlng.lng)];
    let navigationExtras: NavigationExtras = { state: { coordinates: coordinates} };
    this.router.navigate(['trash-details'], navigationExtras);
    console.log("onMapClick:");
    console.log(navigationExtras.state.coordinates);
  }



  ionViewWillLeave() {
    this.map.remove();
  }

  defineIcons(){
    //INITIALIZE LOCATION ICON
    this.locationIcon = Leaflet.icon({
      iconUrl: '../../../assets/icon/favicon.png',
      shadowUrl: '../../../assets/icon/favicon.png',
    
      iconSize:     [20, 20], // size of the icon
      shadowSize:   [20, 20], // size of the shadow
      iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 5],  // the same for the shadow
      popupAnchor:  [-3, -3] // point from which the popup should open relative to the iconAnchor
    
    });

    //INITIALIZE TRASH ICON
    this.trashRecordedIcon = Leaflet.icon({
      iconUrl: '../../../assets/icon/redwhitetrashmarker.png',
      shadowUrl: '../../../assets/icon/redwhitetrashmarker.png',
    
      iconSize:     [60, 60], // size of the icon
      shadowSize:   [60, 60], // size of the shadow
      iconAnchor:   [30, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [30, 50],  // the same for the shadow
      popupAnchor:  [-3, -3] // point from which the popup should open relative to the iconAnchor
    
    });

    //INITIALIZE TRASH ICON
    this.trashCleanedIcon = Leaflet.icon({
      iconUrl: '../../../assets/icon/greenwhitetrashmarker.png',
      shadowUrl: '../../../assets/icon/greenwhitetrashmarker.png',

      iconSize: [60, 60], // size of the icon
      shadowSize: [60, 60], // size of the shadow
      iconAnchor: [30, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [30, 50],  // the same for the shadow
      popupAnchor: [-3, -3] // point from which the popup should open relative to the iconAnchor

    });

  }


}
