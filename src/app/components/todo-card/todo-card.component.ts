import { TodoKeyLocalStorage } from './../../models/enum/todoKeyLocalStorage';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { Todo } from 'src/app/models/model/todo.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: [],
})
export class TodoCardComponent implements OnInit {
  private todoSignalService = inject(TodoSignalsService);
  private todosSignal = this.todoSignalService.todosState;
  todosList = computed(() => this.todosSignal());

  constructor(){
    effect(() => {
      console.log('SIGNAL FOI ATUALIZADO', this.todoSignalService.todosState());
    })
  }

  ngOnInit(): void {
    this.getTodosLocalStorage();
  }

  getTodosLocalStorage(): void {
    const todosDatas = localStorage.getItem(
      TodoKeyLocalStorage.TODO_LIST
    ) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  saveTodosInLocalStorage(): void {
    this.todoSignalService.saveTodosInLocalStorage();
  }

  handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todosSignal.mutate((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;
        todoSelected && (todoSelected.done = true);
        this.saveTodosInLocalStorage();
      });
    }
  }

  handleDeleteTodo(todo: Todo): void {
    if (todo) {
      const index = this.todosList().indexOf(todo);

      if (index !== -1) {
        this.todosSignal.mutate((todos) => {
          todos.splice(index, 1);
          this.saveTodosInLocalStorage();
        })
      }
    }
  }
}
