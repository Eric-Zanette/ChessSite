from flask import Flask, request, session
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.routes import boardRoutes, userRoutes, gameRoutes


if __name__ == "__main__":
    socketio.run(app, debug=True)
