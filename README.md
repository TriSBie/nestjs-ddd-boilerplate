# NestJS API boilerplate

[![Maintainability](https://api.codeclimate.com/v1/badges/a32038f660cfc3acd273/maintainability)](https://codeclimate.com/github/pezzetti/base-app-nestjs/maintainability)
[![Build Status](https://travis-ci.org/pezzetti/base-app-nestjs.svg?branch=master)](https://travis-ci.org/pezzetti/base-app-nestjs)
[![codecov](https://codecov.io/gh/pezzetti/base-app-nestjs/branch/master/graph/badge.svg?token=3Vv7si5MSD)](https://codecov.io/gh/pezzetti/base-app-nestjs)

## Description

Base application API made with NestJS, TypeORM, GraphQL, and Jest

### Folder structure

    Code organization based on NestJS modules with Domain Driven Design, focused on codebase scalability.

### SOLID

    Using SOLID principles to provide better code design for easier maintenance and testing.

### GraphQL / REST

    You can either create API's REST or Graphql

## Installation

```bash
$ npm install
$ docker-compose up -d
$ cp .env-sample .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints

```
/users or /graphql
```

## Swagger documentation

```
/docs
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

## Deployment

### Docker

### Railway

[![Deploy on Railway](https://railway.app/button.svg)]

### Northflank

[![Deploy on Northflank](https://assets.northflank.com/deploy_to_northflank_smm_36700fb050.svg)]

### Vercel

[![Deploy with Vercel](https://vercel.com/button)]

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)]

### Elestio

[![Deploy on Elestio](https://elest.io/images/logos/deploy-to-elestio-btn.png)]

## Workflows

### Setting up SendGrid for Email reminders

1. Create a SendGrid account (https://signup.sendgrid.com/)
2. Go to Settings -> API keys and create an API key
3. Copy API key to your `.env` file into the `SENDGRID_API_KEY` field
4. Go to Settings -> Sender Authentication and verify a single sender
5. Copy the verified E-Mail to your `.env` file into the `SENDGRID_EMAIL` field
6. Add your custom sender name to the `.env` file into the `NEXT_PUBLIC_SENDGRID_SENDER_NAME` field (fallback is Cal.com)

# Folder Structure

The folder structure is organized as DDD (Domain Driven Design) with modules.
[Domain]: Contains the business logic and entities of the application.

> represents the ubiquitous language of your system — it defines what “things” exist and what rules apply.
>
> > ✅ Rules:

-   No NestJS decorators (@Injectable, @Controller)
-   No Prisma imports
-   No framework code
-   This is pure TypeScript, framework-agnostic.

[Applications]: Coordinates domain logic to perform a business action

> > ✅ Rules:

-   Each method here represents a use case (e.g. RegisterUser, DeleteUser).
    > > ✅ Contains:
-   Use case services (user.service.ts)
-   Command handlers / query handlers (if using CQRS)
-   Orchestration logic: validation, combining multiple domain actions

[Infrastructure]: Contains the infrastructure-related code,

> > ✅ Rules:

-   Implements all interfaces defined in the domain/ layer.
-   Contains:
-   Mapper (e.g. UserMapper)
-   Prisma repositories (e.g. UserPrismaRepository)
-   DB adapters, external service clients
-   Configurations, caching

[Presentation]: Contains the presentation layer, such as controllers and GraphQL resolvers.

> Contains:

-   controllers/ (REST endpoints, GraphQL resolvers, WebSocket gateways)
-   dto/ (input validation)
-   response transformers (optional)
