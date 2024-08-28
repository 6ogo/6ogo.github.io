document.addEventListener("DOMContentLoaded", function () {
    const masonryGrid = document.getElementById('masonryGrid');
    const loader = document.getElementById('loader');
    const filterButtons = document.querySelectorAll('.filter-button');
    const searchBox = document.getElementById('searchBox');
    const tagButtons = document.querySelectorAll('.tag');

    let page = 1; // Track the page we are currently on
    const pageSize = 20; // Number of UGC items to load per request
    let isLoading = false;
    let activeFilter = 'day'; // Default filter
    let searchTerm = '';
    let activeTag = '';

    // Function to get random aspect ratio
    function getRandomSize() {
        const aspectRatios = [
            { width: 450, height: 1050 },  // 9:21
            { width: 1050, height: 450 },  // 21:9
            { width: 720, height: 1280 },  // 9:16
            { width: 1280, height: 720 },  // 16:9
            { width: 800, height: 800 },   // 1:1
        ];
        return aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    }

    // Function to load UGC items
    function loadUGC() {
        if (isLoading) return;

        isLoading = true;
        loader.style.display = 'block';

        // Simulate an API call to load UGC items (replace this with actual API call)
        setTimeout(() => {
            for (let i = 0; i < pageSize; i++) {
                const { width, height } = getRandomSize();
                const ugcItem = document.createElement('div');
                ugcItem.className = 'masonry-item';
                ugcItem.style.gridRowEnd = `span ${Math.ceil(height / width)}`;
                ugcItem.innerHTML = `
                    <img src="https://picsum.photos/${width}/${height}?random=${(page - 1) * pageSize + i + 1}" alt="UGC Image">
                    <div class="ugc-info">
                        <h3>UGC Title ${(page - 1) * pageSize + i + 1}</h3>
                        <p>Short description of the UGC content.</p>
                    </div>
                `;
                ugcItem.addEventListener('click', () => showPopup(ugcItem));
                masonryGrid.appendChild(ugcItem);
            }

            page++;
            isLoading = false;
            loader.style.display = 'none';
        }, 1000); // Simulate 1 second delay for loading
    }

    // Function to show popup
    function showPopup(ugcItem) {
        const popup = document.createElement('div');
        const imageSrc = ugcItem.querySelector('img').src; // Get the image source
        const title = ugcItem.querySelector('h3').innerText; // Get the title
        const description = ugcItem.querySelector('p').innerText; // Get the description

        popup.className = 'ugc-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <img src="${imageSrc}" alt="${title}" class="popup-image">
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="action-buttons">
                    <button class="sidebar-button"><i class="fas fa-shopping-cart"></i> Buy</button>
                    <button class="sidebar-button"><i class="fas fa-comments"></i> Contact Creator</button>
                    <button class="sidebar-button"><i class="fas fa-thumbs-up"></i> Recommend</button>
                    <button class="sidebar-button"><i class="fas fa-info-circle"></i> More Info</button>
                </div>
            </div>
        `;

        // Append popup to body
        document.body.appendChild(popup);

        // Close the popup when the close button is clicked
        popup.querySelector('.close-popup').addEventListener('click', function () {
            document.body.removeChild(popup);
        });

        // Add close popup on clicking outside the content
        popup.addEventListener('click', function(event) {
            if (event.target === popup) {
                document.body.removeChild(popup);
            }
        });
    }

    function filterUGC(filter) {
        activeFilter = filter;
        page = 1;
        masonryGrid.innerHTML = '';
        loadUGC();
    }

    function searchUGC(term) {
        searchTerm = term;
        page = 1;
        masonryGrid.innerHTML = '';
        loadUGC();
    }

    function filterByTag(tag) {
        activeTag = tag;
        page = 1;
        masonryGrid.innerHTML = '';
        loadUGC();
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterUGC(this.id.replace('filter', '').toLowerCase());
        });
    });

    searchBox.addEventListener('input', function () {
        searchUGC(this.value);
    });

    tagButtons.forEach(tag => {
        tag.addEventListener('click', function () {
            tagButtons.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterByTag(this.dataset.tag);
        });
    });

    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.body.offsetHeight - 100;

        if (scrollPosition >= threshold) {
            loadUGC();
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Initial load
    loadUGC();
});
