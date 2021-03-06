import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import TransactionService from '../services/TransactionService';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        id: this.props.match.params.id,role:localStorage.getItem('role'),sender:'',senderName:'',receiverName:'',senderEmail:'',receiverEmail:'',receiver:'',balance:'',status:'',sendtime:'',type:''
    };

    componentDidMount(){
        TransactionService.getTransactionById(this.state.id).then((res) => {
            console.log(res);
            this.setState({"sender":res.data.sender});
            this.setState({"receiver":res.data.receiver});
            this.setState({"senderName":res.data.senderName});
            this.setState({"receiverName":res.data.receiverName});
            this.setState({"senderEmail":res.data.senderEmail});
            this.setState({"receiverEmail":res.data.receiverEmail});
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
                            {this.state.role==='admin'?
                            <tr>
                                <td>Sender Info</td>
                                <td>{"Name: "+this.state.senderName+" Email: "+this.state.senderEmail}</td>
                            </tr>
                            :''}
                            {this.state.role==='admin'?
                            <tr>
                                <td>Receiver Info</td>
                                <td>{"Name: "+this.state.receiverName+" Email: "+this.state.receiverEmail}</td>
                            </tr>
                            :''}
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