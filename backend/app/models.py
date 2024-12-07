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
    admin: bool | None = Field(default=False)
    from_user_telegram_id: int | None = Field(sa_column=Column(BigInteger, default=None, nullable=True))
    
class UserCreate(UserBase):
    pass

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    last_five_timestamp: datetime.datetime = Field(default_factory=initial_last_five_timestamp_factory)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    last_activity_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    tasks: list["UserTask"] = Relationship(back_populates="user", cascade="all, delete-orphan")
    
class UserPublic(UserBase):
    id: uuid.UUID
    
class UsersPublic(SQLModel):
    data: list[User]
    count: int

class AirdropBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")
    wallet_connected: bool = Field(default=False)
    wallet_address: str | None = Field(default=None, nullable=True)
    transaction_done: bool = Field(default=False)
    reward: int
    
class AirdropCreate(AirdropBase):
    pass

class Airdrop(AirdropBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class AirdropPublic(AirdropBase):
    id: uuid.UUID
    
class AirdropsPublic(SQLModel):
    data: list[Airdrop]
    count: int

class AirdropUpdate(AirdropBase):
    user_id: uuid.UUID | None = None
    wallet_connected: bool | None = None
    wallet_address: str | None = None
    transaction_done: bool | None = None
    reward: int | None = None

    
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
    user_id: uuid.UUID = Field(sa_column=Column(UUID(as_uuid=True), ForeignKey("user.id")))
    task_id: uuid.UUID = Field(sa_column=Column(UUID(as_uuid=True), ForeignKey("task.id")))

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
    
class SettingBase(SQLModel):
    name: str
    value: str
    
class SettingCreate(SettingBase):
    pass

class Setting(SettingBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    
class SettingPublic(SettingBase):
    id: uuid.UUID
    
class SettingsPublic(SQLModel):
    data: list[SettingPublic]
    count: int
    
class SettingUpdate(SettingBase):
    name: str | None = None
    value: str | None = None

    
# class Transaction(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     user_id: uuid.UUID = Field(foreign_key="user.id")
#     amount: int
#     type: str = Field(nullable=False)
#     created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)