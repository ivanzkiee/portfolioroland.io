
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/health")
def health():
    return "OK", 200

@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def catch_all(path):
    # You can add your logic here to handle all routes
    return jsonify({
        "message": "Flask app is running!",
        "path": path,
        "method": request.method
    })

# Vercel handler
handler = app
