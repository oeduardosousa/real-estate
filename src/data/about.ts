import type { Award, Milestone, Principle } from "./types";

/**
 * Fictional company history, principles and awards for the Sobre page. Requested by the project owner
 * on top of BRIEF.md (founded 2009, team of 14, 480 imóveis, 17 bairros, R$ 1,2 bi). Award bodies are
 * invented and do not refer to any real institution.
 */
export const milestones: readonly Milestone[] = [
  {
    year: "2009",
    title: "Uma sala em Lourdes",
    text: "Helena Vasconcelos abre a Curral com duas pessoas e uma ideia simples: mostrar poucos imóveis, mas conhecer cada um por dentro.",
  },
  {
    year: "2012",
    title: "A primeira casa na serra",
    text: "A venda de uma casa nas Mangabeiras, sem placa na porta, define o jeito da casa. Rafael Mendonça chega para estruturar a área comercial.",
  },
  {
    year: "2015",
    title: "Alto padrão e Vale do Sol",
    text: "Camila Drummond monta a carteira de alto padrão e a Curral passa a atender Nova Lima, do Vila da Serra ao Vale do Sol.",
  },
  {
    year: "2018",
    title: "Investimentos com números honestos",
    text: "Bruno Teixeira cria a mesa de investimentos, com uma regra que vale até hoje: mostrar também os pontos fracos de cada negócio.",
  },
  {
    year: "2021",
    title: "Locação e relacionamento",
    text: "Marina Alvarenga assume a locação e o pós-venda. Acompanhar o cliente depois das chaves passa a fazer parte do serviço.",
  },
  {
    year: "2024",
    title: "Quatorze pessoas, 480 imóveis",
    text: "A equipe chega a 14 pessoas e a Curral passa de 480 imóveis negociados em 17 bairros, sem abrir uma segunda sede.",
  },
  {
    year: "2026",
    title: "O mesmo horizonte",
    text: "R$ 1,2 bi em transações depois, a casa continua pequena de propósito. O critério de 2009 segue de pé: conhecer o imóvel antes de apresentá-lo.",
  },
];

export const principles: readonly Principle[] = [
  {
    title: "Conhecer antes de mostrar",
    text: "Cada imóvel é visitado, medido e fotografado pela equipe. Se a gente não conhece, não anuncia.",
  },
  {
    title: "Dizer o ponto fraco",
    text: "Barulho, sol da tarde, condomínio caro. O que pesa na decisão entra na conversa logo no começo.",
  },
  {
    title: "Ficar depois das chaves",
    text: "A relação não termina na escritura. Reformas, locação e revenda contam com a mesma equipe.",
  },
];

export const awards: readonly Award[] = [
  {
    year: "2025",
    title: "Selo Pedra Fundamental",
    category: "Transparência em investimentos",
    body: "Instituto Pedra Fundamental",
    note: "Pela prática de apresentar riscos e custos junto com a projeção de retorno.",
  },
  {
    year: "2024",
    title: "Prêmio Cumeeira",
    category: "Imobiliária do ano, alto padrão",
    body: "Circuito Cumeeira de Mercado Residencial",
    note: "Reconhecimento à carteira de casas e coberturas na Região Metropolitana de Belo Horizonte.",
  },
  {
    year: "2023",
    title: "Troféu Relacionamento Alvorada",
    category: "Melhor atendimento ao cliente",
    body: "Fórum Alvorada de Serviços",
    note: "Com base em pesquisa de satisfação feita meses depois da entrega das chaves.",
  },
  {
    year: "2022",
    title: "Prêmio Linha do Horizonte",
    category: "Marca e comunicação visual",
    body: "Bienal Linha do Horizonte de Design",
    note: "Pela identidade inspirada na silhueta da Serra do Curral.",
  },
  {
    year: "2019",
    title: "Canga de Ouro",
    category: "Revelação do mercado imobiliário mineiro",
    body: "Guilda Canga de Ouro",
    note: "Dez anos após a abertura, a primeira distinção formal da casa.",
  },
];
