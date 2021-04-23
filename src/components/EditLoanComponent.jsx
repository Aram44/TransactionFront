import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from '@material-ui/core';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import LoanService from '../services/LoanService';

class AddLoan extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        months: [],aid:0, year:1, type:0, amount: 5000, fee: 1, per: 2, error:'',monthlyPayment:421.19,totalPayment:5054.33,totalInterest:54.33,isResult: false,name: '', lid: this.props.match.params.id
    }; 

    componentDidMount(){
      LoanService.getLoanById(this.state.lid).then((res) => {
          console.log(res);
          this.setState({aid: res.data.id});
          this.setState({year: res.data.months/12});
          this.setState({amount: res.data.amount});
          this.setState({totalInterest: res.data.interest});
          this.setState({monthlyPayment: res.data.monthly});
          this.setState({totalPayment: res.data.amount+res.data.interest});
          this.setState({per: res.data.percent});
          this.setState({name: res.data.name});
      });
    }

    SaveLoan = (aid, name, amount, interest, monthly, months,percent) => {
        const credentials = JSON.stringify({
            id: this.state.lid,
            aid: aid,
            name: name,
            amount: amount,
            interest: interest,
            monthly: monthly,
            months: months,
            percent: percent,
            status: 4
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
        window.scrollTo(0, 0);
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

    calculate(year){
        this.calculateResults(this.state.amount, this.state.per, this.state.year);
        this.setState({monts: []});
        let date = new Date();
        for(let i=1;i<(year*12)+1; i++){
            var dateFormat = new Date(date.setMonth(date.getMonth()+1)).toISOString().slice(0, 10);
            this.state.months.push({"id": i,"month": dateFormat});
        }
    }

    credentialChange = event => {
        this.setState({[event.target.name] : event.target.value});
    };
    render() {
        const {amount,name,error,year,type,per,totalPayment,totalInterest,months,monthlyPayment,aid} = this.state;

        return (
            <div className="container" style={{width: 510}}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
                <TextField id="standard-basic" className="w-100" minlenght="20" name="name" value={name} label="Name (max 120 symbols)" onChange={this.credentialChange}/>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Loan amount</label>
                <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="amount" value={amount} placeholder="Balance" onChange={this.credentialChange}/>
                {type===0?<label htmlFor="deposit" className="text-left w-100">Loan term in years</label>:<label for="year" className="text-left w-100">Loan term in months</label>}
                <input type="number" className="form-control w-100" min="1" id="year" label="Account ID" name="year" value={year} placeholder="Account ID" onChange={this.credentialChange}/>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Interest rate per year</label>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={per} onChange={this.credentialChange} name="per" className="w-100">
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4.5}>4.5</MenuItem>
                </Select>
            </div>
            <div className="w-100 d-flex"><div className="mr-auto p-2">Total Paid</div><div className="p-2">{totalPayment}</div></div><hr className="m-0 p-0"/>
            <div className="w-100 d-flex mb-2"><div className="mr-auto p-2">Total Interest Paid</div><div className="p-2">{totalInterest}</div></div>
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={() => this.calculate(year)}>Calculate</Button></div>
            {months.length>0?<div className="d-flex flex-column align-items-center">
                <label htmlFor="balanceDeposit"  className="w-100 mt-2">Schedule</label>
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Paymant date</th>
                                <th>Paymant</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            months.map(item =>
                            <tr key={item.id}>
                            <td>{item.id}</td>
                                <td>{item.month}</td>
                                <td>{monthlyPayment}</td>
                            </tr>)
                        }
                        </tbody>
                    </table>
            </div>:''}
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={() => this.SaveLoan(aid, name, amount, totalInterest, monthlyPayment, year*12)}>Send Request</Button></div>
            </div>
        );
    }
}

export default withRouter(AddLoan);