import sys
import json
import random
import pandas as pd
import joblib
import os
try:
    import xgboost as xgb
except ImportError:
    pass # Handle gracefully if possible, or fail later

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

# Load model globally to avoid reloading on every request if wrapper persists (though here it's CLI based)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model (1).pkl')
loaded_model = None
try:
    loaded_model = joblib.load(MODEL_PATH)
except Exception as e:
    # print(f"Error loading model: {e}", file=sys.stderr)
    pass

def calculate_mobility(data):
    """
    Calculate CO2, cost, and time for a given route and mode.
    Input: { "start": "Delhi", "end": "Mumbai", "mode": "car" }
    """
    start_loc = data.get('start', '').strip()
    end_loc = data.get('end', '').strip()
    mode = data.get('mode', 'car')
    
    distance = 10.0 # Default fallback
    
    if start_loc and end_loc:
        try:
            geolocator = Nominatim(user_agent="ai_sus_hac_predictor")
            loc1 = geolocator.geocode(start_loc, timeout=10)
            loc2 = geolocator.geocode(end_loc, timeout=10)
            
            if loc1 and loc2:
                coords_1 = (loc1.latitude, loc1.longitude)
                coords_2 = (loc2.latitude, loc2.longitude)
                distance = geodesic(coords_1, coords_2).km
                # Add 20% for road curvatute vs straight line
                distance = distance * 1.2
            else:
                # Fallback to hash if geocoding fails
                seed_str = sorted([start_loc.lower(), end_loc.lower()])
                seed_val = sum(ord(c) for c in "".join(seed_str))
                random.seed(seed_val)
                distance = random.uniform(5.0, 50.0)
        except Exception as e:
            # Fallback on error
            seed_str = sorted([start_loc.lower(), end_loc.lower()])
            seed_val = sum(ord(c) for c in "".join(seed_str))
            random.seed(seed_val)
            distance = random.uniform(5.0, 50.0)
    else:
        # Fallback or manual distance
        distance = float(data.get('distance', 10))

    # Factors per km
    factors = {
        'car': {'co2': 0.192, 'cost': 0.50, 'speed': 30}, # Lower speed for city traffic
        'ev': {'co2': 0.053, 'cost': 0.10, 'speed': 30},
        'bus': {'co2': 0.105, 'cost': 0.15, 'speed': 25},
        'metro': {'co2': 0.030, 'cost': 0.08, 'speed': 45}, # Faster than traffic
        'shared': {'co2': 0.090, 'cost': 0.25, 'speed': 30}
    }
    
    factor = factors.get(mode, factors['car'])
    
    co2 = round(distance * factor['co2'], 2)
    # Convert cost to INR (91 INR = 1 USD approx conversion for this context)
    cost = round(distance * factor['cost'] * 91, 2)
    time_min = round((distance / factor['speed']) * 60)
    
    # Format time
    if time_min >= 60:
        hrs = time_min // 60
        mins = time_min % 60
        if mins > 0:
            time_str = f"{hrs} hr {mins} min"
        else:
            time_str = f"{hrs} hr"
    else:
        time_str = f"{time_min} min"
    
    # Calculate savings vs car
    car_factor = factors['car']
    car_co2 = distance * car_factor['co2']
    saved_co2 = round(car_co2 - co2, 2)
    
    response = {
        "distance": f"{distance:.1f} km",
        "co2": f"{co2} kg",
        "cost": f"₹{cost:.2f}",
        "time": time_str,
        "saved_vs_car": f"{saved_co2} kg" if saved_co2 > 0 else "0 kg"
    }

    # Add coordinates if they were calculated
    if 'coords_1' in locals() and 'coords_2' in locals() and coords_1 and coords_2:
        response['start_coords'] = coords_1
        response['end_coords'] = coords_2
        
    return response

def simulate_energy(data):
    """
    Simulate hourly energy usage based on building parameters.
    Input: { "building_type": "office", "hours": 10, "lighting": 80 }
    """
    b_type = data.get('building_type', 'office')
    hours = int(data.get('hours', 10))
    lighting = int(data.get('lighting', 80)) / 100
    
    base_loads = {'office': 500, 'campus': 1200, 'home': 150}
    base = base_loads.get(b_type, 500)
    
    usage_profile = []
    total_usage = 0
    
    for i in range(24):
        # Determine activity level based on operating hours (centered around noon)
        start_hour = 12 - (hours // 2)
        end_hour = 12 + (hours // 2)
        
        is_active = start_hour <= i < end_hour
        
        load = base * 0.2 # Base idle load
        if is_active:
            load = base * lighting # Active load with lighting factor
            # Add random variation
            load += random.uniform(-0.05, 0.05) * base
            
        usage_profile.append({
            "time": f"{i:02d}:00",
            "usage": round(load),
            "solar": round(load * 0.4) if 7 <= i <= 17 else 0
        })
        total_usage += load

    peak_warning = any(p['usage'] > base * 0.9 for p in usage_profile)
    
    return {
        "hourly_usage": usage_profile,
        "total_daily_kwh": round(total_usage),
        "peak_warning": peak_warning,
        "solar_potential": round(total_usage * 0.3) # simplified 30% potential
    }

def calculate_carbon(data):
    """
    Calculate annual carbon footprint based on lifestyle choices.
    """
    transport = data.get('transport', 'car')
    energy = data.get('energy', 'grid')
    diet = data.get('diet', 'average')
    
    # Base values (kg CO2/year) separated to satisfy linter type inference
    transport_bases = {'car': 3500, 'ev': 1500, 'metro': 800}
    energy_bases = {'grid': 3000, 'hybrid': 1800, 'solar': 500}
    diet_bases = {'average': 2500, 'vegetarian': 1500, 'vegan': 1000}
    other_base = 1500
    
    t_val = transport_bases.get(transport, 3500)
    e_val = energy_bases.get(energy, 3000)
    d_val = diet_bases.get(diet, 2500)
    o_val = other_base
    
    total = t_val + e_val + d_val + o_val
    max_val = 10500 # Approx max
    
    score = max(0, min(100, round(100 - (total / max_val * 60))))
    
    breakdown = [
        {"name": "Transport", "value": t_val, "color": "#3b82f6"},
        {"name": "Energy", "value": e_val, "color": "#f59e0b"},
        {"name": "Diet", "value": d_val, "color": "#10b981"},
        {"name": "Other", "value": o_val, "color": "#64748b"}
    ]
    
    return {
        "total_footprint": total,
        "score": score,
        "breakdown": breakdown
    }

def optimize_energy(data):
    # Keep existing logic for backward compatibility/Dashboard
    consumption = data.get('consumption', 600)
    hour = data.get('hour', 14)
    suggestions = []
    
    if 9 <= hour <= 18 and consumption > 500:
        suggestions.append({
            "type": "warning",
            "message": "High peak usage detected. Consider reducing HVAC load."
        })
    if hour > 18 and consumption > 300:
        suggestions.append({
            "type": "success",
            "message": "Good time to run high-energy appliances (off-peak)."
        })
        
    return suggestions

def predict_energy_consumption(data):
    """
    Predict energy consumption using the pre-trained XGBoost model.
    """
    if loaded_model is None:
        return {"error": "Model not loaded properly."}

    try:
        # Extract features
        # Expected: Temperature, Humidity, SquareFootage, Occupancy, RenewableEnergy, 
        #           hour, day, month, dayofweek, HVACUsage(code), LightingUsage(code), DayOfWeek(code), Holiday(code)
        
        timestamp_str = data.get('timestamp', '2022-01-01 12:00:00')
        dt = pd.to_datetime(timestamp_str)
        
        temp = float(data.get('Temperature', 25.0))
        humidity = float(data.get('Humidity', 50.0))
        sq_footage = float(data.get('SquareFootage', 1500.0))
        occupancy = int(data.get('Occupancy', 5))
        renewable = float(data.get('RenewableEnergy', 0.0))
        
        hvac_status = data.get('HVACUsage', 'Off') # On/Off
        lighting_status = data.get('LightingUsage', 'Off') # On/Off
        holiday_status = data.get('Holiday', 'No') # Yes/No
        
        # Derived time features
        hour = dt.hour
        day = dt.day
        month = dt.month
        dayofweek_num = dt.dayofweek # 0=Monday, 6=Sunday
        day_name = dt.day_name() # Monday, Tuesday...

        # Categorical Encoding (Manual mapping based on alphabetical sort)
        # HVAC: Off=0, On=1
        hvac_code = 1 if hvac_status == 'On' else 0
        
        # Lighting: Off=0, On=1
        lighting_code = 1 if lighting_status == 'On' else 0
        
        # Holiday: No=0, Yes=1
        holiday_code = 1 if holiday_status == 'Yes' else 0
        
        # DayOfWeek: Friday=0, Monday=1, Saturday=2, Sunday=3, Thursday=4, Tuesday=5, Wednesday=6
        day_map = {
            'Friday': 0, 'Monday': 1, 'Saturday': 2, 'Sunday': 3, 
            'Thursday': 4, 'Tuesday': 5, 'Wednesday': 6
        }
        day_code = day_map.get(day_name, 0)

        # Create DataFrame for prediction (order matters if model used arrays, but pandas usually handles by name if XGBoost supports it)
        # Based on training code snippet:
        # X had: Temperature, Humidity, SquareFootage, Occupancy, HVACUsage, LightingUsage, RenewableEnergy, DayOfWeek, Holiday, hour, day, month, dayofweek
        # Although the original dropped Timestamp and added derived.
        # Let's match the probable column order from typical pandas usage or dictionary
        
        features = pd.DataFrame([{
            'Temperature': temp,
            'Humidity': humidity,
            'SquareFootage': sq_footage,
            'Occupancy': occupancy,
            'HVACUsage': hvac_code,
            'LightingUsage': lighting_code,
            'RenewableEnergy': renewable,
            'DayOfWeek': day_code,
            'Holiday': holiday_code,
            'hour': hour,
            'day': day,
            'month': month,
            'dayofweek': dayofweek_num
        }])
        
        # Ensure column order matches training if possible. 
        # Provided snippet: categorical_cols encoded in place.
        # Columns likely: Temperature, Humidity, SquareFootage, Occupancy, HVACUsage, LightingUsage, RenewableEnergy, DayOfWeek, Holiday, hour, day, month, dayofweek
        
        prediction = loaded_model.predict(features)[0]
        
        return {
            "predicted_consumption": round(float(prediction), 2),
            "units": "kWh",
            "inputs": data
        }

    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}

if __name__ == "__main__":
    try:
        input_str = sys.stdin.read()
        if not input_str:
            # Test default
            request = {"type": "carbon", "transport": "ev", "energy": "solar"}
        else:
            request = json.loads(input_str)
            
        req_type = request.get('type', 'energy_optimize')
        
        result = {}
        if req_type == 'mobility':
            result = calculate_mobility(request)
        elif req_type == 'energy_simulate':
            result = simulate_energy(request)
        elif req_type == 'carbon_simulate':
            result = calculate_carbon(request)
        elif req_type == 'energy_predict':
            result = predict_energy_consumption(request)
        else:
            result = {"suggestions": optimize_energy(request)}
            
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
