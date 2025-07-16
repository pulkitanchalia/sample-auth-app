#!/usr/bin/env python3
"""
Simple test script to verify the Auth API is working correctly.
Run this after starting the backend server.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing Auth API...\n")
    
    # Test 1: Health check
    print("1️⃣ Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        print("   ✅ Health check passed!\n")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}\n")
        return
    
    # Test 2: Register user
    print("2️⃣ Testing user registration...")
    user_data = {
        "username": "testuser123",
        "email": "test123@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signup", json=user_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            user_info = response.json()
            print(f"   Created user: {user_info['username']} (ID: {user_info['id']})")
            print("   ✅ Registration passed!\n")
        else:
            print(f"   Response: {response.text}")
            if "already registered" in response.text:
                print("   ⚠️ User already exists (this is OK for testing)\n")
            else:
                print("   ❌ Registration failed!\n")
    except Exception as e:
        print(f"   ❌ Registration failed: {e}\n")
    
    # Test 3: Login
    print("3️⃣ Testing user login...")
    login_data = {
        "username": "testuser123",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            print(f"   Token received: {token[:20]}...")
            print("   ✅ Login passed!\n")
            
            # Test 4: Get current user
            print("4️⃣ Testing protected endpoint...")
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/me", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                user_info = response.json()
                print(f"   Current user: {user_info['username']} ({user_info['email']})")
                print("   ✅ Protected endpoint passed!\n")
            else:
                print(f"   ❌ Protected endpoint failed: {response.text}\n")
            
            # Test 5: Logout
            print("5️⃣ Testing logout...")
            response = requests.post(f"{BASE_URL}/logout", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ Logout passed!\n")
            else:
                print(f"   ❌ Logout failed: {response.text}\n")
                
        else:
            print(f"   ❌ Login failed: {response.text}\n")
    except Exception as e:
        print(f"   ❌ Login failed: {e}\n")
    
    print("🎉 API testing completed!")

if __name__ == "__main__":
    test_api()
