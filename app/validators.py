import re


def registration_validation(request):
    errors = {}
    keys = request.keys()
    email_regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"

    if "username" not in keys:
        errors["username"] = "Must Enter Username"
    elif len(request["username"]) < 2 or len(request["username"]) > 12:
        errors["username"] = "Username must be bewtween 2 and 12 characters"
    if "email" not in keys:
        errors["email"] = "Must Enter email"
    elif not re.fullmatch(email_regex, request["email"]):
        errors["email"] = "Not a Valid email"
    if "password" not in keys:
        errors["password"] = "Must Enter password"
    if "password2" not in keys:
        errors["password2"] = "Must Repeat password"
    elif request["password"] != request["password2"]:
        errors["password2"] = "passwords must match"
    return errors


def login_validation(request):
    errors = {}
    keys = request.keys()
    email_regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"

    if "email" not in keys:
        errors["email"] = "Must Enter email"
    elif not re.fullmatch(email_regex, request["email"]):
        errors["email"] = "Not a Valid email"
    if "password" not in keys:
        errors["password"] = "Must Enter password"
    return errors
