import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WakandaService } from "./wakanda.service";
import { ConfirmComponent } from './confirm/confirm.component';
import { ITodo } from "./interfaces";

@Injectable()
export class TodoService {
  constructor(
    private wakanda: WakandaService,
    private dialog: MatDialog
  ) {

  }

  async getClass() {
    const ds = await this.wakanda.catalog();
    return ds.Todo;
  }

  async getAll(opts: {
    pageSize: number;
    start: number;
    filter?: string;
    params?: (string)[];
    orderBy?: string
  } = {
    pageSize: 10,
    start: 0
  }): Promise<{
    list: ITodo[];
    count: number;
  }> {
    const Todo = await this.getClass();
    const res = await Todo.query(opts);

    return {
      list: res.entities,
      count: res._count
    };
  }

  remove(todo): Promise<any> {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { message: "Would you like to remove this entity?" }
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(async isYes => {
        if(isYes){
          await todo.delete();
        }

        resolve(isYes);
      });
    });
  }
}
