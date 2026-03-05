from fastapi import Request

from sandbox.tempfolder import TempFolder


class TempFolderMiddleware:

    async def __call__(self, request: Request, call_next):

        with TempFolder(closeability=False) as temp_folder:

            request.state.temp_folder = temp_folder
            response = await call_next(request)

        return response
