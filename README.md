<h1 align="center">
  Tech Challenge Marrow 🚀
</h1>

<p align="center">
  <a href="#rocket-o-desafio">O desafio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#hammer_and_wrench-decisoes-de-implementacao-e-metodologias-utilizadas">Ferramentas e Decisões</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;  
  <a href="#memo-requisitos">Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-como-usar">Como usar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#scroll-scripts-disponíveis">Scripts disponíveis</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

## :rocket: O desafio
O projeto "Desafio Marrow - IA" tem como objetivo desenvolver um sistema que detecta comportamentos inadequados em conversas de áudio dentro de um espaco educacional, público ou corporativo. Os principais requisitos incluem:
 - Implementação de um sistema de transcrição de áudio 
 - Realização de análise de sentimento e detecção de linguagem tóxica
 - Criação de uma interface de usuário

As tecnologias utilizadas para a implementação foram Python, Next.js, TailwindCSS e Docker. 

## :hammer_and_wrench: Decisões de Implementação e Metodologias Utilizadas

### 1. Transcrição de áudio
A transcrição foi implementada utilizando a biblioteca [SpeechRecognition](https://github.com/Uberi/speech_recognition#readme) em Python, que oferece suporte a diversos modelos de conversão de fala para texto. Para este projeto, escolheu-se o modelo Whisper da [OpenAI](https://openai.com/whisper) devido à sua acurácia e pelas opções de executar localmente ou pela API. 

O Whisper Local foi adotado para garantir privacidade, uma vez que os dados são processados localmente, sem a necessidade de envio para a nuvem. Essa abordagem também permite controlar o consumo de recursos e ajustar a precisão conforme a capacidade computacional disponível. 

Como alternativa, o Whisper API foi integrado para oferecer uma solução prática para casos em que recursos locais sejam limitados.

---

### 2. Análise de Sentimento e Detecção de Linguagem Tóxica
Inicialmente, foi utilizada a biblioteca [Transformers](https://github.com/huggingface/transformers), que oferece acesso a modelos pré-treinados do [Hugging Face](https://huggingface.co/). Embora testados diversos modelos, eles enfrentaram limitações significativas em idiomas diferentes do inglês, evidenciando tanto menor desempenho em detecções de expressões tóxicas e abusivas quanto classificações errôneas constantes.

Para superar essas limitações, foi adotada a API da OpenAI (LLM), que demonstrou:
- Alta precisão na classificação de emoções e na detecção de linguagem tóxica, mesmo em expressões mais sutis.
- Suporte a múltiplos idiomas, garantindo uma experiência consistente em qualquer contexto.
- Utilizando *structured outputs*, que assegura consistência nas respostas do modelo e no formato de exibição para o usuário

A análise de linguagem tóxica foi organizada em 8 categorias, baseando-se no esquema do [Perspective API](https://perspectiveapi.com/), um projeto que visa identificar e categorizar comentários tóxicos e abusivos. As categorias são:
- TOXICITY: Comentários rudes, desrespeitosos ou irracionais.
- IDENTITY_ATTACK: Comentários negativos ou odiosos que atacam alguém por causa de sua identidade.
- INSULT: Comentários insultuosos, inflamados ou negativos direcionados a uma pessoa ou grupo.
- ROFANITY: Uso de palavrões, xingamentos ou linguagem obscena.
- THREAT: Descrições de intenções de infligir dor, ferimentos ou violência contra um indivíduo ou grupo.
- SEXUALLY_EXPLICIT: Referências a atos sexuais, partes do corpo ou outros conteúdos lascivos.
- FLIRTATION: Cantadas, elogios à aparência ou insinuações sexuais sutis.
- OTHER: Comentários tóxicos ou abusivos que não se enquadram nas categorias anteriores.

Essa categorização detalhada permite maior precisão na análise e oferece uma bom meio para detectar comportamentos inadequados.

Os dois modelos — Transformers e LLM — permanecem disponíveis para uso. Contudo, recomenda-se fortemente o uso da LLM devido à sua superioridade em performance. Ainda assim, algumas considerações importantes devem ser feitas:

1. Transformers: Apesar da menor precisão observada em alguns cenários, existe a possibilidade de realizar um fine-tuning nos modelos, o que poderia melhorar significativamente a acurácia para o problema em questão sem a necessidade de utilizar um modelo computacionalmente pesado. No entanto, essa abordagem não foi explorada neste projeto devido à falta de dados, tempo e recursos computacionais necessários para tal treinamento.

2. Alternativas à LLM: Atualmente, a implementação utiliza a API da OpenAI, mas existem outras opções viáveis, como o LLaMA, que também suporta structured outputs. Isso abriria a possibilidade de executar o modelo localmente, preservando dados sensíveis, além de permitir fine-tuning, oferecendo flexibilidade para cenários futuros.

---

### 3. Formatação de Texto e Identificação de Falantes
Durante os testes, observou-se que as transcrições brutas eram de difícil leitura devido à falta de formatação. Para solucionar esse problema, foi implementada uma funcionalidade de formatação automática, utilizando a API da OpenAI.

A formatação reorganiza o conteúdo em parágrafos claros e estruturados, além de identificar os falantes (por exemplo, "Professor" e "Aluno"), melhorando significativamente a legibilidade e usabilidade do texto.

Ambas versões das transcrições — formatadas e não formatadas — são armazenadas no sistema e podem ser baixadas pelo usuário.

### 4. Sumarização do texto
Como se trata de um sistema de monitoramento para um ambiente educacional, surgiu a ideia de implementar uma funcionalidade de sumarização do texto transcrito para verificar se o professor está se mantendo dentro do tópico da aula. Para isso, novamente utilizou-se modelos baseados na arquitetura Transformer, especialmente voltados para a tarefa de sumarização.

Atualmente, o sistema oferece suporte para sumarização em dois idiomas: inglês e português. No entanto, o desempenho dos modelos é significativamente melhor em inglês, devido ao tamanho do modelo utilizado [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn), o que confere ao modelo uma maior acurácia e relevância nas informações extraídas.

Porém, o português foi integrado principalmente como *proof of concept*, utilizando o modelo [phpaiola/ptt5-base-summ-xlsum](https://huggingface.co/recogna-nlp/ptt5-base-summ-xlsum), demonstrando que a tarefa de sumarização é viável também para o idioma. Embora o desempenho do modelo em português ainda seja inferior, a criação de modelos maiores e mais robustos poderia melhorar consideravelmente os resultados dessa funcionalidade. Essa implementação no português serve como um indicativo de que, com o treinamento adequado, o modelo poderia garantir maior precisão na sumarização de conteúdos.

---

## :memo: Requisitos

| Ferramenta| Versão  | Descrição                                    |
|-----------|---------|----------------------------------------------|
| [Docker](https://www.docker.com/)              | 27.3.1 | Plataforma de contêineres que permite empacotar, distribuir e executar o aplicativo de forma isolada, garantindo consistência no ambiente de desenvolvimento e produção.  |
| [Git](https://git-scm.com/)           | | |

## :man_technologist: Tecnologias

Este projeto está sendo desenvolvido com as seguintes tecnologias:

-  Linguagens: [Typescript](https://www.typescriptlang.org/) e [Python](https://www.python.org/);
-  Estilização: [Tailwind](https://tailwindcss.com/) 
-  Front-end: [ReactJS](https://reactjs.org/) e [Next.js](https://nextjs.org/);
-  Back-end: [Flask](https://flask.palletsprojects.com/en/stable/)
-  Contêiner: [Docker](https://www.docker.com/)

## :information_source: Como usar

Um tutorial em vídeo está disponível neste [link](https://youtu.be/).

```bash
# Clonar este repositório
$ git clone https://github.com/Zephrysz/Marrow-Challenge.git
# Ir para o repositório
$ cd Marrow-Challenge
# Rodar a aplicação em ambiente de desenvolvimento
$ docker compose up
```

## :scroll: Scripts disponíveis

- `docker compose up`: Inicia os containers da aplicação
- `docker compose down`: Para e remove todos os contêiners, redes e volumes associado ao projeto
- `docker compose up --build`: Flag que força a reconstrução das imagens Docker antes de iniciar os containers. Use quando houver mudanças nos arquivos de configuração ou código.
- `docker compose up --watch`: Habilita o modo de observação, que reinicia automaticamente a aplicação ao detectar alterações nos arquivos de código


Após rodar o comando, a aplicação estará disponível em: [localhost:3000](http://localhost:3000/)

