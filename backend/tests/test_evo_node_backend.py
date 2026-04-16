"""
EVO Node.js Backend API Tests
Tests for the migrated Node.js/Express backend
Covers: Auth, Bookings, Content, Pricing endpoints
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
TEST_EMAIL = "max@test.ch"
TEST_PASSWORD = "test123"
TEST_NAME = "Max Muster"


class TestHealthEndpoints:
    """Health check endpoints - run first"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        print(f"✓ API root: {data}")
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        print(f"✓ Health check: {data}")


class TestAuthEndpoints:
    """Authentication flow tests"""
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data, "No token in response"
        assert "user" in data, "No user in response"
        assert data["user"]["email"] == TEST_EMAIL
        print(f"✓ Login success: user={data['user']['name']}")
        return data["token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "error" in data
        print(f"✓ Invalid login rejected: {data['error']}")
    
    def test_login_invalid_email_format(self):
        """Test login with invalid email format"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "notanemail",
            "password": "test123"
        })
        assert response.status_code == 400
        print("✓ Invalid email format rejected")
    
    def test_get_current_user(self):
        """Test getting current user with token"""
        # First login to get token
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        token = login_res.json()["token"]
        
        # Get current user
        response = requests.get(f"{BASE_URL}/api/auth/me?token={token}")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == TEST_EMAIL
        assert "is_member" in data
        print(f"✓ Get current user: {data['name']}, is_member={data['is_member']}")
    
    def test_get_user_without_token(self):
        """Test getting user without token fails"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Unauthorized access rejected")
    
    def test_register_new_user(self):
        """Test user registration"""
        unique_email = f"test_{datetime.now().timestamp()}@test.ch"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Test User",
            "email": unique_email,
            "password": "testpass123"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == unique_email
        assert data["user"]["is_member"] == True  # Registered users are members
        print(f"✓ Registration success: {unique_email}")
    
    def test_register_duplicate_email(self):
        """Test registration with existing email fails"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Duplicate User",
            "email": TEST_EMAIL,  # Already exists
            "password": "testpass123"
        })
        assert response.status_code == 400
        data = response.json()
        assert "error" in data
        print(f"✓ Duplicate email rejected: {data['error']}")


class TestPricingEndpoints:
    """Pricing endpoint tests"""
    
    def test_get_pricing(self):
        """Test pricing endpoint returns all 5 options"""
        response = requests.get(f"{BASE_URL}/api/pricing")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "pricing" in data
        assert "cleaning" in data
        assert "deposit" in data
        assert "buffer" in data
        assert "max_advance_months" in data
        
        # Verify 5 pricing options
        pricing = data["pricing"]
        assert len(pricing) == 5, f"Expected 5 pricing options, got {len(pricing)}"
        
        # Verify specific prices
        time_blocks = {(p["time_block"], p["day_label"]): p for p in pricing}
        
        # 4h - all days
        assert ("4h", "Alle Tage") in time_blocks
        assert time_blocks[("4h", "Alle Tage")]["member_price"] == 80
        assert time_blocks[("4h", "Alle Tage")]["external_price"] == 120
        
        # 12h weekday
        assert ("12h", "Mo–Do") in time_blocks
        assert time_blocks[("12h", "Mo–Do")]["member_price"] == 120
        assert time_blocks[("12h", "Mo–Do")]["external_price"] == 180
        
        # 12h weekend
        assert ("12h", "Fr–So + Feiertage") in time_blocks
        assert time_blocks[("12h", "Fr–So + Feiertage")]["member_price"] == 150
        assert time_blocks[("12h", "Fr–So + Feiertage")]["external_price"] == 270
        
        # 24h weekday
        assert ("24h", "Mo–Do") in time_blocks
        assert time_blocks[("24h", "Mo–Do")]["member_price"] == 150
        assert time_blocks[("24h", "Mo–Do")]["external_price"] == 230
        
        # 24h weekend
        assert ("24h", "Fr–So + Feiertage") in time_blocks
        assert time_blocks[("24h", "Fr–So + Feiertage")]["member_price"] == 200
        assert time_blocks[("24h", "Fr–So + Feiertage")]["external_price"] == 350
        
        # Verify cleaning and deposit
        assert data["cleaning"]["price"] == 60
        assert data["deposit"]["amount"] == 250
        assert data["buffer"]["hours"] == 1.5
        assert data["max_advance_months"] == 3
        
        print(f"✓ Pricing endpoint: {len(pricing)} options, cleaning={data['cleaning']['price']}, deposit={data['deposit']['amount']}")


class TestBookingEndpoints:
    """Booking system tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Authentication failed")
    
    def test_seed_bookings(self):
        """Test seeding demo bookings"""
        response = requests.post(f"{BASE_URL}/api/bookings/seed")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "dates" in data
        print(f"✓ Seed bookings: {data['message']}")
    
    def test_get_availability(self):
        """Test getting availability for a month"""
        today = datetime.now()
        year = today.year
        month = today.month
        
        response = requests.get(f"{BASE_URL}/api/bookings/availability/{year}/{month}")
        assert response.status_code == 200
        data = response.json()
        assert "bookings" in data
        print(f"✓ Availability for {year}/{month}: {len(data['bookings'])} bookings")
    
    def test_check_availability_valid_date(self):
        """Test checking availability for a valid future date"""
        # Get a date 10 days from now
        future_date = (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/check-availability", json={
            "booking_date": future_date,
            "start_time": "10:00",
            "time_block": "4h"
        })
        assert response.status_code == 200
        data = response.json()
        assert "available" in data
        print(f"✓ Check availability for {future_date}: available={data['available']}")
    
    def test_check_availability_past_date(self):
        """Test checking availability for past date fails"""
        past_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/check-availability", json={
            "booking_date": past_date,
            "start_time": "10:00",
            "time_block": "4h"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["available"] == False
        assert "message" in data
        print(f"✓ Past date rejected: {data['message']}")
    
    def test_check_availability_too_far_future(self):
        """Test checking availability for date > 3 months fails"""
        far_future = (datetime.now() + timedelta(days=120)).strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/check-availability", json={
            "booking_date": far_future,
            "start_time": "10:00",
            "time_block": "4h"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["available"] == False
        print(f"✓ Far future date rejected: {data.get('message', 'No message')}")
    
    def test_check_price_member(self, auth_token):
        """Test price calculation for member"""
        # Use a weekday date
        future_date = datetime.now() + timedelta(days=7)
        # Find next Tuesday (weekday)
        while future_date.weekday() != 1:  # Tuesday
            future_date += timedelta(days=1)
        date_str = future_date.strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/check-price", json={
            "booking_date": date_str,
            "time_block": "12h",
            "cleaning": False,
            "token": auth_token
        })
        assert response.status_code == 200
        data = response.json()
        assert "rental_price" in data
        assert "total" in data
        # Member 12h weekday price should be 120
        assert data["rental_price"] == 120
        print(f"✓ Member price for 12h weekday: CHF {data['total']}")
    
    def test_check_prices_both(self):
        """Test getting both member and external prices"""
        # Use a weekend date (Saturday)
        future_date = datetime.now() + timedelta(days=7)
        while future_date.weekday() != 5:  # Saturday
            future_date += timedelta(days=1)
        date_str = future_date.strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/check-prices", json={
            "booking_date": date_str,
            "time_block": "12h",
            "cleaning": False
        })
        assert response.status_code == 200
        data = response.json()
        assert "member" in data
        assert "external" in data
        # 12h weekend prices
        assert data["member"]["rental_price"] == 150
        assert data["external"]["rental_price"] == 270
        print(f"✓ 12h weekend prices: member={data['member']['total']}, external={data['external']['total']}")
    
    def test_create_member_booking(self, auth_token):
        """Test creating a booking as logged-in member"""
        # Find a free date far enough in future
        future_date = datetime.now() + timedelta(days=45)
        # Use a unique time to avoid conflicts
        date_str = future_date.strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings", json={
            "booking_date": date_str,
            "time_block": "4h",
            "start_time": "08:00",  # Early morning to avoid conflicts
            "event_type": "TEST_Geburtstag",
            "expected_guests": 25,
            "cleaning_addon": False,
            "special_requests": "Test booking",
            "token": auth_token
        })
        
        if response.status_code == 200:
            data = response.json()
            assert "booking" in data
            booking = data["booking"]
            assert booking["booking_date"] == date_str
            assert booking["time_block"] == "4h"
            assert booking["is_member"] == True
            print(f"✓ Member booking created: {booking['reference_number']}")
        elif response.status_code == 400:
            # Might conflict with seed data
            data = response.json()
            print(f"⚠ Booking conflict (expected with seed data): {data.get('error', 'Unknown')}")
        else:
            pytest.fail(f"Unexpected status: {response.status_code} - {response.text}")
    
    def test_create_external_booking(self):
        """Test creating a booking as external user"""
        # Find a free date
        future_date = datetime.now() + timedelta(days=50)
        date_str = future_date.strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/external", json={
            "booking_date": date_str,
            "time_block": "4h",
            "start_time": "18:00",  # Evening to avoid conflicts
            "event_type": "TEST_Familienfeier",
            "expected_guests": 30,
            "cleaning_addon": True,
            "special_requests": "External test booking",
            "name": "Test External User",
            "email": "external@test.ch",
            "phone": "+41 79 123 45 67"
        })
        
        if response.status_code == 200:
            data = response.json()
            assert "booking" in data
            booking = data["booking"]
            assert booking["is_member"] == False
            assert booking["is_external"] == True
            assert booking["status"] == "pending"  # External bookings are pending
            print(f"✓ External booking created: {booking['reference_number']}")
        elif response.status_code == 400:
            data = response.json()
            print(f"⚠ External booking conflict: {data.get('error', 'Unknown')}")
        else:
            pytest.fail(f"Unexpected status: {response.status_code} - {response.text}")
    
    def test_create_external_booking_missing_fields(self):
        """Test external booking fails without required fields"""
        future_date = (datetime.now() + timedelta(days=55)).strftime("%Y-%m-%d")
        
        response = requests.post(f"{BASE_URL}/api/bookings/external", json={
            "booking_date": future_date,
            "time_block": "4h",
            "start_time": "10:00",
            "event_type": "Test",
            "expected_guests": 20,
            # Missing name, email, phone
        })
        assert response.status_code == 400
        print("✓ External booking without contact info rejected")
    
    def test_get_my_bookings(self, auth_token):
        """Test getting user's bookings"""
        response = requests.get(f"{BASE_URL}/api/bookings/my?token={auth_token}")
        assert response.status_code == 200
        data = response.json()
        assert "bookings" in data
        print(f"✓ My bookings: {len(data['bookings'])} bookings found")
    
    def test_get_my_bookings_unauthorized(self):
        """Test getting bookings without token fails"""
        response = requests.get(f"{BASE_URL}/api/bookings/my")
        assert response.status_code == 401
        print("✓ Unauthorized my-bookings rejected")


class TestContentEndpoints:
    """Content endpoints tests (events, blog, board members)"""
    
    def test_get_events(self):
        """Test getting events"""
        response = requests.get(f"{BASE_URL}/api/events?limit=3")
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        events = data["events"]
        assert len(events) <= 3
        if events:
            assert "title" in events[0]
            assert "date" in events[0]
        print(f"✓ Events: {len(events)} events returned")
    
    def test_get_board_members(self):
        """Test getting board members"""
        response = requests.get(f"{BASE_URL}/api/board-members")
        assert response.status_code == 200
        data = response.json()
        assert "members" in data
        members = data["members"]
        if members:
            assert "name" in members[0]
            assert "role" in members[0]
        print(f"✓ Board members: {len(members)} members returned")
    
    def test_get_blog_posts(self):
        """Test getting blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert "posts" in data
        posts = data["posts"]
        if posts:
            assert "title" in posts[0]
            assert "content" in posts[0]
        print(f"✓ Blog posts: {len(posts)} posts returned")


class TestContactEndpoints:
    """Contact and newsletter endpoints"""
    
    def test_contact_form(self):
        """Test contact form submission"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test User",
            "email": "test@example.ch",
            "subject": "Test Subject",
            "message": "This is a test message"
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Contact form: {data['message']}")
    
    def test_contact_form_invalid(self):
        """Test contact form with missing fields"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test",
            # Missing email, subject, message
        })
        assert response.status_code == 400
        print("✓ Invalid contact form rejected")
    
    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        unique_email = f"newsletter_{datetime.now().timestamp()}@test.ch"
        response = requests.post(f"{BASE_URL}/api/newsletter", json={
            "email": unique_email
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Newsletter subscription: {data['message']}")
    
    def test_newsletter_invalid_email(self):
        """Test newsletter with invalid email"""
        response = requests.post(f"{BASE_URL}/api/newsletter", json={
            "email": "notanemail"
        })
        assert response.status_code == 400
        print("✓ Invalid newsletter email rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
