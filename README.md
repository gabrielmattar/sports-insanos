#Um super projeto insano feito por: 

###Guilherme Fernandes Marchezini
###Gabriel Alves de Campos Mattar 

##Funcionalidades:

1. **Usuários** organizadores de campeonatos podem se registrar e logar

2.  Cada usuário pode criar um ou mais **campeonatos**
  - Campeonatos são criados com um nome e um conjunto de nomes de participantes
  - Campeonatos possuem partidas e funcionam como "mata-mata"
  - Apenas o usuário criador do campeonato pode alterá-lo
  - Qualquer usuário, mesmo sem estar logado, pode acessar um campeonato mas
    não pode editá-lo

3. As **partidas** são sorteadas aleatoriamente quando o campeonato é criado
  - O Administrador pode avançar o time de uma fase para a outra quando o time vence.

4.  Campeonatos podem ser criados com número de participantes igual a
    uma potência de 2.

##Páginas

1. **Inicial**, contendo:
  - descrição do sistema,
  - botão para registrar/logar,
  - imagens de eventos de e-sports,
  - logomarca

2.  **registro**

3. **Lista de campeonatos**:
  - Quando logado apresenta os campeonatos do usuário
  - Quando nenhum usuário logado, apresente os 10 campeonatos mais recentes
  - Porcentagem de conclusão do campeonato

4. **Novo campeonato**:
  
5.  **Página campeonato**:
  - todos os participantes (time e usuários),
  - todas as partidas,
  - Os times que avançaram e os que não avançaram,
  - o estado do campeonato,
  - caso seja um campeonato do usuário logado, formas para editá-lo.

6. Página de **erro do servidor** 
  - 4XX
  - 5XX
  - 404
  - 503
  - Todas possuem mensagens bem humoradas

7. Barra de Login

##Além disso o site possui:

1. **Uso de AJAX** na página do Campeonato

2.  Persistência em **banco de dados** Mongo DB

3.  **_Layout_ e _design_ agradáveis** 

4.  A tecnologia de _back-end_ vistas na matéria

5.  Web Audio Api na página inicial

##Extras:

1. Página do campeonato com **partidas no formato de chaves** no estilo copa do mundo

2. **Páginas responsivas** 

3. Mensagens Estilizadas de Erro e Sucesso

4. **Animações e/ou transições**

5. Biblioteca já implementada de autenticação de Login

6. Apresenta se o usuário está **logado** ou não

7. Versão **mobile** do site

8. Compatibilidade do site com os principais navegadores 

