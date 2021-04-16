import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import TransactionService from '../services/TransactionService';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        id: this.props.match.params.id,sender:0,receiver:0,balance:0,status:'',sendtime:'',type:''
    };

    componentDidMount(){
        TransactionService.getTransactionById(this.state.id).then((res) => {
            console.log(res.data);
            this.setState({"sender":res.data.sender});
            this.setState({"receiver":res.data.receiver});
            this.setState({"balance":res.data.balance});
            this.setState({"status":res.data.status});
            this.setState({"sendtime":res.data.sendtime});
            this.setState({"type":res.data.type});
        });
    }
    
    render() {

        return (
            <div className="container text-center">
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Nmae</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Id</td>
                                <td>{this.state.id}</td>
                            </tr>
                            <tr>
                                <td>Sender Account</td>
                                <td>{this.state.sender}</td>
                            </tr>
                            <tr>
                                <td>Receiver Account</td>
                                <td>{this.state.receiver}</td>
                            </tr>
                            <tr>
                                <td>Balance</td>
                                <td>{this.state.balance}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{this.state.status}</td>
                            </tr>
                            <tr>
                                <td>Send Time</td>
                                <td>{this.state.sendtime}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{this.state.type}</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        );
    }
}

export default withRouter(View);