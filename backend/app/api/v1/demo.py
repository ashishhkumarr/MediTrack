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
        Patient(
            full_name="Demo Patient C",
            first_name="Demo",
            last_name="Patient C",
            email="demo.c@example.com",
            phone="555-0102",
            owner_user_id=owner.id,
            created_at=now,
        ),
        Patient(
            full_name="Demo Patient D",
            first_name="Demo",
            last_name="Patient D",
            email="demo.d@example.com",
            phone="555-0103",
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
            status=AppointmentStatus.unconfirmed,
            notes="Demo visit",
        ),
        Appointment(
            patient_id=patients[1].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="Wellness",
            appointment_datetime=now + timedelta(days=3, hours=1),
            appointment_end_datetime=now + timedelta(days=3, hours=1, minutes=30),
            status=AppointmentStatus.confirmed,
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
        Appointment(
            patient_id=patients[2].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="Dermatology",
            appointment_datetime=now + timedelta(days=7, hours=2),
            appointment_end_datetime=now + timedelta(days=7, hours=2, minutes=30),
            status=AppointmentStatus.unconfirmed,
            notes="Demo consult",
        ),
        Appointment(
            patient_id=patients[3].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="Cardiology",
            appointment_datetime=now + timedelta(days=10, hours=3),
            appointment_end_datetime=now + timedelta(days=10, hours=3, minutes=30),
            status=AppointmentStatus.confirmed,
            notes="Demo cardiology visit",
        ),
        Appointment(
            patient_id=patients[3].id,
            owner_user_id=owner.id,
            doctor_name="Demo Provider",
            department="General",
            appointment_datetime=now - timedelta(days=4, hours=2),
            appointment_end_datetime=now - timedelta(days=4, hours=1, minutes=30),
            status=AppointmentStatus.cancelled,
            notes="Demo cancelled visit",
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


@router.post("/load-sample")
def load_sample_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
    request: Request = None,
):
    if not settings.ENABLE_DEMO_RESET:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    has_patients = (
        db.query(Patient)
        .filter(Patient.owner_user_id == current_user.id)
        .count()
        > 0
    )
    has_appointments = (
        db.query(Appointment)
        .filter(Appointment.owner_user_id == current_user.id)
        .count()
        > 0
    )
    if has_patients or has_appointments:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Sample data already loaded.",
        )

    try:
        seeded = _seed_demo_data(db, current_user)
        db.commit()
    except Exception:
        db.rollback()
        raise

    log_event(
        db,
        current_user,
        action="demo.sample_data_loaded",
        entity_type="demo",
        summary="Demo sample data loaded",
        metadata={"seeded": seeded},
        request=request,
    )

    return {"ok": True, "seeded": seeded}
