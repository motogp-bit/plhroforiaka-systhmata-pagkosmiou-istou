const likedItems = {};
const API_BASE = "http://127.0.0.1:5000"; // Το URL του δικού σου Flask API

document.addEventListener("DOMContentLoaded", () => {
    
    // --- ΛΟΓΙΚΗ ΑΝΑΖΗΤΗΣΗΣ (Τρέχει μόνο στο items.html) ---
    const input = document.getElementById("searchIn");
    const button = document.getElementById("searchBtn");
    // Θα βάζουμε τα αποτελέσματα κατευθείαν στο container τους
    const resultsContainer = document.querySelector(".items-container");

    const handleSearch = (queryStr) => {
        if (!resultsContainer) return; 
        
        resultsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center;'>Φόρτωση...</h3>";
        
        fetch(`${API_BASE}/search?name=${encodeURIComponent(queryStr)}`)
            .then(res => {
                if (!res.ok) throw new Error("Request failed.");
                return res.json();
            })
            .then(items => { 
                resultsContainer.innerHTML = ""; // Καθαρίζουμε τα dummy δεδομένα
                
                if (items.length === 0) {
                    resultsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; color: #e25674;'>Δεν βρέθηκαν αντικείμενα.</h3>";
                    return;
                }
                
                items.forEach(item => {
                    const el = document.createElement("div");
                    el.classList.add("item"); // Το CSS class που έφτιαξαν
                    
                    // Φτιάχνουμε το HTML ακριβώς όπως το έχουν στο items.html
                    el.innerHTML = `
                        <div class="img-wrapper">
                            <div class="heart" data-id="${item._id}"></div>
                            <img src="images/${item.image}" alt="${item.name}">
                        </div>
                        <h3>${item.name}</h3>
                        <p style="font-size: 13px; color: #666; margin-bottom: 5px;">${item.description}</p>
                        <p style="font-weight: bold; color: #20948B; margin-bottom: 5px;">€${item.price.toFixed(2)}</p>
                        <p style="font-size: 12px; color: #999;">Likes: <span id="likes-${item._id}">${item.likes || 0}</span></p>
                    `;
                    resultsContainer.appendChild(el);
                });
            })
            .catch(err => {
                resultsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; color: #e25674;'>Σφάλμα φόρτωσης. Βεβαιωθείτε ότι τρέχει το Python API.</h3>";
                console.error(err);
            });
    };

    // Αν είμαστε στη σελίδα items.html, βάζουμε τα events
    if (button && input) {
        button.addEventListener("click", () => handleSearch(input.value));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch(input.value);
        });
        
        // Φορτώνουμε όλα τα αντικείμενα αυτόματα με το που ανοίξει η σελίδα!
        handleSearch("");
    }

    // --- ΛΟΓΙΚΗ LIKE (Τρέχει μόνο στο items.html) ---
    if (resultsContainer) {
        resultsContainer.addEventListener("click", (e) => {
            // Αν το κλικ έγινε πάνω στην καρδούλα (heart)
            if (!e.target.classList.contains("heart")) return; 
            
            const target = e.target;
            const id = target.getAttribute("data-id");
            const isLiked = likedItems[id] === true;

            fetch(`${API_BASE}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id, liked: isLiked })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const likesSpan = document.getElementById(`likes-${id}`);
                    let current = parseInt(likesSpan.textContent);
                    
                    if (isLiked) {
                        likedItems[id] = false;
                        target.classList.remove("is-active"); // Βγάζει το CSS animation
                        likesSpan.textContent = current - 1;
                    } else {
                        likedItems[id] = true;
                        target.classList.add("is-active"); // Βάζει το CSS animation
                        likesSpan.textContent = current + 1;
                    }
                }
            })
            .catch(err => console.error(err));
        });
    }

    // --- ΛΟΓΙΚΗ ΔΗΜΟΦΙΛΩΝ SLIDESHOW (Τρέχει μόνο στο homepage.html) ---
    const slideshow = document.getElementById("popular-slideshow");
    if (slideshow) {
        fetch(`${API_BASE}/popular`)
            .then(res => res.json())
            .then(items => {
                slideshow.innerHTML = ""; // Καθαρίζουμε τα dummy slides
                
                items.forEach(item => {
                    const slide = document.createElement("div");
                    slide.classList.add("slide");
                    slide.innerHTML = `
                        <img src="images/${item.image}" alt="${item.name}">
                        <div class="caption">${item.name} (${item.likes} Likes)</div>
                    `;
                    slideshow.appendChild(slide);
                });
                
                // Καλούμε τη συνάρτηση από το script.js για να ξεκινήσει το 3D Effect
                if (typeof initSlideshow === "function") {
                    initSlideshow();
                }
            })
            .catch(err => console.error("Slideshow fetch error:", err));
    }
});