import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {AppBar,Tabs,Tab,Typography,Box,Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountService from '../services/AccountService';
import LoanService from '../services/LoanService';
import axios from 'axios';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={4}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

class AddTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        role:localStorage.getItem('role'),accounts: [],loans: [],sender:1, receiver:1, balance: 1,value: 0,month:1, error:'', message: '',id: this.props.match.params.id,loanCurrency: 'USD'
    };
    componentDidMount(){
      let uid = localStorage.getItem('uid');
      LoanService.getAllLoanById(uid).then((res) => {
        this.setState({loans: res.data.content});
        if(this.state.role==='user' && !this.state.id){
          this.setState({receiver: res.data.content[0].id});
          this.setState({id: res.data.content[0].id});
          if(res.data.content[0].currency === 0){
            this.setState({loanCurrency: "USD"});
          }else if(res.data.content[0].currency === 1){
            this.setState({loanCurrency: "EUR"});
          }else{
            this.setState({loanCurrency: "AMD"});
          }
        }
     });
      AccountService.getAccounts(uid).then((res) => {
          this.setState({accounts: res.data.content});
          if(this.state.role==='user'){
            this.setState({sender: res.data.content[0].id});
          }
      });
      if(this.state.id){
        this.setState({receiver: this.state.id});
        LoanService.getLoanById(this.state.id).then((res) => {
          this.setState({loanCurrency: res.data.currency});
        });
        this.setState({"value":2});
      }
  }
    handleChange = (event, newValue) => {
        this.setState({"value":newValue});
    };

    createTransaction = (type) => {
      console.log(this.state.sender);
      console.log(this.state.receiver);
      console.log(this.state.balance);
      console.log(this.state.month);
      if(this.state.balance > 0 || this.state.balance!==''){
        const credentials = JSON.stringify({
            sender: this.state.sender,
            receiver: this.state.receiver,
            balance: this.state.balance,
            status: 1,
            month: this.state.month,
            type: type
        });
        const token = localStorage.getItem('jwtToken');
        axios.post("http://localhost:9090/api/v1/transaction/", credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            let data = response.data;
            this.setState({"balance": 1});
            this.setState({"message": data.message});
            this.setState({"error": data.error});
            this.componentDidMount();
        }).catch(error => {
            this.setState({"error": "Something wrong with data"});
            setTimeout(() => this.setState({"error": ""}), 3000);
        });
        if(this.state.role==='admin'){
          this.setState(() => this.initialState);
        }
      }else{
        this.setState({"error": "The balance can not be less than 0"});
        setTimeout(() => this.setState({"error": ""}), 3000);
      }
    };

    credentialChange = event => {
        if(this.state.id && event.target.name==='receiver'){
          LoanService.getLoanById(event.target.value).then((res) => {
            this.setState({loanCurrency: res.data.currency});
          });
        }
        if (event.target.name==='year' || event.target.name==='balance') {
          console.log(event.target.value);
          if (Math.ceil(event.target.value) > 0 || event.target.value==='') {
              this.setState({[event.target.name] : event.target.value});
          }else{
              this.setState({"error": "The value can not be less than 0"});
              setTimeout(() => this.setState({"error": ""}), 3000);
          }
        }else{
          this.setState({[event.target.name] : event.target.value});
        }
    };
    createSelect(){
      return(
      <select name="sender" value={this.state.sender} onChange={this.credentialChange} className="form-control w-100">
          {
            this.state.accounts.map(account =>
            <option key={account.id} value={account.id}>{account.id} : ({(account.balance).toFixed(5)} {account.currency})</option>)
         }
      </select>
      )
    }
    createSelectAccount(){
      return(
      <select name="sender" value={this.state.sender} onChange={this.credentialChange} className="form-control w-100">
          {
            this.state.accounts.map(account =>{
              if(account.currency === this.state.loanCurrency){
                return <option key={account.id} value={account.id}>{account.id} : ({(account.balance).toFixed(5)} {account.currency})</option>
              }
            }
            )
         }
      </select>
      )
    }

    createSelectLoan(){
      return(
      <select name="receiver" value={this.state.receiver} onChange={this.credentialChange} className="form-control w-100">
          {
            this.state.loans.map(loan =>
            <option key={loan.id} value={loan.id}>{loan.name} : (id: {loan.id} monthly: {loan.monthly} {loan.currency})</option>)
         }
      </select>
      )
    }
    render() {
        const {role,sender,receiver,balance,value, error,month,message} = this.state;

        return (
            <div className="container" style={{width: 670}}>
            {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
      <AppBar position="static">
        <Tabs value={value} onChange={this.handleChange} aria-label="simple tabs example">
          <Tab label="Withdrawal" {...a11yProps(0)} />
          <Tab label="Internal" {...a11yProps(1)} />
          <Tab label="Loan" {...a11yProps(2)} />
          {role==='admin'?<Tab label="Deposit" {...a11yProps(3)} />:''}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label htmlFor="deposit" className="text-left w-100">Accont ID</label>
       {role==='admin'?
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Account ID" onChange={this.credentialChange}/>
        :this.createSelect()}
        <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
        <Button variant="contained" color="primary" className="mt-2" onClick={() => this.createTransaction(1)}>Withdrawal</Button>
      </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label htmlFor="deposit" className="text-left w-100">Sender Accont ID</label>
       {role==='admin'?
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Sender Account ID" onChange={this.credentialChange}/>
        :this.createSelect()}
       <label htmlFor="deposit" className="text-left w-100 mt-2">Receiver Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="receiver" value={receiver} placeholder="Receiver Account ID" onChange={this.credentialChange}/>
        <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2 ">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
            <Button variant="contained" color="primary" className="mt-2" onClick={() => this.createTransaction(2)}>Save</Button>
      </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
        <label htmlFor="deposit" className="text-left w-100">Accont ID</label>
       {role==='admin'?
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Sender Account ID" onChange={this.credentialChange}/>
        :this.createSelectAccount()}
         <label htmlFor="loan" className="text-left w-100">Loan ID</label>
       {role==='admin'?
        <input type="number" className="form-control w-100" min="1" id="loan" label="Account ID" name="receiver" value={receiver} placeholder="Loan ID" onChange={this.credentialChange}/>
        :this.createSelectLoan()}
       <label htmlFor="month" className="text-left w-100 mt-2">Month</label>
        <input type="number" className="form-control w-100" min="1" id="month" label="Account ID" name="month" value={month} placeholder="Month" onChange={this.credentialChange}/>
        <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2 ">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
            <Button variant="contained" color="primary" className="mt-2" onClick={() => this.createTransaction(3)}>Save</Button>
      </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label htmlFor="deposit" className="text-left w-100">Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Account ID" onChange={this.credentialChange}/>
        <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" name="balance" label="Balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
        <Button variant="contained" color="primary" className="mt-2" onClick={() => this.createTransaction(0)}>Deposit</Button>
      </div>
      </TabPanel>
    </div>
        );
    }
}

export default withRouter(AddTransaction);