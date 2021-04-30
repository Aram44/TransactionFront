import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import AccountService from '../../services/AccountService';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


class UserAmountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    initialState = {accounts: [],currency:'All', uid:0, pageCount: 0, page: 0,onFilter:false};

    componentDidMount(){
        AccountService.getAllAccounts().then((res) =>{
            console.log(res);
            this.setState({accounts : res.data.content});
            this.setState({pageCount: res.data.totalPages});
        });
    }

    credentialChange = event => {
        console.log(event.target.value);
        this.setState({[event.target.name] : event.target.value});
    };
    doFilter(uid,currency){
        if(currency === 'All'){
            currency = '';
        }
        if(uid===0){
            uid = '';
        }
        AccountService.getAllByFilter(uid,currency,this.state.page).then((res) =>{
            console.log(res);
            this.setState({accounts : res.data.content});
            this.setState({pageCount: res.data.totalPages});
        });
        
    }
    render() {
        return (
            <div className="container text-center">
                <h2 className="w-100 text-center mt-2">Accounts List</h2>
                <div className="d-flex w-50 justify-content-center align-items-center">
                    <Select labelId="demo-simple-select-label" id="currency" value={this.state.currency}  onChange={this.credentialChange} name="currency" className="w-50">
                        <MenuItem value={'All'}>Select Currency</MenuItem>
                        <MenuItem value={'USD'}>USD</MenuItem>
                        <MenuItem value={'EUR'}>EUR</MenuItem>
                        <MenuItem value={'AMD'}>AMD</MenuItem>
                    </Select>
                    <b>User ID</b>
                    <input type="text" className="form-control w-25" placeholder="User ID" aria-label="User ID" aria-describedby="basic-addon2" value={this.state.uid}  onChange={this.credentialChange} name="uid"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" onClick={() => this.doFilter(this.state.uid, this.state.currency)} type="button">Search</button>
                    </div>
                </div>
                <div className="row container">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Account ID</th>
                                <th>User ID</th>
                                <th>Currency</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.accounts.map(account =>
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.uid}</td>
                                    <td>{account.currency}</td>
                                    <td>{(account.balance).toFixed(2)}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(UserAmountComponent);