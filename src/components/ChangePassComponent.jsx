import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

class Change extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    gohome = () => {
        this.props.history.replace("/");
    };
    componentDidMount(){
        var search = this.props.location.search;
        let token = search.substring(3, search.indexOf("&id"));
        let id = search.substring(search.lastIndexOf('=')+1);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('uid', id);
        this.setState({id: id});
    }

    initialState = {
        id: localStorage.getItem('uid'), password:'', confirm:'', error:''
    };

    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    chnagePassword = () => {
        if(this.state.password === this.state.confirm){
            console.log(this.state.password);
            console.log(this.state.id);

            const credentials = JSON.stringify({
                id: this.state.id,
                password: this.state.password
            });
            const token = localStorage.getItem('jwtToken');
            axios.post("http://localhost:9090/api/v1/users/change", credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }).then(response => {
                let data = response.data;
                console.log(data);
                localStorage.setItem('role', data.role.name);
                this.setState({"error": data.message});
                this.gohome();
            })
            .catch(error => {
                this.resetChangeForm();
                this.setState({"error":"Passwords not the same"});
            });
        }else{
            this.setState({"error":"Passwords not the same"});
        }
        
    };

    resetChangeForm = () => {
        this.setState(() => this.initialState);
    };

    render() {
        const {confirm, password, error} = this.state;

        return (
            <div className="container text-center">
                <h1>You must change password</h1>
                    <div className="row justify-content-center">
                    <div style={{width: 300}}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div>
                        <form action="/login" method="post">
                            <div className="form-group">
                             <input className="form-control" required autoComplete="off" type="password" name="password" value={password} onChange={this.credentialChange}
                                            placeholder="Enter Password"/>
                                 
                            </div>
                            <div className="form-group">
                             <input className="form-control" required autoComplete="off" type="password" name="confirm" value={confirm} onChange={this.credentialChange}
                                            placeholder="Confirm Password"/>
                                 
                            </div>
                            <button className="btn btn-primary" size="sm" type="button" variant="success" onClick={this.chnagePassword}
                                disabled={this.state.confirm.length < 6 || this.state.password.length < 6 || this.state.confirm.length!==this.state.password.length}>
                                Save
                            </button>
                            </form>
                    </div>
                    </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(Change);