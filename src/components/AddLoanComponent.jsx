import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from '@material-ui/core';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

class AddLoan extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        months: [],amonths: [], year:12, type:0, amount: 5000, fee: 1, per: 2,error:'', message:'',monthlyPayment:421.19,totalPayment:5054.33,totalInterest: 54.33, isResult: false,name: '',currency:0,currencyName:'USD'
    };

    createLoan = (name, amount, interest, monthly, months, percent,currency) => {
        if(name.length >4 ){
            let uid = localStorage.getItem('uid');
            const credentials = JSON.stringify({
                uid: uid,
                name: name,
                amount: amount,
                interest: interest,
                monthly: monthly,
                months: months,
                percent: percent,
                currency: currency,
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
                this.setState({"message": data.message});
            }).catch(error => {
                this.setState({"error": "Wrong Data"});
                setTimeout(() => this.setState({"error": ""}), 3000);
            });
        }else{
            this.setState({"error": "Name lengh is short"});
            setTimeout(() => this.setState({"error": ""}), 3000);
        }
       
        window.scrollTo(0, 0);
    };
    calculateResults = (amount, interest, years) => {
        const userAmount = Number(amount);
        const calculatedInterest = Number(interest) / 100 / 12;
        const calculatedPayments = Number(years);
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
        // this.setState({monts: []});
        this.state.months = [];
        let date = new Date();
        for(let i=1;i<(this.state.year)+1; i++){
            var dateFormat = new Date(date.setMonth(date.getMonth()+1)).toISOString().slice(0, 10);
            this.state.months.push({"id": i,"month": dateFormat});
        }
    }

    credentialChange = event => {
        if(event.target.name==='currency'){
            if(event.target.value===0){
                this.setState({currencyName : "USD"});
            }else if(event.target.value===1){
                this.setState({currencyName : "EUR"});
            }else{
                this.setState({currencyName : "AMD"});
            }
        }
        if (event.target.name==='amount' || event.target.name==='year') {
            if (event.target.value >0) {
                this.setState({[event.target.name] : event.target.value});
            }else{
                this.setState({"error": "The value can not be less than 0"});
                setTimeout(() => this.setState({"error": ""}), 3000);
            }
        }else{
            this.setState({[event.target.name] : event.target.value});
        }
    };

    render() {
        const {amount,name,error,message,year,per,totalPayment,totalInterest,months,monthlyPayment,currency,currencyName} = this.state;

        return (
            <div className="container" style={{width: 600}}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div noValidate autoComplete="off" className="container d-flex flex-column align-items-center">
                <TextField id="standard-basic" className="w-100" minlenght="20" name="name" value={name} label="Name (max 120 symbols)" onChange={this.credentialChange}/>
                <label htmlFor="currency"  className="text-left w-100 mt-2">Select currency for loan</label>
                <Select labelId="demo-simple-select-label" id="currency" value={currency} onChange={this.credentialChange} name="currency" className="w-100">
                    <MenuItem value={0}>USD</MenuItem>
                    <MenuItem value={1}>EUR</MenuItem>
                    <MenuItem value={2}>AMD</MenuItem>
                </Select>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Loan amount</label>
                <input type="number" className="form-control w-100" min="1" id="balanceDeposit" label="Balance" name="amount" value={amount} placeholder="Balance" onChange={this.credentialChange}/>
                <label htmlFor="year" className="text-left w-100">Loan term in months</label>
                <input type="number" className="form-control w-100" min="1" id="year" label="Months" name="year" value={year} placeholder="Months" onChange={this.credentialChange}/>
                <label htmlFor="balanceDeposit"  className="text-left w-100 mt-2">Interest rate per year</label>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={per} onChange={this.credentialChange} name="per" className="w-100">
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={1.5}>1.5</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={2.5}>2.5</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={3.5}>3.5</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={4.5}>4.5</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={5.5}>5.5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={6.5}>6.5</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={7.5}>7.5</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={8.5}>8.5</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={9.5}>9.5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={10.5}>10.5</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={11.5}>11.5</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={12.5}>12.5</MenuItem>
                    <MenuItem value={13}>13</MenuItem>
                    <MenuItem value={13.5}>13.5</MenuItem>
                    <MenuItem value={14}>14</MenuItem>
                    <MenuItem value={14.5}>14.5</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={15.5}>15.5</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={16.5}>16.5</MenuItem>
                    <MenuItem value={17}>17</MenuItem>
                    <MenuItem value={17.5}>17.5</MenuItem>
                    <MenuItem value={18}>18</MenuItem>
                    <MenuItem value={18.5}>18.5</MenuItem>
                    <MenuItem value={19}>19</MenuItem>
                    <MenuItem value={19.5}>19.5</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={20.5}>20.5</MenuItem>
                    <MenuItem value={21}>21</MenuItem>
                    <MenuItem value={21.5}>21.5</MenuItem>
                    <MenuItem value={22}>22</MenuItem>
                    <MenuItem value={22.5}>22.5</MenuItem>
                    <MenuItem value={23}>23</MenuItem>
                    <MenuItem value={23.5}>23.5</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                    <MenuItem value={24.5}>24.5</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={25.5}>25.5</MenuItem>
                    <MenuItem value={26}>26</MenuItem>
                    <MenuItem value={26.5}>26.5</MenuItem>
                    <MenuItem value={27}>27</MenuItem>
                    <MenuItem value={27.5}>27.5</MenuItem>
                    <MenuItem value={28}>28</MenuItem>
                    <MenuItem value={28.5}>28.5</MenuItem>
                    <MenuItem value={29}>29</MenuItem>
                    <MenuItem value={29.5}>29.5</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={30.5}>30.5</MenuItem>
                </Select>
            </div>
            <div className="w-100 d-flex"><div className="mr-auto p-2">Total Paid</div><div className="p-2">{totalPayment} {currencyName}</div></div><hr className="m-0 p-0"/>
            <div className="w-100 d-flex mb-2"><div className="mr-auto p-2">Total Interest Paid</div><div className="p-2">{totalInterest} {currencyName}</div></div>
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={this.calculate}>Calculate</Button></div>
            {months.length>0?<div className="d-flex flex-column align-items-center">
                <label htmlFor="balanceDeposit"  className="w-100 mt-2">Schedule</label>
                <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Month</th>
                                <th>Paymant date</th>
                                <th>Interest</th>
                                <th>Principal</th>
                                <th>Paymant</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            months.map(item =>
                            <tr key={item.id}>
                            <td>{item.id}</td>
                                <td>{item.month}</td>
                                <td>{(totalInterest/year).toFixed(2)} {currencyName}</td>
                                <td>{(monthlyPayment - (totalInterest/year)).toFixed(2)} {currencyName}</td>
                                <td>{monthlyPayment} {currencyName}</td>
                            </tr>)
                        }
                        </tbody>
                    </table>
            </div>:''}
            <div className="d-flex flex-column align-items-center mb-2"><Button variant="contained" color="primary" className="mt-2" onClick={() => this.createLoan(name, amount, totalInterest, monthlyPayment, year, per,currency)}>Send Request</Button></div>
            </div>
        );
    }
}

export default withRouter(AddLoan);