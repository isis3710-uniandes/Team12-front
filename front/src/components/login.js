import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";
import '../App.css'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:3001/login', {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'email': this.state.email,
                    'password': this.state.password
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.props.history.push('/');
            })
            .catch(error => {
                alert('Email or password were incorrect');
                this.setState({
                    password: ''
                });
            });
    }

    render() {
        return (
            <div className="login-page">
                <div className="container"> 
                    <h3 className="w3ls-title w3ls-title1">Login to your account</h3>  
                    <div className="login-body">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" className="user" name="email" placeholder="Enter your email" value={this.state.email} onChange={this.handleInputChange} required/>
                            <input type="password" name="password" className="lock" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} required/>
                            <input type="submit" defaultValue="Login"/>
                            <div className="forgot-grid">
                                <div className="forgot">
                                    <a href="#">Forgot Password?</a>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </form>
                    </div>  
                    <h6> Not a Member? <NavLink to="/signup">Sign Up Now »</NavLink></h6>
                </div>
            </div>
        );
    }
}