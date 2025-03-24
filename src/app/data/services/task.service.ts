import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Task {
  id: number;
  createDate: Date;
  updateDate: Date;
  title: string;
  description: string;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = environment.API_URL;
  private readonly httpClient = inject(HttpClient);

  getTasks(search: string = ''): Observable<Task[]> {
    return this.httpClient
      .get(`${this.apiUrl}/tasks?search=${search}`)
      .pipe(map((res: any) => res.data));
  }

  markAsCompleted(taskId: number) {
    return this.httpClient.patch(`${this.apiUrl}/tasks/${taskId}`, {});
  }

  createTask(task: Task) {
    return this.httpClient
      .post(`${this.apiUrl}/tasks`, task)
      .pipe(map((res: any) => res.data));
  }

  updateTask(task: Task, id: number) {
    return this.httpClient
      .put(`${this.apiUrl}/tasks/${id}`, task)
      .pipe(map((res: any) => res.data));
  }

  deleteTask(taskId: number) {
    return this.httpClient.delete(`${this.apiUrl}/tasks/${taskId}`);
  }
}
