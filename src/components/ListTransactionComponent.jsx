import React, { Component } from 'react';
import TransactionService from '../services/TransactionService';
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

class ListTransactionComponent extends Component {
    constructor(props){
        super(props);
        this.state = this.initialState;
        if(localStorage.getItem('jwtToken') === null){
            this.gologin();
        }
    }
    initialState = {
        transactions: [],start:'', finish:'',role: localStorage.getItem('role'), id: localStorage.getItem('uid'),status: 'All', pageCount: 0, page: 0
    };
    gologin = () => {
        this.props.history.replace("/login");
    };
    onNavigateView(id){
        this.props.history.push("/view/"+id);
    }
    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };
    componentDidMount(){
        if(this.state.role === 'admin'){
            TransactionService.getAllTransactions(this.state.page).then((res) => {
                this.setState({transactions: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                console.log(res);
                console.log(res.data.pageable.pageNumber+1);
            });
        }else{
            TransactionService.getAllTransactionById(this.state.id).then((res) => {
                this.setState({transactions: res.data.content});
                console.log(res);
            });
        }
    }
    doFilter(start,finish){
        if(this.state.role === 'admin'){
            TransactionService.getFilter(start,finish).then((res) => {
                console.log(res);
                this.setState({transactions: res.data.content});
                this.setState({pageCount: res.data.totalPages});
            });
        }else{
            let uid = localStorage.getItem('uid');
            TransactionService.getFilterUid(start,finish,uid).then((res) => {
                console.log(res);
                this.setState({transactions: res.data.content});
            });
        }
    }
    action(id,action){
        TransactionService.action(id,action).then((res) => {
            console.log(res);
            this.componentDidMount();
        });
    }
    handlePageClick= (data) => {
        this.setState({page: data.selected});
        TransactionService.getAllTransactions(data.selected).then((res) => {
            this.setState({transactions: res.data.content});
            this.setState({pageCount: res.data.totalPages});
            console.log(res);
            console.log(res.data.pageable.pageNumber+1);
        });
      }
    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
        console.log("ok");
    };
    render() {
        const {pageCount} = this.state;
        return (
            <div className="container text-center">
                <h2>Transaction List {this.state.pageCount}</h2>
                <Accordion>
        <AccordionSummary expandIcon={<FilterListIcon />} aria-controls="panel1c-content" id="panel1c-header">
          <div><Link to={"/transaction"} className="btn btn-outline-primary" style={{width:160}}>Add Transaction</Link></div>
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
                        <MenuItem value={'All'}>All</MenuItem>
                        <MenuItem value={'10'}>Process</MenuItem>
                        <MenuItem value={'20'}>Done</MenuItem>
                        <MenuItem value={'30'}>Refused</MenuItem>
                        <MenuItem value={'40'}>Canceled</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                
            </div>
       
        </AccordionDetails>
        <AccordionActions>
        <button className="btn btn-outline-primary mt-4" onClick={() => this.doFilter(this.state.start,this.state.finish)}>Search</button>
        </AccordionActions>
      </Accordion>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.transactions.map(transaction =>
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.sendtime}</td>
                                    {transaction.status === 'PROCESS' ? 
                                    this.state.role==='admin'? 
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(transaction.id,1)} type="submit" className="btn btn-outline-primary">Apply</a>
                                            <a onClick={() => this.action(transaction.id,2)} type="submit" className="btn btn-outline-primary">Refuse</a>
                                        </td>:
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
                                            <a onClick={() => this.action(transaction.id,3)} type="submit" className="btn btn-outline-primary">Cancel</a>
                                        </td>
                                        :
                                        <td>
                                            <a onClick={() => this.onNavigateView(transaction.id)} className="btn btn-outline-primary">View</a>
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

export default withRouter(ListTransactionComponent);