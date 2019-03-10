import React from 'react';
import {connect} from 'react-redux';
import {TodoActionCreator} from '../../actions/todo.actions';
import {NavLink} from "react-router-dom";
import DeleteModal from "./partials/DeleteModal";

class TodoCreateOrEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todoToDelete: {},
            showDialog: false
        };
    }

    componentWillMount() {
        this.props.fetchTodo(this.props.match.params.id)
    }

    requestDelete(todo) {
        this.setState({
            todoToDelete: todo,
            showDialog: true,
        });
    }

    deleteTodo() {
        this.setState({showDialog: false});
        this.props.deleteTodo(this.state.todoToDelete);
        this.props.history.push('/')
    }

    componentWillUnmount() {
        this.props.deselectTodo();
    }

    render() {
        const {todo} = this.props;
        // todo has to be loaded
        if (!todo || !todo.id) {
            return <div>Loading...</div>
        }

        return (
            <div className="text-center container">
                <DeleteModal todo={todo} onDeleteClicked={this.deleteTodo.bind(this)}
                             shouldShow={this.state.showDialog}
                             onCancelClicked={() => {
                                 this.setState({showDialog: false})
                             }}/>
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="form-group">
                            <h3>Title:</h3>
                            <p>{todo.title}</p>
                        </div>
                        <h3>Description:</h3>
                        <p>{todo.description}</p>
                        Completed: <input type="checkbox" checked={todo.completed} disabled={true}/>
                    </div>
                </div>
                <br/>

                <span className='btn btn-danger'
                      onClick={(evt) => this.requestDelete(todo)}>Delete</span>
                &nbsp;
                <NavLink className="btn btn-warning" to={`/todos/${todo.id}/edit`}>
                    Edit
                </NavLink>

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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTodo: (id) => dispatch(TodoActionCreator.fetchTodo(id)),
        deleteTodo: (todo) => dispatch(TodoActionCreator.deleteTodo(todo)),
        deselectTodo: () => dispatch(TodoActionCreator.deselectTodo()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoCreateOrEdit);
