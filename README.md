# Classfeed

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Executando o Projeto

### Software Necessário

- Docker
- Git
- Make (opcional, mas recomendado)

### Passo 1 - Clonar o Repositório

```bash
git clone https://github.com/ericksjp/classfeed
cd classfeed
```

### Passo 2 - Configurar o Arquivo .env

Para configurar o servidor, você precisa criar um arquivo `.env` baseado no template `.env.example` fornecido. Siga as instruções abaixo para o seu sistema operacional:

#### Linux/macOS:

```bash
cp .env.example .env
```

#### Windows:

```powershell
Copy-Item .env.example .env
```

Após copiar o arquivo, abra o arquivo `.env` recém-criado e atualize as configurações conforme necessário para o seu ambiente.

### Passo 3 - Executando o Docker Compose

Para construir as imagens e executar os containers, use os comandos `make` definidos no arquivo **Makefile**.

| Comando              | Descrição                                                 | Uso Recomendado     |
| -------------------- | --------------------------------------------------------- | ------------------- |
| `make compose`       | Inicia os containers                                      | **Padrão**          |
| `make compose-dev`   | Inicia os containers em modo desenvolvimento (hot-reload) | **Desenvolvimento** |
| `make compose-debug` | Inicia os containers com debug habilitado                 | **Depuração**       |
| `make down`          | Para e remove todos os containers                         | **Encerramento**    |

### Passo 4 - Acessando a Aplicação

Apos iniciar os containers, você pode acessar:

- **API**: http://localhost:3001
- **Banco de Dados**: PostgreSQL na porta 5432

### Estrutura do Projeto

```
classfeed/
├── compose/           # Arquivos de configuração Docker
├── src/              # Código fonte da aplicação
├── sequelize/        # Migrações do banco de dados
├── .env.example      # Template de variáveis de ambiente
├── Dockerfile        # Configuração Docker da aplicação
└── Makefile          # Comandos automatizados
```
