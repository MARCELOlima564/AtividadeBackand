const express = require('express');
const {Pool} = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

const pool = new Pool ({
    user:'postgres',
    host: 'localhost',
    database: 'exercicioback',
    password: 'ds564',
    port: 7007,
})

function calculadoraIdade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNascimento.getMonth();
    if (mesNascimento > mesAtual || (mesNascimento === mesAtual && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  }

function calculadoraSigno (mes, dia){
    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
        return 'Aquario';
    }else if ((mes === 2 && dia >=19) || (mes === 3 && dia <= 20) ){
        return 'Peixes';
    }else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
        return 'Áries';
      }else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
        return 'Touro';
      }else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
        return 'Gêmeos';
      }else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
        return 'Câncer';
      }else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
        return 'Leão';
      }else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
        return 'Virgem';
      }else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
        return 'Libra';
      }else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
        return 'Escorpião';
      }else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
        return 'Sagitário';
      }else {
        return 'Capricórnio'; // Caso padrão para os demais dias de dezembro e janeiro
      }
}

app.post('/usuarios', async (req, res) => {
    try {
        const {nome, sobrenome, email, datanascimento, sexo} = req.body;

        const dataNascimento = new Date(datanascimento);
        const idade = calculadoraIdade(dataNascimento);
        const signo = calculadoraSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

        await pool.query('INSERT INTO usuarios (nome, sobrenome, email, idade, signo, datanascimento, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7);', [nome, sobrenome, email, idade, signo, datanascimento, sexo]);
        res.status(201).send({ mensagem: 'Usuario adicionado com sucesso'});
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        res.status(500).send('Erro ao adicionar usuário');
    }
});

app.get('/usuarios', async (req, res) =>{
    try {
        const resultado = await pool.query('SELECT * FROM usuarios ');
        res.json({
            total: resultado.rowCount,

            usuarios: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
    res.status(500).send('Erro ao obter usuários');
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, sobrenome, email, datanascimento, sexo } = req.body;
      const dataNascimento = new Date(datanascimento);
      const idade = calculadoraIdade(dataNascimento);
      const signo = calculadoraSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());
      await pool.query('UPDATE usuarios SET nome = $1, sobrenome = $2, email = $3, idade = $4, signo = $5, datanascimento = $6, sexo = $7 WHERE id = $8', [nome, sobrenome, email, idade, signo, datanascimento, sexo, id]);
      res.status(200).send({ mensagem: 'Usuário atualizado com sucesso'});
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).send('Erro ao editar usuário');
    }
  });

  app.delete('/usuarios/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
      res.status(200).send({ mensagem: 'Usuário deletado com sucesso'});
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).send('Erro ao deletar usuário');
    }
  });

  app.get('/usuarios/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      if (resultado.rowCount === 0) {
        res.status(404).send({ mensagem: 'Usuário não encontrado' });
      } else {
        res.json(resultado.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      res.status(500).send('Erro ao obter usuário por ID');
    }
  });

  app.get('/', async (req, res) => {
    res.status(200).send({ mensagem: 'Servidor rodando com sucesso'});
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} `);
  });
  

