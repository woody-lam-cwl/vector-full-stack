import psycopg2
import psycopg2.extras
from serverconfig import *


async def withSQLServer(callback, *args):
    with psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST
    ) as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            result = await callback(cur, *args)
            conn.commit()
            return result


async def checkCardExists(cur, cardShouldExist, type):
    card = await getOneCard(cur, type)
    if card != None and not cardShouldExist:
        raise RuntimeError("Card type exists")
    if cardShouldExist:
        if card == None:
            raise RuntimeError("Card not found")
    return card


async def loadDefaultCards(cur):
    cur.execute(
        f"CREATE TABLE {TABLE_NAME} (type varchar(255) PRIMARY KEY, title varchar(255), position integer)"
    )
    await addCard(cur, "bank-draft", "Bank Draft", 0)
    await addCard(cur, "bill-of-lading", "Bill of Lading", 1)
    await addCard(cur, "invoice", "Invoice", 2)
    await addCard(cur, "bank-draft-2", "Bank Draft 2", 3)
    await addCard(cur, "bill-of-lading-2", "Bill of Lading 2", 4)
    return await getAllCards(cur)


async def resetDefaultCards(cur):
    cur.execute(f"DROP TABLE {TABLE_NAME}")
    return await loadDefaultCards(cur)


async def getAllCards(cur):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} ORDER BY position ASC")
    return [dict(card) for card in cur.fetchall()]


async def getOneCard(cur, type):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} WHERE type = '{type}'")
    card = cur.fetchone()
    return dict(card) if card else None


async def addCard(cur, type, title, position):
    await checkCardExists(cur, False, type)
    cur.execute(
        f"INSERT INTO {TABLE_NAME} (type, title, position) VALUES ('{type}', '{title}', {position})"
    )
    return {"type": type, "title": title, "position": position}


async def updateCard(cur, type, title, position):
    await checkCardExists(cur, True, type)
    cur.execute(
        f"UPDATE {TABLE_NAME} SET title = '{title}', position = {position} WHERE type = '{type}'"
    )
    return {
        "type": type,
        "title": title,
        "position": position,
    }


async def deleteCard(cur, type):
    card = await checkCardExists(cur, True, type)
    cur.execute(f"DELETE FROM {TABLE_NAME} WHERE type = '{type}'")
    return dict(card)


# Public functions for API uses
async def asyncGetAllCards(type=None, requestBody=None):
    return await withSQLServer(getAllCards)


async def asyncLoadDefaultCards(type=None, requestBody=None):
    return await withSQLServer(loadDefaultCards)


async def asyncResetDefaultCards(type=None, requestBody=None):
    return await withSQLServer(resetDefaultCards)


async def asyncGetOneCard(type, requestBody=None):
    return await withSQLServer(getOneCard, type)


async def asyncAddCard(type, requestBody):
    return await withSQLServer(
        addCard, type, requestBody["title"], requestBody["position"]
    )


async def asyncUpdateCard(type, requestBody):
    return await withSQLServer(
        updateCard, type, requestBody["title"], requestBody["position"]
    )


async def asyncDeleteCard(type, requestBody=None):
    return await withSQLServer(deleteCard, type)
