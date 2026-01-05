from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_admin
from app.db.session import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.audit_log import AuditLog
from app.models.patient import Patient
from app.models.user import User
from app.services.audit_log import log_event

router = APIRouter(prefix="/demo", tags=["demo"])


def _seed_demo_data(db: Session, owner: User) -> dict:
    now = datetime.utcnow()
    patients = [
        Patient(
            full_name="Demo Patient A",
            first_name="Demo",
            last_name="Patient A",
            email="demo.a@example.com",
            phone="555-0100",
            owner_user_id=owner.id,
            created_at=now,
        ),
        Patient(
            full_name="Demo Patient B",
            first_name="Demo",
            last_name="Patient B",
            email="demo.b@example.com",
            phone="555-0101",
            owner_user_id=owner.id,
            created_at=now,
        ),
    ]
    db.add_all(patients)
    db.flush()

    appointments = [
        Appointment(
            patient_id=patients[0].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="General",
            appointment_datetime=now + timedelta(hours=2),
            appointment_end_datetime=now + timedelta(hours=2, minutes=30),
            status=AppointmentStatus.scheduled,
            notes="Demo visit",
        ),
        Appointment(
            patient_id=patients[1].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="Wellness",
            appointment_datetime=now + timedelta(days=3, hours=1),
            appointment_end_datetime=now + timedelta(days=3, hours=1, minutes=30),
            status=AppointmentStatus.scheduled,
            notes="Demo follow-up",
        ),
        Appointment(
            patient_id=patients[1].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="Wellness",
            appointment_datetime=now - timedelta(days=1, hours=1),
            appointment_end_datetime=now - timedelta(days=1, minutes=30),
            status=AppointmentStatus.completed,
            notes="Demo completed visit",
        ),
    ]
    db.add_all(appointments)
    return {"patients": len(patients), "appointments": len(appointments)}


# TEMPORARY / DEMO ONLY. REMOVE BEFORE RELEASE.
@router.post("/reset")
def reset_demo_data(
    reseed: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
    request: Request = None,
):
    if not settings.ENABLE_DEMO_RESET:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    try:
        appointments_deleted = (
            db.query(Appointment)
            .filter(Appointment.owner_user_id == current_user.id)
            .delete(synchronize_session=False)
        )
        patients_deleted = (
            db.query(Patient)
            .filter(Patient.owner_user_id == current_user.id)
            .delete(synchronize_session=False)
        )
        audit_deleted = (
            db.query(AuditLog)
            .filter(AuditLog.owner_user_id == current_user.id)
            .delete(synchronize_session=False)
        )

        seeded = {"patients": 0, "appointments": 0}
        if reseed:
            seeded = _seed_demo_data(db, current_user)
        db.commit()
    except Exception:
        db.rollback()
        raise

    log_event(
        db,
        current_user,
        action="demo.reset",
        entity_type="demo",
        summary="Demo data reset",
        metadata={
            "deleted": {
                "patients": patients_deleted,
                "appointments": appointments_deleted,
                "auditLogs": audit_deleted,
            },
            "seeded": seeded,
            "reseed": reseed,
        },
        request=request,
    )

    return {
        "ok": True,
        "deleted": {
            "patients": patients_deleted,
            "appointments": appointments_deleted,
            "auditLogs": audit_deleted,
        },
        "seeded": seeded,
    }
