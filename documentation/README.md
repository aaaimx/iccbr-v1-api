## Geting started.

The ICCBR 2024 API is built in 🚀 **Node.js** using ⚙️ **ExpressJS** primarily, using an **MVC** (Model-View-Controller) design pattern to implement user interfaces, data and logic control

🦣 **PostgreSQL** with the AWS Relationship Database Service **RDS** has been used for the database and the server is deployed on **Amazon EC2** (Amazon Elastic Compute Cloud from AWS).

This platform is End to End, meaning it has a flow from start to finish, where the end user (customer) can select the tickets they are interested in purchasing, enter their personal purchase information and process payment using credit/debit cards with Stripe or interbank transfers, finally the client receives their receipt of payment to the email with which they registered.

## Clone the repository to collaborate on the project.

Make sure you have Git installed, it is recommended to use Ubuntu as well. 😉

1. Create a folder where you can save the Back-End repository, it is recommended that it be in the same directory where the Front-End is:

```
git clone https://github.com/aaaimx/iccbr-v1-api.git
```

2. Below is the project structure tree:

```
.
├── node_modules
├── src
│   ├── config
│   │   ├── database.js
│   │   └── nodemailer.js
│   ├── controllers
│   │   ├── bankTransferController.js
│   │   ├── nodemailerController.js
│   │   ├── stripeController.js
│   │   └── ticketsController.js
│   ├── models
|   |   ├── regisrationModel.js
|   |   ├── registrationTicketsModel.js
|   |   └── usersModel.js
│   ├── routes
│   │   ├── bankTransferRoutes.js
│   │   ├── stripeRoutes.js
│   │   └── ticketsRoutes.js
│   └── index.js
├── .env
├── .env.local
├── .gitignore
├── package.json
└── pnpm-lock.yaml
```

## Development and production environment.

The repository has three branches; **prod**, **dev** and **hot-fixes**;

> [!TIP]
> **Branches:** These are parallel versions of the code base that allow working on different functionalities or bug fixes independently. In this case, three main branches are mentioned:

prod (short for "production"): This branch typically contains the stable version of the code that is ready to be deployed to a production environment, that is, the environment where end users interact with the live application.

dev (short for "development"): This branch is often used to integrate new features and major code changes. It is a development environment where changes are tested and integrated before being promoted to the production branch.

hot-fixes (short for "quick fixes"): This branch is used to fix critical or urgent bugs in the production version without having to wait for the next planned release. Hot-fixes are deployed quickly and applied directly to the production branch to fix urgent issues.
