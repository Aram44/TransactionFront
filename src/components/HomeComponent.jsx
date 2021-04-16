import React, { Component } from 'react';
import ListTransactionComponent from './ListTransactionComponent';
import ListAccountComponent from './ListAccountComponent';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import ListUserComponent from './ListUserComponent';
import {withRouter} from 'react-router-dom';
import RegisterConponent from './RegisterConponent';
import AddTransactionComponent from './AddTransactionComponent';
import ViewTransactionComponent from './ViewTransactionComponent';

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    if(localStorage.getItem('jwtToken') === null){
      this.gologin();
    }
    if(localStorage.getItem('role') === 'none'){
      this.goChangePassword();
    }
  }
  initialState = {
    role: localStorage.getItem('role'), id: localStorage.getItem('uid')
  };
  gologin = () => {
    this.props.history.replace("/login");
  };
  goChangePassword(){
    this.props.history.replace("/changepass");
  }
  logoutClick = () => {
    localStorage.clear();
    this.gologin();
  };
  
  render() {
    return (
    <div>
         <Router>
      <div>
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <p className="h5 my-0 me-md-auto fw-normal">Transaction</p>
            <nav className="my-2 my-md-0 me-md-3">
                    <Link to={"/"} className="p-2 text-dark">Transactions</Link>
                    {this.state.role==='user'?<Link to={"/account"} className="p-2 text-dark">Accounts</Link>:<Link to={"/users"} className="p-2 text-dark">Users</Link>}
            </nav>
            <div style={{flex: 1}}></div>
            { <Link to={"/logout"} onClick={this.logoutClick} className="btn btn-outline-primary nav-link">Sign Out</Link> }
        </div>

        <Switch>
          <Route exact path="/">
            <ListTransactionComponent />
          </Route>
          <Route exact path="/users">
            <ListUserComponent />
          </Route>
          <Route exact path="/transaction">
            <AddTransactionComponent />
          </Route>
          <Route exact path="/account">
            <ListAccountComponent />
          </Route>
          <Route exact path="/register">
            <RegisterConponent />
          </Route>
          <Route exact path="/view/:id" component={ViewTransactionComponent}/>
        </Switch>
      </div>
    </Router>
    </div>
    
  );
  }
}

export default withRouter(HomeComponent);
