import logging
from datetime import datetime, timedelta
<<<<<<< HEAD
from smtplib import SMTP, SMTPException
=======
>>>>>>> v2

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.appointment import Appointment, AppointmentStatus
from app.models.patient import Patient
<<<<<<< HEAD
=======
from app.models.user import User, UserRole
from app.services.email import build_reminder_email, send_email
>>>>>>> v2

logger = logging.getLogger("reminders")


<<<<<<< HEAD
def send_email(recipient: str, subject: str, message: str) -> None:
    if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASSWORD]):
        logger.info("Email skipped for %s: SMTP not configured", recipient)
        return
    try:
        with SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            body = f"Subject: {subject}\n\n{message}"
            smtp.sendmail(settings.SMTP_USER, recipient, body)
    except SMTPException as exc:
        logger.error("Failed to send email to %s: %s", recipient, exc)
=======
def _resolve_end_time(start_time, end_time):
    if not start_time:
        return end_time
    return end_time or start_time + timedelta(
        minutes=settings.APPOINTMENT_DEFAULT_DURATION_MINUTES
    )


def _get_clinic_name(db: Session) -> str:
    clinic = (
        db.query(User)
        .filter(User.role == UserRole.admin, User.clinic_name.isnot(None))
        .first()
    )
    return clinic.clinic_name if clinic and clinic.clinic_name else settings.PROJECT_NAME


def dispatch_reminders(db: Session, now: datetime | None = None) -> dict:
    current_time = now or datetime.utcnow()
    window_start = current_time
    window_end = current_time + timedelta(hours=settings.REMINDER_WINDOW_HOURS)
    lookahead_end = current_time + timedelta(
        minutes=settings.REMINDER_LOOKAHEAD_MINUTES
    )
    if lookahead_end > window_end:
        window_end = lookahead_end

    appointments = (
        db.query(Appointment)
        .join(Patient)
        .filter(
            Appointment.status == AppointmentStatus.scheduled,
            Appointment.reminder_sent_at.is_(None),
            Appointment.appointment_datetime >= window_start,
            Appointment.appointment_datetime <= window_end,
            Patient.email.isnot(None),
            Patient.email != "",
        )
        .all()
    )

    processed = len(appointments)
    sent = 0
    skipped = 0

    for appointment in appointments:
        patient: Patient = appointment.patient
        recipient = patient.email.strip() if patient and patient.email else None
        if not recipient:
            skipped += 1
            continue
        print(
            f"EMAIL_TRIGGER event=reminder appointment_id={appointment.id} patient_email={recipient}"
        )
        clinic_name = _get_clinic_name(db)
        subject, html_body, text_body = build_reminder_email(
            patient.full_name,
            clinic_name,
            appointment.appointment_datetime,
            _resolve_end_time(
                appointment.appointment_datetime, appointment.appointment_end_datetime
            ),
            appointment.doctor_name,
            appointment.department,
            appointment.notes,
        )
        send_email(recipient, subject, html_body, text_body)
        appointment.reminder_sent_at = current_time
        db.add(appointment)
        sent += 1

    if sent:
        db.commit()

    skipped += processed - sent
    return {"processed": processed, "sent": sent, "skipped": skipped}
>>>>>>> v2


def process_reminders():
    try:
        db: Session = SessionLocal()
    except Exception as exc:  # pragma: no cover - scheduler resilience
        logger.warning("Reminder service unavailable: %s", exc)
        return
    try:
<<<<<<< HEAD
        window_start = datetime.utcnow()
        window_end = window_start + timedelta(hours=settings.REMINDER_HOURS_BEFORE)
        appointments = (
            db.query(Appointment)
            .filter(
                Appointment.status == AppointmentStatus.scheduled,
                Appointment.appointment_datetime.between(window_start, window_end),
            )
            .all()
        )
        for appointment in appointments:
            patient: Patient = appointment.patient
            if patient and patient.email:
                send_email(
                    patient.email,
                    "Appointment Reminder",
                    f"Dear {patient.full_name},\n\n"
                    f"This is a reminder for your appointment with "
                    f"{appointment.doctor_name} on "
                    f"{appointment.appointment_datetime:%Y-%m-%d %H:%M}.",
                )
            else:
                logger.info(
                    "Skipping reminder for appointment %s due to missing patient email",
                    appointment.id,
                )
=======
        dispatch_reminders(db)
>>>>>>> v2
    finally:
        db.close()


scheduler = BackgroundScheduler()
scheduler.add_job(process_reminders, "interval", hours=1, id="reminder_job")
