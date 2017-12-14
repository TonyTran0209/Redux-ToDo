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

const {combineReducers} = Redux;
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const {createStore, compose} = Redux;
const store = createStore(todoApp, {}, compose(
    // applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
    // batchedSubscribe(/* ... */)
));