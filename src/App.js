import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose, combineReducers} from 'redux'

/********** CONTROLLER **********/
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                // current state + new state object in action
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            // clone array (shouldn't change original array)
            return state.map(t => todo(t, action));
        default:
            return state; // return the current state
    }
};

/********** FILTER **********/
const visibilityFilter = (state = 'SHOW_ALL',
                          action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

/********** DECLARATION **********/
// const {combineReducers} = Redux; // => import { createStore, compose, combineReducers } from 'redux'
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

// const {createStore} = Redux;
// const store = createStore(todoApp);
//==> Redux DevTools
// const {createStore, compose} = Redux; // => import { createStore, compose, combineReducers } from 'redux'
const store = createStore(todoApp, {}, compose(
    // applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
    // batchedSubscribe(/* ... */)
));

/********** DECLARATION **********/
const {Component} = React;
let nextTodoId = 0;

class TodoApp extends Component {
    render() {
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/> {/*use react callback ref API*/}
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++
                    });
                    this.input.value = ''; // clear after add
                }}>
                    Add Todo
                </button>
                <ul>
                    {/*componet receive ToDos as a prop*/}
                    {this.props.todos && this.props.todos.map(todo =>
                        <li key={todo.id}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }}
                            style={{
                                textDecoration:
                                    todo.completed ?
                                        'line-through' :
                                        'none'
                            }}>
                            {todo.text}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp
            todos={store.getState().todos} // read current state of store => array (as a props)
        />,
        document.getElementById('root')
    );
};

store.subscribe(render); // watching the changing store
render();

export default TodoApp;