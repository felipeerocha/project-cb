# 🥥 Coco Bambu - Processo Seletivo

![Project Status](https://img.shields.io/badge/status-concluído-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20FastAPI%20%7C%20PostgreSQL-orange)

## 📖 Sobre o Projeto

Este é um sistema **SaaS (Software as a Service)** desenvolvido para gerenciar o fluxo de reservas corporativas da rede **Coco Bambu**. O sistema resolve o problema de logística e aprovação de reservas para grandes clientes e parceiros, centralizando solicitações e permitindo um controle rigoroso de disponibilidade por unidade.

O projeto foi construído utilizando uma arquitetura moderna, separando Frontend e Backend, orquestrados via **Docker**, garantindo que o ambiente de desenvolvimento seja idêntico ao de produção.

---

## 🚀 Funcionalidades e Perfis de Acesso

O sistema é dividido em dois perfis principais, cada um com fluxos de trabalho distintos:

### 🏢 1. Perfil Admin (Backoffice)
Focado na gestão e tomada de decisão.
- **Dashboard Gerencial:** Visualização de métricas em tempo real (Total de reservas, status global, gráfico de evolução diária).
- **Gestão de Unidades:** CRUD completo das filiais com **Geolocalização** integrada (mapa interativo para definir latitude/longitude).
- **Gestão de Clientes:** Controle de acesso e permissões de usuários corporativos.
- **Fluxo de Aprovação:** O Admin recebe as solicitações "Em Análise" e pode **Aprovar** ou **Reprovar** (com justificativa obrigatória).

### 👤 2. Perfil Cliente (Corporativo)
Focado na experiência do usuário e solicitação rápida.
- **Dashboard Pessoal:** Acompanhamento do status das suas solicitações (Aprovadas/Reprovadas).
- **Nova Reserva (Wizard):** Fluxo passo-a-passo intuitivo:
  1.  **Seleção de Local:** Filtro por região/cidade ou via Mapa Interativo.
  2.  **Dados da Reserva:** Escolha de data, horário e quantidade de pessoas.
  3.  **Pré-seleção de Cardápio:** (Opcional) Escolha antecipada de pratos.

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Shadcn/ui
- **Gerenciamento de Estado/Form:** React Hook Form + Zod
- **Mapas:** Leaflet
- **Gráficos:** Recharts
- **Arquitetura:** Service Layer Pattern (desacoplamento de API e UI)

### Backend
- **Framework:** FastAPI (Python)
- **Banco de Dados:** PostgreSQL 15
- **ORM:** SQLAlchemy
- **Validação:** Pydantic
- **Autenticação:** JWT (OAuth2 with Password Bearer)
- **Migrations:** Alembic

### Infraestrutura
- **Docker & Docker Compose:** Orquestração completa dos serviços.
- **Auto-Seed:** O banco de dados é populado automaticamente na primeira execução.

---

## 🐳 Como Rodar o Projeto

Este projeto foi desenhado para ser "Plug & Play". Graças ao Docker, você não precisa instalar Node, Python ou Postgres na sua máquina.

### Pré-requisitos
- Docker e Docker Compose instalados.

### ▶️ Passo a Passo

#### 1. Clone o repositório

```bash
git clone https://github.com/felipeerocha/project-cb.git
cd project-cb
```

#### 2. Configuração de Variáveis de Ambiente

O projeto utiliza arquivos `.env` para gerenciar chaves e conexões.

* Na raiz do projeto:

  * Renomeie `.env.example` para `.env`
* Na pasta `/backend`:

  * Renomeie `.env.example` para `.env`

> **Nota:** As credenciais do banco no `.env` da raiz devem coincidir com as configurações do backend.

#### 3. Suba o ambiente completo

```bash
docker-compose up --build
```

#### 4. Inicialização automática

* Criação das tabelas
* Execução do `init.sql`
* Inserção de dados de teste (usuários, unidades e reservas)

#### 5. Acesso

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Swagger (API):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔐 Credenciais de Acesso

O banco já vem populado com usuários de teste:

| Perfil        | E-mail                                                | Senha  |
| ------------- | ----------------------------------------------------- | ------ |
| Administrador | [admin@cocobambu.com](mailto:admin@cocobambu.com)     | admin@123 |
| Cliente       | [cliente@cocobambu.com](mailto:cliente@cocobambu.com) | cliente@123 |

> **Nota:** O sistema utiliza autenticação JWT com token armazenado via **Cookies**, garantindo persistência segura da sessão.

---

## ✅ Testes Automatizados

Para garantir a confiabilidade e segurança do sistema, foi implementada uma suíte de testes de integração utilizando **Pytest**.

Os testes focam nas **Regras de Negócio Críticas**, como:
* Validação de permissões (ACL) entre Admin e Usuário Comum.
* Bloqueio de edição em reservas já aprovadas.
* Integridade referencial (não permitir deletar unidades com reservas em analise).

### 📄 Documentação de Casos de Teste
O planejamento completo dos cenários de teste (incluindo entradas, saídas esperadas e status codes) pode ser visualizado no documento abaixo:

👉 **[Ver Documentação de Casos de Teste (PDF)](https://drive.google.com/file/d/1p4wAywsHSIwXEahn65oqh-OLJRx1-86K/view?usp=drive_link)**

### 🧪 Como Rodar os Testes

1. **Prepare o ambiente:**
   Acesse a pasta do backend, ative o ambiente virtual e **instale as dependências**:

   ```bash
   cd backend

   # Cria o ambiente virtual 
   python -m venv venv
   # Ativa o ambiente
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate   # Windows
   # Instala os pacotes necessários 
   pip install -r requirements.txt
   ```
    2 . Execute os testes: Com as dependências instaladas, basta rodar:
   ```bash
   pytest -v
   ```

---

## 📂 Estrutura do Projeto

```bash
CB-LAB/
├── docker-compose.yml   # Orquestração dos containers
├── .env.example         # Variáveis globais
├── backend/             # API REST (FastAPI)
│   ├── app/             # Models, Schemas e Routers
│   ├── tests/           # testes integração
│   ├── init.sql         # Seed automático do banco
│   ├── .env.example     # Variáveis do backend
│   └── Dockerfile       # Imagem Python
└── frontend/            # Aplicação Web (Next.js)
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── services/    # Comunicação com a API
    │   └── app/         # Rotas e páginas
    └── Dockerfile       # Imagem Node
```

---

## 👨‍💻 Desenvolvedor

Desenvolvido com por **Felipe Rocha**.

Projeto criado como parte de um **desafio técnico**, demonstrando competências em:

* Full Stack Development
* Arquitetura de Software
* DevOps

   




   