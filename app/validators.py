import re
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User

email_regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"


def registration_validation(request):
    errors = {}

    if len(request["username"]) < 2 or len(request["username"]) > 12:
        errors["username"] = "Username must be between 2 and 12 characters"
    if len(request["username"]) == 0:
        errors["username"] = "Must Enter username"

    if not re.fullmatch(email_regex, request["email"]):
        errors["email"] = "Not a Valid email"
    if len(request["email"]) == 0:
        errors["email"] = "Must enter email"

    if len(request["password"]) == 0:
        errors["password"] = "Must enter password"

    if len(request["password2"]) == 0:
        errors["password2"] = "Must repeat password"
    elif request["password"] != request["password2"]:
        errors["password2"] = "passwords must match"
    return errors


def login_validation(request):
    errors = {}
    keys = request.keys()

    if not re.fullmatch(email_regex, request["email"]):
        errors["email"] = "Not a Valid email"
    if len(request["email"]) == 0:
        errors["email"] = "Must enter email"

    if len(request["password"]) == 0:
        errors["password"] = "Must enter password"

    return errors
