import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class DividaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            user: ''
        }
    }

    componentDidMount(){
        this.getJSONPlaceholderUser();
    }

    getJSONPlaceholderUser(){
        axios.get(`https://jsonplaceholder.typicode.com/users/${this.state.item.JSONPlaceholderID}`)
        .then(response => {
            this.setState({ user: response.data }, () => {
                console.log(this.state.user)
            });
        })
        .catch(err => console.log(err));
    }


    render() {
        return (
            <li className="collection-item">
                <Link to={`/dividas/${this.state.item.id}`}>
                {this.state.user.name}</Link>
            </li>
        )
    }
}

export default DividaItem;