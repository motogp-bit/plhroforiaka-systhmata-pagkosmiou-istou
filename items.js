const likedItems = {};

document.addEventListener("DOMContentLoaded", ()=> {
    const input = document.getElementById("searchIn");
    const button = document.getElementById("searchBtn");
    const results = document.getElementById("results");
    const handleSearch = () => {
        const query = input.value;
        results.innerHTML = "<p>Loading...</p>";
        fetch(`/search?name=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error("Request failed.");
                return res.json();
            })
            .then(items => { 
                results.innerHTML = "";
                if (items.length === 0) {
                    results.innerHTML = "<p>Δεν βρέθηκαν αντικείμενα.</p>";
                    return;
                }
                items.forEach(item => {
                    const el = document.createElement("div");
                    el.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>Price: ${item.price}</p>
                        <p>Likes: <span id="likes-${item._id}">${item.likes || 0}</span></p>
                        <button data-id="${item._id}" class="like-btn">❤️ Like</button>
                    `;
                    results.appendChild(el);
                });
            })
            .catch(err => {
                results.innerHTML = "<p>Δεν μπόρεσαν να φορτωθούν τα αποτελέσματα.</p>";
                console.error(err);
            });
    };
    button.addEventListener("click", handleSearch);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
    results.addEventListener("click", (e) => {
    if (!e.target.classList.contains("like-btn")) return;
        const target = e.target;
        const id = target.getAttribute("data-id");
        const isLiked = likedItems[id] === true;

        fetch("/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, liked: isLiked })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const likesSpan = document.getElementById(`likes-${id}`);
                let current = parseInt(likesSpan.textContent);
                if (isLiked) {
                    likedItems[id] = false;
                    target.textContent = "Like";
                    likesSpan.textContent = current - 1;
                } else {
                    likedItems[id] = true;
                    target.textContent = "Unlike";
                    likesSpan.textContent = current + 1;
                }
            } else {
                console.error(data.error);
            }
        })
        .catch(err => console.error(err));
    });
    const slideshow = document.getElementById("popular-slideshow");
    fetch("/popular")
        .then(res => res.json())
        .then(items => {
            slideshow.innerHTML = ""; 
            items.forEach(item => {
                const slide = document.createElement("div");
                slide.classList.add("slide");
                slide.innerHTML = `
                    <img src="${item.image || 'images/monet.jpg'}" alt="${item.name}">
                    <div class="caption">${item.name}</div>
                `;
                slideshow.appendChild(slide);
            });
            initSlideshow();
        })
        .catch(err => {
            initSlideshow(); //fallback
        });
});


