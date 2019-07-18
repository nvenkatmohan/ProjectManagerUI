import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  usersList: any = [];
  userSearchList: any = [];
   
  submitted = false;
  
  addUserForm: FormGroup;
  userFormControl = new FormControl('',[Validators.required]);
  
  filteredUserOptions: Observable<string[]>;

  constructor(private userFormBuilder: FormBuilder, 
      private router: Router, private userService: UserService) { }

  ngOnInit() {

    this.addUserForm = this.userFormBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        employeeId: ['', Validators.required]
    });

    this.retrieveAllUsers();

    this.createUserSearchList();

    this.filteredUserOptions = this.userFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
 
    return this.userSearchList.filter(option => option.toLowerCase().includes(filterValue));
  }

  get uf() {return this.addUserForm.controls;}

  onSubmit() {
    
    this.submitted = true;

    console.log('Selected User: '+this.userFormControl.value);

    if(this.addUserForm.invalid || this.userFormControl.value == '') {
      return;
    }

    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.addUserForm.value));
    //alert('User Selected:: '+this.userFormControl.value);
  }

  retrieveAllUsers() {
    this.usersList = this.userService.retrieveAllUsers();
  }
  
  sortresults(event) {
    console.log(event);
  }

  createUserSearchList() {

    if(this.usersList != null) {
      this.usersList.forEach( user => {
          this.userSearchList.push(user.employeeId + ' - ' +
            user.firstName + ' '+ user.lastName);
      });
    }
  }

  routeToEditUser(userId: number) {
    this.router.navigate(['edituser/' + userId]);
  }


}
