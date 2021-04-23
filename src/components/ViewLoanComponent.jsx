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
        schedules: [], id: this.props.match.params.id, interest : 0, pageCount: 0, page: 0
    };
    componentDidMount(){
        LoanService.getLoanSchedulesById(this.state.id,this.state.page).then((res) => {
            console.log(res);
            this.setState({schedules: res.data.content});
            this.setState({pageCount: res.data.totalPages});
        });
        LoanService.getLoanById(this.state.id).then((res) => {
            this.setState({interest: (res.data.interest/res.data.months).toFixed(2)});
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
        return (
            <div className="container text-center">
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Paymant Date</th>
                                <th>Monthly</th>
                                <th>Balance</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                this.state.schedules.map(schedule =>
                                <tr key={schedule.id}>
                                    <td>{schedule.month}</td>
                                    <td>{schedule.paymantdate}</td>
                                    <td>{schedule.monthly}</td>
                                    <td>{schedule.balance}</td>
                                    <td>{schedule.monthly-this.state.interest}</td>
                                    <td>{this.state.interest}</td>
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