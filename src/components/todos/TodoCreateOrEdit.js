import React from 'react';
import {connect} from 'react-redux';
import {selectedTodoChanged} from '../../actions/todo.actions';
import {
    updateTodo,
    deselectTodo,
    createTodo,
    clearTodoCreated,
    fetchTodo,
    clearTodoDeleted,
    deleteTodo
} from '../../actions/todo.actions';
import {NavLink} from "react-router-dom";

class TodoCreateOrEdit extends React.Component {
    /*
    static contextTypes = {
        router: React.PropTypes.object
    };
    */
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            title: '',
            description: '',
            completed: false,
            editMode: false,
            submitting: false,
        };
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        if (id) {
            this.setState({editMode: true});
            this.props.fetchTodo(this.props.match.params.id)
        } else {
            this.setState({editMode: false});
        }
    }

    onSubmitForm(event) {
        this.props.updateTodo(this.state)
    }

    componentWillUnmount() {
        if (this.props.todo && this.props.todo.id)
            this.props.deselectTodo();
    }

    onInputChange(key, evt) {
        if (key === 'completed') {
            this.setState({[key]: evt.target.checked});
        } else
            this.setState({[key]: evt.target.value});
    }

    updateTodo() {
        this.props.updateTodo(this.props.todo);
    }

    deleteTodo() {
        this.props.deleteTodo(this.props.todo);
    }

    createOrUpdate() {
        if (this.state.editMode)
            this.props.updateTodo(this.state);
        else
            this.props.createTodo(this.state);
    }

    componentWillUpdate(nextProps, nextState, nextContext) {

        if (this.props.todo.id == null && nextProps.todo.id != null) {
            this.setState({
                ...nextProps.todo,
            });
        }

        if (this.props.todo_created === false && nextProps.todo_created === true) {
            this.props.clearTodoCreated();
            this.props.history.push('/');
        }

        if (this.props.todo_deleted === false && nextProps.todo_deleted === true) {
            this.props.clearTodoDeleted();
            this.props.history.push('/');
        }
    }

    render() {
        const {todo} = this.props;
        // todo has to be loaded
        if (this.state.editMode && (!todo || !todo.id)) {
            return <div>Loading...</div>
        }

        return (
            <div className="text-center container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="form-group">
                            <label htmlFor="title"/>Title:
                            <input type="text" name="title" value={this.state.title} className="form-control"
                                   onChange={(evt) => this.onInputChange('title', evt)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description"/>Description:
                            <input type="text" name="description" className="form-control"
                                   value={this.state.description}
                                   onChange={(evt) => this.onInputChange('description', evt)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="completed"/>Completed:
                            <input id="completed" type="checkbox" name="checkbox" checked={this.state.completed}
                                   onChange={(evt) => this.onInputChange('completed', evt)}
                            />
                        </div>
                    </div>
                </div>
                <br/>
                <button className="btn btn-info" onClick={this.createOrUpdate.bind(this)}
                        disabled={this.state.submitting}>
                    {todo && todo.id ? 'Update' : 'Create'}
                </button>
                &nbsp;
                {this.state.editMode && <button className="btn btn-danger" onClick={this.deleteTodo.bind(this)}>Delete
                </button>}
                &nbsp;
                <NavLink className="btn btn-success" to="/">Back to home
                </NavLink>
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    return {
        todo: state.TodoReducer.selected_todo,
        todo_created: state.TodoReducer.todo_created,
        todo_deleted: state.TodoReducer.todo_deleted,
    };
}


export default connect(mapStateToProps, {
    // Each time we call this.props.getTodo() it will trigger dispatch(getTodoAction)
    fetchTodo,
    selectedTodoChanged,
    updateTodo,
    deselectTodo,
    deleteTodo,
    createTodo,
    clearTodoCreated,
    clearTodoDeleted
    // Each time we call this.props.deleteTodo() it will trigger dispatch(getDeleteTodoAction)
})(TodoCreateOrEdit);
