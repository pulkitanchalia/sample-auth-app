#!/usr/bin/env python3
"""
Simple startup script for the FastAPI backend with error handling
"""
import os
import sys

def main():
    print("🚀 Starting FastAPI Authentication Backend...\n")
    
    # Check if we're in the right directory
    if not os.path.exists("main.py"):
        print("❌ Error: main.py not found. Please run this from the backend directory.")
        return
    
    # Check if virtual environment is activated by checking for required packages
    try:
        import fastapi
        import uvicorn
        print("✅ FastAPI packages found")
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("Please install dependencies:")
        print("   pip install -r requirements.txt")
        return
    
    # Test password hashing
    try:
        from auth import get_password_hash
        test_hash = get_password_hash("test")
        print("✅ Password hashing working")
    except Exception as e:
        print(f"❌ Password hashing error: {e}")
        print("Bcrypt may not be installed. Try: pip install bcrypt")
        return
    
    # Create database tables
    try:
        from database import create_tables
        create_tables()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database error: {e}")
        return
    
    print("\n🎉 All checks passed! Starting server...\n")
    print("🌐 Server will be available at:")
    print("   - API: http://localhost:8000")
    print("   - Docs: http://localhost:8000/docs")
    print("   - ReDoc: http://localhost:8000/redoc")
    print("\n⏹️ Press Ctrl+C to stop the server\n")
    
    # Start the server
    try:
        import uvicorn
        from main import app
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"\n❌ Server error: {e}")

if __name__ == "__main__":
    main()
