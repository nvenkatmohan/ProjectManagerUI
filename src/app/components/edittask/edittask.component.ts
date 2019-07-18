import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.css']
})
export class EdittaskComponent implements OnInit {

  taskList: Array<Task> = [];
  nonDeletedTaskList: Array<Task> = [];
  priorityList: Array<any> = [];

  taskToUpdate: Task = new Task();
  parTask: Task;

  isReadOnly: boolean = false;
  submitted = false;

  id: number;

  myFrmGrp: FormGroup;

  task_name: AbstractControl;
  task_priority: AbstractControl;
  task_parent: AbstractControl;
  task_stdt: AbstractControl;
  task_enddt: AbstractControl;

  task_name_str: string;
  priority_str: string;
  task_parent_str: string;
  task_stdt_str: string;
  task_enddt_str: string;

  prev_task_parent_str: string;

  constructor(fb: FormBuilder, private taskService: TaskService, private router: Router,
    private route: ActivatedRoute) {

    // Getting the task id from the request Parameter
    this.route.params.subscribe((parameters) => {
      this.id = parameters["id"];
    });

    // Creating the Form group and Form Controls
    this.myFrmGrp = fb.group({
      "task_nme": ["", Validators.required],
      "task_prty": ["", Validators.required],
      "task_prnt": ["", Validators.required],
      "task_st_dt": ["", Validators.required],
      "task_end_dt": ["", Validators.required]
    });

    this.task_name = this.myFrmGrp.controls["task_nme"];
    this.task_priority = this.myFrmGrp.controls["task_prty"];
    this.task_parent = this.myFrmGrp.controls["task_prnt"];
    this.task_stdt = this.myFrmGrp.controls["task_st_dt"];
    this.task_enddt = this.myFrmGrp.controls["task_end_dt"];
  }

  ngOnInit() {

    // Fetching all the tasks during init
    this.fetchAllTasks();

    // Pushing priority values 1 to 30
    for (var i = 1; i <= 30; i++) {
      this.priorityList.push(i);
    }

    // Fetch specific task
    this.taskService.fetchTask(this.id)
      .then(data => {
        
        this.taskToUpdate = data;

        if (this.taskToUpdate.parentTaskName == 'This task has no Parent') {
          this.taskToUpdate.parentTaskName = 'Please Select';
        }

        // Set the read only flag based on the delete flag
        if (this.taskToUpdate.deleteFlag == 'Y') {
          this.isReadOnly = true;

          // disabling the form group if the task has been ended
          this.myFrmGrp.disable();
        }

        this.task_name.setValue(this.taskToUpdate.task);
        this.task_priority.setValue(this.taskToUpdate.priority);
        this.task_parent.setValue(this.taskToUpdate.parentTaskName);
        this.task_stdt.setValue(this.taskToUpdate.startDateStr);
        this.task_enddt.setValue(this.taskToUpdate.endDateStr);

        this.prev_task_parent_str = this.taskToUpdate.parentTaskName;

      });   

         
  }

  // Fetch all the tasks
  fetchAllTasks() {
    this.taskService.fetchAllTasks()
      .then(data => {
        this.taskList = data;        
      });          
  }

  // Update the task
  updateTask(): void {

    this.submitted = true;

    this.task_name_str = this.task_name.value;
    this.priority_str = this.task_priority.value;
    this.task_parent_str = this.task_parent.value;
    this.task_stdt_str = this.task_stdt.value;
    this.task_enddt_str = this.task_enddt.value;
    
    if(this.myFrmGrp.invalid) {    
        return;
    }

    this.editTask(this.task_name_str, this.priority_str, this.task_parent_str, this.task_stdt_str, this.task_enddt_str);
  }

  // Update the task by Service
  editTask(task: string, priority: string, parentStr: string, startDate: string, endDate: string) {

    if ('' !== task) {
      this.taskToUpdate.task = task;
    }

    if ('' !== priority) {
      this.taskToUpdate.priority = parseInt(priority);
    }

    if ('' !== startDate) {
      this.taskToUpdate.startDateStr = startDate;
    }

    if ('' !== endDate) {
      this.taskToUpdate.endDateStr = endDate;
    }

    this.taskToUpdate.deleteFlag = 'N';

    

    if ('' !== parentStr && 'Please Select' != parentStr && 
          this.prev_task_parent_str != parentStr) {

      let task1 = JSON.parse(parentStr);
      this.parTask = task1 as Task;      

      this.taskToUpdate.parentId = this.parTask.taskId;
      this.taskToUpdate.parentTaskName = this.parTask.task;
    }

    this.taskService.updateTask(this.taskToUpdate).then(data => {
      this.router.navigate(['viewtask']);
    });

  }

  // Redirecting to the homescreen on clicking Cancel
  cancel() {
    this.router.navigate(['viewtask']);
  }

}
