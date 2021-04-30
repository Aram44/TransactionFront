import React, { Component } from 'react';
import TransactionService from '../../services/TransactionService';
import { withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class ListTransactionComponent extends Component {
    constructor(props){
        super(props);
        this.state = this.initialState;
        this.referance = React.createRef()
        if(localStorage.getItem('jwtToken') === null){
            this.gologin();
        }
    }
    initialState = {
        transactions: [], idsArray: [], status: 5, id: localStorage.getItem('uid'), pageCount: 0, page: 0, onFilter:false, total:0
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
        TransactionService.getAllTransactions(this.state.page).then((res) => {
            this.setState({transactions: res.data.content});
            this.setState({pageCount: res.data.totalPages});
            res.data.content.map(item =>{ let sum = this.state.total; this.setState({total: sum+item.balance})});
        });
    }
    doFilter(status){
        this.setState({total: 0});
        TransactionService.getFilter('','',status,this.state.page).then((res) => {
            console.log(res);
            this.setState({transactions: res.data.content});
            this.setState({pageCount: res.data.totalPages});
            this.setState({onFilter: true});
            res.data.content.map(item =>{ let sum = this.state.total; this.setState({total: sum+item.balance})});
        });
    }
    handlePageClick= (data) => {
        this.setState({page: data.selected});
        if(this.state.onFiler){
            TransactionService.getFilter('','',this.state.status,data.selected).then((res) => {
                console.log(res);
                this.setState({transactions: res.data.content});
                this.setState({pageCount: res.data.totalPages});
                this.setState({onFilter: true});
            });
        }else{
            TransactionService.getAllTransactions(data.selected).then((res) => {
                this.setState({transactions: res.data.content});
                this.setState({pageCount: res.data.totalPages});
            });
        }
        window.scrollTo(0, 0);
    }

    render() {
        const {pageCount} = this.state;
        return (
            <div className="container text-center">
                <h2>Transaction List</h2>
                <div className="d-flex justify-content-center w-100 mt-4 mb-2">
                    <FormControl className="ml-1 w-25">
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={this.state.status} onChange={this.credentialChange} name="status">
                        <MenuItem value={5}>All</MenuItem>
                        <MenuItem value={0}>Process</MenuItem>
                        <MenuItem value={1}>Done</MenuItem>
                        <MenuItem value={2}>Refused</MenuItem>
                        <MenuItem value={3}>Canceled</MenuItem>
                        </Select>
                    </FormControl>
                 <button className="btn btn-outline-primary" onClick={() => this.doFilter(this.state.status)}>Search</button>
                 <div className="w-100 text-right">Total balance {(this.state.total).toFixed(2)}</div>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Balance</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.transactions.map(transaction =>
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.sender}</td>
                                    <td>{transaction.receiver}</td>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.balance}</td>
                                    <td>{transaction.sendtime}</td>
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