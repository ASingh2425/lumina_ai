import os
import sys

# Add backend to path for local execution
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import User, Progress, PaymentRequest

def main():
    print("--- Lumina AI User Purge Utility ---")
    
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
        
        # Get all users
        all_users = db.query(User).all()
        
        if not all_users:
            print("\nNo user accounts found in the database.")
            db.close()
            return
            
        print("\nCurrent user accounts in database:")
        for idx, u in enumerate(all_users, 1):
            role = "Admin/Premium" if u.is_admin else "Standard User"
            print(f"{idx}. Username: '{u.username}' | Email: '{u.email}' | Role: {role}")

        admin_username = input("\nEnter the username of the Admin you want to KEEP (all other accounts will be DELETED):\n").strip()
        
        # Verify the admin user exists
        admin_user = db.query(User).filter(User.username == admin_username).first()
        if not admin_user:
            print(f"\nError: User '{admin_username}' not found in the database. Deletion cancelled.")
            db.close()
            return
            
        # Ensure the specified user is set as admin
        admin_user.is_admin = True
        
        # Delete progress, payment requests, and users for all other accounts
        deleted_count = 0
        for u in all_users:
            if u.username != admin_username:
                # 1. Delete user progress
                db.query(Progress).filter(Progress.user_id == u.id).delete(synchronize_session=False)
                
                # 2. Delete user payment requests
                db.query(PaymentRequest).filter(PaymentRequest.user_id == u.id).delete(synchronize_session=False)
                
                # 3. Delete user account
                db.delete(u)
                deleted_count += 1
                
        db.commit()
        print(f"\nSUCCESS: Permanently removed {deleted_count} user account(s) and their associated records.")
        print(f"Account '{admin_username}' remains intact as the Admin.")
        db.close()
        
    except Exception as e:
        print(f"\nDatabase Error: {e}")

if __name__ == "__main__":
    main()
