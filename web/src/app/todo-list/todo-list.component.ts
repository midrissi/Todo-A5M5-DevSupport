import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { ITodo } from "../shared/interfaces";
import { TodoService } from '../shared/todo.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent{
  cols: string[] = ['ID', 'description', 'done', 'tools'];
  todos: MatTableDataSource<ITodo> = new MatTableDataSource<ITodo>([]);
  current: ITodo;
  count: number = 0;
  editable: boolean = false;
  isOpenSidePanel: Boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private todoService: TodoService
  ) {
    this.refresh();
  }

  async onSort(a,b,c) {
    let qOptions: any = {
      pageSize: 10,
      start: 0
    };

    if(this.sort.direction){
      qOptions.orderBy = this.sort.active + ' ' + this.sort.direction
    }

    const result = await this.todoService.getAll(qOptions);
    this.setData(result);
  }

  async refresh() {
    const result = await this.todoService.getAll();
    this.setData(result);
  }

  select(todo) {
    this.isOpenSidePanel = true;
    this.current = todo;
  }

  async remove(todo) {
    const isRemoved = await this.todoService.remove(todo);
    if (isRemoved) {
      this.refresh();
    }
  }

  async onNavigate(p) {
    const result = await this.todoService.getAll({
      pageSize: p.pageSize,
      start: p.pageSize*p.pageIndex
    });

    this.setData(result);
  }

  async save(todo){
    const isSaved = await todo.save();
    this.editable = false;
    if (isSaved) {
      this.refresh();
    }
  }

  cancel(){
    this.editable= false;

    if(this.current && !this.current._key){
      this.isOpenSidePanel = false;
      this.current = null;
    } else {
      this.refresh();
    }
  }

  async search(value: string, $ev){
    let v = value? value.trim(): '';

    if(
      ($ev.keyCode >= 48 && $ev.keyCode <= 57) ||
      ($ev.keyCode >= 65 && $ev.keyCode <= 90) ||
      ([8].indexOf($ev.keyCode) >= 0)
    ){
      const result = await this.todoService.getAll({
        pageSize: 10,
        start: 0,
        filter: "description == :1",
        params: [`*${v}*`]
      });
      this.setData(result);
    } else if(!v){
      this.refresh();
    }
  }

  async create(todo){
    const Todo = await this.todoService.getClass();
    this.current = Todo.create();
    this.editable = true;
    this.isOpenSidePanel = true;
  }

  private setData(d: {
    list: ITodo[];
    count: number;
  }){
    this.todos = new MatTableDataSource<ITodo>(d.list);
    this.count = d.count;
  }
}
