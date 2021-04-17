import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    goUsers = () => {
        this.props.history.replace("/users");
    };

    initialState = {
        email:'',name:'', password:'', confirm: '', error:''
    };

    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    saveUser = () => {
        if(this.state.password === this.state.confirm){
            const credentials = JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            });
            const token = localStorage.getItem('jwtToken');
                axios.post("http://localhost:9090/api/v1/users/register", credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }).then(response => {
                    let data = response.data;
                    console.log(data);
                    this.goUsers();
                })
                .catch(error => {
                    this.resetRegisterForm();
                    this.setState({"error":"Error!"});
                });
        }else{
            this.setState({"error":"Passwords not the same"});
        }
    };

    resetRegisterForm = () => {
        this.setState(() => this.initialState);
    };
    isEmail(val) {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!regEmail.test(val)){
          return 'Invalid Email';
        }
    }

    render() {
        const {email,name, password, confirm, error} = this.state;

        return (
            <div className="container text-center">
                <h1>Sign Up page</h1>
                    <div className="row justify-content-center">
                    <div style={{width: 300}}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div>
                        <form action="/login" method="post">
                            <div className="form-group">
                                <input className="form-control" required autoComplete="off" type="email" name="email" value={email} onChange={this.credentialChange}
                                            placeholder="Enter Email Address"/>
                            </div>
                            <div className="form-group">
                                <input className="form-control" required autoComplete="off" type="text" name="name" value={name} onChange={this.credentialChange}
                                            placeholder="Enter Name"/>
                            </div>
                            <div className="form-group">
                             <input className="form-control" required autoComplete="off" type="password" name="password" value={password} onChange={this.credentialChange}
                                            placeholder="Enter Password"/>
                                 
                            </div>
                            <div className="form-group">
                             <input className="form-control" required autoComplete="off" type="password" name="confirm" value={confirm} onChange={this.credentialChange}
                                            placeholder="Confirm Password"/>
                                 
                            </div>
                            <button className="btn btn-primary" size="sm" type="button" variant="success" onClick={this.saveUser}
                                disabled={this.isEmail(this.state.email) || this.state.password.length < 6 || this.state.name.length <2}>
                                Register
                            </button>
                            </form>
                    </div>
                    </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(Register);