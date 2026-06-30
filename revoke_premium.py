import os
import sys

# Add backend to path for local execution
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import User

def main():
    print("--- Lumina AI Premium/Admin Revocation Utility ---")
    
    # Prompt for connection string (default to local sqlite)
    db_url = input("\nPaste your database URI connection string (leave empty for local SQLite):\n").strip()
    if not db_url:
        db_url = "sqlite:///backend/lumina.db"
        print(f"Using default local database: {db_url}")

    # Fix postgres prefix if needed
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    try:
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        # Get all users with admin/premium privileges
        privileged_users = db.query(User).filter(User.is_admin == True).all()
        
        if not privileged_users:
            print("\nNo accounts currently have premium or administrative access (is_admin=False for all).")
            db.close()
            return
            
        print("\nAccounts with active Premium/Admin access:")
        for idx, u in enumerate(privileged_users, 1):
            print(f"{idx}. Username: '{u.username}' | Email: '{u.email}'")

        admin_username = input("\nEnter the username of the Admin you want to KEEP (all other accounts will be revoked):\n").strip()
        
        # Verify the admin user exists and is in the privileged list
        admin_user = db.query(User).filter(User.username == admin_username).first()
        if not admin_user:
            print(f"\nError: User '{admin_username}' not found in the database. Revocation cancelled.")
            db.close()
            return
            
        # Revoke access from all other users
        revoked_count = 0
        for u in privileged_users:
            if u.username != admin_username:
                u.is_admin = False
                revoked_count += 1
                
        # Ensure the specified admin is indeed admin
        admin_user.is_admin = True
        
        db.commit()
        print(f"\nSUCCESS: Revoked Premium/Admin access from {revoked_count} user(s).")
        print(f"Account '{admin_username}' remains as the sole Admin/Premium user.")
        db.close()
        
    except Exception as e:
        print(f"\nDatabase Error: {e}")

if __name__ == "__main__":
    main()
