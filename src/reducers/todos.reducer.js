import {TodoAction} from "../actions/types";

const INITIAL_STATE = {
    is_loading: false,
    todo_created: false,
    todo_deleted: false,
    todos: [],
    selected_todo: {}
};

export const TodoReducer = function (state = INITIAL_STATE, action) {
    switch (action.type) {

        case TodoAction.local.TODO_SET_IS_LOADING:
            return {...state, is_loading: action.is_loading};
        case TodoAction.local.FETCH_TODOS_SUCCESS:
            return {
                ...state,
                is_loading: false,
                todos: action.todos
            };
        case TodoAction.local.FETCH_TODO_SUCCESS:
            return {...state, selected_todo: action.todo, is_loading: false};

        case TodoAction.local.CREATE_TODO_SUCCESS: {
            const newState = {
                ...state, is_loading: false, todo_created: true,
            };
            newState.todos.push(action.todo);
            return newState;
        }
        case TodoAction.local.CLEAR_TODO_CREATED:
            return {...state, todo_created: false};

        case TodoAction.local.CHANGE_TODO:
            return {...state, selected_todo: {...state.selected_todo, ...action.changes}};
        case TodoAction.local.UPDATE_TODO_SUCCESS:
            return {
                ...state, is_loading: false,
                todos: state.todos.map(todo => { // leave them as they were, except for the updated one
                    if (todo.id === action.id)
                        return {...todo, ...action.todo};
                    else
                        return {...todo};
                })
            };
        case TodoAction.local.DELETE_TODO_SUCCESS:
            return {
                ...state, todo_deleted: true,
                // state.todos.filter(todo => todo.id !== action.id);
                todos: state.todos.filter(({id}) => id !== action.todo.id)
            };
        case TodoAction.local.CLEAR_TODO_DELETED:
            return {
                ...state, todo_deleted: false
            };
        case TodoAction.local.CLEAR_TODO_SELECTED:
            return {...state, selected_todo: {}};
        default:
            return state;
    }
};
