"""add appointment confirmation statuses

Revision ID: 0010_add_appointment_confirmation_statuses
Revises: 0009_add_login_lockout_fields
Create Date: 2026-01-06 00:00:00.000000
"""

from alembic import op

revision = "0010_add_appointment_confirmation_statuses"
down_revision = "0009_add_login_lockout_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute(
            "ALTER TYPE appointmentstatus ADD VALUE IF NOT EXISTS 'Unconfirmed'"
        )
        op.execute("ALTER TYPE appointmentstatus ADD VALUE IF NOT EXISTS 'Confirmed'")
    op.execute(
        "UPDATE appointments SET status = 'Unconfirmed' WHERE status = 'Scheduled'"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE appointments SET status = 'Scheduled' WHERE status IN ('Unconfirmed', 'Confirmed')"
    )
