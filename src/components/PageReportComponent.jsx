import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import AllAmountComponent from './reports/AllAmountComponent';
import ListScheduleComponent from './reports/ListScheduleComponent';
import ListTransactionComponent from './reports/ListTransactionComponent';
import ListLoanComponent from './reports/ListLoanComponent';
import UserAmountComponent from './reports/UserAmountComponent';

class PageReportComponent extends Component {
    render() {
        return (
            <div className="row w-100">
            <Router>
                <div className="d-flex flex-column p-3 bg-light h-100" style={{width: 280}}>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item"><Link to={"/report/"} className="nav-link">Total amounts</Link></li>
                        <li className="nav-item"><Link to={"/report/user/"} className="nav-link">Users balance</Link></li>
                        <li className="nav-item"><Link to={"/report/transactions/"} className="nav-link">Transactions</Link></li>
                        <li className="nav-item"><Link to={"/report/loans/"} className="nav-link">Loans</Link></li>
                        <li className="nav-item"><Link to={"/report/payments/"} className="nav-link">Payments</Link></li>
                    </ul>
                </div>
                
                <div className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                <Switch>
                    <Route exact path="/report/">
                        <AllAmountComponent/>
                    </Route>
                    <Route exact path="/report/user/">
                        <UserAmountComponent/>
                    </Route>
                    <Route exact path="/report/transactions/">
                        <ListTransactionComponent/>
                    </Route>
                    <Route exact path="/report/loans/">
                        <ListLoanComponent/>
                    </Route>
                    <Route exact path="/report/payments/">
                        <ListScheduleComponent/>
                    </Route>
                </Switch>
                </div>
            </Router>
            </div>
        );
    }
}

export default withRouter(PageReportComponent);