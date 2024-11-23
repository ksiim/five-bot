from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import *


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=PROJECT_NAME,
    generate_unique_id_function=custom_generate_unique_id,
)

app = FastAPI()

@app.get("/api/v1/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get("/api/v1/openapi.json", include_in_schema=False)
async def get_openapi_json():
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

cors = [str(origin) for origin in BACKEND_CORS_ORIGINS] + [
            FRONTEND_HOST
        ]

print(cors)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lx6v2rq8-5173.euw.devtunnels.ms",
        "https://lx6v2rq8.euw.devtunnels.ms:5173",
        "https://lx6v2rq8.euw.devtunnels.ms:8000",
        "https://lx6v2rq8-8000.euw.devtunnels.ms",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(api_router, prefix=API_V1_STR)
