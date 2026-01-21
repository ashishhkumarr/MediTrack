from datetime import datetime, timedelta

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.appointment import Appointment
from app.models.audit_log import AuditLog
from app.models.patient import Patient
from app.models.user import User, UserRole


def _get_headers(client, email: str, password: str) -> dict:
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_load_sample_data_disabled_returns_404(client, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_DEMO_RESET", False)
    headers = _get_headers(client, "admin@test.com", "adminpass")
    response = client.post("/api/v1/demo/load-sample", headers=headers)
    assert response.status_code == 404


def test_load_sample_data_creates_records_for_current_user(client, db_session, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_DEMO_RESET", True)
    other_user = User(
        email="other@test.com",
        hashed_password=get_password_hash("otherpass"),
        full_name="Other User",
        role=UserRole.admin,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    other_patient = Patient(
        owner_user_id=other_user.id,
        first_name="Other",
        last_name="Patient",
        full_name="Other Patient",
    )
    db_session.add(other_patient)
    db_session.commit()

    headers = _get_headers(client, "admin@test.com", "adminpass")
    response = client.post("/api/v1/demo/load-sample", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert payload["ok"] is True
    assert payload["seeded"]["patients"] >= 3
    assert payload["seeded"]["appointments"] >= 5

    admin_user = db_session.query(User).filter(User.email == "admin@test.com").first()
    assert (
        db_session.query(Patient)
        .filter(Patient.owner_user_id == admin_user.id)
        .count()
        == payload["seeded"]["patients"]
    )
    assert (
        db_session.query(Appointment)
        .filter(Appointment.owner_user_id == admin_user.id)
        .count()
        == payload["seeded"]["appointments"]
    )
    assert (
        db_session.query(Patient)
        .filter(Patient.owner_user_id == other_user.id)
        .count()
        == 1
    )

    audit = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.owner_user_id == admin_user.id,
            AuditLog.action == "demo.sample_data_loaded",
        )
        .first()
    )
    assert audit is not None


def test_load_sample_data_blocks_when_existing_data(client, db_session, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_DEMO_RESET", True)
    admin_user = db_session.query(User).filter(User.email == "admin@test.com").first()

    existing_patient = Patient(
        owner_user_id=admin_user.id,
        first_name="Existing",
        last_name="Patient",
        full_name="Existing Patient",
    )
    db_session.add(existing_patient)
    db_session.commit()
    db_session.refresh(existing_patient)

    existing_appointment = Appointment(
        owner_user_id=admin_user.id,
        patient_id=existing_patient.id,
        doctor_name="Demo Provider",
        department="General",
        appointment_datetime=datetime.utcnow() + timedelta(days=1),
    )
    db_session.add(existing_appointment)
    db_session.commit()

    headers = _get_headers(client, "admin@test.com", "adminpass")
    response = client.post("/api/v1/demo/load-sample", headers=headers)
    assert response.status_code == 409
