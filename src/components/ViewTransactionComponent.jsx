import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import TransactionService from '../services/TransactionService';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        id: this.props.match.params.id,role:localStorage.getItem('role'),data:[],sender:[],senderAccount:[],receiver:[],receiverAccount:[]
    };

    componentDidMount(){
        TransactionService.getTransactionById(this.state.id).then((res) => {
            console.log(res);
            this.setState({data:res.data});
            this.setState({senderAccount:res.data.sender});
            this.setState({sender:res.data.sender.user});
            this.setState({receiverAccount:res.data.receiver});
            this.setState({receiver:res.data.receiver.user});
        });
    }
    
    render() {
        const {data,sender,senderAccount,receiver,receiverAccount} = this.state;
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
                                <td>Type</td>
                                <td>{data.type}</td>
                            </tr>
                            <tr>
                                <td>Id</td>
                                <td>{this.state.id}</td>
                            </tr>
                            <tr>
                                <td>Sender Account</td>
                                <td>{senderAccount.id}</td>
                            </tr>
                            {this.state.role==='admin'?
                            <tr>
                                <td>Sender Info</td>
                                <td>{"Name: "+sender.name+" Email: "+sender.email}</td>
                            </tr>
                            :''}
                            {this.state.data.type!=='WITHDRAWAL' || this.state.data.type!=='DEPOSIT'?
                            <tr>
                                <td>Receiver Account</td>
                                <td>{receiverAccount.id}</td>
                            </tr>
                            :''}
                            {this.state.role==='admin'?
                            <tr>
                                <td>Receiver Info</td>
                                <td>{"Name: "+receiver.name+" Email: "+receiver.email}</td>
                            </tr>
                            :''}
                            <tr>
                                <td>From {senderAccount.id}</td>
                                <td>{data.balance}</td>
                            </tr>
                            {this.state.data.type!=='WITHDRAWAL' || this.state.data.type!=='DEPOSIT'?
                            <tr>
                                <td>To {receiverAccount.id}</td>
                                <td>{data.balance}</td>
                            </tr>
                            :''}
                            <tr>
                                <td>Fee</td>
                                <td>{data.fee}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{data.status}</td>
                            </tr>
                            <tr>
                                <td>Send Time</td>
                                <td>{data.sendtime}</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        );
    }
}

export default withRouter(View);