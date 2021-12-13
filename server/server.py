from starlette.applications import Starlette
from starlette.responses import Response, JSONResponse
from starlette.endpoints import HTTPEndpoint
import uvicorn
from database import *

app = Starlette()


async def errorWrapper(callback, validationNeeded=False, body=None):
    try:
        if validationNeeded:
            assertRequestFormatValid(body)
        return JSONResponse(await callback(body))
    except Exception as e:
        return Response(str(e), status_code=400)


def assertRequestFormatValid(body):
    try:
        assert type(body["type"]) == str
        assert type(body["title"]) == str
        assert type(body["position"]) == int
    except:
        raise RuntimeError("Incorrect request format.")


@app.route("/")
class root(HTTPEndpoint):
    async def get(self, request):
        return await errorWrapper(asyncGetAllCards)

    async def post(self, request):
        body = await request.json()
        return await errorWrapper(asyncAddCard, True, body)

    async def put(self, request):
        body = await request.json()
        return await errorWrapper(asyncUpdateCard, True, body)

    async def delete(self, request):
        body = await request.json()
        return await errorWrapper(asyncDeleteCard, True, body)


if __name__ == "__main__":
    asyncio.run(asyncLoadDefaultCards())
    uvicorn.run(app, host="0.0.0.0", port=8000)
