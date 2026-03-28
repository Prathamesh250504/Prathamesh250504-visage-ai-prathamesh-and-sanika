from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB Atlas"""
        try:
            mongodb_uri = os.getenv("MONGODB_URI")
            if not mongodb_uri:
                raise ValueError("MONGODB_URI not found in environment variables")
            
            print("⏳ Connecting to MongoDB Atlas...")
            
            cls.client = AsyncIOMotorClient(
                mongodb_uri,
                server_api=ServerApi('1'),
                serverSelectionTimeoutMS=10000  # 10 second timeout
            )
            
            # Test connection with timeout
            await cls.client.admin.command('ping')
            print("✅ Successfully connected to MongoDB Atlas!")
            
        except Exception as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            print("💡 Common fixes:")
            print("   1. Whitelist your IP in MongoDB Atlas Network Access")
            print("   2. Check internet connection")
            print("   3. Verify credentials in .env file")
            print("   4. Run: python test_mongodb.py")
            raise
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("🔌 MongoDB connection closed")
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        db_name = os.getenv("DATABASE_NAME", "visage_ai")
        return cls.client[db_name]

# Database instance
db_instance = Database()

def get_database():
    """Dependency to get database"""
    return db_instance.get_db()
