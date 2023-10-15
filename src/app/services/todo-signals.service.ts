import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/model/todo.model';
import { TodoKeyLocalStorage } from '../models/enum/todoKeyLocalStorage';

@Injectable({
  providedIn: 'root',
})
export class TodoSignalsService {
  todosState = signal<Array<Todo>>([]);

  updateTodos({ id, title, description, done }: Todo): void {
    if ((title && id && description !== null) || undefined) {
      this.todosState.mutate((todos) => {
        if (todos !== null) {
          todos.push(new Todo(id, title, description, done));
        }
      });
      this.saveTodosInLocalStorage();
    }
  }

  saveTodosInLocalStorage(): void {
    const todos = JSON.stringify(this.todosState());
    todos && localStorage.setItem(TodoKeyLocalStorage.TODO_LIST, todos);
  }
}
