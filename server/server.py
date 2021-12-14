import asyncio
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response, JSONResponse
from starlette.endpoints import HTTPEndpoint
import uvicorn
from database import *


async def errorWrapper(callback, validationNeeded=False, cardType=None, body=None):
    try:
        if validationNeeded:
            assertRequestFormatValid(cardType, body)
        return JSONResponse(await callback(cardType, body))
    except Exception as e:
        return Response(str(e), status_code=400)


def assertRequestFormatValid(cardType, body):
    try:
        assert type(body["type"]) == str
        assert cardType == body["type"]
        assert type(body["title"]) == str
        assert type(body["position"]) == int
    except:
        raise RuntimeError("Incorrect request format.")


class batch(HTTPEndpoint):
    async def get(self, request):
        return await errorWrapper(asyncGetAllCards)

    async def post(self, request):
        return await errorWrapper(asyncResetDefaultCards)

    async def put(self, request):
        body = await request.json()
        for card in body:
            await errorWrapper(asyncUpdateCard, True, card["type"], card)
        return await errorWrapper(asyncGetAllCards)


class individual(HTTPEndpoint):
    async def get(self, request):
        print(request.path_params["type"])
        return await errorWrapper(asyncGetOneCard, cardType=request.path_params["type"])

    async def post(self, request):
        body = await request.json()
        return await errorWrapper(asyncAddCard, True, request.path_params["type"], body)

    async def put(self, request):
        body = await request.json()
        return await errorWrapper(
            asyncUpdateCard, True, request.path_params["type"], body
        )

    async def delete(self, request):
        return await errorWrapper(asyncDeleteCard, cardType=request.path_params["type"])


routes = [
    Route("/", batch, methods=["GET", "POST", "PUT"]),
    Route("/{type}", individual, methods=["GET", "POST", "PUT", "DELETE"]),
]
middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
]
app = Starlette(routes=routes, middleware=middleware)

if __name__ == "__main__":
    asyncio.run(asyncLoadDefaultCards())
    uvicorn.run(app, host="0.0.0.0", port=8000)
