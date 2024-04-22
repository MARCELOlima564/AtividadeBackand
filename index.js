const express = require('express');
const {Pool} = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

const pool = new Pool ({
    user:'postgres',
    host: 'localhost',
    database: 'atividadebackand',
    password: 'ds564',
    port: 5432,
})

function calvuladoraIdade(mes, dia){
    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
        return 'Aquario';
    }else if ((mes === 2 && dia >=19) || (mes === 3 && dia <= 20) ){
        return 'Peixes';
    }
}

