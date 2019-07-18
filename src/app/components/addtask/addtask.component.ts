import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css']
})
export class AddtaskComponent implements OnInit {

  submitted = false;
  taskList: Array<Task> = []
  priorityList: Array<any> = [];

  optionSelected: any;
  prioritySelected: any;

  taskToAdd: Task = new Task();
  parTask: Task;

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

  constructor(fb: FormBuilder, private taskService: TaskService, private router: Router) {
    // Initializing the form group and Form Controls
    this.myFrmGrp = fb.group({
      task_nme: ['', Validators.required],
      task_prty: ['', Validators.required],
      task_prnt: ['', Validators.required],
      task_st_dt: ['', Validators.required],
      task_end_dt: ['', Validators.required]
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
  }

  // Fetching all the tasks from the Service
  fetchAllTasks() {
    this.taskService.fetchAllTasks()
      .then(data => {
        this.taskList = data
      })
  }

  saveTask(): void {

    this.submitted = true;

    this.task_name_str = this.task_name.value;
    this.priority_str = this.task_priority.value;
    this.task_parent_str = this.task_parent.value;
    this.task_stdt_str = this.task_stdt.value;
    this.task_enddt_str = this.task_enddt.value;

    if(this.myFrmGrp.invalid) {    
          return;
      }

    this.addTask(this.task_name_str, this.priority_str, this.task_parent_str, this.task_stdt_str, this.task_enddt_str);
  }

  // Save the task by Service
  addTask(task: string, priority: string, parentStr: string, startDate: string, endDate: string) {

    this.taskToAdd.taskId = null;
    this.taskToAdd.task = task;
    this.taskToAdd.priority = parseInt(priority);
    this.taskToAdd.startDateStr = startDate;
    this.taskToAdd.endDateStr = endDate;
    this.taskToAdd.deleteFlag = 'N';

    // Check if Parent task is selected or not
    if ('' == parentStr) {
      this.taskToAdd.parentId = null;
      this.taskToAdd.parentTaskName = null;
    } else {
      let task1 = JSON.parse(parentStr);
      this.parTask = task1 as Task;

      this.taskToAdd.parentId = this.parTask.taskId;
      this.taskToAdd.parentTaskName = this.parTask.task;
    }

    // Redirecting to Homepage after adding the task
    this.taskService.addTask(this.taskToAdd).then(data => {
      this.router.navigate(['viewtask']);
    });

  }

  reset() {
    //empty the form elements
    this.myFrmGrp.controls["task_nme"].setValue("");
    this.myFrmGrp.controls["task_prty"].setValue(0);
    this.myFrmGrp.controls["task_prnt"].setValue(0);
    this.myFrmGrp.controls["task_st_dt"].setValue("");
    this.myFrmGrp.controls["task_end_dt"].setValue("");
  }

}