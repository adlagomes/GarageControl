# 🚗 GarageControl

Sistema completo para gerenciamento de Garagens e Veículos, desenvolvido com Angular no frontend e .NET no backend. Inspirado no universo de GTA V, com visual urbano gamer e funcionalidades práticas para jogadores.

## 🎯 Funcionalidades

- CRUD de Garagens
- CRUD de Veículos
- Upload de imagens para veículos
- Filtros por tipo, capacidade, assentos e muito mais
- Ordenação inteligente (nome, capacidade, veículos alocados etc.)
- Tema escuro/claro com botão de alternância
- Paginação e design responsivo inspirado no estilo GTA

## 🛠️ Tecnologias utilizadas

### 🧩 Frontend (Angular)
- Angular 17+
- TypeScript
- CSS puro (tema dark/light)
- Responsividade via Flexbox

### ⚙️ Backend (.NET)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- CORS + Swagger habilitado

## 🔧 Como rodar o projeto localmente

### Backend

```bash
cd GaragesAPI
dotnet restore
dotnet ef database update
dotnet run
```
### Frontend

```
cd GaragesApp
npm install
ng serve
Acesse em: http://localhost:4200
```

## 🧠 Organização do Projeto

```
GarageControl/
├── GaragesAPI/        ← backend .NET
├── GaragesApp/        ← frontend Angular
├── GarageControl.sln  ← solução do Visual Studio
└── README.md          ← este arquivo
```
## 🤝 Contribuição
Este projeto foi desenvolvido com foco em aprendizado e prática de arquitetura fullstack. Sinta-se à vontade para sugerir melhorias ou abrir issues!
