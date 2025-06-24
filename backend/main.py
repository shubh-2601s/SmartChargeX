from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import pandas as pd
import os
from random import randint
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",https://smart-charge-x.vercel.app/],  # update with your frontend origin
    
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory reservation storage: keys are tuples (station_id, time string)
reservations = {}

class ReservationRequest(BaseModel):
    time: str

    @validator("time")
    def validate_time_format(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise ValueError("Time must be in format YYYY-MM-DD HH:MM:SS")
        return v

@app.get("/api/forecast/station/{station_id}")
async def get_forecast(station_id: int):
    """
    Returns forecast data, peak and green hours, sustainability info, and correlation analysis for a given station.
    """
    file_path = f"forecasts/forecast_station_{station_id}.csv"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Forecast data not found")

    df = pd.read_csv(file_path)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df.sort_values("timestamp", inplace=True)

    peak_times = df.sort_values("demand_kWh", ascending=False).head(3)["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S").tolist()
    green_times = df.sort_values("demand_kWh", ascending=True).head(3)["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S").tolist()

    forecast_list = df[["timestamp", "demand_kWh", "temperature_C", "humidity_percent", "traffic_index"]].copy()
    forecast_list.rename(columns={"demand_kWh": "predicted_kwh"}, inplace=True)
    forecast_list["timestamp"] = forecast_list["timestamp"].astype(str)
    forecast_list_dict = forecast_list.to_dict(orient="records")

    green_session_kwh = 15
    peak_emission_factor = 0.7
    green_emission_factor = 0.2

    peak_emission = peak_emission_factor * green_session_kwh
    green_emission = green_emission_factor * green_session_kwh
    co2_saved = peak_emission - green_emission

    badge = "🌱 Eco Saver" if co2_saved >= 5 else "⚡ Green Charger"

    corr_temp_demand = df["temperature_C"].corr(df["demand_kWh"])
    corr_traffic_demand = df["traffic_index"].corr(df["demand_kWh"])

    analysis = {
        "correlation_temperature_demand": round(corr_temp_demand, 2),
        "correlation_traffic_demand": round(corr_traffic_demand, 2),
        "interpretation": "Demand tends to increase with higher traffic and moderately with temperature."
    }

    return {
        "station_id": station_id,
        "forecast": forecast_list_dict,
        "insights": {
            "peak_hours": peak_times,
            "green_hours": green_times,
            "analysis": analysis
        },
        "sustainability": {
            "session_kwh": green_session_kwh,
            "co2_saved_per_session": round(co2_saved, 2),
            "badge": badge,
            "sustainability_score": round((1 - (co2_saved / peak_emission)) * 100, 2),
            "sustainability_explanation": (
                "Lower score indicates better environmental impact. "
                f"This station saves approx. {co2_saved:.2f} kg CO₂ per session compared to peak hours."
            )
        }
    }

@app.get("/api/forecast/station/{station_id}/congestion")
async def get_congestion(station_id: int):
    """
    Provides congestion level and estimated wait times at station based on average demand.
    """
    file_path = f"forecasts/forecast_station_{station_id}.csv"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Forecast data not found")

    df = pd.read_csv(file_path)
    avg_demand = df["demand_kWh"].mean()

    if avg_demand > 50:
        level = "High"
        wait = randint(30, 60)
    elif avg_demand > 20:
        level = "Medium"
        wait = randint(10, 30)
    else:
        level = "Low"
        wait = randint(0, 10)

    return {
        "station_id": station_id,
        "congestion_level": level,
        "estimated_wait_minutes": wait
    }

@app.post("/api/forecast/station/{station_id}/reserve")
async def reserve_slot(station_id: int, reservation: ReservationRequest):
    """
    Reserve a charging slot at a station for a given timestamp.
    Reject if slot already booked or time not valid.
    Returns CO2 saved estimate if reserved at a green hour.
    """
    time = reservation.time
    key = (station_id, time)
    if key in reservations:
        raise HTTPException(status_code=400, detail="Slot already booked")

    file_path = f"forecasts/forecast_station_{station_id}.csv"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Forecast data not found")

    df = pd.read_csv(file_path)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    try:
        reserved_time = pd.to_datetime(time)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid time format")

    match_row = df[df["timestamp"] == reserved_time]
    if match_row.empty:
        raise HTTPException(status_code=404, detail="Requested time not found in forecast data")

    demand = match_row.iloc[0]["demand_kWh"]

    green_session_kwh = 15
    peak_emission_factor = 0.7
    green_emission_factor = 0.2

    # Determine if reserved slot is during a green hour (lower quartile demand)
    is_green = demand < df["demand_kWh"].quantile(0.25)

    co2_saved = (peak_emission_factor - green_emission_factor) * green_session_kwh if is_green else 0

    reservations[key] = True

    return {
        "message": "Slot reserved successfully",
        "station_id": station_id,
        "time": time,
        "co2_saved_this_session": round(co2_saved, 2)
    }
