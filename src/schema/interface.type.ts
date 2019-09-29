export interface Todo {
  id: string;
  task: string;
  done: boolean;
  user: string;
}

export interface UserID {
  id: string;
}

export interface User extends UserID {
  lastName: string;
  firstName: string;
  todos: Todo[];
}
