from fastapi import APIRouter

from .routes import (
    users, tasks, task_types, user_tasks,
    settings, manifest
)

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(task_types.router, prefix="/task-types", tags=["task_types"])
api_router.include_router(user_tasks.router, prefix="/user-tasks", tags=["user_tasks"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(manifest.router, prefix="/manifest", tags=["manifest"])
