from types import SimpleNamespace

import pytest

from app.core.config import settings
from app.services import email as email_service


def test_send_email_dev_mode_does_not_call_resend(monkeypatch, capsys):
    called = {"count": 0}

    def fake_post(*args, **kwargs):
        called["count"] += 1
        raise AssertionError("Resend should not be called in dev mode")

    monkeypatch.setattr(email_service.requests, "post", fake_post)
    monkeypatch.setattr(settings, "EMAIL_ENABLED", False)
    monkeypatch.setattr(settings, "EMAIL_PROVIDER", "resend")

    email_service.send_email(
        "dev@example.com",
        "Dev mode",
        "<p>Preview body</p>",
        "Preview body",
    )

    output = capsys.readouterr().out
    assert "EMAIL_DEV_MODE" in output
    assert called["count"] == 0


def test_send_email_resend_missing_key_raises(monkeypatch, capsys):
    monkeypatch.setattr(settings, "EMAIL_ENABLED", True)
    monkeypatch.setattr(settings, "EMAIL_PROVIDER", "resend")
    monkeypatch.setattr(settings, "RESEND_API_KEY", None)
    monkeypatch.setattr(settings, "EMAIL_FROM", "onboarding@resend.dev")

    with pytest.raises(email_service.EmailSendError) as exc:
        email_service.send_email(
            "missing@example.com",
            "Missing key",
            "<p>Body</p>",
            "Body",
        )

    output = capsys.readouterr().out
    assert "EMAIL_ERROR provider=resend" in output
    assert "Resend API key is missing" in str(exc.value)


def test_send_email_resend_sends(monkeypatch, capsys):
    captured = {}

    def fake_post(url, headers=None, json=None, timeout=None):
        captured["url"] = url
        captured["headers"] = headers
        captured["json"] = json
        captured["timeout"] = timeout
        return SimpleNamespace(status_code=200, text="ok")

    monkeypatch.setattr(email_service.requests, "post", fake_post)
    monkeypatch.setattr(settings, "EMAIL_ENABLED", True)
    monkeypatch.setattr(settings, "EMAIL_PROVIDER", "resend")
    monkeypatch.setattr(settings, "RESEND_API_KEY", "test-key")
    monkeypatch.setattr(settings, "EMAIL_FROM", "onboarding@resend.dev")

    email_service.send_email(
        "send@example.com",
        "Subject line",
        "<p>Hello</p>",
        "Hello",
    )

    output = capsys.readouterr().out
    assert "EMAIL_SENT" in output
    assert captured["url"] == "https://api.resend.com/emails"
    assert captured["headers"]["Authorization"] == "Bearer test-key"
    assert captured["json"]["from"] == "onboarding@resend.dev"
    assert captured["json"]["to"] == ["send@example.com"]
    assert captured["json"]["subject"] == "Subject line"
    assert captured["json"]["html"] == "<p>Hello</p>"
