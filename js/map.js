document.addEventListener("DOMContentLoaded", function () {
    const infoPanel = document.getElementById('infoPanel');
    const closePanelButton = document.getElementById('closePanel');
    const locationTitle = document.getElementById('locationTitle');
    const ugcContent = document.getElementById('ugcContent');
    let chatWindow;

    const apiKey = '14dd70f553c24d7ebe5acc3bee3873f5'; // Replace with your OpenCage API key
    const recommendedUGCs = new Set(); // To store recommended UGCs by the user

    // Initialize the map with zoom control repositioned
    const map = L.map('worldMap', {
        center: [20, 0],   // Centered on the map
        zoom: 3,           // Initial zoom level
        minZoom: 3,        // Prevent zooming out too far
        maxZoom: 18,       // Max zoom level
        zoomControl: false, // Disable the default zoom control
        maxBounds: [[-90, -180], [90, 180]] // Prevent map from panning out of bounds
    });
    
    // Add a tile layer (this is the map style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 1, // Set the minimum zoom level
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Enhanced heatmap points
    const heatmapPoints = [
        [37.7749, -122.4194, 10], // San Francisco, much higher intensity
        [51.5074, -0.1278, 7],    // London, higher intensity
        [35.6895, 139.6917, 8]    // Tokyo, higher intensity
    ];

    // Initialize heatmap layer with enhanced settings
    const heat = L.heatLayer(heatmapPoints, {
        radius: 30,  // Increase the radius to make it more noticeable
        blur: 12,    // Reduce blur to make the spots sharper
        maxZoom: 19,
        minOpacity: 0.12,
        gradient: {
            0.12: 'blue',
            0.35: 'lime',
            0.7: 'yellow',
            1.0: 'red'   // Red is the highest intensity
        }
    }).addTo(map);

    // Handle clicks on the heatmap
    map.on('click', function(e) {
        // Find the closest heatmap point
        const closestPoint = heatmapPoints.reduce((prev, curr) => {
            const prevDist = map.distance([prev[0], prev[1]], e.latlng);
            const currDist = map.distance([curr[0], curr[1]], e.latlng);
            return (currDist < prevDist) ? curr : prev;
        });

        // Check if the click is within a reasonable distance of a heatmap point
        if (map.distance([closestPoint[0], closestPoint[1]], e.latlng) < 50000) { // Adjust this threshold as needed
            reverseGeocode(closestPoint[0], closestPoint[1], function(locationName) {
                locationTitle.classList.add('location-title'); // Add the class for styling
                locationTitle.textContent = locationName;
            });
            // Show UGC content for the clicked location
            const ugcId = `${closestPoint[0]}-${closestPoint[1]}`;
            ugcContent.innerHTML = `
                <div class="content-area">
                    ${getSpotContent(closestPoint)}
                </div>
                <div class="action-buttons">
                    <div class="action-icons">
                        <a href="#" id="buyButton"><i class="fas fa-shopping-cart"></i> Buy</a>
                        <a href="#" id="contactCreator"><i class="fas fa-comments"></i> Contact Creator</a>
                        <a href="#" id="recommendButton"><i class="fas fa-thumbs-up"></i> Recommend <span id="recommendCount">12</span></a>
                        <a href="#" id="moreInfoButton"><i class="fas fa-info-circle"></i> More Info</a>
                    </div>
                </div>`;
            infoPanel.classList.add('active');
            infoPanel.style.display = 'block'; // Ensure the sidebar is visible

            document.getElementById('recommendButton').addEventListener('click', function () {
                if (!recommendedUGCs.has(ugcId)) {
                    let recommendCount = document.getElementById('recommendCount');
                    let currentCount = parseInt(recommendCount.textContent);
                    recommendCount.textContent = currentCount + 1;
                    recommendedUGCs.add(ugcId); // Add to recommended set
                } else {
                    alert("You've already recommended this UGC.");
                }
            });

            document.getElementById('buyButton').addEventListener('click', function () {
                alert("This functionality is not yet available.");
            });

            document.getElementById('moreInfoButton').addEventListener('click', function () {
                showMoreInfoModal(ugcId);
            });

            updateChatWindowPosition(); // Update the chat window when the sidebar is opened
        }
    });

// Reverse geocoding function
function reverseGeocode(lat, lng, callback) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.results && data.results[0]) {
                const components = data.results[0].components;
                // Display only the city and country
                const locationName = `${components.city || components.town || components.village || components.neighbourhood}, ${components.country}`;
                callback(locationName);
            } else {
                callback(`Location (${lat}, ${lng})`);
            }
        })
        .catch(() => {
            callback(`Location (${lat}, ${lng})`);
        });
}


    closePanelButton.addEventListener('click', function () {
        infoPanel.classList.remove('active');
        infoPanel.style.display = 'none'; // Hide the sidebar
        updateChatWindowPosition(); // Update chat window position when sidebar is closed
    });

    // Function to return UGC content based on the location
    function getSpotContent(point) {
        if (point[0] === 37.7749 && point[1] === -122.4194) {
            return '<p>This is a placeholder text for San Francisco.</p>' +
                '<img src="images/sf-placeholder.jpg" alt="San Francisco" style="width:100%;border-radius:10px;">';
        } else if (point[0] === 51.5074 && point[1] === -0.1278) {
            return '<p>This is a placeholder text for London.</p>' +
                '<video controls style="width:100%;border-radius:10px;">' +
                '<source src="videos/london-placeholder.mp4" type="video/mp4">' +
                'Your browser does not support the video tag.' +
                '</video>';
        } else if (point[0] === 35.6895 && point[1] === 139.6917) {
            return '<p>This is a placeholder text for Tokyo.</p>' +
                '<img src="images/tokyo-placeholder.jpg" alt="Tokyo" style="width:100%;border-radius:10px;">';
        } else {
            return '<p>No UGC content available for this location.</p>';
        }
    }

    // Open chat window when Contact Creator is clicked
    document.body.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'contactCreator') {
            openChatWindow();
        }
    });

    function openChatWindow() {
        chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <span>Chat with Creator</span>
                <button class="close-chat">&times;</button>
            </div>
            <div class="chat-body">
                <p>Start your conversation...</p>
            </div>
            <div class="chat-footer">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
        `;
        chatWindow.style.position = 'fixed';
        chatWindow.style.bottom = '20px';  // Positioned at the bottom
        chatWindow.style.width = '300px';
        chatWindow.style.maxHeight = '50vh'; // Limit height to half of the viewport height
        chatWindow.style.overflowY = 'auto'; // Enable scrolling if content overflows
        chatWindow.style.zIndex = '1001';  // Ensure it's above the map
        chatWindow.style.transition = 'right 0.5s'; // Smooth transition for movement
    
        updateChatWindowPosition(); // Ensure correct placement based on sidebar state
    
        document.body.appendChild(chatWindow);
    
        document.querySelector('.close-chat').addEventListener('click', function () {
            document.body.removeChild(chatWindow);
        });
    }
    
    function updateChatWindowPosition() {
        if (infoPanel.classList.contains('active')) {
            // If the sidebar is open, position the chat window to the left of the sidebar
            chatWindow.style.right = `${window.innerWidth - infoPanel.offsetLeft + 20}px`; 
        } else {
            // If the sidebar is closed, position the chat window at the right of the viewport
            chatWindow.style.right = '20px';
        }
    }
    

    // Function to show more info in a modal
    function showMoreInfoModal(ugcId) {
        const modal = document.createElement('div');
        modal.className = 'info-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Metadata Information</h2>
                <p>Here is all the metadata related to this UGC:</p>
                <ul>
                    <li>ID: ${ugcId}</li>
                    <li>Date: ${new Date().toLocaleDateString()}</li>
                    <li>Source: UGC Platform</li>
                    <li>Resolution: 1920x1080</li>
                    <li>Duration: 1:29</li>
                    <li>File Size: 2.5 MB</li>
                    <li>Device: iPhone 12</li>
                    <li>GPS Coordinates: 51.5074, -0.1278</li>
                    <!-- Add more metadata as needed -->
                </ul>
            </div>
        `;
    
        document.body.appendChild(modal);
    
        // Attach event listener for the close button
        document.querySelector('.close-modal').addEventListener('click', function () {
            document.body.removeChild(modal);
        });
    }
    });
