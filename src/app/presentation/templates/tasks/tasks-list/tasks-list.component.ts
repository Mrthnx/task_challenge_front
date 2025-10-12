import { Component, inject, signal } from '@angular/core';
import { Task } from '@data/services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { DeleteTaskModalComponent } from '@presentation/templates/tasks/delete-task-modal/delete-task-modal.component';
import { ModalService } from '../../../../core/services/modal.service';
import { UpdateTaskModalComponent } from '@presentation/templates/tasks/update-task-modal/update-task-modal.component';
import { CreateTaskModalComponent } from '@presentation/templates/tasks/create-task-modal/create-task-modal.component';
import { TaskStore } from '@data/store/tasks.store';

type FilterType = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-tasks-list',
  imports: [DatePipe, NgClass],
  templateUrl: './tasks-list.component.html',
  standalone: true,
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  readonly taskStore = inject(TaskStore);
  readonly modalService = inject(ModalService);
  currentFilter = signal<FilterType>('all');
  animatingTaskId = signal<number | null>(null);

  constructor() {
    this.taskStore.loadTasks();
  }

  setFilter(filter: FilterType) {
    this.currentFilter.set(filter);
  }

  getFilteredTasks(): Task[] {
    const filter = this.currentFilter();
    const tasks = this.taskStore.filteredTasks();
    
    if (filter === 'pending') {
      return tasks.filter((task: Task) => !task.isCompleted);
    } else if (filter === 'completed') {
      return tasks.filter((task: Task) => task.isCompleted);
    }
    return tasks;
  }

  getPendingCount(): number {
    return this.taskStore.allTasks().filter((task: Task) => !task.isCompleted).length;
  }

  getCompletedCount(): number {
    return this.taskStore.allTasks().filter((task: Task) => task.isCompleted).length;
  }

  handleTaskCheckboxChange(task: Task) {
    // Trigger animation only when completing a task
    if (!task.isCompleted) {
      this.animatingTaskId.set(task.id);
      setTimeout(() => {
        this.animatingTaskId.set(null);
      }, 600);
    }
    
    this.taskStore.markAsCompleted(task.id).subscribe();
  }

  handleDeleteTask(task: Task) {
    this.modalService.open(DeleteTaskModalComponent, {
      task,
    });
  }

  handleUpdateTask(task: Task) {
    this.modalService.open(UpdateTaskModalComponent, {
      task,
    });
  }

  handleCreateTask() {
    this.modalService.open(CreateTaskModalComponent);
  }
}
