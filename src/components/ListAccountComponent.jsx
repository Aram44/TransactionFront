import React, { Component } from 'react';
import AccountService from '../services/AccountService';
import {withRouter} from 'react-router-dom';

class ListAccountComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            accounts: [],
            mes:''
        }
    }
    
    componentDidMount(){
        let uid = localStorage.getItem('uid');
        AccountService.getAccounts(uid).then((res) => {
            this.setState({accounts: res.data.content});
        });
    }
    create() {
        let uid = localStorage.getItem('uid');
        AccountService.crateAccount(uid).then(response => {
            let data = response.data;
            console.log(data);
        });
    }
    remove(id) {
        AccountService.removeAccount(id).then(response => {
            let data = response.data;
            console.log(data);
            this.componentDidMount();
        });
    }
    render() {
        return (
            <div className="container text-center">
                <h2>Accounts List</h2>
                <div className="d-flex justify-content-start mb-1">
                    <button className="btn btn-outline-primary" onClick={this.create}>Add Account</button>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Account ID</th>
                                <th>Balance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.accounts.map(account =>
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.balance}</td>
                                    <td><a onClick={() => this.remove(account.id)} className="btn btn-outline-primary">Remove</a></td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ListAccountComponent);