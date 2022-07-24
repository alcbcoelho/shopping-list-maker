/* const n = 2;

if (typeof n === "number") {
  console.log("Ele é!");
}
 */

class Pessoa {
  constructor(nome = "", anoDeNascimento = Number, sexo = "", cpf = "") {
    this.nome = nome;
    this.anoDeNascimento = anoDeNascimento;
    this.sexo = sexo;
    this.cpf = cpf;
  }
}

class Aluno extends Pessoa {
  constructor(matricula) {
    this.matricula = matricula;
  }
}

const andre = new Aluno(2124290028);
console.log(andre);
