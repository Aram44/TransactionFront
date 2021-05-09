import React, { Component } from 'react';
import UserService from '../../services/UserService';
import { Link, withRouter } from "react-router-dom";

class ListUserComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            users: []
        }
    }
    componentDidMount(){
        UserService.getAllUsers().then((res) => {
            this.setState({users: res.data.content});
        });
    }
    render() {
        return (
            <div className="container text-center">
                <h2>Users List</h2>
                <div className="d-flex justify-content-start mb-1">
                    <Link to={"/register"} className="btn btn-outline-primary">Add User</Link>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map(user =>
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role.name}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ListUserComponent);