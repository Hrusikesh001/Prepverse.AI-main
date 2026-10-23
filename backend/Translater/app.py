from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Cache for translations to avoid repeated API calls
translation_cache = {}

def simple_translate(text, target_language):
    """Simple translation using free API with caching"""
    try:
        # Map language codes
        lang_map = {
            'odia': 'or',
            'hindi': 'hi',
            'english': 'en'
        }
        
        lang_code = lang_map.get(target_language.lower(), 'en')
        
        # If target is English, return original
        if lang_code == 'en':
            return text
        
        # Check cache first
        cache_key = f"{text}:{lang_code}"
        if cache_key in translation_cache:
            print(f"Cache hit: '{text}' -> '{translation_cache[cache_key]}'")
            return translation_cache[cache_key]
        
        # Skip empty or very short texts
        if not text or len(text.strip()) < 2:
            return text
        
        url = "https://api.mymemory.translated.net/get"
        params = {
            'q': text,
            'langpair': f'en|{lang_code}'
        }
        
        print(f"Translating: '{text[:50]}...' to {target_language} ({lang_code})")
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get('responseStatus') == 200:
            translated = data['responseData']['translatedText']
            
            # Cache the translation
            translation_cache[cache_key] = translated
            
            print(f"✓ Translated: '{text[:30]}...' -> '{translated[:30]}...'")
            return translated
        else:
            print(f"✗ Translation failed for: '{text[:50]}...'")
            print(f"Response: {data}")
            return text
            
    except Exception as e:
        print(f"Translation error for '{text[:50]}...': {str(e)}")
        return text

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "Backend is running!",
        "translator": "MyMemory API",
        "supported_languages": ["english", "hindi", "odia"],
        "cache_size": len(translation_cache)
    })

@app.route('/api/translate/bulk', methods=['POST'])
def translate_bulk():
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        target_language = data.get('targetLanguage', 'odia')
        
        print(f"\n{'='*60}")
        print(f"Bulk translation request:")
        print(f"  - Texts: {len(texts)} items")
        print(f"  - Target: {target_language}")
        print(f"{'='*60}")
        
        if not texts:
            return jsonify({"error": "No texts provided"}), 400
        
        translations = []
        successful = 0
        failed = 0
        
        for i, text in enumerate(texts):
            if text and text.strip():
                translated = simple_translate(text.strip(), target_language)
                translations.append(translated)
                
                if translated != text:
                    successful += 1
                else:
                    failed += 1
                    
                # Small delay to avoid rate limiting (MyMemory has limits)
                if i < len(texts) - 1:
                    time.sleep(0.1)
            else:
                translations.append("")
        
        print(f"\n✓ Translation complete:")
        print(f"  - Successful: {successful}")
        print(f"  - Failed/Unchanged: {failed}")
        print(f"  - Total: {len(translations)}")
        print(f"{'='*60}\n")
        
        return jsonify({
            "translations": translations,
            "sourceLanguage": "en",
            "targetLanguage": target_language,
            "stats": {
                "successful": successful,
                "failed": failed,
                "total": len(translations)
            }
        })
        
    except Exception as e:
        print(f"✗ Bulk translation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/clear-cache', methods=['POST'])
def clear_cache():
    """Clear translation cache"""
    global translation_cache
    cache_size = len(translation_cache)
    translation_cache = {}
    return jsonify({
        "message": "Cache cleared",
        "items_cleared": cache_size
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"\n{'='*60}")
    print(f"🚀 Translation Backend Starting...")
    print(f"   Port: {port}")
    print(f"   CORS: Enabled")
    print(f"   API: MyMemory (Free)")
    print(f"{'='*60}\n")
    app.run(host='0.0.0.0', port=port, debug=True)