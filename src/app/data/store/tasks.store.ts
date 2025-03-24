import { computed, inject, Injectable, signal } from '@angular/core';
import { Task, TaskService } from '@data/services/task.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly taskService = inject(TaskService);

  allTasks = signal<Task[]>([]);
  query = signal('');
  filteredTasks = computed(() => {
    return this.allTasks()
      .filter((task) => {
        return (
          this.query().length === 0 ||
          task.title.toLowerCase().includes(this.query().toLowerCase()) ||
          task.description.toLowerCase().includes(this.query().toLowerCase())
        );
      })
      .sort((a, _b) => (!a.isCompleted ? -1 : 1));
  });

  addTask(task: Task) {
    return this.taskService.createTask(task).pipe(
      tap((res) => {
        this.allTasks.update((tasks) => [...tasks, res]);
      }),
    );
  }

  updateTask(task: Task, taskId: number) {
    return this.taskService.updateTask(task, taskId).pipe(
      tap((res) => {
        this.allTasks.update((tasks) => {
          return tasks.map((t) => {
            if (t.id === task.id) {
              return { ...t, ...res };
            }
            return t;
          });
        });
      }),
    );
  }

  deleteTask(taskId: number) {
    return this.taskService.deleteTask(taskId).pipe(
      tap(() => {
        this.allTasks.update((tasks) => {
          return tasks.filter((t) => t.id !== taskId);
        });
      }),
    );
  }

  markAsCompleted(taskId: number) {
    return this.taskService.markAsCompleted(taskId).pipe(
      tap((res) => {
        this.allTasks.update((tasks) => {
          return tasks.map((t) => {
            if (t.id === taskId) {
              return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
          });
        });
      }),
    );
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.allTasks.set(tasks);
    });
  }
}
