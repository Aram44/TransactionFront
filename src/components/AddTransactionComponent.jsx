import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {AppBar,Tabs,Tab,Typography,Box,Button,Snackbar} from '@material-ui/core';
import PropTypes from 'prop-types';
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
    gohome = () => {
        this.props.history.replace("/");
    };

    initialState = {
        sender:1, receiver:1, balance: 1,value: 0,open: false, error:''
    };

    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };
    handleClick = () => {
        this.setState({"open":true});
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({"open":false});
      };
    handleChange = (event, newValue) => {
        this.setState({"value":newValue});
    };

    createTransaction = () => {
        const credentials = JSON.stringify({
            sender: this.state.sender,
            receiver: this.state.balance,
            balance: this.state.balance,
            status: 1
        });
        const token = localStorage.getItem('jwtToken');
        axios.post("http://localhost:9090/api/v1/transaction/", credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            let data = response.data;
            console.log(data);
            this.setState({"error":"Transaction Created"});
            this.handleClick();
        }).catch(error => {
            this.resetForm();
            this.setState({"error":"Error!"});
            this.handleClick();
        });
    };

    resetForm = () => {
        this.setState(() => this.initialState);
    };
    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    render() {
        const {sender,receiver,balance,value,open, error} = this.state;

        return (
            <div className="container" style={{width: 510}}>
    <Snackbar open={open} autoHideDuration={2000} onClose={this.handleClose} message={error}/>
      <AppBar position="static">
        <Tabs value={value} onChange={this.handleChange} aria-label="simple tabs example">
          <Tab label="Deposit" {...a11yProps(0)} />
          <Tab label="Withdrawal" {...a11yProps(1)} />
          <Tab label="Internal" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <form noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label for="deposit" className="text-left w-100">Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" name="sender" value={sender} placeholder="Account ID" onChange={this.credentialChange}/>
        <label for="balanceDeposit"  className="text-left w-100 mt-2">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit"  name="balance" label="Balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
        <Button variant="contained" color="primary" className="mt-2" onClick={this.createTransaction}>Deposit</Button>
      </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <form noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label for="deposit" className="text-left w-100">Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" value={sender} placeholder="Account ID" onChange={this.credentialChange}/>
        <label for="balanceDeposit"  className="text-left w-100 mt-2">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" value={receiver} placeholder="Balance" onChange={this.credentialChange}/>
        <Button variant="contained" color="primary" className="mt-2" onClick={this.createTransaction}>Withdrawal</Button>
      </form>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <form noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
       <label for="deposit" className="text-left w-100">Sender Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" value={sender} placeholder="Sender Account ID" onChange={this.credentialChange}/>
       <label for="deposit" className="text-left w-100 mt-2">Receiver Accont ID</label>
        <input type="number" className="form-control w-100" min="1" id="deposit" label="Account ID" value={receiver} placeholder="Receiver Account ID" onChange={this.credentialChange}/>
        <label for="balanceDeposit"  className="text-left w-100 mt-2 ">Balance</label>
        <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" value={balance} placeholder="Balance" onChange={this.credentialChange}/>
            <Button variant="contained" color="primary" className="mt-2" onClick={this.createTransaction}>Save</Button>
      </form>
      </TabPanel>
    </div>
        );
    }
}

export default withRouter(AddTransaction);