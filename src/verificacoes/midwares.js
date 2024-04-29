const db = require('../bancodedados')

const verificarSenha = (req, res, next) => {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(400).json({mensagem: 'A senha precisa ser informada'})
    }
    if (senha_banco !== db.banco.senha) {
        return res.status(400).json({mensagem: 'senha incorreta'})
    }

    next()
}

const verificarInformacoes = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body

    if (!nome) {
        return res.status(400).json({mensagem: "nome deve ser informado"})
    }
    if (!cpf) {
        return res.status(400).json({mensagem: "cpf deve ser informado"})
    }
    if (!data_nascimento) {
        return res.status(400).json({mensagem: "data de nacimento deve ser informado"})
    }
    if (!telefone) {
        return res.status(400).json({mensagem: "telefone deve ser informado"})
    }
    if (!email) {
        return res.status(400).json({mensagem: "email deve ser informado"})
    }
    if (!senha) {
        return res.status(400).json({mensagem: "senha deve ser informado"})
    }
  
    next()
}

const verificarNumeroConta = (req, res, next) => {
    const { numeroConta } = req.params

    const contaEncontrada = db.contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "A conta informada não foi encontrada"})
    }

    next()
}

module.exports = {
    verificarSenha,
    verificarInformacoes,
    verificarNumeroConta
}