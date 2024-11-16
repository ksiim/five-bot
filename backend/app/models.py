import datetime
import uuid
from sqlalchemy import UUID, BigInteger, Column, ForeignKey
from sqlmodel import Field, SQLModel, Relationship


def initial_last_five_timestamp_factory():
    return datetime.datetime.now() - datetime.timedelta(days=1)

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    telegram_id: int = Field(sa_column=Column(BigInteger, unique=True, index=True))
    balance: int = Field(default=0)
    premium: bool = Field(default=False)
    from_user: uuid.UUID | None = Field(default=None)
    admin: bool | None = Field(default=False)
    
class UserCreate(UserBase):
    pass

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    last_five_timestamp: datetime.datetime = Field(default_factory=initial_last_five_timestamp_factory)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    last_activity_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class UserPublic(UserBase):
    id: uuid.UUID
    
class UsersPublic(SQLModel):
    data: list[User]
    count: int

class Airdrop(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    wallet_connected: bool = Field(default=False)
    transactions_done: bool = Field(default=False)
    reward: int
    
class TaskTypeBase(SQLModel):
    task_name: str
    
class TaskTypeCreate(TaskTypeBase):
    pass

class TaskType(TaskTypeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    
class TaskTypePublic(TaskTypeBase):
    id: uuid.UUID
    
class TaskTypesPublic(SQLModel):
    data: list[TaskType]
    count: int
    
class TaskTypeUpdate(TaskTypeBase):
    pass
    
class UserTaskBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")
    task_id: uuid.UUID = Field(foreign_key="task.id")

class UserTaskCreate(UserTaskBase):
    pass

class UserTask(UserTaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    completed_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class UserTaskPublic(UserTaskBase):
    id: uuid.UUID
    completed_at: datetime.datetime
    
class UserTasksPublic(SQLModel):
    data: list[UserTask]
    count: int
    
class UserTaskUpdate(UserTaskBase):
    user_id: uuid.UUID | None = None
    task_id: uuid.UUID | None = None
    
class TaskBase(SQLModel):
    title: str
    description: str
    reward: int
    link: str | None = Field(default=None, nullable=True)
    verification_link: str | None = Field(default=None, nullable=True)
    task_type_id: uuid.UUID = Field(foreign_key="tasktype.id")
    
class TaskCreate(TaskBase):
    pass

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class TaskPublic(TaskBase):
    id: uuid.UUID
    
class TasksPublic(SQLModel):
    data: list[TaskPublic]
    count: int
    
class TaskUpdate(TaskBase):
    title: str | None = None
    description: str | None = None
    reward: int | None = None
    link: str | None = Field(default=None, nullable=True)
    verification_link: str | None = None
    task_type_id: uuid.UUID | None = None
    
class SettingsBase(SQLModel):
    name: str
    value: str
    
class SettingsCreate(SettingsBase):
    pass

class Settings(SettingsBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class SettingsPublic(SettingsBase):
    id: uuid.UUID
    
class SettingsesPublic(SQLModel):
    data: list[Settings]
    count: int
    
class SettingsUpdate(SettingsBase):
    name: str | None = None
    value: str | None = None

    
# class Transaction(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     user_id: uuid.UUID = Field(foreign_key="user.id")
#     amount: int
#     type: str = Field(nullable=False)
#     created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)