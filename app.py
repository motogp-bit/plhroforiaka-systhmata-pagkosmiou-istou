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
        # Αν είναι κενό string, επιστρέφει όλα τα αντικείμενα και ταξινομεί με βάση την φθίνουσα τιμή
        cursor = mongo.db.items.find().sort("price", -1)
    else:
        # Αναζήτηση με βάση το όνομα και ταξινομεί με βάση την φθίνουσα τιμή
        cursor = mongo.db.items.find({"$text": {"$search": name_query}}).sort("price", -1)
    items = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        items.append(doc)
        
    return jsonify(items), 200

# Likes
@app.route('/like', methods=['POST'])
def like_item():
    # Περιμένει JSON στο body του request (πρέπει το "Content-Type" να είναι "application/json")
    data = request.get_json()
    if not data or 'id' not in data:
        return jsonify({"error": "Λείπει το id"}), 400  
    item_id = data['id']
    
    try:
        # +1 likes
        result = mongo.db.items.update_one({"_id": ObjectId(item_id)}, {"$inc": {"likes": 1}})
        if result.modified_count == 1:
            return jsonify({"success": True, "message": "Liked"}), 200
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