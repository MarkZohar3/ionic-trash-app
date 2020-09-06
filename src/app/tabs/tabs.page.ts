import { Component } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public authService : AngularFireAuth, private router:Router) {}
  logout(){
    this.authService.signOut()
    .then(res => {
    this.router.navigate(["/login"]);
    }, err => {
    console.log(err);
    })
  }
}
