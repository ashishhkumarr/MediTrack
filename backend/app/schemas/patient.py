from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class PatientBase(BaseModel):
<<<<<<< HEAD
    full_name: str
    date_of_birth: date | None = None
    phone: str | None = None
    email: EmailStr | None = None
=======
    full_name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    sex: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
>>>>>>> v2
    medical_history: str | None = None
    medications: str | None = None
    notes: str | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
<<<<<<< HEAD
    full_name: str | None = None
    date_of_birth: date | None = None
    phone: str | None = None
    email: EmailStr | None = None
=======
    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    date_of_birth: date | None = None
    sex: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
>>>>>>> v2
    medical_history: str | None = None
    medications: str | None = None
    notes: str | None = None


<<<<<<< HEAD
class PatientResponse(PatientBase):
    id: int
=======
class PatientNotesUpdate(BaseModel):
    notes: str | None = None


class PatientResponse(PatientBase):
    id: int
    full_name: str
>>>>>>> v2
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
