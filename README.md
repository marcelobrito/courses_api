# Backend Assessment

This is a simple API built using Typescript, Express, Swagger and Sqlite.
You will find the Postman collection to consume the API in the root directory of this project.
You can also access the Swagger documentation on /api-docs route.

# Running the app

To setup and run the project, execute the commands:
```bash
cp .env.example .env
docker compose up
```
# Running the app in development mode
to run the app in development mode, execute the commands: 
```bash
cp .env.example .env
docker compose -f docker-compose-development.yml up 
```

# Tests

To execute the tests, run the command:
```bash
npm run test
```

# Lint and Formatter

To format the code, run the command:

```bash
npm run format
```

To execute the lint, run the command:

```bash
npm lint
```


To execute both, run the command:

```bash
npm check
```
