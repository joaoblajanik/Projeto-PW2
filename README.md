# PROJETO_WEB — Cantinho do Churrasco

Projeto web reorganizado para uma estrutura de pastas mais limpa e fácil de apresentar.

## Estrutura principal

```text
PROJETO_WEB/
├── index.html
├── pages/
│   ├── cadastro.html
│   ├── consulta.html
│   ├── relatorios.html
│   ├── cardapio.html
│   ├── sobre.html
│   └── contato.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── imagens/
│   ├── carnes/
│   ├── saladas/
│   └── bebidas/
└── README.md
```

As três páginas pedidas foram criadas:
- `pages/cadastro.html`: formulário de reserva.
- `pages/consulta.html`: painel administrativo, cadastro interno, consulta, edição e exclusão.
- `pages/relatorios.html`: estatísticas e relatório das reservas.

As páginas `cardapio.html`, `sobre.html` e `contato.html` foram mantidas dentro de `pages/` para não perder o conteúdo que já existia no projeto.

## Funcionamento

O sistema usa `localStorage` do navegador para guardar as reservas e o status do salão. Não existe banco de dados ou servidor nesta versão.

### Acesso administrativo

Usuários configurados no JavaScript:
- arthur / arthur123
- fabricio / fabricio123
- blajanik / blajanik123

> Como essas credenciais ficam no JavaScript, isso serve apenas para um projeto escolar/demonstração local. Não é um sistema de autenticação seguro para produção.

## Imagens

O cardápio já aponta para:
- `imagens/carnes/`
- `imagens/saladas/`
- `imagens/bebidas/`

Coloque nessas pastas as imagens que já eram usadas no projeto original. Elas não foram inventadas nem substituídas, pois não estavam entre os arquivos enviados.

## Como abrir

Abra `index.html` no navegador. Para testar o painel, entre em `Painel Admin` e use uma das credenciais acima.

## Alterações feitas

- Centralização de CSS em `css/style.css`.
- Centralização de JavaScript em `js/script.js`.
- Correção dos caminhos relativos para páginas dentro de `pages/`.
- Separação entre cadastro, consulta e relatórios.
- Correção do fluxo de reservas no `localStorage`.
- Formulários de contato e reserva com mensagens de retorno.
- Relatórios calculados a partir das reservas existentes.
- Navegação atualizada para a nova estrutura.
