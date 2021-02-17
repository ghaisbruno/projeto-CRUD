import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import Divida from './Dividas'
import { numberFormat, dateFormat} from '../helpers/Format'

class DividaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            user: ''
        }
    }

    componentDidMount() {
        this.getJSONPlaceholderUser();
    }

    getJSONPlaceholderUser() {
        axios.get(`https://jsonplaceholder.typicode.com/users/${this.state.item.JSONPlaceholderID}`)
            .then(response => {
                this.setState({ user: response.data }, () => {
                    // console.log(this.state.user)
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <tr onClick={() => {Divida.escolherOpcao(this.state.item.id)}}>
                <td>{this.state.user.name}</td>
                <td>{this.state.item.MotivoDivida}</td>
                <td>{numberFormat(this.state.item.Valor)}</td>
                <td>{dateFormat(new Date(this.state.item.DataDivida))}</td>
            </tr>
        )
    }
}

export default DividaItem;