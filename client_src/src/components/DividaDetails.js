import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class DividaDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: '',
            JSONPlaceHolder: ''
        }
    }

    componentDidMount(){
        this.getDivida();
    }

    getJSONPlaceholderUser(){
        axios.get(`https://jsonplaceholder.typicode.com/users/${this.state.details.JSONPlaceholderID}`)
        .then(response => {
            this.setState({ JSONPlaceHolder: response.data }, () => {
                console.log(this.state)
            });
        })
        .catch(err => console.log(err));
    }

    getDivida() {
        let dividaId = this.props.match.params.id;
        axios.get(`http://localhost:3000/api/Dividas/${dividaId}`)
            .then(response => {
                this.setState({ details: response.data }, () => {
                    this.getJSONPlaceholderUser();
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <br />
                <Link className="btn btn-dark blue darken-4" to="/">Voltar</Link>
                <h1>Cliente: {this.state.JSONPlaceHolder.name}</h1>
            </div>
        )
    }
}

export default DividaDetails;