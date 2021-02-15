import React, { Component } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import DividaItem from './DividaItem';

class Divida extends Component {
    constructor() {
        super();
        this.state = {
            dividas: [],
            users: []
        }
    }

    componentDidMount() {
        this.getDividas();
        this.getUsers();
    }

    getDividas() {
        axios.get('http://localhost:3000/api/Dividas')
            .then(response => {
                this.setState({ dividas: response.data }, () => {
                    console.log(this.state.dividas)
                });
            })
            .catch(err => console.log(err));
    }

    async getUsers() {
        await axios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                this.setState({ users: response.data }, () => {
                    //console.log(this.state.users)
                });
            })
            .catch(err => console.log(err));
    }

    async createDivida(userList) {
        const users = userList.map((user, i) => {
            return user.name;
        });

        const { value: formValues } = await Swal.fire({
            title: 'Cadastrar Divida',
            input: 'select',
            inputOptions: users,
            confirmButtonText: 'Salvar',
            showCancelButton: 'true',
            cancelButtonText: 'Cancelar',
            html:
                '<a>Motivo:</a><input id="MotivoDivida" class="swal2-input">' +
                '<a>Valor:</a><input id="Valor" class="swal2-input">' +
                '<a>Data:</a><input id="DataDivida" class="swal2-input">'+
                '<br>'+
                '<a>Cliente:</a>',
            focusConfirm: false,
            preConfirm: (formValues) => {
                let buffer = parseInt(formValues)+1;
                return [
                    buffer,
                    document.getElementById('MotivoDivida').value,
                    parseFloat(document.getElementById('Valor').value),
                    document.getElementById('DataDivida').value
                ]
            }
        })

        if (formValues) {
            let formToSend =
            {
                JSONPlaceholderID: formValues[0],
                MotivoDivida: formValues[1],
                Valor: formValues[2],
                DataDivida: formValues[3]
            }

            console.log(formToSend)
            await axios.post('http://localhost:3000/api/Dividas', formToSend)
            .then(window.location.reload())
            .catch(err => console.log(err))
        }
    }

    render() {

        const dividaItems = this.state.dividas.map((divida, i) => {
            return (
                <DividaItem key={divida.id} item={divida} />
            )
        })
        return (
            <div>
                <h1>Gerenciador de Dividas</h1>
                <ul className="collection">
                    {dividaItems}
                </ul>
                <button className='btn btn-success' onClick={() => {this.createDivida(this.state.users)}}>Novo</button>
            </div>
        )
    }
}

export default Divida;