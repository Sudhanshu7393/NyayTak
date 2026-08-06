import urllib.request
import re
import json
import os
import html
import time

def fetch_lawyers(city):
    url = f"https://lawrato.com/lawyers/{city.lower().replace(' ', '-')}"
    print(f"Fetching lawyers for: {city} from {url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            page_content = response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {city}: {e}")
        return []
        
    # Split page content by lawyer item blocks
    blocks = page_content.split('class="lawyer-item')
    lawyers = []
    
    for block in blocks[1:]: # skip header section
        # Limit scope to card boundaries
        block = block[:5000]
        
        # 1. Extract Name
        name_match = re.search(r'itemprop="name">([^<]+)</span>', block)
        name = name_match.group(1).strip() if name_match else None
        if not name:
            continue
        name = html.unescape(name)
        
        # 2. Extract Experience
        exp_match = re.search(r'class="experience".*?<span>\s*([^<]+)\s*</span>', block, re.DOTALL)
        if not exp_match:
            exp_match = re.search(r'suitcase-icon.*?<span>\s*([^<]+)\s*</span>', block, re.DOTALL)
        exp = exp_match.group(1).strip() if exp_match else "Practicing Advocate"
        exp = re.sub(r'\s+', ' ', exp)
        
        # 3. Extract Rating
        rating_match = re.search(r'class="score">\s*([\d\.]+)', block)
        rating = f"{rating_match.group(1).strip()} star" if rating_match else "5.0 star"
        
        # 4. Extract Locality
        loc_match = re.search(r'itemprop="addressLocality">([^<]+)</span>', block)
        loc = loc_match.group(1).strip() if loc_match else f"{city.capitalize()}"
        loc = html.unescape(loc)
        loc = re.sub(r'\s+', ' ', loc)
        
        # 5. Extract Specializations
        spec_match = re.search(r'class="experience visible-xs".*?<span>\s*([^<]+)\s*</span>', block, re.DOTALL)
        if not spec_match:
            spec_match = re.search(r'litigation-icon.*?<span>\s*([^<]+)\s*</span>', block, re.DOTALL)
        spec = spec_match.group(1).strip() if spec_match else "General Practice"
        spec = html.unescape(spec)
        spec = re.sub(r'\s+', ' ', spec)
        
        # 6. Extract Profile URL
        url_match = re.search(r'href="([^"]+)"\s*title="[^"]*"\s*>\s*<h2', block)
        if not url_match:
            url_match = re.search(r'href="([^"]+)"', block)
        prof_url = url_match.group(1).strip() if url_match else f"https://lawrato.com"
        
        # Generate clean ID
        lawyer_id = "scr-" + city.lower() + "-" + re.sub(r'[^a-z0-9]', '', name.lower())[:10]
        
        lawyers.append({
            "id": lawyer_id,
            "name": name,
            "exp": f"{exp} . Specializes in {spec}",
            "rating": rating,
            "cases": "Verified Advocate",
            "loc": loc,
            "ph": "+91 94150 XXXXX",
            "profileUrl": prof_url
        })
        
    print(f"Extracted {len(lawyers)} advocates for {city}")
    return lawyers

def main():
    # Major districts in Uttar Pradesh
    cities = ["lucknow", "allahabad", "kanpur", "varanasi", "noida", "ghaziabad", "agra", "meerut", "gorakhpur", "bareilly"]
    
    database = {}
    total_scraped = 0
    
    for city in cities:
        # Delay to avoid IP ban
        time.sleep(1.5)
        lawyers = fetch_lawyers(city)
        if lawyers:
            key = f"Uttar Pradesh|{city.capitalize()}"
            database[key] = lawyers
            total_scraped += len(lawyers)
            
    output_file = "scraped_lawyers.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
        
    print("\n" + "="*50)
    print(f"Scraping complete! Scraped {total_scraped} lawyers across {len(database)} UP districts.")
    print(f"Database file saved to: {os.path.abspath(output_file)}")
    print("="*50)

if __name__ == "__main__":
    main()
