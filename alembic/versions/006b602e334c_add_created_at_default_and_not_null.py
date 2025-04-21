"""add created_at default and not null

Revision ID: 006b602e334c
Revises: d0cab9d7ee9c
Create Date: 2025-04-21 19:08:05.476911
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '006b602e334c'
down_revision: str = 'd0cab9d7ee9c'
branch_labels = None
dependencies = None


def upgrade() -> None:
    # 1) Заполняем все существующие NULL-ы текущим временем
    op.execute("UPDATE users SET created_at = now() WHERE created_at IS NULL;")

    # 2) Устанавливаем серверный дефолт и делаем поле обязательным
    op.alter_column(
        'users',
        'created_at',
        existing_type=sa.DateTime(),
        server_default=sa.text('now()'),
        nullable=False
    )


def downgrade() -> None:
    # Откатываем серверный дефолт и обязательность поля
    op.alter_column(
        'users',
        'created_at',
        existing_type=sa.DateTime(),
        server_default=None,
        nullable=True
    )
