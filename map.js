const service = require('./service.js');

Array.prototype.meuMap = function (callback) {
    const newArray = [];
    for (let i = 0; i < this.length; i++) {
        newArray.push(callback(this[i], i));
    }
    return newArray;
};

async function main() {
    try {
        const pessoas = await service.obterPessoas('a');
        const pessoasMapeadas = pessoas.results.meuMap(pessoa => pessoa.name);
        console.log(pessoasMapeadas);
    } catch(error) {
        console.error('Error', error);
    }
}

main();