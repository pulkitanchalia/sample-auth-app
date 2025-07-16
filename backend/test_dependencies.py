#!/usr/bin/env python3
"""
Test script to verify backend dependencies are working
"""
import sys
import os

print("🔍 Testing backend dependencies...\n")

# Test 1: Environment variables
print("1️⃣ Testing environment variables...")
try:
    from dotenv import load_dotenv
    load_dotenv()
    secret_key = os.getenv("SECRET_KEY")
    if secret_key:
        print(f"   ✅ SECRET_KEY loaded: {secret_key[:10]}...")
    else:
        print("   ❌ SECRET_KEY not found")
except Exception as e:
    print(f"   ❌ Error loading environment: {e}")

# Test 2: Password hashing
print("\n2️⃣ Testing password hashing...")
try:
    from auth import get_password_hash, verify_password
    test_password = "test123"
    hashed = get_password_hash(test_password)
    print(f"   ✅ Password hashed successfully: {hashed[:20]}...")
    
    # Test verification
    is_valid = verify_password(test_password, hashed)
    if is_valid:
        print("   ✅ Password verification works!")
    else:
        print("   ❌ Password verification failed")
except Exception as e:
    print(f"   ❌ Password hashing error: {e}")

# Test 3: JWT token creation
print("\n3️⃣ Testing JWT token creation...")
try:
    from auth import create_access_token
    from datetime import timedelta
    
    token = create_access_token(
        data={"sub": "testuser"}, 
        expires_delta=timedelta(minutes=30)
    )
    print(f"   ✅ JWT token created: {token[:20]}...")
except Exception as e:
    print(f"   ❌ JWT token error: {e}")

# Test 4: Database connection
print("\n4️⃣ Testing database...")
try:
    from database import create_tables, get_db
    create_tables()
    print("   ✅ Database tables created successfully!")
except Exception as e:
    print(f"   ❌ Database error: {e}")

# Test 5: FastAPI imports
print("\n5️⃣ Testing FastAPI imports...")
try:
    from fastapi import FastAPI
    import uvicorn
    print("   ✅ FastAPI imports successful!")
except Exception as e:
    print(f"   ❌ FastAPI import error: {e}")

print("\n🎉 Dependency testing completed!")
print("\nIf all tests passed, you can start the server with:")
print("   python main.py")
print("\nOr use uvicorn directly:")
print("   uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
