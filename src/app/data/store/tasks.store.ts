import { Injectable, signal } from '@angular/core';
import { Task } from '@data/services/task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly tasks = signal<Task[]>([]);
  private readonly filter = signal('');

  getTasks() {
    const search = this.filter();
    return this.tasks().filter((task) => {
      return (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  filterTasks(search: string) {
    this.filter.set(search);
  }

  setTasks(newTask: Task[]) {
    this.tasks.set(newTask);
  }

  addTask(task: Task) {
    this.tasks.update((currentTask) => [...currentTask, task]);
  }

  removeTask(task: Task) {
    this.tasks.update((currentTask) => currentTask.filter((t) => t !== task));
  }
}
