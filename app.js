class Despesa {
    constructor(ano, mes, dia, descricao, tipo, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.descricao = descricao
        this.tipo = tipo
        this.valor = valor
    }
    validarDados () {
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId () {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar (d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros () {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas

    }
    pesquisa(despesa) {
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa () {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let descricao = document.getElementById('descricao')
    let tipo = document.getElementById('tipo')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        descricao.value,
        tipo.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('exampleModalLabel').innerText = 'sucesso'
        document.getElementById('corTexto').className = 'modal-header text-success'
        document.getElementById('textModal').innerText = 'registro efetuado com sucesso'
        document.getElementById('botaoModal').className = 'btn btn-success'
        document.getElementById('botaoModal').innerText = 'voltar'
        $('#suporteGravacao').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        descricao.value = ''
        valor.value = ''
        tipo.value = ''

    } else {
        document.getElementById('exampleModalLabel').innerText = 'erro na gravação'
        document.getElementById('corTexto').className = 'modal-header text-danger'
        document.getElementById('textModal').innerText = 'Existem campos obrigatórios que não foram preenchidos'
        document.getElementById('botaoModal').className = 'btn btn-danger'
        document.getElementById('botaoModal').innerText = 'voltar e corrigir'
        $('#suporteGravacao').modal('show')
    }
    
}

function carregaListaDespesas (despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo){
            case '1': d.tipo = 'alimentação'
                break
            case '2': d.tipo = 'educação'
                break
            case '3': d.tipo = 'lazer'
                break
            case '4': d.tipo = 'saúde'
                break
            case '5': d.tipo = 'transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function consultaDespesas () {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let descricao = document.getElementById("descricao").value
    let tipo = document.getElementById("tipo").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, descricao, tipo, valor)

    let despesas = bd.pesquisa(despesa)

    carregaListaDespesas(despesas, true)

}
function carregaIndices() {
    let despesasIndices = Array()
    let valoresIndices = Array()
    let s = 0
    despesasIndices = bd.recuperarTodosRegistros()
    let q = despesasIndices.length


    despesasIndices.forEach(function(d){
        valoresIndices.push(parseFloat(d.valor))
        s += parseFloat(d.valor)
    })

    let m = s / q

    let maior = Math.max(...valoresIndices)
    let menor = Math.min(...valoresIndices)

    document.getElementById('total').innerHTML = s.toFixed(2)
    document.getElementById('media').innerHTML = m.toFixed(2)
    document.getElementById('maior').innerHTML = maior
    document.getElementById('menor').innerHTML = menor

}
