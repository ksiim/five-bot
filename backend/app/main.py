from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import *


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=PROJECT_NAME,
    generate_unique_id_function=custom_generate_unique_id,
)

cors = [str(origin) for origin in BACKEND_CORS_ORIGINS] + [
            FRONTEND_HOST
        ]

print(cors)

app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in BACKEND_CORS_ORIGINS] + [
            FRONTEND_HOST
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(api_router, prefix=API_V1_STR)
