import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';



interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  hide2 = true;
  checkbox = false;
  loading = false;
  submitted = false;


  profileForm!: FormGroup;

  get email() { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }
  get passwordConfirm() { return this.profileForm.get('passwordConfirm'); }

  constructor(private http: HttpClient, private router: Router) {
  }
  ngOnInit(): void {
    if (localStorage.getItem('email') != null) {
      this.router.navigate(['/home'])
    }

    this.profileForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$')
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required
      ])
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.http.post(
      "https://party-service.herokuapp.com/rest/api/user/register",
      {
        "email": this.profileForm.get('email')!.value,
        "password": this.profileForm.get('password')!.value
      }
      )
      .subscribe(
        (val) => {
          console.log("POST call successful value returned in body",
            val);
          window.alert("Register success !!");
          this.router.navigate(['/login']);
        },
        response => {
          console.log("POST call in error", response);
          window.alert("register fail please try again later!");
          this.profileForm.reset();
        },
        () => {
          console.log("The POST observable is now completed.");
        });
  }


}
