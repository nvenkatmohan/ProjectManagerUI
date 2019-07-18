import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

 constructor(private http: HttpClient) { }
  
  retrieveAllProjects() {
    
    let projectsList: any = [];

    let proj1: Project = new Project();
    proj1.project='Some Project';
    proj1.projectId= 1234;
    proj1.priority = 10;
    proj1.startDateStr= '2019/08/01';
    proj1.endDateStr = '2019/12/31';
    proj1.noOfTasks = 2;
    proj1.completed = 'N';

    projectsList.push(proj1);

    let proj2: Project = new Project();
    proj2.project='A2B';
    proj2.projectId= 5678;
    proj2.priority = 5;
    proj2.startDateStr= '2019/01/01';
    proj2.endDateStr = '2019/05/31';
    proj2.noOfTasks = 4;
    proj2.completed = 'Y';

    projectsList.push(proj2);

    return projectsList;
  }


  // Fetch specific project by project id
  fetchProject(projectId: number) {

    let projToUpdate: Project = new Project();
    projToUpdate.project='Some Project';
    projToUpdate.projectId= 1234;
    projToUpdate.priority = 25;
    projToUpdate.startDateStr= '2019-08-01';
    projToUpdate.endDateStr = '2019-12-31';
    projToUpdate.noOfTasks = 2;
    projToUpdate.completed = 'N';
    projToUpdate.managerStr = '127453 - Naveen Mohan';

    return projToUpdate;

  }

}
