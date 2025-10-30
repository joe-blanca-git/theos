import { Component } from '@angular/core';
import { LandingFooterComponent } from '../../shared/layouts/landing-footer/landing-footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-teachers',
  standalone: true,
  imports: [CommonModule, LandingFooterComponent],
  templateUrl: './landing-teachers.component.html',
  styleUrl: './landing-teachers.component.scss'
})
export class LandingTeachersComponent {
  urlImgHeader: string = '/images/assets/header-teacher.png';
  urlAbout: string = '/images/assets/about.jpg'
  urlImgHero: string = '';

   public teachers: any = [
    {
      UserId: 1,
      Nome: 'Cleber Rocha',
      Idade: 51,
      Cidade: 'Ituverava-SP',
      Formacao: 'Teólogo',
      Bio: 'Cleber é casado com Elísia e pai de Marcus, Matheus e Ester. Bacharel em Teologia e pós-graduado em plantação e revitalização de igrejas, é pastor presidente da Igreja Metodista em Ituverava e professor de Teologia. Evangelista apaixonado por Jesus, família, almas e discipulado.',
      Cursos: 1,
      Aulas: 1,
      LinkInstagram: '',
      LinkLinkedin: '',
      LinkImagem: '/images/teachers/cleber2.png'
    },
    {
      UserId: 2,
      Nome: 'Jefferson Lopes',
      Idade: 34,
      Cidade: 'São Joaquim da Barra-SP',
      Formacao: 'Teólogo',
      Bio: 'Jefferson casado com Jéssica e pai do Samuel e Lucas. Bacharel em Teologia e e especializado em Literatura de Tradição Joanina e Apocalíptica pela UMESP (Universidade Metodista/SP). Pastor na Igreja Metodista no Brasil e presidente do CONPAS (Conselho de Pastores de São Joaquim da Barra/SP). Tem um ministério marcado pela pregação fervorosa e dinâmica da Palavra de Deus.',
      Cursos: 1,
      Aulas: 1,
      LinkInstagram: '',
      LinkLinkedin: '',
      LinkImagem: '/images/teachers/jefferson2.png'
    },
    {
      UserId: 3,
      Nome: 'Tiago Gonçalves',
      Idade: 32,
      Cidade: 'Ituverava-SP',
      Formacao: 'Teólogo',
      Bio: 'Natural de Uberaba-MG, casado com Susana, pai da Larissa, é um teólogo apaixonado, formado pela FTSA, com uma sólida base em Teologia e um amor profundo pelo  estudo das questões espirituais e filosóficas. Além de sua formação teológica, ele se especializou em Sociologia e Filosofia, Aconselhamento Pastoral, e Docência em Ensino Superior, áreas que lhe permitem abordar a fé e a espiritualidade sob uma perspectiva abrangente e multifacetada.',
      Cursos: 1,
      Aulas: 1,
      LinkInstagram: '',
      LinkLinkedin: '',
      LinkImagem: '/images/teachers/tiago2.png'
    },
    {
      UserId: 4,
      Nome: 'Fernando Prado',
      Idade: 26,
      Cidade: 'Ituverava-SP',
      Formacao: 'Psicólogo',
      Bio: 'Natural de Ituverava-SP, Filho de Deus e redimido desde 2011. Casado e apaixonado pela Bruna. Formado em Psicologia, atuando na área clinica, além disso é estudante de teologia. O Nando, assim chamado pelos amigos ama se relacionar e acredito que Jesus deve ser apresentado em qualquer ocasião e até os confins da terra. Serviu por 10 anos coordenando o ministério de jovens de sua igreja, e atualmente é seminarista na mesma. Entre os seus temas de maior interesse está - Missiológia, Liderança Biblica e Saude Emocional.',
      Cursos: 1,
      Aulas: 1,
      LinkInstagram: '',
      LinkLinkedin: '',
      LinkImagem: '/images/teachers/fernando2.png'
    },
    {
      UserId: 5,
      Nome: 'Joeder Blanca',
      Idade: 35,
      Cidade: 'Ituverava-SP',
      Formacao: 'Análista de Sistemas',
      Bio: 'Natural de Ituverava e tem 34 anos. Reconheceu Jesus Cristo como seu único e sulficiente salvador desde 2018 e se tornou membro da Igreja Metodista de Ituverava em 2019, onde está até hoje. Já foi lider e atualmente é conselheiro do Ministério Audio Visual, também é professor daEscola Dominical. Casado com a Tania e pai da Nicolly, estudando Analise e Desenvolvimento de Sistemas pela Universidade Paulista.',
      Cursos: 1,
      Aulas: 1,
      LinkInstagram: '',
      LinkLinkedin: '',
      LinkImagem: '/images/teachers/joe2.png'
    }
  ];
}
