import React, { Component } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import DividaItem from './DividaItem';
import { numberFormat } from '../helpers/Format'
import '../App.css';

class Divida extends Component {
    constructor() {
        super();
        this.state = {
            dividas: [],
            users: [],
            user: {}
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
                    // console.log(this.state.dividas)
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
            allowOutsideClick: false,
            html:
                '<a>Motivo:</a><input id="MotivoDivida" class="swal2-input">' +
                '<a>Valor:</a><span class="money-format">R$</span>'+
                '<input id="Valor" class="swal2-input" onkeypress="$(this).mask(\'R$ #.###.##0,00\', {reverse: true});">' +
                '<a>Data:</a><input type="date" id="DataDivida" class="swal2-input">' +
                '<br>' +
                '<a>Cliente:</a>',
            focusConfirm: false,
            preConfirm: (formValues) => {
                let buffer = parseInt(formValues) + 1;
                let money = document.getElementById('Valor').value;
                money = money.replace('.', ''); //remove os pontos na casa do milhar
                money = money.replace(',', '.'); //substitui a virgula por ponto para transformar em float
                let date = new Date(document.getElementById('DataDivida').value+'T00:00:00');
                return [
                    buffer,
                    document.getElementById('MotivoDivida').value,
                    parseFloat(money),
                    date.toISOString()
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
                .then(Swal.fire({
                    position: 'center-mid',
                    icon: 'success',
                    title: 'Novo cliente cadastrado',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                }))
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Alguma coisa deu errado, tente novamente!'
                    })
                })
        }
    }

    static escolherOpcao(id) {
        Swal.fire({
            title: 'O que deseja fazer?',
            confirmButtonText: 'Editar Cliente',
            denyButtonText: 'Deletar Cliente',
            showDenyButton: true,
            showCloseButton: true,
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Divida.editarDivida(id)
                } else if (result.isDenied) {
                    Swal.fire({
                        title: 'Tem Certeza?',
                        text: "Se deletar um cliente nao vai poder recuperar ele de volta!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sim, pode deletar!',
                        cancelButtonText: 'Cancelar!',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Divida.deletarDivida(id)
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            Swal.fire(
                                'Cancelado',
                                'Pode ficar tranquilo, nada vai ser deletado',
                                'error'
                            )
                        }
                    })
                }
            })
    }

    static async editarDivida(id) {
        await axios.get(`http://localhost:3000/api/Dividas/${id}`)
            .then(async (response) => {
                const { value: formValues } = await Swal.fire({
                    title: 'Editar Cliente',
                    confirmButtonText: 'Editar',
                    showCancelButton: 'true',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    html:
                        '<a>Motivo:</a><input id="MotivoDivida" class="swal2-input" value="' + response.data.MotivoDivida + '" placeholder="Motivo da divida">' +
                        '<a>Valor:</a><span class="money-format">R$</span>'+
                        '<input id="Valor" class="swal2-input" placeholder="Valor em reais" value="' + numberFormat(response.data.Valor, { minimumFractionDigits: 2 }) + '" onkeypress="$(this).mask(\'R$ #.###.##0,00\', {reverse: true});">' +
                        '<a>Data:</a><input type="date" id="DataDivida" value="' + response.data.DataDivida.replace('T03:00:00.000Z','') + '"class="swal2-input">',
                    focusConfirm: false,
                    preConfirm: (formValues) => {
                        let buffer = parseInt(formValues) + 1;
                        let money = document.getElementById('Valor').value;
                        money = money.replace('.', ''); //remove os pontos na casa do milhar
                        money = money.replace(',', '.'); //substitui a virgula por ponto para transformar em float
                        let date = new Date(document.getElementById('DataDivida').value+'T00:00:00');
                        return [
                            buffer,
                            document.getElementById('MotivoDivida').value,
                            parseFloat(money),
                            date.toISOString()
                        ]
                    }
                })
                if (formValues) {
                    let formToSend =
                    {
                        JSONPlaceholderID: response.data.JSONPlaceholderID,
                        MotivoDivida: formValues[1],
                        Valor: formValues[2],
                        DataDivida: formValues[3]
                    }

                    console.log(formToSend)
                    axios.put(`http://localhost:3000/api/Dividas/${id}`, formToSend)
                        .then(Swal.fire({
                            position: 'center-mid',
                            icon: 'success',
                            title: 'Cliente Editado',
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        })).catch(err => {
                            console.log(err)
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Alguma coisa deu errado, tente novamente!'
                            })
                        })

                }
            })
            .catch(err => console.log(err));
    }

    static async deletarDivida(id) {
        await axios.delete(`http://localhost:3000/api/Dividas/${id}`)
            .then((response) => {
                Swal.fire(
                    'Deletado!',
                    'O cliente foi deletado com sucesso.',
                    'success'
                ).then(result => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                })
            })
            .catch(err => {
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Alguma coisa deu errado, tente novamente!'
                })
            })
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
                <button className='btn btn-success tb-margin' onClick={() => { this.createDivida(this.state.users) }}>Novo</button>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Motivo</th>
                            <th scope="col">Divida</th>
                            <th scope="col">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dividaItems}
                    </tbody>
                </table>
                {/* <ul className="collection">
                    {dividaItems}
                </ul> */}
            </div>
        )
    }
}

export default Divida;