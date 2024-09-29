document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const imageName = document.getElementById('imageName').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value;

    // Example API endpoint: '/api/search-ugc?imageName={imageName}&location={location}&description={description}&tags={tags}'
    const apiUrl = `/api/search-ugc?imageName=${encodeURIComponent(imageName)}&location=${encodeURIComponent(location)}&description=${encodeURIComponent(description)}&tags=${encodeURIComponent(tags)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});

function displayResults(images) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (images.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    images.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');

        imageCard.innerHTML = `
            <img src="${image.url}" alt="${image.name}">
            <h3>${image.name}</h3>
            <p><strong>Location:</strong> ${image.location}</p>
            <p><strong>Description:</strong> ${image.description}</p>
            <p><strong>Tags:</strong> ${image.tags.join(', ')}</p>
        `;

        resultsContainer.appendChild(imageCard);
    });
}
