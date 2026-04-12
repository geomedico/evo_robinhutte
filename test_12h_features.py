#!/usr/bin/env python3
"""
Specific tests for 12h time block features as requested in the review
"""

import requests
import sys
from datetime import datetime, timedelta

def test_12h_pricing():
    """Test 12h pricing for weekdays and weekends"""
    base_url = "https://elternverein-og.preview.emergentagent.com"
    
    print("🔍 Testing 12h Time Block Features")
    print("=" * 50)
    
    # Test pricing endpoint for 12h blocks
    response = requests.get(f"{base_url}/api/pricing")
    if response.status_code == 200:
        pricing_data = response.json()
        print("✅ Pricing endpoint accessible")
        
        # Check if all 5 pricing options are present
        pricing_options = pricing_data.get("pricing", [])
        print(f"📊 Found {len(pricing_options)} pricing options:")
        
        expected_options = [
            ("4h", "Alle Tage"),
            ("12h", "Mo–Do"), 
            ("12h", "Fr–So + Feiertage"),
            ("24h", "Mo–Do"),
            ("24h", "Fr–So + Feiertage")
        ]
        
        found_options = []
        for option in pricing_options:
            time_block = option.get("time_block")
            day_label = option.get("day_label")
            member_price = option.get("member_price")
            external_price = option.get("external_price")
            
            print(f"   • {option.get('label')} ({day_label}): CHF {member_price} / CHF {external_price}")
            found_options.append((time_block, day_label))
        
        # Check if all expected options are present
        missing_options = []
        for expected in expected_options:
            if expected not in found_options:
                missing_options.append(expected)
        
        if not missing_options:
            print("✅ All 5 pricing options present")
        else:
            print(f"❌ Missing pricing options: {missing_options}")
        
        # Check specific 12h weekday pricing
        weekday_12h = next((p for p in pricing_options if p.get("time_block") == "12h" and "Mo–Do" in p.get("day_label", "")), None)
        if weekday_12h:
            member_price = weekday_12h.get("member_price")
            external_price = weekday_12h.get("external_price")
            if member_price == 120 and external_price == 180:
                print("✅ 12h weekday pricing correct: CHF 120 member / CHF 180 external")
            else:
                print(f"❌ 12h weekday pricing incorrect: CHF {member_price} member / CHF {external_price} external")
        else:
            print("❌ 12h weekday pricing option not found")
        
        # Check buffer time and max advance booking info
        buffer_info = pricing_data.get("buffer", {})
        max_advance = pricing_data.get("max_advance_months")
        cleaning_info = pricing_data.get("cleaning", {})
        
        if buffer_info.get("hours") == 1.5:
            print("✅ Buffer time correctly set to 1.5h")
        else:
            print(f"❌ Buffer time incorrect: {buffer_info.get('hours')}h")
        
        if max_advance == 3:
            print("✅ Max advance booking correctly set to 3 months")
        else:
            print(f"❌ Max advance booking incorrect: {max_advance} months")
        
        if cleaning_info.get("price") == 60:
            print("✅ Cleaning fee correctly set to CHF 60")
        else:
            print(f"❌ Cleaning fee incorrect: CHF {cleaning_info.get('price')}")
    
    else:
        print(f"❌ Pricing endpoint failed: {response.status_code}")

def test_12h_price_calculation():
    """Test 12h price calculation for different days"""
    base_url = "https://elternverein-og.preview.emergentagent.com"
    
    print("\n🧮 Testing 12h Price Calculation")
    print("-" * 30)
    
    # Test weekday 12h pricing
    weekday = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")  # Tuesday
    while datetime.strptime(weekday, "%Y-%m-%d").weekday() >= 4:  # Skip weekends
        weekday = (datetime.strptime(weekday, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
    
    response = requests.post(f"{base_url}/api/bookings/check-prices?booking_date={weekday}&time_block=12h&cleaning=false")
    if response.status_code == 200:
        prices = response.json()
        member_price = prices.get("member", {}).get("total", 0)
        external_price = prices.get("external", {}).get("total", 0)
        
        if member_price == 120 and external_price == 180:
            print(f"✅ 12h weekday pricing calculation correct: CHF {member_price} / CHF {external_price}")
        else:
            print(f"❌ 12h weekday pricing calculation incorrect: CHF {member_price} / CHF {external_price}")
    else:
        print(f"❌ 12h weekday price calculation failed: {response.status_code}")
    
    # Test weekend 12h pricing
    weekend = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")  # Find a Friday
    while datetime.strptime(weekend, "%Y-%m-%d").weekday() != 4:  # Friday
        weekend = (datetime.strptime(weekend, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
    
    response = requests.post(f"{base_url}/api/bookings/check-prices?booking_date={weekend}&time_block=12h&cleaning=false")
    if response.status_code == 200:
        prices = response.json()
        member_price = prices.get("member", {}).get("total", 0)
        external_price = prices.get("external", {}).get("total", 0)
        
        if member_price == 150 and external_price == 270:
            print(f"✅ 12h weekend pricing calculation correct: CHF {member_price} / CHF {external_price}")
        else:
            print(f"❌ 12h weekend pricing calculation incorrect: CHF {member_price} / CHF {external_price}")
    else:
        print(f"❌ 12h weekend price calculation failed: {response.status_code}")

def test_max_advance_booking_validation():
    """Test max 3 months advance booking validation"""
    base_url = "https://elternverein-og.preview.emergentagent.com"
    
    print("\n📅 Testing Max Advance Booking Validation")
    print("-" * 40)
    
    # Test booking too far in advance (4 months)
    far_future = (datetime.now() + timedelta(days=120)).strftime("%Y-%m-%d")
    
    response = requests.post(f"{base_url}/api/bookings/check-availability?booking_date={far_future}&start_time=10:00&time_block=12h")
    if response.status_code == 200:
        result = response.json()
        if not result.get("available", True):
            message = result.get("message", "")
            if "3 Monate" in message or "3 months" in message:
                print("✅ Max 3 months advance booking validation working")
            else:
                print(f"❌ Unexpected validation message: {message}")
        else:
            print("❌ Max advance booking validation not working - booking allowed too far in future")
    else:
        print(f"❌ Availability check failed: {response.status_code}")

if __name__ == "__main__":
    test_12h_pricing()
    test_12h_price_calculation()
    test_max_advance_booking_validation()
    print("\n✨ 12h Feature Testing Complete")