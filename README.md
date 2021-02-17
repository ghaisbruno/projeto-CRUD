# Projeto CRUD simples

![App example](client_src/public/app-example.png)

# Dependências e Instalação (Linux)

- [nodejs](https://nodejs.org/pt-br/)
    - `sudo apt install nodejs`
- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
    - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash && source ~/.bashrc`
- configurar a versao do node
    - `nvm install v14.15.5 && nvm use v14.15.5`
- [loopback 3](https://loopback.io/doc/en/lb3/)
    - `npm install -g loopback-cli`
- [yarn](https://yarnpkg.com/)
    - `npm install --global yarn`
- [mongodb](https://www.mongodb.com/)
    - `sudo apt install mongodb`
- [react](https://reactjs.org/)
    - `npm install -g create-react-app`
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    - `sudo apt install git`

# First run

Na pasta raiz, é só rodar o seguinte comando:

`yarn fresh-start`

para instalar os pacotes tanto pro node quanto pro react.

E após isso é só rodar o comando:

`yarn start`

que o loopback3 vai ser iniciado na porta 3000 e o react na porta 3001
