from fastapi import APIRouter
from fastapi.responses import FileResponse


router = APIRouter()

@router.get("/")
async def get_manifest_json_file():
    return FileResponse('manifest-example.json')