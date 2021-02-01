import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // 0 = verde
  // 1 = vermelho
  // 2 = amarelo
  // 3 = azul
  
  TEMPO = 500;

  ordemASerSeguida: Array<number> = [];  
  pontuacao = 0;
  level = 1;
  msgBotao = 'PLAY!';
  mensagem = 'Bem vindo ao jogo de memória Genius! Para iniciar o jogo clique em PLAY!';
  desabilitarBotoes: boolean = true;  
  coresAcesas: Array<boolean> = [false, false, false, false];
  indice = 0
  
  setup(): void {
    this.mensagem = 'Repita a sequência de cores';    
    this.pontuacao = 0;
    this.level = 1;
    this.msgBotao = 'Reset';
    this.desabilitarBotoes = false;
    this.coresAcesas = [false, false, false, false];
    this.indice = 0;

    this.ordemASerSeguida = [];    

    this.adicionarSequencia();
    this.exibirSequencia();
  }

  //---------------------------------------------------------------------  
  proximoLevel(): void {
    this.level++;
    this.pontuacao += 5;
    this.mensagem = 'Exibindo nova sequência';
    this.adicionarSequencia();
    this.exibirSequencia();    
  }
  
  //---------------------------------------------------------------------    
  gameOver(): void {
    this.mensagem = 'Você perdeu =( ... Para jogar novamente clique em Play!';
    this.msgBotao = 'PLAY!'; 
    this.desabilitarBotoes = true;   
  }
     
  //---------------------------------------------------------------------      
  // Função para criar uma ordem aleatória de cores a cada rodada    
  adicionarSequencia(): void {    
      const cor = Math.floor(Math.random() * 4);      
      this.ordemASerSeguida.push(cor);
  }

  //--------------------------------------------------------------------- 
  exibirSequencia(): void {
    // Desabilita o click nos botões enquanto estiver exibindo a sequência
    this.desabilitarBotoes = true;

    let count = 0;    
    this.coresAcesas[this.ordemASerSeguida[count]] = true; 
        
    interval(this.TEMPO).pipe(take(this.level)).subscribe({
      next: () => {        
        this.coresAcesas[this.ordemASerSeguida[count]] = false; 
        
        count++;        

        setTimeout(() => this.coresAcesas[this.ordemASerSeguida[count]] = true, 200 );        
      },
      complete: () => {
        this.coresAcesas[this.ordemASerSeguida[count]] = false;
        this.desabilitarBotoes = false;
        this.mensagem = 'Repita a sequência de cores';
      }
    });
  }

  
  //---------------------------------------------------------------------   
  comparaSequencia(corClicada: number): void {
    
    if(corClicada !== this.ordemASerSeguida[this.indice]) {
      this.gameOver();
      return;
    }

    if(this.indice === this.ordemASerSeguida.length - 1) {
      this.mensagem = 'Você acertou! Iniciando o próximo level!';
      this.indice = 0;

      setTimeout(() => {
        this.proximoLevel();        
      }, 1000);      
    }
    else {  
      this.indice ++;    
    }
  }
  
  
  //--------------------------------------------------------------------- 
  click (corClicada: number): void {

    if(this.desabilitarBotoes)
      return;
    
    this.comparaSequencia(corClicada);    
  }

}
