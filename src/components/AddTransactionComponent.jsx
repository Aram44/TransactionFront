import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {AppBar,Tabs,Tab,Typography,Box,Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountService from '../services/AccountService';
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
          <Box p={3}>
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
        role:localStorage.getItem('role'),accounts: [],sender:1, receiver:1, balance: 1,value: 0, error:''
    };
    componentDidMount(){
      let uid = localStorage.getItem('uid');
      AccountService.getAccounts(uid).then((res) => {
          this.setState({accounts: res.data.content});
          if(this.state.role==='user'){
            this.setState({sender: res.data.content[0].id});
          }
      });
  }
    handleChange = (event, newValue) => {
        this.setState({"value":newValue});
    };

    createTransaction = (type) => {
        const credentials = JSON.stringify({
            sender: this.state.sender,
            receiver: this.state.receiver,
            balance: this.state.balance,
            status: 0,
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
            this.setState({"error": data.message});
            this.componentDidMount();
        }).catch(error => {
            this.setState({"error": "Wrong ID"});
        });
        if(this.state.role==='admin'){
          this.setState(() => this.initialState);
        }
    };

    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };
    createSelect(){
      return(
      <select name="sender" value={this.state.sender} onChange={this.credentialChange} className="form-control w-100">
          {
            this.state.accounts.map(account =>
            <option key={account.id} value={account.id}>{account.id} : ({account.balance}$)</option>)
         }
      </select>
      )
    }

    render() {
        const {role,sender,receiver,balance,value, error} = this.state;

        return (
            <div className="container" style={{width: 510}}>
    {error && <div className="alert alert-danger">{error}</div>}
      <AppBar position="static">
        <Tabs value={value} onChange={this.handleChange} aria-label="simple tabs example">
          <Tab label="Withdrawal" {...a11yProps(0)} />
          <Tab label="Internal" {...a11yProps(1)} />
          {role==='admin'?<Tab label="Deposit" {...a11yProps(2)} />:''}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={2}>
      <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label htmlFor="deposit" className="text-left w-100">Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Account ID" onChange={this.credentialChange}/>
        <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" name="balance" label="Balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
        <Button variant="contained" color="primary" className="mt-2" onClick={() => this.createTransaction(0)}>Deposit</Button>
      </div>
      </TabPanel>
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
    </div>
        );
    }
}

export default withRouter(AddTransaction);