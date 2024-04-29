const express = require('express')
const { listarConta, criarConta, editarConta, excluirConta, efetuarTransacao, sacar, efetuarTransferencia, conferirSaldo, imprimirExtrato } = require('./controladores/control')
const { verificarSenha, verificarInformacoes, verificarNumeroConta } = require('./verificacoes/midwares')
const rota     = express()


rota.use(verificarSenha)
rota.get('/contas',listarConta)
rota.post('/contas', verificarInformacoes ,criarConta)
rota.put('/contas/:numeroConta/usuario', verificarInformacoes, verificarNumeroConta ,editarConta)
rota.delete('/contas/:numeroConta',verificarNumeroConta, excluirConta)
rota.post('/transacoes/depositar', efetuarTransacao)
rota.post('/transacoes/sacar', sacar)
rota.post('/transacoes/transferir', efetuarTransferencia)
rota.get('/contas/saldo', conferirSaldo)
rota.get('/contas/extrato', imprimirExtrato)


module.exports = rota