## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### To open swagger page visit [project swagger page](http://localhost:3000/api/)

### Features

1. CRUD for users.

2. Get user by id with populated articles field.

3. Get all articles that created by specific user.

4. CRUD for articles.

5. Creating new article, with check if owner exist.
   Create an article and increment **_numberOfArticles_** field for that user.

6. Edit any article document. Check if article / user exist, and only
   after that start updating document.

7. Use **searchText** query for full text search across these params **title, subtitle, description, category**. Use **lessThanCreatedAt, greaterThanCreatedAt, lessThanUpdatedAt, greaterThanUpdatedAt**
   query params in order to build query and get articles based on passed query params.
   If the request endpoint is send without setting filter criteria, get all articles from database with populated owner field.

8. Delete any article from database with decreasing **_numberOfArticles_** field for user that created this article.

9. Api endpoints is tested with supertest library.

TODO: 10. add more tests with trying different requests json data. try requests with bad and invalid data
