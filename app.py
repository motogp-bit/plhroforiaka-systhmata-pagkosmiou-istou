from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Σύνδεση με τη βάση 
app.config["MONGO_URI"] = "mongodb://localhost:27017/etsy_bitsy_db"
mongo = PyMongo(app)

# Αναζήτηση
@app.route('/search', methods=['GET'])
def search_items():
    name_query = request.args.get('name', '')
    if name_query.strip() == '':
        # Αν η αναζήτηση είναι κενή, φέρε τα πάντα ταξινομημένα από το πιο ακριβό
        cursor = mongo.db.items.find().sort("price", -1)
    else:
        #σπάμε και ραβουμε ξανα τις λεξεις σε παρενθεση για την αναζητηση
        words = name_query.split()
        strict_query = " ".join([f'"{word}"' for word in words])
        # Αναζήτηση με βάση το όνομα και ταξινομεί με βάση την φθίνουσα τιμή
        cursor = mongo.db.items.find({"$text": {"$search": strict_query}}, {"score": {"$meta": "textScore"}}).sort([("score", {"$meta": "textScore"})])
    items = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        items.append(doc)
        
    return jsonify(items), 200

# Likes
@app.route('/like', methods=['POST'])
def like_item():
    data = request.get_json()
    if not data or 'id' not in data:
        return jsonify({"error": "Λείπει το id"}), 400  
    item_id = data['id']
    liked = data.get("liked", False)
    
    try:
        update = -1 if liked else 1
        result = mongo.db.items.update_one({"_id": ObjectId(item_id)}, {"$inc": {"likes": update}})
        action = "L" if update == -1 else "Unl"
        if result.modified_count == 1:
            return jsonify({"success": True, "message": action + "iked"}), 200
        else:
            return jsonify({"error": "Το αντικείμενο δεν βρέθηκε"}), 404
        
    except Exception as e:
        return jsonify({"error": "Μη έγκυρο ID αντικειμένου"}), 400

# Δημοφιλοι
@app.route('/popular', methods=['GET'])
def popular_items():
    # Επιστρέφει τα top-5 πιο δημοφιλή αντικείμενα
    cursor = mongo.db.items.find().sort("likes", -1).limit(5)
    items = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        items.append(doc)
        
    return jsonify(items), 200


if __name__ == '__main__':
    # Το API τρέχει στην IP 127.0.0.1 και PORT 5000
    app.run(host='127.0.0.1', port=5000, debug=True)