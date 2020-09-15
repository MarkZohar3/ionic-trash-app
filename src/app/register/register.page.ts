import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FireauthService } from '../fireauth.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { FirebaseService } from '../firebase.service';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'username': [
      { type: 'required', message: 'Username is required.' },
      //{ type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength', message: 'Password must be at least 5 characters long.' }
]
  };
  constructor(
    private authService: FireauthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private fser : FirebaseService
  ) { }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
])),
username: new FormControl('', Validators.compose([
  Validators.required,
])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }
  tryRegister(value) {
    this.authService.doRegister(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
        let user:User = { 
          userId: firebase.auth().currentUser.uid, 
          username: value.username 
        };     
        this.registerUser(user);
        this.authService.initUser(user);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      });
  }

  goLoginPage() {
    this.router.navigate(["/login"]);
  }

  registerUser(user : User) {
    let u: User = { 
      userId: user.userId, 
      username: user.username 
    };
    console.log(u);
    this.fser.createUser(u).then(resp => {
      console.log("createTask: then - " + resp);
    })
      .catch(error => {
        console.log("createTask: catch - " + error);
      });
    //console.log("addTask: " + this.tasks);
    this.router.navigate(['tabs']);
  }

}