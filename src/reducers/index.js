import {combineReducers} from "redux";
import {TodoReducer} from './todos.reducer'
import {UiReducer} from './ui.reducer'

export const rootReducer = combineReducers({
    TodoReducer,
    UiReducer,
});