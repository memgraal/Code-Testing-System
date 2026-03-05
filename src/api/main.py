from fastapi import FastAPI

from middlewares import TempFolderMiddleware

app = FastAPI()

app.add_middleware(TempFolderMiddleware)
app.include_router(router=...)
