from typing import List

from fastapi import APIRouter, UploadFile, File, Request


testing_router = APIRouter(prefix="/testing", tags=["testing"])


# Так как на платформе есть возможность вставлять код
@testing_router.post(path="/test/files")
async def file_test(
    request: Request, uploaded_files: List[UploadFile] = File(...)
):

    temp_folder = request.state.temp_folder
    for file in uploaded_files:
        content = await file.read()
        temp_folder.append_file(filename=file.filename, content=content)

    temp_folder.force_delete()


@testing_router.post(path="/test/text")
async def text_test(request: Request, filename: str, content: str):
    temp_folder = request.state.temp_folder
    temp_folder.append_file(filename=filename, content=content.encode())

    temp_folder.force_delete()
