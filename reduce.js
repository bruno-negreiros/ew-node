const { obterPessoas } = require('./service.js');

Array.prototype.meuReduce = function(callback, valorInicial) { 
    let acumulador = typeof valorInicial !== undefined ? valorInicial : this[0];

    for (let i = 0; i < this.length; i++) {
        acumulador = callback(acumulador, this[i], i, this);
    }
    return acumulador;
}


function main() {
    try {
        // const { results } = await obterPessoas('a');
        // results.reduce()
        const results = [1, 2, 3, 4, 5];
        const result = results.meuReduce((acc, cur, idx, src) =>  { 
            return acc + cur;
        }, 0);
        console.log(result);
    } catch(err) {
        console.error(err);
    }
}

main();