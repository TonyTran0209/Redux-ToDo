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

// const {combineReducers} = Redux;
const combineReducers = (reducers) => { // reducers: todos, visibilityFilter
    return (state = {}, action) => {
        // Object.keys(reducers): get every element of 'reducers'
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                // set every element from 'reducers' to the 'nextState' object
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            }, // 'reduce' method push every 'nextState' object to 'state' tree
            {} // initial empty object for 'nextState'
        );
    };
};

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

/********** SHOW CONSOLE LOG **********/
console.log('Initial state:');
console.log(store.getState());
console.log('--------------------------------------------------');

console.log('Dispatching ADD_TODO.')
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------------------------------------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go shopping'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------------------------------------------');

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------------------------------------------');

console.log('Dispatching SET_VISIBILITY_FILTER');
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------------------------------------------');