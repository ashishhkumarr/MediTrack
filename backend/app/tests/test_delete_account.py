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


def test_delete_account_disabled_returns_404(client, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_ACCOUNT_DELETION", False)
    headers = _get_headers(client, "admin@test.com", "adminpass")
    response = client.delete("/api/v1/users/me", headers=headers)
    assert response.status_code == 404


def test_delete_account_deletes_only_current_user_data(client, db_session, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_ACCOUNT_DELETION", True)
    other_user = User(
        email="other@test.com",
        hashed_password=get_password_hash("otherpass"),
        full_name="Other User",
        role=UserRole.admin,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    admin_user = db_session.query(User).filter(User.email == "admin@test.com").first()
    admin_user_id = admin_user.id

    admin_patient = Patient(
        owner_user_id=admin_user.id,
        first_name="Demo",
        last_name="Patient",
        full_name="Demo Patient",
    )
    other_patient = Patient(
        owner_user_id=other_user.id,
        first_name="Other",
        last_name="Patient",
        full_name="Other Patient",
    )
    db_session.add_all([admin_patient, other_patient])
    db_session.commit()
    db_session.refresh(admin_patient)
    db_session.refresh(other_patient)

    admin_appointment = Appointment(
        owner_user_id=admin_user.id,
        patient_id=admin_patient.id,
        doctor_name="Dr. Admin",
        department="General",
        appointment_datetime=datetime.utcnow() + timedelta(days=1),
    )
    other_appointment = Appointment(
        owner_user_id=other_user.id,
        patient_id=other_patient.id,
        doctor_name="Dr. Other",
        department="General",
        appointment_datetime=datetime.utcnow() + timedelta(days=2),
    )
    db_session.add_all([admin_appointment, other_appointment])
    db_session.commit()

    admin_log = AuditLog(
        owner_user_id=admin_user.id,
        action="profile.updated",
        entity_type="user",
        entity_id=admin_user.id,
        summary="Admin log",
    )
    other_log = AuditLog(
        owner_user_id=other_user.id,
        action="profile.updated",
        entity_type="user",
        entity_id=other_user.id,
        summary="Other log",
    )
    db_session.add_all([admin_log, other_log])
    db_session.commit()

    headers = _get_headers(client, "admin@test.com", "adminpass")
    response = client.delete("/api/v1/users/me", headers=headers)
    assert response.status_code == 204

    assert db_session.query(User).filter(User.id == admin_user_id).first() is None
    assert (
        db_session.query(Patient)
        .filter(Patient.owner_user_id == admin_user_id)
        .count()
        == 0
    )
    assert (
        db_session.query(Appointment)
        .filter(Appointment.owner_user_id == admin_user_id)
        .count()
        == 0
    )
    assert (
        db_session.query(AuditLog)
        .filter(AuditLog.owner_user_id == admin_user_id)
        .count()
        == 0
    )

    assert db_session.query(User).filter(User.id == other_user.id).first() is not None
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
    assert (
        db_session.query(AuditLog)
        .filter(AuditLog.owner_user_id == other_user.id)
        .count()
        == 1
    )

    check = client.get("/api/v1/users/me", headers=headers)
    assert check.status_code == 401
