## Description

## Prerequisites

1. Create a user in your mongodb admin database with superuser role.
   Add comments with space after two dashes in order to be removed in without\*comments branch with regex \*\*\*// \w+\_\*\*

2. For local running and testing create user in mongodb database with mongosh.

paste following commands into mongosh:

```js
use admin;
db.createUser(
  {
    user: "username",
    pwd: "user_password",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

use admin;
db.grantRolesToUser('username', [{ role: 'root', db: 'admin' }])
```

```js
// sample of comment
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode for windows
$ npm run start:dev-win

# production mode for windows
$ npm run start:prod-win
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

### To open swagger page visit [project swagger page](http://localhost:3027/api/)

### To open mongo-express page visit [express-mongo](http://localhost:8081/)

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

10. add more tests with trying different requests json data. try requests with bad and invalid data
