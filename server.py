
from flask import Flask, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/get_location_weather", methods=["POST"])
def get_location_weather():
    data = request.get_json()
    address = data.get("address")
    if not address:
        return jsonify({"error": "No address provided"}), 400

    geo_url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
    geo_res = requests.get(geo_url).json()
    if not geo_res:
        return jsonify({})

    lat = geo_res[0]["lat"]
    lon = geo_res[0]["lon"]

    weather_url = (
        f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}"
        f"&appid={OPENWEATHER_API_KEY}&units=metric"
    )
    weather_res = requests.get(weather_url).json()
    return jsonify({
        "lat": lat,
        "lon": lon,
        "temp": weather_res["main"]["temp"],
        "humidity": weather_res["main"]["humidity"],
        "wind_speed": weather_res["wind"]["speed"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
