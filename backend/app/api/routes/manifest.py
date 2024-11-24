import os
from fastapi import APIRouter
from fastapi.responses import FileResponse


router = APIRouter()

@router.get("/")
async def get_manifest_json_file():
    print(os.getcwd())
    return FileResponse('app/api/manifest-example.json')