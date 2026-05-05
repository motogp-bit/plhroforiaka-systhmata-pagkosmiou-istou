from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/etsy_bitsy_db"
mongo = PyMongo(app)

def seed_database():
    with app.app_context():
        db_items = mongo.db.items
        db_items.drop()
        # Αντικείμενα
        items_data = [
            {"name": "To σπιτάκι του Hagrid", "image": "item1.jpg", "likes": 51, "price": 11.00, "description": "Κεραμική μινιατούρα."},
            {"name": "Διακοσμητικά Γραφείου Hallowen", "image": "item2.jpg", "likes": 42, "price": 5.00, "description": "Χειροποίητες μινιατούρες γραφείου."},
            {"name": "Μίνι Κιθάρα", "image": "item3.jpg", "likes": 110, "price": 18.50, "description": "Με χορδές από πετονιά."},
            {"name": "Custom keyboard keys", "image": "item4.jpg", "likes": 27, "price": 20.00, "description": "Ενσωματωμένες φιγούρες σε πλαστική θήκη πλήκτρων."},
            {"name": "Μινιατούρα Γραμμόφωνο", "image": "item5.jpg", "likes": 88, "price": 4.50, "description": "Χειροποίητο με απίστευτη λεπτομέρεια."},
            {"name": "Σκαλιστή Ξύλινη Πάπια", "image": "item6.jpg", "likes": 55, "price": 12.00, "description": "Σκαλιστή από ξύλο βελανιδίας"},
            {"name": "Μικροσκοπική Γλάστρα με Κάκτο", "image": "item7.jpg", "likes": 105, "price": 6.00, "description": "Αληθινός μικροσκοπικός κάκτος."},
            {"name": "Μίνι Καρέκλα Σκηνοθέτη", "image": "item8.jpg", "likes": 22, "price": 9.90, "description": "Σετ ρεαλιστικών μινιατουρων."},
            {"name": "Μίνι Τσαγιέρα Πορσελάνης", "image": "item9.jpg", "likes": 64, "price": 11.00, "description": "Με υπέροχα σχέδια λουλουδιών."},
            {"name": "Μικροσκοπικό Ρολόι Τσέπης", "image": "item10.jpg", "likes": 90, "price": 25.00, "description": "Δείχνει πάντα την ίδια ώρα."}, 
            {"name": "Μικροσκοπικό Πιατάκι με Μακαρόνια", "image": "item11.jpg", "likes": 47, "price": 7.50, "description": "Κατασκευασμένο από πολυμερικό πηλό."},
            {"name": "Μίνι Φαναράκι", "image": "item12.jpg", "likes": 38, "price": 8.50, "description": "Χωρίς φωτάκι."},
            {"name": "Μικροσκοπικό Κουτί Δώρου", "image": "item13.jpg", "likes": 19, "price": 3.00, "description": "Περιέχει ένα μικρότερο κουτί μέσα."},
            {"name": "Μίνι Ομπρέλα", "image": "item14.jpg", "likes": 51, "price": 6.50, "description": "Ανοίγει και κλείνει κανονικά."},
            {"name": "Μίνι Σκάκι", "image": "item15.jpg", "likes": 85, "price": 30.00, "description": "Περιλαμβάνει όλα τα πιόνια."},
            {"name": "Μικροσκοπικό Τηλεσκόπιο", "image": "item16.jpg", "likes": 60, "price": 16.00, "description": "Φτιαγμένο από μπρούτζο."},
            {"name": "Μίνι Βιβλία Αντίκες", "image": "item17.jpg", "likes": 75, "price": 14.00, "description": "Σετ από 7 μικροσκοπικά δερματόδετα βιβλία."},
            {"name": "Μικροσκοπικό Cupcake από Πηλό", "image": "item18.jpg", "likes": 120, "price": 8.00, "description": "Πολύχρωμο cupcake μινιατούρα, μοιάζει λαχταριστό!"},
            {"name": "Μίνι Μπουκαλάκι με Μήνυμα", "image": "item19.jpg", "likes": 95, "price": 5.50, "description": "Γυάλινο φιαλίδιο με ένα κρυφό μικροσκοπικό μήνυμα."},
            {"name": "Μικροσκοπικό Καβαλέτο με Πίνακα", "image": "item20.jpg", "likes": 68, "price": 15.00, "description": "Ξύλινο καβαλέτο με ζωγραφισμένο τοπίο."}
        ]
        
        # Εισαγωγή των αντικειμένων στη βάση (MongoDB)
        db_items.insert_many(items_data)
        db_items.create_index([("name", "text")])
        
        print("Επιτυχία! Τα δεδομένα φωρτώθηκαν")

if __name__ == "__main__":
    seed_database()