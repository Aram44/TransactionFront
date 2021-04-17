import React, { Component } from 'react';
import TransactionService from '../services/TransactionService';
import { Link, withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';

class ListTransactionComponent extends Component {
    constructor(props){
        super(props);
        this.state = this.initialState;
        if(localStorage.getItem('jwtToken') === null){
            this.gologin();
        }
    }
    initialState = {
        transactions: [],start:'2021-04-16', finish:'2021-04-16',role: localStorage.getItem('role'), id: localStorage.getItem('uid')
    };
    gologin = () => {
        this.props.history.replace("/login");
    };
    onNavigateView(id){
        this.props.history.push("/view/"+id);
    }
    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };
    componentDidMount(){
        if(this.state.role === 'admin'){
            TransactionService.getAllTransactions().then((res) => {
                this.setState({transactions: res.data.content});
            });
        }else{
            TransactionService.getAllTransactionById(this.state.id).then((res) => {
                this.setState({transactions: res.data.content});
                console.log(res);
            });
        }
    }
    doFilter(start,finish){
        if(this.state.role === 'admin'){
            TransactionService.getFilter(start,finish).then((res) => {
                console.log(res);
                this.setState({transactions: res.data.content});
            });
        }else{
            let uid = localStorage.getItem('uid');
            TransactionService.getFilterUid(start,finish,uid).then((res) => {
                console.log(res);
                this.setState({transactions: res.data.content});
            });
        }
    }
    action(id,action){
        TransactionService.action(id,action).then((res) => {
            console.log(res);
            this.componentDidMount();
        });
    }
    render() {
        return (
            <div className="container text-center">
                <h2>Transaction List</h2>
                <div className="container d-flex flex-row mb-3 align-items-center">
                <Link to={"/transaction"} className="btn btn-outline-primary" style={{width:450}}>Add Transaction</Link>
                <div style={{flex:'1 1 100%'}}></div>
                <TextField id="date" label="from" type="date" defaultValue="2021-04-16" name="start" value={this.state.start} onChange={this.credentialChange}
                className="form-control" InputLabelProps={{shrink: true,}}/>
                <TextField id="date" label="to" type="date" defaultValue="2021-04-16" name="finish" value={this.state.finish} onChange={this.credentialChange}
                className="form-control" InputLabelProps={{shrink: true,}}/>
                <button className="btn btn-outline-primary mt-4" onClick={() => this.doFilter(this.state.start,this.state.finish)}>Search</button>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.transactions.map(transaction =>
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.sendtime}</td>
                                    {transaction.status === 'PROCESS' ? 
                                    this.state.role==='admin'? 
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(transaction.id,1)} type="submit" className="btn btn-outline-primary">Apply</a>
                                            <a onClick={() => this.action(transaction.id,2)} type="submit" className="btn btn-outline-primary">Refuse</a>
                                        </td>:
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(transaction.id,3)} type="submit" className="btn btn-outline-primary">Cancel</a>
                                        </td>
                                        :
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
                                        </td>  
                                    }
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ListTransactionComponent);