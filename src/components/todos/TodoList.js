import {connect} from "react-redux";
import React from "react";
import {TodoActionCreator} from "../../actions/todo.actions";
import {NavLink} from "react-router-dom";
import DeleteModal from "./partials/DeleteModal";

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Todos',
            todoToDelete: {},
            showDialog: false,
        };

        this.deleteTodo.bind(this);
    }

    onUrlChanged(location, action) {
        // we can force re-rendering with
        // this.forceUpdate();
        // or with
        // this.setState(this.state);
        if (this.props.location !== location) {
            this.loadTodos(location);
        }
    }

    componentDidMount() {
        this.unlisten = this.props.history.listen(this.onUrlChanged.bind(this));
        this.loadTodos(this.props.location);
    }

    loadTodos(location, page, page_size) {
        // Please notice why is important to understand difference between props.match.path vs props.location.pathname
        // since this component is mapped to an array, props.match.path is an array, location.pathname is always a string!

        if (location.pathname === '/todos') {
            this.setState({
                title: 'Newest Todos'
            });
            this.props.fetchTodos({completed: true});
        } else if (location.pathname.startsWith('/todos/completed')) {
            // ERROR: this.props.match is pointing to the previous URL!!
            // this.props.fetchTodos({tag: this.props.match.params.tag_slug});
            let slug = location.pathname.split("/", 4)[3];
            this.props.fetchTodos({completed: true});
            this.setState({
                title: 'Completed Todos'
            });
        } else if (location.pathname.startsWith('/todos/pending')) {
            let slug = location.pathname.split("/", 4)[3];
            this.props.fetchTodos({completed: false});
            this.setState({
                title: 'Pending Todos'
            });
        } else {
            this.props.fetchTodos({page, page_size});
            this.setState({
                title: 'Newest Todos'
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.location !== this.props.location) {
            return true;
        }
        return true;
    }

    componentWillUnmount() {
        this.unlisten();
    }

    onTodoSelected(todo) {
        this.props.onTodoSelected(todo);
    }

    toggleComplete(todo) {
        const todoToUpdate = {...todo};
        todoToUpdate.completed = !todoToUpdate.completed;
        this.props.updateTodo(todoToUpdate)
    }


    deleteTodo() {
        this.setState({showDialog: false});
        this.props.deleteTodo(this.state.todoToDelete);
    }

    requestDelete(todo) {
        this.setState({
            todoToDelete: todo,
            showDialog: true,
        });
    }

    render() {
        return (
            <div className="container">

                <DeleteModal todo={this.state.todoToDelete} onDeleteClicked={this.deleteTodo.bind(this)}
                             shouldShow={this.state.showDialog}
                             onCancelClicked={() => {
                                 this.setState({showDialog: false})
                             }}/>
                <NavLink className="btn btn-primary" to="/todos/new">Create</NavLink>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Completed</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.todos.map((todo, index) => {
                        return <tr key={index}>
                            <td>
                                {todo.title}
                            </td>
                            <td>
                                <input type='checkbox' onChange={() => this.toggleComplete.bind(this)(todo)}
                                       checked={todo.completed}/>
                            </td>
                            <td>
                                {todo.created_at}
                            </td>
                            <td>
                                {todo.updated_at}
                            </td>
                            <td>
                                <NavLink to={'/todos/' + todo.id} className='btn btn-info'>Details</NavLink>
                            </td>
                            <td>
                                <NavLink to={`/todos/${todo.id}/edit`} className='btn btn-warning'>Edit</NavLink>
                            </td>
                            <td>
                                <span className='btn btn-danger'
                                      onClick={(evt) => this.requestDelete(todo)}>Delete</span>
                            </td>
                        </tr>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        fetchTodos: (query) => dispatch(TodoActionCreator.fetchTodos(query)),
        onTodoSelected: (todo) => dispatch(TodoActionCreator.setTodoSelected(todo)),
        updateTodo: (todo) => dispatch(TodoActionCreator.updateTodo(todo)),
        deleteTodo: (todo) => dispatch(TodoActionCreator.deleteTodo(todo)),
        deleteAll: () => dispatch(TodoActionCreator.deleteTodos()),
    };
}

function mapStateToProps(state) {
    return {
        todos: state.TodoReducer.todos,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
// export default connect(mapStateToProps, {getTodos})(TodoList);
// export default connect(mapStateToProps, {getTodos:getTodos})(TodoList);
