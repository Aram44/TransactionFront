import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import ReportInfoService from '../../services/reports/ReportInfoService';


class AllAmountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    initialState = {
        collapseMenu: [true,false,false], usd:0, eur:0, amd:0,data:[]
    };

    componentDidMount(){
        ReportInfoService.getBalanceInfo().then((res) => {
            this.setState({usd: res.data[0]});
            this.setState({eur: res.data[1]});
            this.setState({amd: res.data[2]});
        });
        ReportInfoService.getLoanInfo().then((res) => {
            this.setState({data: res.data});
        });
    }

    collapseChange = event => {
        let num = parseInt(event.target.value);
        this.state.collapseMenu = [false,false,false];
        this.state.collapseMenu[num] = true;
        this.forceUpdate();
    };
    createLoanName(){
        return(
            <tr>
            {
              this.state.data.map(item =>{
                    if(item[0]===0){
                        return <th>In Process</th>
                    }else if(item[0]===1){
                        return <th>Approved</th>
                    }else if(item[0]===2){
                        return <th>Refused</th>
                    }else if(item[0]===3){
                        return <th>Canceled</th>
                    }else{
                        return <th>Edited</th>
                    }
                }
              )
           }
           </tr>
        )
      }
      createLoan(){
        return(<tr>{this.state.data.map(item =><td>{item[1]}</td>)}</tr>)
      }
    
    render() {
        return (
            <div className="container text-center">
                <div className="row">
                    <h3 className="w-100 text-center">Total amount of all existing accounts</h3>
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>USD</th>
                                <th>EUR</th>
                                <th>AMD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={0}>
                                <td>{(this.state.usd).toFixed(2)} USD</td>
                                <td>{(this.state.eur).toFixed(2)} EUR</td>
                                <td>{(this.state.amd).toFixed(2)} AMD</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <h3 className="w-100 text-center mt-3">Total count of loans</h3>
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            {this.createLoanName()}
                        </thead>
                        <tbody>
                            {this.createLoan()}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3">Total amount of all existing accounts&nbsp;
                <button onClick={this.collapseChange} value="0" className="btn btn-primary" type="button" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    USD</button>
                <button onClick={this.collapseChange} value="1" className="btn btn-primary" type="button" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    EUR</button>
                <button onClick={this.collapseChange} value="2"className="btn btn-primary" type="button" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    AMD</button>
                </p>
                <Collapse in={this.state.collapseMenu[0]}>
                    <div className="card card-body">{(this.state.usd).toFixed(2)} USD</div>
                </Collapse>
                <Collapse in={this.state.collapseMenu[1]}>
                    <div className="card card-body">{(this.state.eur).toFixed(2)} EUR</div>
                </Collapse>
                <Collapse in={this.state.collapseMenu[2]}>
                    <div className="card card-body">{(this.state.amd).toFixed(2)} AMD</div>
                </Collapse>
            </div>
        );
    }
}

export default withRouter(AllAmountComponent);