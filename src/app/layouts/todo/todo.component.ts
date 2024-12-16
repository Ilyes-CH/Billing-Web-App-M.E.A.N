import { Component, OnInit } from '@angular/core';
import { PopupService } from 'app/Services/popup.service';


interface Todo {
  id: number,
  date: number,
  task: string,
  type: string,
  isDone: boolean
}
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  public todo: Todo = { id: Date.now(), date: Date.now(), task: '', type: '', isDone: false }
  public todos: Array<Todo> = []

  constructor(private popup: PopupService) {
    

  }

  ngOnInit(): void {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]')
    console.log(this.todos)
  }

  addTask() {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]')
    this.todos.push(this.todo)
    localStorage.setItem('todos', JSON.stringify(this.todos))
    this.todo = { id: Date.now(), date: Date.now(), task: '', type: '', isDone: false }
    this.popup.showNotification('bottom', 'right', 'success', 'Todo Was Added With Success')
  }

  deleteTask(id: number) {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const index = this.todos.findIndex(todo => todo.id == id)
    this.todos.splice(index)
    localStorage.setItem('todos', JSON.stringify(this.todos))
    this.popup.showNotification('bottom', 'right', 'success', 'Todo Was Deleted With Success')

  }

  markDone(id: number) {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]')
    
    

    const index = this.todos.findIndex(todo => todo.id == id)
    this.todos[index].isDone = !this.todos[index].isDone
    localStorage.setItem('todos', JSON.stringify(this.todos))

  }
  
}
