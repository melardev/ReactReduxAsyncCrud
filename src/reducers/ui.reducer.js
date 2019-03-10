import {UiAction} from '../actions/types';

const initialState = {
    alert: {type: '', message: ''},
    toast: {className: '', message: ''}
};

export const UiReducer = function (state = initialState, action) {
    switch (action.type) {
        case UiAction.TOAST_SUCCESS:
            if (state.toast.message === action.message)
                return state;
            return {
                ...state,
                toast: {
                    className: 'alert-success',
                    message: action.message
                }
            };
        case UiAction.TOAST_ERROR:
            return {
                ...state,
                toast: {
                    className: 'alert-danger',
                    message: action.message
                }
            };
        case UiAction.TOAST_CLEAR:
            return {...initialState, toast: {message: '', className: ''}};
        case UiAction.MESSAGE_CLEAR:
            return {...initialState, toast: {message: '', className: ''}, alert: {message: '', type: ''}};
        case UiAction.DIALOG_ERROR:
            return {...state, alert: {message: action.message, type: action.dialog_type}};
        case UiAction.DIALOG_CLEAR:
            return {...state, alert: {message: '', type: ''}};
        case UiAction.TOAST_SHOW:
            return {
                ...state,
                toast: {
                    className: action.className,
                    message: action.message
                }
            };
        default:
            return state
    }
};