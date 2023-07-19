from flask import Flask, send_file
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_cors import CORS


app = Flask(__name__, static_folder="../client/build", static_url_path="/")
app.config.from_object(Config)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.routes import boardRoutes, userRoutes, gameRoutes


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    socketio.run(app, debug=True)
