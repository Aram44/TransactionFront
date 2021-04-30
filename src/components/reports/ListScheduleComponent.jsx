import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import ReportInfoService from '../../services/reports/ReportInfoService';

class ListScheduleComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            schedules: []
        }
    }
    componentDidMount(){
        ReportInfoService.getPaymentsInfo().then((res) => {
            console.log(res);
            this.setState({schedules: res.data});
        });
    }
    render() {
        return (
            <div className="container text-center">
                <h2>Payments List</h2>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>User ID</th>
                                <th>Loan ID</th>
                                <th>Balance</th>
                                <th>Month</th>
                                <th>Payment data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.schedules.map(schedule =>
                                <tr key={schedule.id}>
                                    <td>{schedule.id}</td>
                                    <td>{schedule.lid}</td>
                                    <td>{schedule.balance}</td>
                                    <td>{schedule.month}</td>
                                    <td>{schedule.paymantdate}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ListScheduleComponent);