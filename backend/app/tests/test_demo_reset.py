from datetime import datetime, timedelta

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.appointment import Appointment, AppointmentStatus
from app.models.patient import Patient
from app.models.user import User, UserRole

from .test_auth import get_admin_headers


def _create_user(db_session, email: str) -> User:
    user = User(
        email=email,
        hashed_password=get_password_hash("Password123!"),
        full_name="Demo User",
        role=UserRole.admin,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _seed_for_user(db_session, owner: User):
    patient = Patient(
        full_name="Seed Patient",
        owner_user_id=owner.id,
        created_at=datetime.utcnow() - timedelta(days=1),
    )
    db_session.add(patient)
    db_session.commit()
    appointment = Appointment(
        patient_id=patient.id,
        owner_user_id=owner.id,
        doctor_name="Seeder",
        appointment_datetime=datetime.utcnow() + timedelta(days=1),
        status=AppointmentStatus.unconfirmed,
    )
    db_session.add(appointment)
    db_session.commit()


def test_demo_reset_disabled_returns_404(client):
    settings.ENABLE_DEMO_RESET = False
    headers = get_admin_headers(client)
    response = client.post("/api/v1/demo/reset", headers=headers)
    assert response.status_code == 404


def test_demo_reset_deletes_only_current_user_data(client, db_session, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_DEMO_RESET", True)

    admin = db_session.query(User).filter(User.email == "admin@test.com").first()
    other_user = _create_user(db_session, "other@test.com")
    _seed_for_user(db_session, admin)
    _seed_for_user(db_session, other_user)

    headers = get_admin_headers(client)
    response = client.post("/api/v1/demo/reset?reseed=false", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert payload["deleted"]["patients"] == 1
    assert payload["deleted"]["appointments"] == 1

    assert (
        db_session.query(Patient)
        .filter(Patient.owner_user_id == other_user.id)
        .count()
        == 1
    )
    assert (
        db_session.query(Appointment)
        .filter(Appointment.owner_user_id == other_user.id)
        .count()
        == 1
    )

    analytics = client.get("/api/v1/dashboard/analytics", headers=headers)
    assert analytics.status_code == 200
    data = analytics.json()
    assert data["kpis"]["totalPatients"] == 0
    assert data["kpis"]["appointmentsToday"] == 0


def test_demo_reset_reseeded(client, db_session, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_DEMO_RESET", True)
    headers = get_admin_headers(client)
    response = client.post("/api/v1/demo/reset?reseed=true", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert payload["seeded"]["patients"] == 2
    assert payload["seeded"]["appointments"] == 3
