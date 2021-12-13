import asyncio
from typing import AsyncIterator
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


async def checkCardExists(cur, cardShouldExist, type, title, position):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} WHERE type = '{type}'")
    card = cur.fetchone()
    if card != None and not cardShouldExist:
        raise RuntimeError("Card type exists")
    if cardShouldExist:
        if card == None:
            raise RuntimeError("Card not found")
        elif (
            card["type"] != type
            or card["title"] != title
            or card["position"] != position
        ):
            raise RuntimeError("Mismatch card data")


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
    return await getAllCards(cur)


async def getAllCards(cur):
    cur.execute(f"SELECT type, title, position FROM {TABLE_NAME} ORDER BY position ASC")
    cards = [dict(card) for card in cur.fetchall()]
    return cards


async def addCard(cur, type, title, position):
    await checkCardExists(cur, False, type, title, position)
    cur.execute(
        f"INSERT INTO {TABLE_NAME} (type, title, position) VALUES ('{type}', '{title}', {position})"
    )
    return {"type": type, "title": title, "position": position}


async def updateCard(
    cur, type, originalTitle, originalPosition, newTitle=None, newPosition=None
):
    await checkCardExists(cur, True, type, originalTitle, originalPosition)
    title = originalTitle if newTitle == None else newTitle
    position = originalPosition if newPosition == None else newPosition
    cur.execute(
        f"UPDATE {TABLE_NAME} SET title = '{title}', position = {position} WHERE type = '{type}'"
    )
    return {
        "type": type,
        "title": title,
        "position": position,
    }


async def deleteCard(cur, type, title, position):
    await checkCardExists(cur, True, type, title, position)
    cur.execute(f"DELETE FROM {TABLE_NAME} WHERE type = '{type}'")
    return {"type": type, "title": title, "position": position}


# Public functions for API uses
async def asyncLoadDefaultCards(requestBody=None):
    return await withSQLServer(loadDefaultCards)


async def asyncGetAllCards(requestBody=None):
    return await withSQLServer(getAllCards)


async def asyncAddCard(requestBody):
    return await withSQLServer(
        addCard, requestBody["type"], requestBody["title"], requestBody["position"]
    )


async def asyncUpdateCard(requestBody):
    return await withSQLServer(
        updateCard,
        requestBody["type"],
        requestBody["title"],
        requestBody["position"],
        requestBody.get("newTitle", None),
        requestBody.get("newPosition", None),
    )


async def asyncDeleteCard(requestBody):
    return await withSQLServer(
        deleteCard, requestBody["type"], requestBody["title"], requestBody["position"]
    )
