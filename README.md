App para desfazer a distorção de perspectiva em fotografias de folhas de papel.

## Execução

- Online: acessar <https://diogocampos.github.io/rectify/>.
- Local: abrir o arquivo `dist/index.html` em um browser.

## Utilização

1. Abrir a imagem a ser corrigida:
    - clicar no botão **Imagem…** e escolher o arquivo na janela que aparece, ou
    - arrastar o arquivo e soltar dentro do app.
2. Selecionar a região correspondente à folha de papel, posicionando os cantos da seleção sobre os cantos do papel.
3. Clicar no botão **Retificar**.
4. Quando a imagem resultante aparecer, clicar no botão **Salvar** para obter o arquivo.

## Compilação

Para reconstruir o app a partir do código fonte:

1. Instalar o runtime [Node.js](https://nodejs.org/).

2. Executar em uma linha de comando, neste diretório:

        npm install

3. Executar:

        npm start

    para iniciar um servidor de desenvolvimento que recompila automaticamente cada vez que um arquivo é editado, ou

        npm run build

    para compilar uma só vez, colocando os arquivos resultantes no diretório `dist`.
