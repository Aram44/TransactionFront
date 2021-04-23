import React, { Component } from 'react';
import AccountService from '../services/AccountService';
import {withRouter} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
class ListAccountComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            accounts: [],
            mes:'',
            currency: 3,
            open: false
        }
    }
    componentDidMount(){
        let uid = localStorage.getItem('uid');
        AccountService.getAccounts(uid).then((res) => {
            this.setState({accounts: res.data.content});
        });
    }
    create = () => {
        if(this.state.currency!==3){
            let uid = localStorage.getItem('uid');
            AccountService.crateAccount(uid,this.state.currency).then(response => {
                let data = response.data;
                console.log(data);
                this.setState({"mes":data.message});
                this.componentDidMount();
            })
            .catch(error => {
                this.setState({"error":"Account not created"});
            });
        }else{
            this.setState({"open":true});
        }
    }
    remove(id) {
        AccountService.removeAccount(id).then(response => {
            let data = response.data;
            console.log(data);
            this.componentDidMount();
        });
    }
    credentialChange = event => {
        this.setState({[event.target.name] : event.target.value});
        console.log(event.target.value);
    }
    handleClose = () => {
        this.setState({"open":false});
    };
    
    render() {
        const {mes,error} = this.state;
        return (
            <div className="container text-center">
                <h2>Accounts List</h2>
                {mes && <div className="alert alert-success">{mes}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-flex justify-content-start mb-1">
                    <Select labelId="demo-simple-select-label" className="w-25" id="demo-simple-select" value={this.state.currency} onChange={this.credentialChange} name="currency">
                        <MenuItem value={3}>Select currency</MenuItem>
                        <MenuItem value={0}>Dolar</MenuItem>
                        <MenuItem value={1}>Euro</MenuItem>
                        <MenuItem value={2}>Dram</MenuItem>
                    </Select>
                    <button className="btn btn-outline-primary" onClick={this.create}>Add Account</button>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Account ID</th>
                                <th>Currency</th>
                                <th>Balance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.accounts.map(account =>
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.currency}</td>
                                    <td>{account.balance}</td>
                                    <td><a onClick={() => this.remove(account.id)} className="btn btn-outline-primary">Remove</a></td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
                    <DialogContent><DialogContentText>Please first select account currency</DialogContentText></DialogContent>
                    <DialogActions><Button onClick={this.handleClose} color="primary" autoFocus>Close</Button></DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withRouter(ListAccountComponent);