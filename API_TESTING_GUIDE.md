# Backend API Testing Guide

## Test Scripts for Windows PowerShell/Command Prompt

### 1. Test if API is running
curl http://localhost:8000

### 2. Register a new user
curl -X POST "http://localhost:8000/signup" -H "Content-Type: application/json" -d "{\"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"password123\"}"

### 3. Login and get JWT token
curl -X POST "http://localhost:8000/login" -H "Content-Type: application/json" -d "{\"username\": \"testuser\", \"password\": \"password123\"}"

### 4. Get user info (replace YOUR_TOKEN with the actual token from login)
curl -X GET "http://localhost:8000/me" -H "Authorization: Bearer YOUR_TOKEN"

### 5. Test logout
curl -X POST "http://localhost:8000/logout" -H "Authorization: Bearer YOUR_TOKEN"

## PowerShell Examples (with proper escaping)

### Register user (PowerShell)
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/signup" -Method POST -Body $body -ContentType "application/json"

### Login (PowerShell)
$loginBody = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "Token: $token"

### Get user info (PowerShell)
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:8000/me" -Method GET -Headers $headers
