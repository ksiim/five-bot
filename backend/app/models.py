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
    
class Transaction(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    amount: int
    type: str = Field(nullable=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)