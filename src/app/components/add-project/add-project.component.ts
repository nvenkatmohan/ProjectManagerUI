import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';

import { Project } from '../../model/project.model';
import { User } from '../../model/user.model';

import { DateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(private projectService: ProjectService, 
        private userService: UserService,
        private projectFormBuilder: FormBuilder,
        private datePipe: DatePipe,
        private router: Router) { }

  projectsList: any = [];
  managersList: any = [];
  managerSearchList: any = [];
  priorityList: Array<any> = [];

  filteredManagerOptions: Observable<string[]>;
  addProjectForm: FormGroup;

  submitted = false;
  areProjectInputsValid = true;
  selectedManager = new FormControl('',[Validators.required]);

  newProject: Project;  

  ngOnInit() {
    
    this.retrieveAllUsers();  
    this.retrieveAllProjects();

    // Pushing priority values 1 to 30
    for (var i = 1; i <= 30; i++) {
      this.priorityList.push(i);
    }

    this.addProjectForm = this.projectFormBuilder.group({
        project: ['', Validators.required],
        priority: ['', Validators.required],
        startDate: ['', DateValidator.dateValidator],
        endDate: ['', DateValidator.dateValidator]   
    });

    this.filteredManagerOptions = this.selectedManager.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterManager(value))
      );

    this.createManagerSearchList();    
  }

  private _filterManager(value: string): string[] {
    const filterValue = value.toLowerCase();
 
    return this.managerSearchList.filter(option => option.toLowerCase().includes(filterValue));
  }

  get projectform() {return this.addProjectForm.controls;}
  
  retrieveAllProjects() {
     this.projectsList = this.projectService.retrieveAllProjects();
  }

  retrieveAllUsers() {
    this.managersList = this.userService.retrieveAllUsers();
  }

  sortresults(event) {
    console.log(event);
  }

  createManagerSearchList() {

    if(this.managersList != null) {
      this.managersList.forEach( user => {
          this.managerSearchList.push(user.employeeId + ' - ' +
            user.firstName + ' '+ user.lastName);
      });
    }
  }

  routeToUpdateProject(projectId: number) {
    this.router.navigate(['updateproject/' + projectId]);
  }
  

  onSubmit() {
    
    this.submitted = true;
    this.areProjectInputsValid = true;  

    this.validateAddProjectInput();

    if(this.areProjectInputsValid) {
      this.setValuesInNewProject();
      alert('SUCCESS!! :-)\n\n New Project Values:: ' + JSON.stringify(this.newProject));     
    } 

  }


  validateAddProjectInput() {

    if(this.addProjectForm.controls['priority'].value == 0) {
      this.addProjectForm.controls['priority'].setErrors({'incorrect': true});
    }

    if(this.addProjectForm.invalid || this.selectedManager.value == '') {
        this.areProjectInputsValid = false;
    }               

    let strtDte: Date;
    let endDte: Date;

     if(this.areProjectInputsValid) {
        
          let strtDteStr = this.addProjectForm.controls['startDate'].value;
          let endDteStr = this.addProjectForm.controls['endDate'].value;

          if(endDteStr != '' && strtDteStr == '') {            
            this.addProjectForm.controls['startDate']
                .setErrors({'startDateRequired': true});
            
            this.areProjectInputsValid = false;

          } else if(endDteStr != '') {

            //strtDte = moment(strtDteStr, 'YYYY-MM-DD', true);
            //endDte = moment(endDteStr, 'YYYY-MM-DD', true);

            if(!(moment(endDteStr, 'YYYY-MM-DD', true).isAfter(moment(strtDteStr, 'YYYY-MM-DD', true)))) {
              this.addProjectForm.controls['endDate']
                .setErrors({'invalidEndDate': true});
                
              this.areProjectInputsValid = false;
            }

          }
      }
    }

    setValuesInNewProject() {
      this.newProject = new Project();
      this.newProject.project=this.addProjectForm.controls["project"].value;
      this.newProject.priority=this.addProjectForm.controls["priority"].value;
      this.newProject.startDateStr=this.addProjectForm.controls["startDate"].value;
      this.newProject.endDateStr=this.addProjectForm.controls["endDate"].value;
      this.newProject.managerStr=this.selectedManager.value;
    }

    reset() {
      this.addProjectForm.controls['project'].setValue('');
      this.addProjectForm.controls['priority'].setValue(0); 
      this.addProjectForm.controls['startDate'].setValue('');
      this.addProjectForm.controls['endDate'].setValue('');
      this.selectedManager.setValue('');
      this.submitted = false;
    }


}
