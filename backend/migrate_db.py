import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Migrate the existing database to add new columns"""
    db_path = "test.db"
    
    if not os.path.exists(db_path):
        print("No existing database found. New database will be created automatically.")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add created_at column if it doesn't exist
        if 'created_at' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
            print("Added created_at column")
        
        # Add last_login column if it doesn't exist
        if 'last_login' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL')
            print("Added last_login column")
        
        # Add Google SSO columns
        if 'google_id' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE NULL')
            print("Added google_id column")
        
        if 'profile_picture' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN profile_picture TEXT NULL')
            print("Added profile_picture column")
        
        if 'auth_provider' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT "local"')
            print("Added auth_provider column")
        
        # Make hashed_password nullable for Google users
        try:
            # Create a new table with the correct schema
            cursor.execute('''
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    hashed_password TEXT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP NULL,
                    google_id TEXT UNIQUE NULL,
                    profile_picture TEXT NULL,
                    auth_provider TEXT DEFAULT "local"
                )
            ''')
            
            # Copy data from old table
            cursor.execute('''
                INSERT INTO users_new (id, username, email, hashed_password, is_active, created_at, last_login, google_id, profile_picture, auth_provider)
                SELECT id, username, email, hashed_password, is_active, 
                       COALESCE(created_at, CURRENT_TIMESTAMP),
                       last_login,
                       COALESCE(google_id, NULL),
                       COALESCE(profile_picture, NULL),
                       COALESCE(auth_provider, "local")
                FROM users
            ''')
            
            # Drop old table and rename new one
            cursor.execute('DROP TABLE users')
            cursor.execute('ALTER TABLE users_new RENAME TO users')
            print("Updated table schema for Google SSO")
            
        except sqlite3.Error as e:
            print(f"Schema update not needed or failed: {e}")
        
        # Update existing users with current timestamp for created_at if null
        cursor.execute('UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL')
        cursor.execute('UPDATE users SET auth_provider = "local" WHERE auth_provider IS NULL')
        
        conn.commit()
        conn.close()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        print("Deleting old database to create fresh one...")
        if 'conn' in locals():
            conn.close()
        os.remove(db_path)
        print("Old database deleted. New database will be created on next startup.")

if __name__ == "__main__":
    migrate_database()
