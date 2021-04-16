import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }
    gohome = () => {
        this.props.history.replace("/");
    };

    initialState = {
        email:'', password:'', error:''
    };

    credentialChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    validateUser = () => {
        const credentials = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });
        axios.post("http://localhost:9090/api/v1/auth/authenticate", credentials, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
                let data = response.data;
                console.log(data.token);
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('uid', data.id);
                localStorage.setItem('role', data.role);
                this.gohome();
            })
            .catch(error => {
                this.resetLoginForm();
                this.setState({"error":"Invalid email and password"});
            });
    };

    resetLoginForm = () => {
        this.setState(() => this.initialState);
    };

    render() {
        const {email, password, error} = this.state;

        return (
            <div className="container text-center">
                <h1>Login page</h1>
                    <div className="row justify-content-center">
                    <div style={{width: 300}}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div>
                        <form action="/login" method="post">
                            <div className="form-group">
                                <input className="form-control" required autoComplete="off" type="text" name="email" value={email} onChange={this.credentialChange}
                                            placeholder="Enter Email Address"/>
                            </div>
                            <div className="form-group">
                             <input className="form-control" required autoComplete="off" type="password" name="password" value={password} onChange={this.credentialChange}
                                            placeholder="Enter Password"/>
                                 
                            </div>
                            <button className="btn btn-primary" size="sm" type="button" variant="success" onClick={this.validateUser}
                                disabled={this.state.email.length === 0 || this.state.password.length === 0}>
                                Login
                            </button>
                            </form>
                    </div>
                    </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(Login);