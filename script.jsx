//////////////////////////////////////////////////
// CONTROLLER
//////////////////////////////////////////////////
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                // current state + new state object in action
                {
                    id: action.id,
                    text: action.text,
                    completed: false // default value
                }
            ];
        default:
            return state; // return the current state
    }
};

//////////////////////////////////////////////////
// TEST FUNCTION: ADD
//////////////////////////////////////////////////
const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];

    // UnitTest: check reducer is pure function
    deepFreeze(stateBefore);
    deepFreeze(action);

    // UnitTest: stateBefore + action = stateAfter
    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

//////////////////////////////////////////////////
// CALL FUNCTIONS
//////////////////////////////////////////////////
testAddTodo();
console.log('All tests passed.') || displayInPreview('All tests passed.');


//////////////////////////////////////////////////
// ADDITIONAL FUNCTIONS
//////////////////////////////////////////////////

// Function exported from deep-freeze lib
function deepFreeze(o) {
    if (o === Object(o)) {
        Object.isFrozen(o) || Object.freeze(o)
        Object.getOwnPropertyNames(o).forEach(function (prop) {
            prop === 'constructor' || deepFreeze(o[prop])
        })
    }
    return o
}

// display in plunker preview
function displayInPreview(string) {
    var newDiv = document.createElement("div");
    var newContent = document.createTextNode(string);
    newDiv.appendChild(newContent);
    document.body.appendChild(newDiv)
}