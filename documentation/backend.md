# Backend documentation

## Python server

The following libraries are used in the Python server:

- `uvicorn` for server hosting
- `Starlette` for handling HTTP requests
- `psycopg2` for PostgreSQL connections and queries

For development purpose, the server resets the database and loads default data on start.

---

## REST API documentation

### `GET /`

##### Return all cards.

**Parameters:** No parameters needed

**Response:** An array of all Card objects in database in JSON format

```
[
    {
        "type": "bank-draft",
        "title": "Bank Draft",
        "position": 0
    },
    {
        "type": "invoice",
        "title": "Invoice",
        "position": 1
    },
    {
        "type": "bill-of-lading-2",
        "title": "Bill of Lading 2",
        "position": 2
    }
]
```

### `POST /`

##### Reset all cards to default.

**Parameters:** No parameters needed

**Response:** An array of all Card objects in database in JSON format

```
[
    {
        "type": "bank-draft",
        "title": "Bank Draft",
        "position": 0
    },
    {
        "type": "invoice",
        "title": "Invoice",
        "position": 1
    },
    {
        "type": "bill-of-lading-2",
        "title": "Bill of Lading 2",
        "position": 2
    }
]
```

### `PUT /`

##### Update all cards in body.

**Parameters:**

_Body:_ An array of Card objects to be updated

```
[
    {
        "type": "bank-draft",
        "title": "Updated",
        "position": 0
    },
    {
        "type": "bill-of-lading-2",
        "title": "Bill of Lading 2",
        "position": 999
    }
]
```

**Response:** An array of all Card objects in database in JSON format

```
[
    {
        "type": "bank-draft",
        "title": "Updated",
        "position": 0
    },
    {
        "type": "invoice",
        "title": "Invoice",
        "position": 1
    },
    {
        "type": "bill-of-lading-2",
        "title": "Bill of Lading 2",
        "position": 999
    }
]
```

### `GET /{type}`

##### Return card with type {type}.

**Parameters:**

_Type (path parameter):_ Type of Card object to fetch

```
/bank-draft
```

**Response:** A Card object in JSON format if Card is found

```
{
        "type": "bank-draft",
        "title": "Updated",
        "position": 0
}
```

### `POST /{type}`

##### Add card with type {type}.

**Parameters:**

_Type (path parameter):_ Type of Card object to add

```
/new-card
```

_Body:_ The Card object to be added

```
{
        "type": "new-card", // this type must match type in path parameter
        "title": "New Card",
        "position": 999
}
```

**Response:** The Card object added in JSON format if operation succeed

```
{
        "type": "new-card",
        "title": "New Card",
        "position": 999
}
```

### `PUT /{type}`

##### Update card with type {type}.

**Parameters:**

_Type (path parameter):_ Type of Card object to update

```
/new-card
```

_Body:_ The Card object to be udpated

```
{
        "type": "bank-draft", // this type must match type in path parameter
        "title": "Updated",
        "position": 999
}
```

**Response:** The Card object updated in JSON format if operation succeed

```
{
        "type": "bank-draft",
        "title": "Updated",
        "position": 999
}
```

### `DELETE /{type}`

##### Delete card with type {type}.

**Parameters:**

_Type (path parameter):_ Type of Card object to delete

```
/bank-draft
```

**Response:** The Card object deleted in JSON format if Card is found.

```
{
        "type": "bank-draft",
        "title": "Updated",
        "position": 0
}
```

### Error Code

Typical error codes apply.

Code `400` for invalid requests (invalid request format, duplicate cards in addition or non-existent card in updates and deletions)

---

## PostgreSQL

An officially distributed image of PostgreSQL is used with the following configurations

- Username: `postgres`
- Password: `postgres`
- Database: `vector-full-stack`

Only 1 table is needed in this project.

**Card**

- `type`: `varchar(255) PRIMARY KEY`
- `title`: `varchar(255)`
- `position`: `integer`

---
