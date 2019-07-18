import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

   retrieveAllUsers() {

    let usersList: any = [];

    let user1: User = new User();
    user1.userId = 225;
    user1.firstName = 'Naveen';
    user1.lastName = 'Mohan';
    user1.employeeId = '127453';
    
    usersList.push(user1);

    let user2: User = new User();
    user2.userId = 290;
    user2.firstName = 'Karthik';
    user2.lastName = 'Balasubramani';
    user2.employeeId = '184185';
    
    usersList.push(user2);

    let user3: User = new User();
    user3.userId = 222;
    user3.firstName = 'Arun';
    user3.lastName = 'Jeyaraman';
    user3.employeeId = '152326';
    
    usersList.push(user3); 

    return usersList; 
  }

  fetchUser(userId: number) {
    
    let userToEdit: User = new User();

    userToEdit.userId = 290;
    userToEdit.firstName = 'Karthik';
    userToEdit.lastName = 'Balasubramani';
    userToEdit.employeeId = '184185';

    return userToEdit;

  }

}
