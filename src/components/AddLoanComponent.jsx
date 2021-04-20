import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from '@material-ui/core';
import AccountService from '../services/AccountService';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class AddLoan extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        accounts: [], months: [],aid:0, year:1, type:0, amount: 5000, interest:1, fee: 1, per: 1,error:'',monthlyPayment:418.93,totalPayment:5027.12,totalInterest:27.15,isResult: false
    };
    componentDidMount(){
      let uid = localStorage.getItem('uid');
      AccountService.getAccounts(uid).then((res) => {
          this.setState({accounts: res.data.content});
          this.setState({aid: res.data.content[0].id});
      });
  }

    createLoan = (aid, amount, interest, monthly, months) => {
        const credentials = JSON.stringify({
            aid: aid,
            amount: amount,
            interest: interest,
            monthly: monthly,
            months: months,
            status: 0
        });
        const token = localStorage.getItem('jwtToken');
        axios.post("http://localhost:9090/api/v1/loan/loan/", credentials, {
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
    calculateResults = (amount, interest, years) => {
        const userAmount = Number(amount);
        const calculatedInterest = Number(interest) / 100 / 12;
        const calculatedPayments = Number(years) * 12;
        const x = Math.pow(1 + calculatedInterest, calculatedPayments);
        const monthly = (userAmount * x * calculatedInterest) / (x - 1);
     
        if (isFinite(monthly)) {
          const monthlyPaymentCalculated = monthly.toFixed(2);
          const totalPaymentCalculated = (monthly * calculatedPayments).toFixed(2);
          const totalInterestCalculated = (monthly * calculatedPayments - userAmount).toFixed(2);
     
          this.setState({
            monthlyPayment: monthlyPaymentCalculated,
            totalPayment: totalPaymentCalculated,
            totalInterest: totalInterestCalculated,
            isResult: true,
          });
        }
        return;
      };

    calculate = () =>{
        console.log(this.state.year);
        this.calculateResults(this.state.amount, this.state.per, this.state.year);
        this.state.months = [];
        for(let i=1;i<(this.state.year*12)+1; i++){
            this.state.months.push(i);
        }
    }

    credentialChange = event => {
        this.setState({[event.target.name] : event.target.value});
        console.log(event.target.value);
    };
    createSelect(){
        return(
        <select name="aid" value={this.state.aid} onChange={this.credentialChange} className="form-control w-100" id="aid">
            {
              this.state.accounts.map(account =>
              <option key={account.id} value={account.id}>{account.id} : ({account.balance}$)</option>)
           }
        </select>
        )
      }
    render() {
        const {amount,error,year,type,per,totalPayment,totalInterest,months,monthlyPayment,aid} = this.state;

        return (
            <div className="container" style={{width: 510}}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={type} onChange={this.credentialChange} name="type" className="w-100">
                    <MenuItem value={0}>Loan term in years</MenuItem>
                    <MenuItem value={1}>Loan term in months</MenuItem>
                </Select>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Loan amount</label>
                <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="amount" value={amount} placeholder="Balance" onChange={this.credentialChange}/>
                {type===0?<label htmlFor="deposit" className="text-left w-100">Loan term in years</label>:<label for="year" className="text-left w-100">Loan term in months</label>}
                <input type="number" className="form-control w-100" min="1" id="year" label="Account ID" name="year" value={year} placeholder="Account ID" onChange={this.credentialChange}/>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Interest rate per year</label>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={per} onChange={this.credentialChange} name="per" className="w-100">
                    <MenuItem value={0.5}>0.5</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                </Select>
            </div>
            <div className="w-100 d-flex"><div className="mr-auto p-2">Total Principal Paid</div><div className="p-2">{totalPayment}</div></div><hr className="m-0 p-0"/>
            <div className="w-100 d-flex mb-2"><div className="mr-auto p-2">Total Interest Paid</div><div className="p-2">{totalInterest}</div></div>
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={this.calculate}>Calculate</Button></div>
            {months.length>0?<div className="d-flex flex-column align-items-center">
                <label htmlFor="balanceDeposit"  className="w-100 mt-2">Schedule</label>
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Paymant</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            months.map(item =>
                            <tr key={item}>
                                <td>{item}</td>
                                <td>{monthlyPayment}</td>
                            </tr>)
                        }
                        </tbody>
                    </table>
            </div>:''}
            <label htmlFor="aid" className="text-left w-100">Accont ID</label>
            {this.createSelect()}
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={() => this.createLoan(aid, amount, totalInterest, monthlyPayment, year*12)}>Send Request</Button></div>
            </div>
        );
    }
}

export default withRouter(AddLoan);