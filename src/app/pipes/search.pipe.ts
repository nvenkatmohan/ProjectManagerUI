import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Task } from '../model/task.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(
    tasks: Array<Task>,
    taskname?: string,
    parenttask?: string,
    priorityFrom?: number,
    priorityTo?: number,
    startDate?: string,
    endDate?: string) {

    // Filter Task name
    tasks = tasks.filter(task => task.task.toLowerCase().includes(taskname.toLowerCase()));
    // Filter parent task
    tasks = tasks.filter(task => task.parentTaskName.toLowerCase().includes(parenttask.toLowerCase()));

    // Filter Priority From
    tasks = tasks.filter(task => {
      if (!priorityFrom)
        priorityFrom = 0;

      if (task.priority >= priorityFrom)
        return true;
    });

    // Filter Priority To
    tasks = tasks.filter(task => {
      if (!priorityTo)
        priorityTo = 30;

      if (task.priority <= priorityTo)
        return true;
    });

    // Filter Start Date
    if (typeof startDate !== 'undefined' && startDate !== '') {
      tasks = tasks.filter(task => {
        if (task.startDateStr == startDate)
          return true;
      });
    }

    // Filter End Date
    if (typeof endDate !== 'undefined' && endDate !== '') {
      tasks = tasks.filter(task => {
        if (task.endDateStr == endDate)
          return true;
      });
    }

    return tasks;
  }
}
