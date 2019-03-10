import {UiActionCreator} from "./ui.actions";
import {TodoAxiosService} from "../services/remote/TodoAxiosService";
import {TodoAction} from "./types";


function loading() {
    return {
        type: TodoAction.local.TODO_SET_IS_LOADING,
        is_loading: true,
    };
}

const fetchedTodos = (todos) => {
    return {
        type: TodoAction.local.FETCH_TODOS_SUCCESS,
        todos
    }
};
const fetchedTodo = (todo) => {
    return {
        type: TodoAction.local.FETCH_TODO_SUCCESS,
        todo
    };
};

const fetchTodos = function (query = {}) {
    console.trace('TodoActionCreator::fetchTodos');
    return (dispatch) => {
        console.trace('TodoActionCreator::fetchTodos_Async');
        dispatch(UiActionCreator.info('Loading products'));
        dispatch(TodoActionCreator.loading());
        TodoAxiosService.fetchAll(query).then(res => {
            if (res.status === 200 && res.data instanceof Array) {
                dispatch(TodoActionCreator.fetchedTodos(res.data));
                dispatch(UiActionCreator.successToast('Todos loaded successfully'))
            } else
                dispatch(UiActionCreator.dialogError(res.data.full_messages ? res.data.full_messages[0] : 'An dialogError occurred'));
        }).catch(err => {
            dispatch(UiActionCreator.dialogError('It could not load the todos, reason: ' + err.message));
            console.error(err);
        });
    }
};

export function deleteTodo(todo) {
    console.trace('TodoActionCreator::deleteTodo');
    return (dispatch) => {
        console.trace('TodoActionCreator::deleteTodo_Async');
        dispatch(UiActionCreator.info('deleting todo'));
        dispatch(TodoActionCreator.loading());
        TodoAxiosService.delete(todo.id).then(res => {
            if (res.status === 204) {
                dispatch(UiActionCreator.successToast('Todo deleted successfully'));
                dispatch(deletedTodo(todo));
            } else
                dispatch(UiActionCreator.dialogError(res.data.full_messages ? res.data.full_messages : 'An error occurred'));
        }).catch(err => {
            dispatch(UiActionCreator.dialogError('It could not load the todo, reason: ' + err.message));
        });
    };

    function deletedTodo(todo) {
        return {
            type: TodoAction.local.DELETE_TODO_SUCCESS,
            todo,
        }
    }
}

export function updateTodo(todo) {
    console.trace('TodoActionCreator::fetchTodo');
    return (dispatch) => {
        console.trace('TodoActionCreator::fetchTodo_Async');
        dispatch(UiActionCreator.info('Loading products'));
        dispatch(TodoActionCreator.loading());
        TodoAxiosService.update(todo).then(res => {
            if (res.status === 200 && res.data.id) {
                stripResponse(res.data);
                dispatch(UiActionCreator.clear());
                dispatch(UiActionCreator.successToast('Todo updated successfully'));
                dispatch(updatedTodo(res.data));
            } else
                dispatch(UiActionCreator.dialogError(res.data.full_messages ? res.data.full_messages : 'An dialogError occurred'));
        }).catch(err => {
            console.error(err);
            dispatch(UiActionCreator.dialogError('It could not load the todo, reason: ' + err.message));
        });
    };

    function updatedTodo(todo) {
        return {
            type: TodoAction.local.UPDATE_TODO_SUCCESS,
            todo,
            id: todo.id,
        }
    }
}

function stripResponse(data) {
    delete data.success;
    delete data.full_messages;
    return data;
}

export function selectedTodoChanged(changes) {
    return {
        type: TodoAction.local.CHANGE_TODO,
        changes
    }
}

export function fetchTodo(id) {
    console.trace('TodoActionCreator::fetchTodo');
    return (dispatch) => {
        console.trace('TodoActionCreator::fetchTodo_Async');
        dispatch(UiActionCreator.info('Loading todos'));
        dispatch(TodoActionCreator.loading());
        TodoAxiosService.fetchById(id).then(res => {
            if (res.status === 200 && res.data.id) {
                dispatch(UiActionCreator.clear());
                dispatch(UiActionCreator.successToast('Todo Loaded successfully'));
                stripResponse(res.data);
                dispatch(TodoActionCreator.fetchedTodo(res.data));
            } else
                dispatch(UiActionCreator.dialogError(res.data.full_messages ? res.data.full_messages : 'An dialogError occurred'));
        }).catch(err => {
            console.error(err);
            dispatch(UiActionCreator.dialogError('It could not load the todo, reason: ' + err.message));
        });
    }
}

function setTodoSelected(todo) {
    return fetchedTodo(todo);
}

function deleteTodos() {

}

export function deselectTodo() {
    return {
        type: TodoAction.local.CLEAR_TODO_SELECTED
    }
}

export function createdTodo(todo) {
    return {
        type: TodoAction.local.CREATE_TODO_SUCCESS,
        todo
    }
}

export function createTodo(data) {
    return function (dispatch) {
        TodoAxiosService.create(data).then(res => {
            if (res.status === 201) {
                dispatch(UiActionCreator.successToast('Todo created successfully'));
                dispatch(TodoActionCreator.createdTodo(res.data));
            } else {
                dispatch(UiActionCreator.dialogError('An error occured'));
            }
        }).catch(err => {

        });
    }
}

export const clearTodoCreated = () => {
    return {
        type: TodoAction.local.CLEAR_TODO_CREATED
    };
};
export const clearTodoDeleted = () => {
    return {
        type: TodoAction.local.CLEAR_TODO_DELETED
    };
};

export const TodoActionCreator = {
    fetchTodos,
    fetchTodo,
    fetchedTodo,
    fetchedTodos,
    setTodoSelected, loading,
    updateTodo,
    deleteTodo,
    deleteTodos,
    deselectTodo,
    createTodo,
    createdTodo,
    clearTodoCreated
};
