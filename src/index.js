import React, { useContext, useReducer, useState, useRef } from "react";
import ReactDOM from "react-dom";
import uuidv1 from "uuid/v1";
function reducer(state, action) {
  switch (action.type) {
    case "addTodo":
      const todo = action.todo;
      return { ...state, todos: [...state.todos, todo] };
    case "toggleTodo":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            todo.complete = !todo.complete;
          }
          return todo;
        })
      };
    case "deleteTodo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id)
      };
    case "editTodo":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.id) {
            todo.text = action.text;
          }
          return todo;
        })
      };
    default:
      return state;
  }
}
const TodosContext = React.createContext({
  todos: [
    {
      id: 0,
      text: "Hooks Todo List :))",
      complete: true
    }
  ]
});
function App() {
  const initialState = useContext(TodosContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <TodosContext.Provider value={{ state, dispatch }}>
        <TodosList />
      </TodosContext.Provider>
    </div>
  );
}
function TodosList() {
  const { state, dispatch } = useContext(TodosContext);
  const [value, setValue] = useState("");
  const [{ editMode, id }, setEditMode] = useState({
    editMode: false,
    id: ""
  });
  const input = useRef();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (editMode) {
      if (value !== "") {
        dispatch({
          type: "editTodo",
          id,
          text: value
        });
        setEditMode({ editMode: false, id: "" });
      }
    } else {
      value !== "" &&
        dispatch({
          type: "addTodo",
          todo: { id: uuidv1(), text: value, complete: false }
        });
    }
    setValue("");
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleToggle = (id) => {
    dispatch({ type: "toggleTodo", id });
  };
  const handleDelete = (id) => {
    dispatch({ type: "deleteTodo", id });
  };
  const handleEdit = (id, text) => {
    input.current.focus();
    setEditMode({ editMode: true, id });
    setValue(text);
  };
  return (
    <div>
      <h3>Hooks Todo List</h3>
      {state.todos.map((todo) => (
        <li
          key={todo.id}
          style={{ textDecoration: todo.complete ? "line-through" : "none" }}
          onDoubleClick={() => handleToggle(todo.id)}
        >
          {todo.text}
          <button onClick={() => handleDelete(todo.id)}>delete</button>
          <button onClick={() => handleEdit(todo.id, todo.text)}>Edit</button>
        </li>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={value}
          placeholder="Add Todos"
          ref={input}
        />
      </form>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
