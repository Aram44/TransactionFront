import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import LoanService from '../services/LoanService';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    initialState = {
        schedules: [], id: this.props.match.params.id
    };
    componentDidMount(){
        LoanService.getLoanById(this.state.id).then((res) => {
            console.log(res);
            this.setState({schedules: res.data.content});
        });
    }
    
    render() {
        return (
            <div className="container text-center">
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Balance</th>
                                <th>Paymant Date</th>
                                <th>Monthly</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                this.state.schedules.map(schedule =>
                                <tr key={schedule.id}>
                                    <td>{schedule.month}</td>
                                    <td>{schedule.balance}</td>
                                    <td>{schedule.paymantdate}</td>
                                    <td>{schedule.monthly}</td>
                                    <td>{schedule.status}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
            </div>
        );
    }
}

export default withRouter(View);