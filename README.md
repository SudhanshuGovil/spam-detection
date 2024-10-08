# Spam Detection Application

This project uses Nodejs and Expressjs for backend application. Prisma as an ORM and Postgresql for database service. Created a REST api to be consumed by a mobile app, which is somewhat similar to various popular apps which tell you if a number is spam, or allow you to find a person’s name by searching for their phone number.

### Env Setup

Create a .env file and add the following variables

```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=test123
```

### Run Locally

Install dependencies

```bash
  npm install
```

Run migration

```bash
  npx prisma migrate dev
```

Apply seed if not applied automatically in the above step

```bash
  npx prisma db seed
```

Start the server

```bash
  node index
```

Or if you have nodemon installed

```bash
  nodemon index
```

## API Reference

#### Users

Both the APIs return JWT tokens which are required to make all the other API calls

```http
  Post /users/signup
```

| Body       | Type     | Description          |
| :--------- | :------- | :------------------- |
| `phone`    | `string` | **Required**. unique |
| `name`     | `string` | **Required**.        |
| `password` | `string` | **Required**.        |
| `email`    | `string` | **optional**.        |

```http
  Post /users/login
```

| Body       | Type     | Description   |
| :--------- | :------- | :------------ |
| `phone`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

The default password for all the seeded users is "testing1".

#### NOTE: Add the JWT token in "autherization" header before making any API call

#### Contacts

```http
  GET /contacts/${id}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of the contact to fetch |

```http
  Post /contacts/
```

To create contact, the created contact will be associated to the person whose JWT token is used to make the API call

| Body    | Type     | Description   |
| :------ | :------- | :------------ |
| `phone` | `string` | **Required**. |
| `name`  | `string` | **Required**. |
| `email` | `string` | **optional**. |

```http
  PATCH /contacts/mark-spam?id=${id}
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `string` | **Required**. Id of the contact to mark spam |

#### Search

```http
  GET /search/name?name=${name}
```

| Parameter | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `name`    | `string` | **Required**. name of the person to search with |

```http
  GET /search/phone?phone=${phone}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `phone`   | `string` | **Required**. phonenumber to search with |

### How does the application works?

##### Registration and Profile:

- A user has to register with at least name and phone number, along with a password, before
  using. He can optionally add an email address.
- Only one user can register on the app with a particular phone number.
- A user needs to be logged in to do anything; there is no public access to anything.

##### Spam:

- A user should be able to mark a number as spam so that other users can identify spammers via
  the global database. Note that the number may or may not belong to any registered user or
  contact - it could be a random number.

###### Search:

- A user can search for a person by name in the global database. Search results display the name,
  phone number and spam likelihood for each result matching that name completely or partially.
  Results should first show people whose names start with the search query, and then people
  whose names contain but don’t start with the search query.
- A user can search for a person by phone number in the global database. If there is a registered
  user with that phone number, show only that result. Otherwise, show all results matching that
  phone number completely - note that there can be multiple names for a particular phone number
  in the global database, since contact books of multiple registered users may have different names
  for the same phone number.
- Clicking a search result displays all the details for that person along with the spam likelihood. But
  the person’s email is only displayed if the person is a registered user and the user who is
  searching is in the person’s contact list.
