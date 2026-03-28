"""
Startup script for Facial Analysis Backend
This script helps diagnose issues before starting the server
"""
import os
import sys
from pathlib import Path

def check_environment():
    """Check if all required environment variables are set"""
    print("🔍 Checking environment variables...")
    
    required_vars = ['MONGODB_URI', 'DATABASE_NAME']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
            print(f"  ❌ {var} is not set")
        else:
            print(f"  ✅ {var} is set")
    
    if missing_vars:
        print(f"\n⚠️ Warning: Missing environment variables: {', '.join(missing_vars)}")
        print("⚠️ Database features may not work properly")
    
    return len(missing_vars) == 0

def check_models():
    """Check if model files exist"""
    print("\n🔍 Checking model files...")
    
    models_dir = Path('models')
    if not models_dir.exists():
        print(f"  ❌ Models directory not found: {models_dir}")
        return False
    
    required_models = ['skincondition.h5', 'skintone.h5', 'skintype.h5', 'Dark.h5']
    missing_models = []
    
    for model_file in required_models:
        model_path = models_dir / model_file
        if model_path.exists():
            size_mb = model_path.stat().st_size / (1024 * 1024)
            print(f"  ✅ {model_file} found ({size_mb:.2f} MB)")
        else:
            missing_models.append(model_file)
            print(f"  ❌ {model_file} not found")
    
    if missing_models:
        print(f"\n⚠️ Warning: Missing model files: {', '.join(missing_models)}")
        print("⚠️ Some predictions may not work properly")
    
    return len(missing_models) == 0

def check_port():
    """Check if the port is available"""
    import socket
    
    print("\n🔍 Checking port availability...")
    
    port = int(os.getenv("API_PORT", 8001))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((host if host != "0.0.0.0" else "127.0.0.1", port))
            print(f"  ✅ Port {port} is available")
            return True
    except OSError:
        print(f"  ❌ Port {port} is already in use")
        print(f"  💡 Try changing API_PORT in .env or stop the process using port {port}")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print("\n🔍 Checking dependencies...")
    
    required_packages = [
        'fastapi',
        'uvicorn',
        'tensorflow',
        'PIL',
        'cv2',
        'motor',
        'pymongo'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'PIL':
                __import__('PIL')
            elif package == 'cv2':
                __import__('cv2')
            else:
                __import__(package)
            print(f"  ✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"  ❌ {package} is not installed")
    
    if missing_packages:
        print(f"\n⚠️ Missing packages: {', '.join(missing_packages)}")
        print("💡 Run: pip install -r requirements.txt")
        return False
    
    return True

def main():
    """Main startup function"""
    print("=" * 60)
    print("🚀 Facial Analysis Backend - Startup Diagnostics")
    print("=" * 60)
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run all checks
    checks = {
        'Dependencies': check_dependencies(),
        'Environment': check_environment(),
        'Models': check_models(),
        'Port': check_port()
    }
    
    print("\n" + "=" * 60)
    print("📊 Diagnostic Summary")
    print("=" * 60)
    
    all_passed = True
    for check_name, passed in checks.items():
        status = "✅ PASSED" if passed else "⚠️ WARNING"
        print(f"  {check_name}: {status}")
        if not passed and check_name in ['Dependencies', 'Port']:
            all_passed = False
    
    print("=" * 60)
    
    if not all_passed:
        print("\n❌ Critical issues found. Please fix them before starting the server.")
        sys.exit(1)
    
    print("\n✅ All critical checks passed! Starting server...")
    print("=" * 60 + "\n")
    
    # Start the server
    import uvicorn
    from main import app
    
    port = int(os.getenv("API_PORT", 8001))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    try:
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n\n❌ Server crashed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
