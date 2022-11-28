import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  //endpoint da api
  apiEndpoint: string = 'http://localhost:8080/api/produtos';
 
  //variável
  produtos: any[] = [];
 
  //criando uma variável e inicializar o objeto HttpClient
  constructor(
    private httpClient: HttpClient
  ) {
 
  }
 
  //método executado sempre que o componente é aberto
  ngOnInit(): void {
 
    //fazendo uma chamada para o serviço GET /api/produtos
    this.httpClient.get(this.apiEndpoint)
      .subscribe( //capturando o retorno obtido da API
        (dados) => {
          //armazenar os produtos obtidos da API
          this.produtos = dados as any[];
        }
      )
  }
 
  //formulário para cadastro de produtos
  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required])
  });
 
  //função para exibir as mensagens de erro de validação do formulário
  get form_cadastro(): any {
    return this.formCadastro.controls;
  }
 
  //função para capturar o submit do formulário
  cadastrarProduto(): void {
   
    //realizando uma requisição POST para a api
    this.httpClient.post(this.apiEndpoint, this.formCadastro.value,
      { responseType: 'text' })
      .subscribe(
        (mensagem) => {
          alert(mensagem); //popup para exibir a mensagem obtida da API
          this.formCadastro.reset(); //limpar os campos do formulário
          this.ngOnInit(); //re-executando a consulta de produtos
        }
      );
  }
 
  //formulário para edição de produtos
  formEdicao = new FormGroup({
    idProduto: new FormControl(''),
    nome: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required])
  });
 
  //função para exibir as mensagens de erro de validação do formulário
  get form_edicao(): any {
    return this.formEdicao.controls;
  }
 
  //função para capturar o submit do formulário
  atualizarProduto(): void {
   
    //executando uma requisição para o serviço de edição da API
    this.httpClient.put(this.apiEndpoint, this.formEdicao.value,
      { responseType: 'text' })
      .subscribe(
        (mensagem) => {
          alert(mensagem); //exibindo a mensagem obtida da API
          this.ngOnInit(); //re-executando a consulta de produtos
        }
      )
  }
 
  //função para capturar o produto selecionado
  //e exibir os seus dados no formulário de edição
  exibirProduto(p: any): void {
    //preenchendo o formulário com os dados do produto
    this.formEdicao.patchValue(p);
  }
 
  //função para excluir o produto (evento click)
  excluirProduto(p: any) : void {
 
    let texto: string = "Deseja realmente excluir o produto?\n";
    texto += "\nNome do Produto: " + p.nome;
    texto += "\nPreço: " + p.preco;
    texto += "\nQuantidade: " + p.quantidade;
    texto += "\nDescrição: " + p.descricao;
 
    //solicitar que o usuário confirme a exclusão do produto
    if(confirm(texto)) {
 
      //realizando uma requisição DELETE para excluir um produto na API
      this.httpClient.delete(this.apiEndpoint + '/' + p.idProduto,
        { responseType: 'text' })
      .subscribe(
        (mensagem) => {
          alert(mensagem); //exibindo a mensagem obtida da API
          this.ngOnInit(); //re-executando a consulta de produtos
        }
      )
    }
  }
 
}
 


