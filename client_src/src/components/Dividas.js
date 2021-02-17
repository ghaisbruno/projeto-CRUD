import React, { Component } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import DividaItem from './DividaItem';
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
                '<a>Motivo:</a><input id="MotivoDivida" class="swal2-input" placeholder="Motivo da divida">' +
                '<a>Valor:</a><input id="Valor" class="swal2-input" placeholder="Valor em reais">' +
                '<a>Data:</a><input type="date" id="DataDivida" class="swal2-input">' +
                '<br>' +
                '<a>Cliente:</a>',
            focusConfirm: false,
            preConfirm: (formValues) => {
                let buffer = parseInt(formValues) + 1;
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

    static async editarDivida(id) {
        await axios.get(`http://localhost:3000/api/Dividas/${id}`)
            .then(async (response) => {
                const { value: formValues } =  await Swal.fire({
                    title: 'Editar Cliente',
                    confirmButtonText: 'Editar',
                    showDenyButton: true,
                    denyButtonText: `Deletar`,
                    showCancelButton: 'true',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    html:
                        '<a>Motivo:</a><input id="MotivoDivida" class="swal2-input" value="'+response.data.MotivoDivida+'" placeholder="Motivo da divida">' +
                        '<a>Valor:</a><input id="Valor" class="swal2-input" value="'+response.data.Valor+'" placeholder="Valor em reais">' +
                        '<a>Data:</a><input type="date" id="DataDivida" value="'+response.data.DataDivida+'"class="swal2-input">',
                    focusConfirm: false,
                    preConfirm: (formValues) => {
                        let buffer = parseInt(formValues) + 1;
                        return [
                            buffer,
                            document.getElementById('MotivoDivida').value,
                            parseFloat(document.getElementById('Valor').value),
                            document.getElementById('DataDivida').value
                        ]
                    }
                })
                console.log(formValues)
                // if (formValues) {
                //     let formToSend =
                //     {
                //         JSONPlaceholderID: formValues[0],
                //         MotivoDivida: formValues[1],
                //         Valor: formValues[2],
                //         DataDivida: formValues[3]
                //     }
        
                //     console.log(formToSend)
                //     axios.put(`http://localhost:3000/api/Dividas/${id}`, formToSend)
                //         .then(Swal.fire({
                //             position: 'center-mid',
                //             icon: 'success',
                //             title: 'Cliente Editado',
                //             showConfirmButton: true,
                //         }).then((result) => {
                //             if (result.isConfirmed) {
                //                 window.location.reload()
                //             }
                //         }))
                //         .catch(err => console.log(err))
                // }
            })
            .catch(err => console.log(err));
    }

    async deletarDivida(id) {
        //on Delete  
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
                Swal.fire(
                    'Deletado!',
                    'O cliente foi deletado com sucesso.',
                    'success'
                )
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