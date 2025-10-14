import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-household-budget',
  imports: [ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  currentYear: number = new Date().getFullYear();
  titulo = 'PROJEKTZ';
  textoVisivel = signal('');

  ngOnInit() {
    this.digitarTexto();
  }

  digitarTexto() {
    const letras = this.titulo.split('');
    let i = 0;

    const intervalo = setInterval(() => {
      if (i < letras.length) {
        this.textoVisivel.update(valorAtual => valorAtual + letras[i]);
        i++;
      } else {
        clearInterval(intervalo);
      }
    }, 100); // ⏱️ tempo entre cada letra (ms)
  }
}
