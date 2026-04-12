#!/usr/bin/env python3
"""
Backend API Testing for EVO (Elternvereinigung Oberglatt) Website
Tests all backend endpoints including auth, bookings, content, and contact forms.
"""

import requests
import sys
import json
from datetime import datetime, timedelta
from typing import Dict, Any

class EVOAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        # Default headers
        default_headers = {'Content-Type': 'application/json'}
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            default_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}

            details = f"Status: {response.status_code}"
            if not success:
                details += f", Expected: {expected_status}, Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    # ==================== AUTH TESTS ====================
    
    def test_health_check(self):
        """Test API health endpoints"""
        self.run_test("API Root Health", "GET", "api/", 200)
        self.run_test("API Health Check", "GET", "api/health", 200)

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        test_user = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "testpass123",
            "phone": "+41 79 123 45 67",
            "address": "Teststrasse 1, 8154 Oberglatt"
        }
        
        success, response = self.run_test(
            "User Registration", "POST", "api/auth/register", 200, test_user
        )
        
        if success and "token" in response:
            self.token = response["token"]
            self.user_id = response["user"]["id"]
            print(f"   → Registered user: {test_user['email']}")
            return True
        return False

    def test_existing_user_login(self):
        """Test login with existing user from review request"""
        credentials = {
            "email": "max@test.ch",
            "password": "test123"
        }
        
        success, response = self.run_test(
            "Login Existing User", "POST", "api/auth/login", 200, credentials
        )
        
        if success and "token" in response:
            # Store token for subsequent tests
            existing_token = response["token"]
            print(f"   → Logged in as: {credentials['email']}")
            return True, existing_token
        return False, None

    def test_user_login(self):
        """Test user login with registered user"""
        if not self.token:
            print("❌ No token available for login test")
            return False
            
        # Test getting current user info
        success, response = self.run_test(
            "Get Current User", "GET", f"api/auth/me?token={self.token}", 200
        )
        
        if success:
            print(f"   → User info retrieved: {response.get('name', 'Unknown')}")
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_creds = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        self.run_test("Invalid Login", "POST", "api/auth/login", 401, invalid_creds)

    # ==================== CONTENT TESTS ====================
    
    def test_board_members(self):
        """Test board members endpoint"""
        success, response = self.run_test("Get Board Members", "GET", "api/board-members", 200)
        if success and "members" in response:
            print(f"   → Found {len(response['members'])} board members")
        return success

    def test_events(self):
        """Test events endpoint"""
        success, response = self.run_test("Get Events", "GET", "api/events", 200)
        if success and "events" in response:
            print(f"   → Found {len(response['events'])} events")
        
        # Test with limit parameter
        self.run_test("Get Events with Limit", "GET", "api/events?limit=5", 200)
        return success

    def test_blog_posts(self):
        """Test blog posts endpoint"""
        success, response = self.run_test("Get Blog Posts", "GET", "api/blog", 200)
        if success and "posts" in response:
            print(f"   → Found {len(response['posts'])} blog posts")
        return success

    def test_pricing(self):
        """Test pricing endpoint"""
        success, response = self.run_test("Get Pricing", "GET", "api/pricing", 200)
        if success and "pricing" in response:
            print(f"   → Found {len(response['pricing'])} pricing tiers")
            # Verify pricing structure
            pricing = response["pricing"]
            has_4h = any(p["time_block"] == "4h" for p in pricing)
            has_24h = any(p["time_block"] == "24h" for p in pricing)
            if has_4h and has_24h:
                print("   → Pricing includes both 4h and 24h blocks")
            else:
                print("   → Warning: Missing expected pricing blocks")
        return success

    # ==================== BOOKING TESTS ====================
    
    def test_booking_availability(self):
        """Test booking availability check"""
        # Test availability for next month
        next_month = datetime.now() + timedelta(days=30)
        year = next_month.year
        month = next_month.month
        
        success, response = self.run_test(
            "Check Availability", "GET", f"api/bookings/availability/{year}/{month}", 200
        )
        if success and "bookings" in response:
            print(f"   → Found {len(response['bookings'])} existing bookings")
        return success

    def test_price_calculation(self):
        """Test price calculation"""
        # Test without token (external pricing)
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        success, response = self.run_test(
            "Price Check External", "POST", 
            f"api/bookings/check-price?booking_date={tomorrow}&time_block=4h&cleaning=false", 200
        )
        if success and "total" in response:
            print(f"   → External 4h price: CHF {response['total']}")
        
        # Test with member token if available
        if self.token:
            success2, response2 = self.run_test(
                "Price Check Member", "POST", 
                f"api/bookings/check-price?booking_date={tomorrow}&time_block=4h&cleaning=false&token={self.token}", 200
            )
            if success2 and "total" in response2:
                print(f"   → Member 4h price: CHF {response2['total']}")
        
        return success

    def test_availability_check(self):
        """Test specific time slot availability"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        success, response = self.run_test(
            "Check Time Slot", "POST", 
            f"api/bookings/check-availability?booking_date={tomorrow}&start_time=10:00&time_block=4h", 200
        )
        if success and "available" in response:
            print(f"   → Time slot available: {response['available']}")
        return success

    def test_create_booking(self):
        """Test booking creation"""
        if not self.token:
            print("❌ No token available for booking test")
            return False
        
        # Book for day after tomorrow to avoid conflicts
        booking_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        booking_data = {
            "booking_date": booking_date,
            "time_block": "4h",
            "start_time": "14:00",
            "event_type": "Test Event",
            "expected_guests": 25,
            "cleaning_addon": False,
            "special_requests": "Test booking from automated test"
        }
        
        success, response = self.run_test(
            "Create Booking", "POST", f"api/bookings?token={self.token}", 200, booking_data
        )
        
        if success and "booking" in response:
            booking = response["booking"]
            print(f"   → Booking created: {booking.get('reference_number', 'No ref')}")
            print(f"   → Total price: CHF {booking.get('total_price', 'Unknown')}")
            return True
        return False

    def test_get_my_bookings(self):
        """Test getting user's bookings"""
        if not self.token:
            print("❌ No token available for my bookings test")
            return False
        
        success, response = self.run_test(
            "Get My Bookings", "GET", f"api/bookings/my?token={self.token}", 200
        )
        
        if success and "bookings" in response:
            print(f"   → Found {len(response['bookings'])} user bookings")
        return success

    # ==================== CONTACT TESTS ====================
    
    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Contact",
            "email": "test@example.com",
            "subject": "Test Message",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Contact Form", "POST", "api/contact", 200, contact_data
        )
        if success:
            print("   → Contact message sent successfully")
        return success

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        timestamp = datetime.now().strftime("%H%M%S")
        email = f"newsletter{timestamp}@example.com"
        
        success, response = self.run_test(
            "Newsletter Subscribe", "POST", f"api/newsletter?email={email}", 200
        )
        if success:
            print(f"   → Newsletter subscription: {email}")
        
        # Test duplicate subscription
        self.run_test(
            "Newsletter Duplicate", "POST", f"api/newsletter?email={email}", 200
        )
        return success

    # ==================== MAIN TEST RUNNER ====================
    
    def test_price_comparison_endpoint(self):
        """Test the price comparison endpoint for both member and external prices"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        success, response = self.run_test(
            "Price Comparison Endpoint", 
            "POST", 
            f"api/bookings/check-prices?booking_date={tomorrow}&time_block=4h&cleaning=false", 
            200
        )
        if success and response:
            if 'member' in response and 'external' in response:
                member_total = response['member'].get('total', 0)
                external_total = response['external'].get('total', 0)
                self.log_test(f"Member price: CHF {member_total}", member_total == 80)
                self.log_test(f"External price: CHF {external_total}", external_total == 120)
                if member_total == 80 and external_total == 120:
                    self.log_test("Price comparison working correctly", True)
                    return True, response
                else:
                    self.log_test(f"Unexpected prices - Member: {member_total}, External: {external_total}", False)
            else:
                self.log_test("Missing member/external price comparison", False)
        else:
            self.log_test("Price comparison endpoint failed", False)
        return success, response

    def test_external_booking_endpoint(self):
        """Test external booking endpoint"""
        # Use a date further in the future to avoid conflicts
        future_date = (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d")
        booking_data = {
            "booking_date": future_date,
            "time_block": "4h",
            "start_time": "10:00",
            "event_type": "Geburtstag",
            "expected_guests": 25,
            "cleaning_addon": False,
            "special_requests": "Test external booking",
            "name": "Test External User",
            "email": "external@test.ch",
            "phone": "+41 79 123 45 67"
        }
        
        success, response = self.run_test(
            "External Booking Creation", 
            "POST", 
            "api/bookings/external", 
            200, 
            data=booking_data
        )
        
        if success and response:
            booking = response.get('booking', {})
            if booking:
                self.log_test(f"External booking created with reference: {booking.get('reference_number')}", True)
                self.log_test(f"External booking status: {booking.get('status')}", booking.get('status') == 'pending')
                self.log_test(f"External booking marked as external: {booking.get('is_external')}", booking.get('is_external') == True)
                self.log_test(f"External booking total price: CHF {booking.get('total_price')}", booking.get('total_price') == 120)
                
                # Check if it's marked as external and pending
                if booking.get('is_external') and booking.get('status') == 'pending':
                    self.log_test("External booking correctly marked as pending", True)
                    return True, response
                else:
                    self.log_test("External booking not properly configured", False)
            else:
                self.log_test("No booking data in response", False)
        else:
            self.log_test("External booking endpoint failed", False)
        return success, response

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting EVO Backend API Tests")
        print("=" * 50)
        
        # Health checks
        print("\n📋 Health Checks")
        self.test_health_check()
        
        # Authentication tests
        print("\n🔐 Authentication Tests")
        self.test_user_registration()
        self.test_user_login()
        self.test_existing_user_login()
        self.test_invalid_login()
        
        # Content tests
        print("\n📄 Content Tests")
        self.test_board_members()
        self.test_events()
        self.test_blog_posts()
        self.test_pricing()
        
        # Booking tests
        print("\n📅 Booking Tests")
        self.test_booking_availability()
        self.test_price_calculation()
        self.test_availability_check()
        self.test_create_booking()
        self.test_get_my_bookings()
        
        # External booking tests
        print("\n🌐 External Booking Tests")
        self.test_price_comparison_endpoint()
        self.test_external_booking_endpoint()
        
        # Contact tests
        print("\n📧 Contact Tests")
        self.test_contact_form()
        self.test_newsletter_subscription()
        
        # Results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed - check details above")
            return 1

def main():
    # Get backend URL from environment
    backend_url = "https://elternverein-og.preview.emergentagent.com"
    
    print(f"Testing backend at: {backend_url}")
    
    tester = EVOAPITester(backend_url)
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())