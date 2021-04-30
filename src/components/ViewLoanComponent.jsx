import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import LoanService from '../services/LoanService';
import ReactPaginate from "react-paginate";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    initialState = {
        schedules: [], id: this.props.match.params.id, totalInterest:0,interest : 0, pageCount: 0, page: 0, balance: 0,monthly:0,principal:0,currency: 'USD'
    };
    componentDidMount(){
        LoanService.getLoanSchedulesById(this.state.id,this.state.page).then((res) => {
            this.setState({schedules: res.data.content});
            this.setState({pageCount: res.data.totalPages});
        });
        LoanService.getLoanById(this.state.id).then((res) => {
            this.setState({interest: (res.data.interest/res.data.months).toFixed(2)});
            this.setState({monthly: res.data.monthly});
            this.setState({totalInterest: res.data.interest});
            this.setState({principal: res.data.amount});
            this.setState({currency: res.data.currency});
        });
        LoanService.getLoanInfoById(this.state.id).then((res) => {
            this.setState({balance: res.data.balance});
        });
    }
    handlePageClick= (data) => {
        this.setState({page: data.selected});
        LoanService.getLoanSchedulesById(this.state.id, data.selected).then((res) => {
            console.log(res);
            this.setState({schedules: res.data.content});
            this.setState({pageCount: res.data.totalPages});
        });
        window.scrollTo(0, 0);
    }
    
    render() {
        const {balance,monthly,interest,totalInterest,principal,currency} = this.state;
        return (
            <div className="container text-center">
                <div className="container">
                <div className="row">
                    <div className="col-sm">
                    Paid
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Interest</div>
                        <div className="col col-lg-3">{(Math.floor(balance/monthly)*interest).toFixed(2)} {currency}</div>
                    </div>
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Principal</div>
                        <div className="col col-lg-3">{Math.ceil((balance-(Math.floor(balance/monthly)*interest)).toFixed(2))} {currency}</div>
                    </div>
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Balance</div>
                        <div className="col col-lg-3">{balance} {currency}</div>
                    </div>
                    </div>
                    <div className="col-sm">
                    Future
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Interest</div>
                        <div className="col col-lg-3">{(totalInterest-(Math.floor(balance/monthly)*interest)).toFixed(2)} {currency}</div>
                    </div>
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Principal</div>
                        <div className="col col-lg-3">{(principal-(balance-(Math.floor(balance/monthly)*interest))).toFixed(2)} {currency}</div>
                    </div>
                    <div className="row mt-1 mb-1">
                        <div className="col text-left">Balance</div>
                        <div className="col col-lg-3">{(principal+totalInterest-balance).toFixed(2)} {currency}</div>
                    </div>
                    </div>
                </div>
                </div>
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Paymant Date</th>
                                <th>Monthly</th>
                                <th>Balance</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Paid</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                this.state.schedules.map(schedule =>
                                <tr key={schedule.id}>
                                    <td>{schedule.month}</td>
                                    <td>{schedule.paymantdate}</td>
                                    <td>{schedule.monthly} {currency}</td>
                                    <td>{(schedule.monthly-schedule.balance).toFixed(2)} {currency}</td>
                                    <td>{(schedule.monthly-interest).toFixed(2)} {currency}</td>
                                    <td>{interest} {currency}</td>
                                    <td>{schedule.balance} {currency}</td>
                                    <td>{schedule.status}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                    <div className="w-100 d-flex justify-content-center">
                    {this.state.pageCount>1?
                    <ReactPaginate
                        pageCount={this.state.pageCount}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        activeClassName="active"
                        disabledClassName="disabled"
                        previousLinkClassName="page-link"
                        nextLinkClassName="page-link"
                        disableInitialCallback={true}
                    />:''}
                </div>
            </div>
        );
    }
}

export default withRouter(View);