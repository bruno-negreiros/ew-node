const service = require('./service.js');

Array.prototype.meuFilter = function (callback) {
    const novoArray = [];
    for (let i = 0; i < this.length; i ++) {
        if (callback(this[i], i, this)) {
            novoArray.push(this[i].name);
        }
    }

    return novoArray;
};

async function main() {

    try {

        const { results } = await service.obterPessoas('a');

        const familiaLars = results.meuFilter(function(pessoa) {
            return pessoa.name.toLowerCase().indexOf('lars') !== -1;
        });

        console.log(familiaLars);

        // const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // const numerosFiltrados = numeros.meuFilter(function(numero) {
        //     return numero % 2 === 0;
        // });

        // console.log(numerosFiltrados);

    } catch(err) {
        console.error('Error:', err);
    }
}

main();

