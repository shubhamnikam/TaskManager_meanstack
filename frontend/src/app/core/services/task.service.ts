import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from '../models/list';
import { Task } from '../models/task';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webService: WebService) {}

 
}
