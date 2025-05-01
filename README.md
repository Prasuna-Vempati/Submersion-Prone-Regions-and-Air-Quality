# Submersion-Prone-Regions-and-Air-Quality
This repository contains two powerful GEE scripts for visualizing and analyzing:
- Air Quality (Gas concentration monitoring)
- Sea Level Rise Simulation

📁 Code 1: Air Quality Monitoring (Time Series & Visualization)
📌 Description
- This script processes satellite-based gas concentration data (from Sentinel-5P) over three regions of interest (ROIs) and generates:
  --Time-series charts for NO₂, CO, CH₄, HCHO, SO₂, and O₃.
  --Mean gas concentration layers for each ROI and gas type.

🛰️ Satellite Source
- Dataset: COPERNICUS/S5P/OFFL/L3_*
- Time Range: 2024-08-23 to 2024-10-23

📊 Features
- Average image layer for each gas over each ROI
- Interactive time-series charts (mean values over time)
- Visualizations use gas-specific color palettes

🧪 Gases Included
Gas	Dataset ID	Band Name
NO₂	COPERNICUS/S5P/OFFL/L3_NO2	NO2_column_number_density
CO	COPERNICUS/S5P/OFFL/L3_CO	CO_column_number_density
HCHO	COPERNICUS/S5P/OFFL/L3_HCHO	tropospheric_HCHO_column_number_density
O₃	COPERNICUS/S5P/OFFL/L3_O3	O3_column_number_density
SO₂	COPERNICUS/S5P/OFFL/L3_SO2	SO2_column_number_density
CH₄	COPERNICUS/S5P/OFFL/L3_CH4	CH4_column_volume_mixing_ratio_dry_air

📍 Requirements
Define roi1, roi2, and roi3 before running.

📁 Code 2: Sea Level Rise Visualization Tool
📌 Description
- This script simulates sea level rise effects based on elevation data and displays flooded areas interactively on a map UI.

🛰️ Dataset Used
Elevation Data: NASA/NASADEM_HGT/001

🎛️ Features
Dynamic UI with sliders for:
- Sea level rise (mm/year)
- Simulation year (2020–2100)
- Interactive map visualization
- Hillshade + Elevation
- Flooded (drowned) zones
- Elevation legend and flood zone indicator

🔧 Functions
- seaRise(mm, year): Highlights areas below simulated sea level
- legendPanel(): Generates elevation color legend
