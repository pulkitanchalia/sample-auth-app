# MCP Server Test Script
# This script tests the MCP server functionality by simulating MCP tool calls

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MCP Server Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if the backend server is running
Write-Host "Checking if FastAPI backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get -TimeoutSec 5
    Write-Host "✓ Backend is running: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running on http://localhost:8000" -ForegroundColor Red
    Write-Host "Please start the backend server first using start-backend.bat or start-backend.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Testing API endpoints directly..." -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "1. Testing health check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get
    Write-Host "   ✓ Health check passed" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Health check failed" -ForegroundColor Red
}

# Test 2: User Registration
Write-Host "2. Testing user registration..." -ForegroundColor Cyan
$testUser = @{
    username = "testuser_$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "testpass123"
}

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8000/signup" -Method Post -Body ($testUser | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   ✓ User registration successful: $($registerResponse.username)" -ForegroundColor Green
    $global:testUsername = $testUser.username
    $global:testPassword = $testUser.password
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   ⚠ User might already exist (this is normal for repeated tests)" -ForegroundColor Yellow
        # Use default test credentials
        $global:testUsername = "testuser"
        $global:testPassword = "testpass123"
    } else {
        Write-Host "   ✗ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Test 3: User Login
Write-Host "3. Testing user login..." -ForegroundColor Cyan
$loginData = @{
    username = $global:testUsername
    password = $global:testPassword
}

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/login" -Method Post -Body ($loginData | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    $global:token = $loginResponse.access_token
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Get Current User
Write-Host "4. Testing get current user..." -ForegroundColor Cyan
try {
    $headers = @{
        Authorization = "Bearer $($global:token)"
    }
    $userResponse = Invoke-RestMethod -Uri "http://localhost:8000/me" -Method Get -Headers $headers
    Write-Host "   ✓ Get user info successful: $($userResponse.username)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Get user info failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Logout
Write-Host "5. Testing logout..." -ForegroundColor Cyan
try {
    $headers = @{
        Authorization = "Bearer $($global:token)"
    }
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:8000/logout" -Method Post -Headers $headers
    Write-Host "   ✓ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Tests Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Install Node.js if not already installed" -ForegroundColor White
Write-Host "2. Run: start-mcp-server.bat (or .ps1)" -ForegroundColor White
Write-Host "3. The MCP server will expose these tools:" -ForegroundColor White
Write-Host "   - auth_health_check" -ForegroundColor Cyan
Write-Host "   - auth_signup" -ForegroundColor Cyan
Write-Host "   - auth_login" -ForegroundColor Cyan
Write-Host "   - auth_get_current_user" -ForegroundColor Cyan
Write-Host "   - auth_logout" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
