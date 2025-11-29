@echo off
echo Starting AI Symptom Checker Backend...
cd backend
call venv\Scripts\activate.bat
python app.py
pause