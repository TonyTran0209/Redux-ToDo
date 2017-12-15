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
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

////////// Redux DevTools //////////
const store = createStore(todoApp, {}, compose(
    // applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
    // batchedSubscribe(/* ... */)
));

/********** PRESENTATION COMPONENT **********/
// const {Component} = React;
let nextTodoId = 0;

const FilterLink = ({
                        filter, // a string of store.type
                        currentFilter,
                        children, // content of <a> tag
                        onClick // onclick the filter
                    }) => {
    // current filter link is unclickable
    if (filter === currentFilter) {
        return <span>{children}</span>;
    }

    return (
        <a href='#'
           onClick={e => {
               e.preventDefault();
               onClick(filter);
           }}
        >
            {children}
        </a>
    );
};

const FilterGroup = ({
                         visibilityFilter,
                         onFilterClick
                     }) => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}
        >
            All
        </FilterLink>
        {', '}
        <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}
        >
            Active
        </FilterLink>
        {', '}
        <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
            onClick={onFilterClick}
        >
            Completed
        </FilterLink>
    </p>
);

const AddTodo = ({
                     onAddClick // props
                 }) => {
    let input; // this.input

    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button onClick={() => {
                onAddClick(input.value);
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    );
};

const Todo = ({
                  onClick,
                  completed,
                  text
              }) => (
    <li
        onClick={onClick}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>
);

const TodoList = ({
                      todos,
                      onTodoClick
                  }) => (
    <ul>
        {todos && todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
);

const getVisibleTodos = (todos,
                         filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
    }
}

const TodoApp = ({
                     todos,
                     visibilityFilter
                 }) => (
    <div>
        <FilterGroup
            visibilityFilter={visibilityFilter}
            onFilterClick={filter =>
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                })
            }
        />
        <AddTodo
            onAddClick={text =>
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text
                })
            }
        />
        <TodoList
            todos={
                getVisibleTodos(
                    todos,
                    visibilityFilter
                )
            }
            onTodoClick={id =>
                store.dispatch({
                    type: 'TOGGLE_TODO',
                    id
                })
            }
        />
    </div>
);

const render = () => {
    ReactDOM.render(
        <TodoApp
            {...store.getState()} // read current state of store => array (as a props)
        />,
        document.getElementById('root')
    );
};

store.subscribe(render); // watching the changing store
render();

export default TodoApp;