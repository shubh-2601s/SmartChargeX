
# SmartCharge AI - EV Charging Demand Forecasting & Smart Station Guidance Dashboard

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Problem Statement](#problem-statement)  
- [Proposed Solution](#proposed-solution)  
- [Key Features](#key-features)  
- [How the Website Works](#how-the-website-works)  
- [Innovation and Novelty](#innovation-and-novelty)  
- [Technology Stack](#technology-stack)  
- [Installation & Setup](#installation--setup)  
- [Future Work & Enhancements](#future-work--enhancements)  
- [License](#license)  

---

## Project Overview

The rapid adoption of Electric Vehicles (EVs) is revolutionizing the transportation sector worldwide, including India. However, the sudden increase in EV charging demand puts tremendous pressure on the existing power grid and charging infrastructure. To address these challenges, **SmartCharge AI** offers a cutting-edge, data-driven platform that forecasts EV charging demand at a granular station level, providing actionable insights to users, grid operators, and infrastructure managers.

This intelligent dashboard leverages **over 40 unique datasets** collected from strategically located EV charging stations across India — spanning diverse climatic zones, urban densities, and traffic conditions. These datasets combine historical usage, weather, and traffic metrics, empowering SmartCharge AI to deliver precise, location-specific forecasts and recommendations.

---

## Problem Statement

The growth in EV ownership is creating unprecedented demand spikes at public charging stations, leading to:

- **Grid overload risks:** Peak hour surges increase load on the electricity grid, risking outages and increased operational costs.
- **Charging station congestion:** Long wait times and inefficient station utilization frustrate users and limit EV adoption.
- **Environmental impact:** Charging during peak demand often relies on fossil-fuel-based power plants, resulting in increased CO₂ emissions.
- **Lack of predictive guidance:** Users and operators lack real-time, forward-looking information to make optimal decisions.

Without predictive tools, balancing demand and supply efficiently remains a challenge, resulting in lost time, increased costs, and environmental strain.

---

## Proposed Solution

SmartCharge AI addresses these challenges through a comprehensive, AI-powered platform offering:

- Accurate, station-level EV charging demand forecasts  
- Peak and low-demand (“green”) hour identification  
- Real-time congestion estimation and wait time prediction  
- Slot reservation system for user convenience  
- Sustainability metrics highlighting environmental impact  
- Interactive, user-friendly dashboard with rich visualizations  

---

## Key Features

### 1. **Comprehensive Load Forecasting Using 40+ Station Datasets**  
SmartCharge AI currently utilizes **forecast datasets from over 40 stations** located across India, including cities like Chennai, Mumbai, Delhi, Bangalore, Kolkata, and more. Each dataset integrates station-specific historical charging demand, meteorological data (temperature, humidity), and traffic indices, enabling highly accurate hourly demand predictions tailored to local conditions.

### 2. **Peak and Green Hour Identification**  
The system automatically detects the top three **peak demand hours** where charging load is highest, as well as the three **green hours** with the lowest demand. This helps:

- Grid operators to manage load and avoid overload.  
- Users to schedule charging during off-peak times for cost and environmental benefits.

### 3. **Dynamic Congestion Prediction and Wait Time Estimates**  
Based on the forecasted demand, SmartCharge AI predicts the likely congestion level at each station (Low, Medium, High) and estimates waiting times in minutes. This feature allows users to choose less crowded stations or time slots, enhancing user satisfaction and station throughput.

### 4. **Slot Reservation System**  
Users can reserve charging slots for specific times at selected stations directly via the dashboard. The backend prevents double bookings, ensuring fair and organized station usage, while reducing on-site queueing and uncertainty.

### 5. **Sustainability Score & Carbon Emission Savings**  
SmartCharge AI quantifies the **carbon dioxide (CO₂) emissions saved** by shifting charging sessions from peak to green hours. It calculates emissions based on typical session energy consumption and grid emission factors during different periods. Users earn badges like “🌱 Eco Saver” to encourage greener charging behaviors.

### 6. **Interactive, Data-Rich Dashboard**  
- **KPIs & Metrics:** Real-time display of total predicted demand, congestion levels, and sustainability scores.  
- **Charts & Visualizations:** Hourly demand curves, peak and green hour highlights, and comparative analytics.  
- **Export Options:** Ability to export forecast data and reports for offline analysis or operational planning.  
- **Responsive Design:** Accessible on all devices with intuitive navigation.

---

## How the Website Works

- **Station Selection:** Users select an EV charging station from a dropdown list of 40+ locations.  
- **Forecast & Insights Retrieval:** The frontend fetches detailed forecast data and sustainability insights from the backend API.  
- **Visualization:** Demand forecasts, peak/green hour indicators, congestion predictions, and sustainability metrics are presented via visually engaging charts and cards.  
- **Reservation Interface:** Users can pick a date and time to reserve a charging slot, receiving immediate confirmation or conflict warnings.  
- **Real-Time Updates:** Forecasts and congestion info update frequently to reflect changing conditions and improve decision-making.

---

## Innovation and Novelty

SmartCharge AI delivers innovation by:

- Integrating **multivariate data fusion** (weather, traffic, historical load) for superior prediction accuracy.  
- Embedding **environmental impact analysis** directly into operational tools, motivating sustainable charging habits.  
- Providing a **full-stack smart solution** combining forecasting, congestion management, and user reservations.  
- Supporting a **wide geographic footprint** with 40+ datasets, enhancing scalability and applicability across India’s diverse regions.  
- Building with **modern technologies** (FastAPI backend, React frontend) for performance, maintainability, and extensibility.

---

## Technology Stack

- **Frontend:** React.js, CSS3, Responsive Web Design  
- **Backend:** FastAPI (Python) with Pandas and Uvicorn  
- **Data:** CSV-based datasets for forecasting, extendable to databases  
- **Visualization:** Chart.js or equivalent libraries  
- **Version Control:** Git & GitHub  
- **Deployment:** Vercel, Render

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/shubh-2601s/SmartChargeX.git
   cd SmartChargeX
```
2. **Setup Backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the App**

   Open `http://localhost:3000` in your browser.

---

## Future Work & Enhancements

* Implement user authentication and personalized dashboards.
* Integrate live IoT data streams from actual charging stations.
* Develop mobile applications for Android and iOS.
* Incorporate renewable energy forecasting into sustainability metrics.
* Add multi-language support for broader accessibility.
* Enable push notifications for slot reminders and alerts.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for exploring **SmartCharge AI** — innovating smarter and greener EV charging infrastructure for a sustainable future!


---


