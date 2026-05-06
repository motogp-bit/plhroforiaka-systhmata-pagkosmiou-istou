// Διαβάζουμε τα likedItems από τη μνήμη. Αν είναι κενο φτιαχνουμε ενα νεο αδειο αντικειμενο
let likedItems = JSON.parse(sessionStorage.getItem("likedItems")) || {};
const API_BASE = "http://127.0.0.1:5000"; 

document.addEventListener("DOMContentLoaded", () => {
    
    const input = document.getElementById("searchIn");
    const button = document.getElementById("searchBtn");
    const resultsContainer = document.querySelector(".items-container");

    // --- ΛΟΓΙΚΗ ΑΝΑΖΗΤΗΣΗΣ ---
    const handleSearch = (queryStr) => {
        if (!resultsContainer) return; 
        
        resultsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center;'>Φόρτωση...</h3>";
        
        fetch(`${API_BASE}/search?name=${encodeURIComponent(queryStr)}`)
            .then(res => {
                if (!res.ok) throw new Error("Request failed.");
                return res.json();
            })
            .then(items => { 
                resultsContainer.innerHTML = ""; 
                
                if (items.length === 0) {
                    resultsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; color: #e25674;'>Δεν βρέθηκαν αντικείμενα.</h3>";
                    return;
                }
                
                items.forEach(item => {
                    const el = document.createElement("div");
                    el.classList.add("item"); 
                    
                    // Ελέγχουμε αν αυτό το αντικείμενο είναι ήδη liked 
                    const isAlreadyLiked = likedItems[item._id] === true;
                    // Αν είναι liked, του βαζουμε κατευθείαν καρδια
                    const activeClass = isAlreadyLiked ? "is-active" : "";
                    
                    el.innerHTML = `
                        <div class="img-wrapper">
                            <div class="heart ${activeClass}" data-id="${item._id}"></div>
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

    if (button && input) {
        button.addEventListener("click", () => handleSearch(input.value));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch(input.value);
        });
        
        handleSearch("");
    }

    // --- ΛΟΓΙΚΗ LIKE ---
    if (resultsContainer) {
        resultsContainer.addEventListener("click", (e) => {
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
                        target.classList.remove("is-active"); 
                        likesSpan.textContent = current - 1;
                    } else {
                        likedItems[id] = true;
                        target.classList.add("is-active"); 
                        likesSpan.textContent = current + 1;
                    }
                    
                    // Αποθηκεύουμε τη νέα κατάσταση στο sessionStorage!
                    sessionStorage.setItem("likedItems", JSON.stringify(likedItems));
                }
            })
            .catch(err => console.error(err));
        });
    }

    // --- ΛΟΓΙΚΗ ΔΗΜΟΦΙΛΩΝ SLIDESHOW ---
    const slideshow = document.getElementById("popular-slideshow");
    if (slideshow) {
        fetch(`${API_BASE}/popular`)
            .then(res => res.json())
            .then(items => {
                slideshow.innerHTML = ""; 
                
                items.forEach(item => {
                    const slide = document.createElement("div");
                    slide.classList.add("slide");
                    slide.innerHTML = `
                        <img src="images/${item.image}" alt="${item.name}">
                        <div class="caption">${item.name} (${item.likes} Likes)</div>
                    `;
                    slideshow.appendChild(slide);
                });
                
                if (typeof initSlideshow === "function") {
                    initSlideshow();
                }
            })
            .catch(err => console.error("Slideshow fetch error:", err));
    }
});