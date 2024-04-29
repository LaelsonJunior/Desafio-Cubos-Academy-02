const {contas, depositos, saques, transferencias} = require('../bancodedados')
const fns = require('date-fns')
let id = 1



const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body
    

  
       
        const checkEmail = contas.find((contas) => {
            return contas.usuario.email === email
        })

        const checkCpf = contas.find((contas) => {
            return contas.usuario.cpf === cpf
        })

    
        if (checkEmail !== undefined || checkCpf !== undefined) {
            return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"})
        }



    const novoUsuario ={
        numero: id,
        saldo: 0,
        usuario:{
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novoUsuario)
    id++
    res.status(201).json()
}

const listarConta = (req, res) => {
    return res.json(contas)
}

const editarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body
    const { numeroConta} = req.params

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    const checkEmail = contas.find((contas) => {
        return contas.usuario.email === email
    })

    if (checkEmail !== undefined) {
        return res.status(400).json({"mensagem": "Já existe uma conta com o e-mail informado!"})
    }

    const checkCpf = contas.find((contas) => {
        return contas.usuario.cpf === cpf
    })

    if (checkCpf !== undefined) {
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf informado!"})
    }

    contaEncontrada.usuario.nome = nome
    contaEncontrada.usuario.cpf = cpf
    contaEncontrada.usuario.data_nascimento = data_nascimento 
    contaEncontrada.usuario.telefone = telefone
    contaEncontrada.usuario.email = email
    contaEncontrada.usuario.senha = senha

    res.json()
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    const contaIdex = contas.findIndex((conta) => {
        return conta.numero === Number(numeroConta)
    })

    const contaEncontrada = contas[contaIdex]

    if (contaEncontrada.saldo !== 0) {
        return res.status(400).json({"mensagem" : "Contas que não estão com o saldo zerado não podem ser excluidas"})
    }
    contas.splice(contaIdex, 1)

    res.json()
}

const efetuarTransacao = (req, res) => {
    const { numeroConta, valor} = req.body

    if (!numeroConta) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o numero da conta au qual você ira realizar o deposito"})
    }

    if (!valor) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o valor a ser depositado"})
    }
    
    if (valor <= 0) {
        return res.status(400).json({"mensagem": "O valor a ser depositado não pode ser negativo nem zerado"})

    }


    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "A conta informada não foi encontrada"})
    }


    const deposito = {
        "data": fns.format(new Date(), 'yyyy-MM-dd kk:mm:ss'),
        "numero_conta": numeroConta,
        valor
    }   
    depositos.push(deposito)
    contaEncontrada.saldo += valor
    

    res.status(201).json()
}

const sacar = (req, res) => {
    const { numeroConta, valor, senha } = req.body

    if (!numeroConta) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o numero da conta au qual você ira realizar o deposito"})
    }

    if (!valor) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o valor a ser depositado"})
    }
    
    if (valor <= 0) {
        return res.status(400).json({"mensagem": "O valor a ser depositado não pode ser negativo nem zerado"})

    }
    if (!senha) {
        return res.status(400).json({"mensagem": "É obrigatorio informar a sua senha"})
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({"mensagem": "A conta informada não foi encontrada"})
    }
    
    if (conta.usuario.senha !== senha) {
        return res.status(400).json({"mensagem" : "A senha informada não condiz com a senha dessa conta"})
    }

    if (conta.saldo < valor) {
        return res.status(400).json({"mensagem" : "Esta conta não possue saldo suficiente pra essa saque"})

    }

    const saque = {
        "data": fns.format(new Date(), 'yyyy-MM-dd kk:mm:ss'),
        "numero_conta": numeroConta,
        valor
    }   
    saques.push(saque)
    conta.saldo -= valor

    res.status(201).json()
}

const efetuarTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
 
    if (!numero_conta_origem) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o numero da conta au qual você ira retira o valor"})
    }

    if (!numero_conta_destino) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o numero da conta au qual você ira realizar o deposito"})
    }

    if (!valor) {
        return res.status(400).json({"mensagem": "É obrigatorio informar o valor a ser depositado"})
    }
    
    if (valor <= 0) {
        return res.status(400).json({"mensagem": "O valor a ser depositado não pode ser negativo nem zerado"})

    }
    if (!senha) {
        return res.status(400).json({"mensagem": "É obrigatorio informar a sua senha"})
    }

    const contaOrigin = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })

    if (!contaOrigin) {
        return res.status(404).json({"mensagem": "A conta de origem informada não foi encontrada"})
    }
    if (!contaDestino) {
        return res.status(404).json({"mensagem": "A conta do destinatario informada não foi encontrada"})
    }
    
    if (contaOrigin.usuario.senha !== senha) {
        return res.status(400).json({"mensagem" : "A senha informada não condiz com a senha dessa conta"})
    }

    if (contaOrigin.saldo < valor) {
        return res.status(400).json({"mensagem" : "Esta conta não possue saldo suficiente pra essa saque"})

    }
	

	 const tranferencia = {
        "data": fns.format(new Date(), 'yyyy-MM-dd kk:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }   
    transferencias.push(tranferencia)
    contaOrigin.saldo  -= valor
    contaDestino.saldo += valor

    res.status(201).json()
	
}

const conferirSaldo = (req, res) => {
    const { numero_conta, senha} = req.query

    if (!numero_conta) {
        return res.status(400).json({"mensagem": "Conta bancária não encontada!"})
    }

    if (!senha) {
        return res.status(400).json({"mensagem": "É obrigatorio informar a sua senha"})
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "A conta informada não foi encontrada"})
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({"mensagem": "A senha informada pode estar incorreta"})
    }

    res.json({"Saldo" : contaEncontrada.saldo})
}

const imprimirExtrato = (req, res) => {
    const { numero_conta, senha} = req.query

    if (!numero_conta) {
        return res.status(400).json({"mensagem": "Conta bancária não encontada!"})
    }

    if (!senha) {
        return res.status(400).json({"mensagem": "É obrigatorio informar a sua senha"})
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "A conta informada não foi encontrada"})
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({"mensagem": "A senha informada pode estar incorreta"})
    }

    const TransferenciasEnviadas = transferencias.filter((conta) => {
        return conta.numero_conta_origem ===  Number(numero_conta)
    })

    const TransferenciasRecebidas = transferencias.filter((conta) => {
        return conta.numero_conta_destino === Number(numero_conta)
    })

    

    res.json({"Depositos" : depositos,
              "Saques"    : saques,
              TransferenciasEnviadas,
              TransferenciasRecebidas })
}

module.exports = {
    listarConta,
    criarConta,
    editarConta,
    excluirConta,
    efetuarTransacao,
    sacar,
    efetuarTransferencia,
    conferirSaldo,
    imprimirExtrato
}