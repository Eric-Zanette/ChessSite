from app import db
from flask import request
from werkzeug.urls import url_parse
from app import app


@app.route("/register", methods=["GET", "POST"])
def register():
    return {"name": "lololol"}
