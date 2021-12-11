from typing import AsyncIterator
import psycopg2
import psycopg2.extras
from serverconfig import *


async def withSQLServer(callback, **kwargs):
    with psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST
    ) as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            await callback(cur, **kwargs)
            conn.commit()


async def loadDefaultCards(cur):
    cur.execute(f"DROP TABLE {TABLE_NAME}")
    cur.execute(
        f"CREATE TABLE {TABLE_NAME} (type varchar(255) PRIMARY KEY, title varchar(255), position integer)"
    )
    await addCard(cur, "bank-draft", "Bank Draft", 0)
    await addCard(cur, "bill-of-lading", "Bill of Lading", 1)
    await addCard(cur, "invoice", "Invoice", 2)
    await addCard(cur, "bank-draft-2", "Bank Draft 2", 3)
    await addCard(cur, "bill-of-lading-2", "Bill of Lading 2", 4)


async def getAllCards(cur):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} ORDER BY position ASC")
    print(cur.fetchall())
    return cur.fetchall()


async def checkCardExists(cur, type, cardShouldExist):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} WHERE type = '{type}'")
    card = cur.fetchone()
    if card != None and not cardShouldExist:
        raise RuntimeError("*** Card type exists already ***")
    if cardShouldExist:
        if card == None:
            raise RuntimeError("*** Card not found ***")
        else:
            return card


async def addCard(cur, type, title, position):
    await checkCardExists(cur, type, False)
    cur.execute(
        f"INSERT INTO {TABLE_NAME} (type, title, position) VALUES ('{type}', '{title}', {position})"
    )


async def updateCard(cur, type, title=None, position=None):
    card = await checkCardExists(cur, type, True)
    if title == None:
        title = card["title"]
    if position == None:
        position = card[position]
    cur.execute(
        f"UPDATE {TABLE_NAME} SET title = '{title}', position = {position} WHERE type = '{type}'"
    )


async def deleteCard(cur, type):
    await checkCardExists(cur, type, True)
    cur.execute(f"DELETE FROM {TABLE_NAME} WHERE type = '{type}'")


async def errorWrapper(callback):
    try:
        await callback
    except RuntimeError as error:
        print(f"ERROR! {error}")


# Public functions for API uses
async def asyncLoadDefaultCards():
    await errorWrapper(withSQLServer(loadDefaultCards))


async def asyncGetAllCards():
    await errorWrapper(withSQLServer(getAllCards))


async def asyncAddCard(type, title, position):
    await errorWrapper(
        withSQLServer(addCard, type=type, title=title, position=position)
    )


async def asyncUpdateCard(type, title=None, position=None):
    await errorWrapper(
        withSQLServer(updateCard, type=type, title=title, position=position)
    )


async def asyncDeleteCard(type):
    await errorWrapper(withSQLServer(deleteCard, type=type))
