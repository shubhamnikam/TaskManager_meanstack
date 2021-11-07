import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  readonly BASE_API_URL;
  constructor(private httpClient: HttpClient) {
    this.BASE_API_URL = environment.BASE_API_URL;
  }

  //---------------------List API---------------------
  getLists(): Observable<any> {
    return this.httpClient.get(`${this.BASE_API_URL}lists`);
  }

  createList(title: String): Observable<any> {
    return this.httpClient.post(`${this.BASE_API_URL}lists`, { title });
  }

  deleteList(listId: String): Observable<any> {
    return this.httpClient.delete(`${this.BASE_API_URL}lists/${listId}`);
  }

  //---------------------Task API---------------------
  getTasks(listId: String): Observable<any> {
    return this.httpClient.get(`${this.BASE_API_URL}lists/${listId}/tasks`);
  }

  createTask(listId: String, title: String): Observable<any> {
    return this.httpClient.post(`${this.BASE_API_URL}lists/${listId}/tasks`, {
      title,
    });
  }

  deleteTask(listId: String, taskId: String): Observable<any> {
    return this.httpClient.delete(
      `${this.BASE_API_URL}lists/${listId}/tasks/${taskId}`
    );
  }

  updateTask(listId: String, task: Task): Observable<any> {
    return this.httpClient.patch(
      `${this.BASE_API_URL}lists/${listId}/tasks/${task._id}`,
      { completed: !task.completed }
    );
  }
}
