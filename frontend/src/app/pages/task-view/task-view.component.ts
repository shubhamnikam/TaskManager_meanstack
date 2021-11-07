import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from 'src/app/core/models/list';
import { WebService } from 'src/app/core/services/web.service';
import { Task } from '../../core/models/task';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] = [];
  listId: string = "";

  constructor(
    private webService: WebService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //get all lists
    this.getLists();
    //get tasks by listId changes
    this.getTasksByListId();
  }
  getLists() {
    this.webService.getLists().subscribe(
      (data: List[]) => {
        this.lists = data;
        //select default list after list load
       this.selectDefaultList();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  selectDefaultList() {
     //select default task
     if(this.lists?.length > 0){
      this.router.navigate([`/lists/${this.lists[0]._id}`])
    }
  }

  getTasksByListId() {
    this.route.paramMap.subscribe((paramMap) => {
      this.listId = paramMap.get('listId') ?? '';
      if (this.listId) {
        this.webService.getTasks(this.listId).subscribe(
          (data: Task[]) => {
            this.tasks = data;
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error('listId is null');
        return;
      }
    });
  }

  onClickChangeStatusTask(task: Task){
    this.webService.updateTask(this.listId, task).subscribe(
      () => {
        task.completed = !task.completed;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onClickDeleteTask(task: Task){
    this.webService.deleteTask(this.listId, task._id).subscribe(
      () => {
        this.tasks = this.tasks.filter((t: Task, index, Number)=>{
          return t._id !== task._id;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onClickDeleteList(list: List){
    this.webService.deleteList(list._id).subscribe(
      () => {
        this.lists = this.lists.filter((l: List, index, Number)=>{
          return l._id !== list._id;
        });
        //select default list after list load
        this.selectDefaultList();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onClickCreateList(){
    let data = prompt("Enter List Title:");
    if(data && data?.length >= 3){
      this.webService.createList(data).subscribe(
        (list: List) => {
          this.lists.push(list);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert("title length must be >= 3");
    }
    
  }

  onClickCreateTask(){
    if(!this.listId){
      alert("Please select list to add task");
      return;
    }
    let data = prompt("Enter Task Title:");
    if(data && data?.length >= 3){
      this.webService.createTask(this.listId, data).subscribe(
        (task: Task) => {
          this.tasks.push(task);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert("title length must be >= 3");
    }
  }
}
