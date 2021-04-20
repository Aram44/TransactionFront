import React, { Component } from 'react';
import LoanService from '../services/LoanService';
import { Link, withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import FilterListIcon from '@material-ui/icons/FilterList';
import ReactPaginate from "react-paginate";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class ListLoanComponent extends Component {
    constructor(props){
        super(props);
        this.state = this.initialState;
        if(localStorage.getItem('jwtToken') === null){
            this.gologin();
        }
    }
    initialState = {
        loans: [],start:'', finish:'', status: 4, role: localStorage.getItem('role'), id: localStorage.getItem('uid'), pageCount: 0, page: 0,onFilter:false
    };
    gologin = () => {
        this.props.history.replace("/login");
    };
    onNavigateView(id){
        this.props.history.push("/loan/"+id);
    }
    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };
    componentDidMount(){
        if(this.state.role === 'admin'){
            LoanService.getAllLoans(this.state.page).then((res) => {
                this.setState({loans: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                console.log(res);
                console.log(res.data.pageable.pageNumber+1);
            });
        }else{
            LoanService.getAllLoanById(this.state.id).then((res) => {
                this.setState({loans: res.data.content});
                console.log(res);
            });
        }
    }
    doFilter(start,finish,status){
            console.log(start);
        if(this.state.role === 'admin'){
            LoanService.getFilter(start,finish,status,this.state.page).then((res) => {
                console.log(res);
                this.setState({loans: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                this.setState({onFilter: true});
            });
        }else{
            let uid = localStorage.getItem('uid');
            LoanService.getFilterUid(start,finish,uid).then((res) => {
                console.log(res);
                this.setState({loans: res.data.content});
            });
        }
    }
    action(id,action){
        LoanService.action(id,action).then((res) => {
            console.log(res);
            this.componentDidMount();
        });
    }
    handlePageClick= (data) => {
        this.setState({page: data.selected});
        if(this.state.onFiler){
            LoanService.getFilter(this.state.start,this.state.finish,this.state.status,data.selected).then((res) => {
                console.log(res);
                this.setState({loans: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                this.setState({onFilter: true});
            });
        }else{
            LoanService.getAllTransactions(data.selected).then((res) => {
                this.setState({loans: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                console.log(res);
                console.log(res.data.pageable.pageNumber+1);
            });
        }
        
      }
    render() {
        const {pageCount,role} = this.state;
        return (
            <div className="container text-center">
                <h2>Loan List</h2>
                <Accordion>
        <AccordionSummary expandIcon={<FilterListIcon />} aria-controls="panel1c-content" id="panel1c-header">
          {role==='admin'?'':<div><Link to={"/createloan"} className="btn btn-outline-primary" style={{width:160}}>Add Loan</Link></div>}
          <div className="w-100 d-flex flex-row-reverse mt-2">Filters</div>
        </AccordionSummary>
        <AccordionDetails>
            <div className="d-flex w-100 justify-content-center">
                <div className="d-flex justify-content-center w-75">
                    <TextField id="date" label="from" type="datetime-local" name="start" value={this.state.start} onChange={this.credentialChange}
                        className="form-control" InputLabelProps={{shrink: true,}}/>
                    <TextField id="date" label="to" type="datetime-local" name="finish" value={this.state.finish} onChange={this.credentialChange}
                        className="form-control ml-1" InputLabelProps={{shrink: true,}}/>
                        <FormControl style={{with:200}} className="ml-1 w-100">
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.status}
                        onChange={this.credentialChange}
                        name="status"
                        >
                        <MenuItem value={4}>All</MenuItem>
                        <MenuItem value={0}>Process</MenuItem>
                        <MenuItem value={1}>Done</MenuItem>
                        <MenuItem value={2}>Refused</MenuItem>
                        <MenuItem value={3}>Canceled</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        </AccordionDetails>
        <AccordionActions>
        <button className="btn btn-outline-primary mt-4" onClick={() => this.doFilter(this.state.start,this.state.finish,this.state.status)}>Search</button>
        </AccordionActions>
      </Accordion>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Loan ID</th>
                                <th>Account ID</th>
                                <th>Amount</th>
                                <th>Interest</th>
                                <th>Monthly</th>
                                <th>Months</th>
                                <th>Status</th>
                                <th>Request Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.loans.map(loan =>
                                <tr key={loan.id}>
                                    <td>{loan.id}</td>
                                    <td>{loan.aid}</td>
                                    <td>{loan.amount}</td>
                                    <td>{loan.interest}</td>
                                    <td>{loan.monthly}</td>
                                    <td>{loan.months}</td>
                                    <td>{loan.status}</td>
                                    <td>{loan.requesttime}</td>
                                    {loan.status === 'PROCESS' ? 
                                    this.state.role==='admin'? 
                                        <td>
                                            <a onClick={() => this.onNavigateView(loan.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(loan.id,1)} type="submit" className="btn btn-outline-primary">Approve</a>
                                            <a onClick={() => this.action(loan.id,2)} type="submit" className="btn btn-outline-primary">Reject</a>
                                        </td>:
                                        <td>
                                            <a onClick={() => this.onNavigateView(loan.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(loan.id,3)} type="submit" className="btn btn-outline-primary">Cancel</a>
                                        </td>
                                        :
                                        <td>
                                            <a onClick={() => this.onNavigateView(loan.id)} className="btn btn-outline-primary">View</a>
                                        </td>  
                                    }
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                <div className="w-100 d-flex justify-content-center">
                    {this.state.pageCount>1?
                    <ReactPaginate
                        pageCount={pageCount}
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

export default withRouter(ListLoanComponent);