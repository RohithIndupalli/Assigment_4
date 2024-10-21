const YOUTUBE_API_KEY = 'AIzaSyBkIPf-hDqT6ByFEH-wurZCugY404P8ZaY'; // Replace with your YouTube API key
const YOUTUBE_CHANNEL_ID = 'UCDHaJ1NaQF7UzIkjOx0-wEA'; // Replace with the YouTube channel ID
const SOUNDCLOUD_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID'; // Replace with your SoundCloud Client ID
const SPOTIFY_ACCESS_TOKEN = 'YOUR_SPOTIFY_ACCESS_TOKEN'; // Replace with your Spotify Access Token
const SPOTIFY_PLAYLIST_ID = 'YOUR_PLAYLIST_ID'; // Replace with your Spotify Playlist ID

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

const playlistCategorySelect = document.getElementById('playlist-category');
const playlistContainer = document.getElementById('playlist-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Function to fetch and display playlists from YouTube
async function fetchYouTubePlaylists() {
    loadingSpinner.classList.remove('hidden');
    playlistContainer.innerHTML = '';
    
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch YouTube playlists');//error handling
        const data = await response.json();//handling responses
        console.log(data);

        data.items.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${playlist.snippet.thumbnails.default.url}" alt="${playlist.snippet.title}">
                <h2>${playlist.snippet.title}</h2>
                <a href="https://youtube.com/playlist?list=${playlist.id}" target="_blank">Watch Now</a>
            `;
            playlistContainer.appendChild(playlistItem);
        });
    } catch (error) {
        console.error('Error fetching YouTube playlists:', error);
        playlistContainer.innerHTML = '<p>Failed to load YouTube playlists. Please try again later.</p>';
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// Function to fetch and display playlists from SoundCloud
async function fetchSoundCloudPlaylists() {
    loadingSpinner.classList.remove('hidden');
    playlistContainer.innerHTML = '';

    try {
        const response = await fetch(`https://api.soundcloud.com/playlists?client_id=${SOUNDCLOUD_CLIENT_ID}`);
        if (!response.ok) throw new Error('Failed to fetch SoundCloud playlists');
        const data = await response.json();

        data.collection.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${playlist.artwork_url || 'https://via.placeholder.com/250'}" alt="${playlist.title}">
                <h2>${playlist.title}</h2>
                <a href="${playlist.permalink_url}" target="_blank">Listen Now</a>
            `;
            playlistContainer.appendChild(playlistItem);
        });
    } catch (error) {
        console.error('Error fetching SoundCloud playlists:', error);
        playlistContainer.innerHTML = '<p>Failed to load SoundCloud playlists. Please try again later.</p>';
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// Function to fetch and display playlists from Spotify
async function fetchSpotifyPlaylists() {
    loadingSpinner.classList.remove('hidden');
    playlistContainer.innerHTML = '';

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST_ID}`, {
            headers: {
                'Authorization': `Bearer ${SPOTIFY_ACCESS_TOKEN}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch Spotify playlists');
        const data = await response.json();

        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <img src="${data.images[0]?.url || 'https://via.placeholder.com/250'}" alt="${data.name}">
            <h2>${data.name}</h2>
            <a href="${data.external_urls.spotify}" target="_blank">Listen Now</a>
        `;
        playlistContainer.appendChild(playlistItem);
    } catch (error) {
        console.error('Error fetching Spotify playlists:', error);
        playlistContainer.innerHTML = '<p>Failed to load Spotify playlists. Please try again later.</p>';
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// Function to update playlists based on selected category
function updatePlaylists() {
    const category = playlistCategorySelect.value;

    switch (category) {
        case 'youtube':
            fetchYouTubePlaylists();
            break;
        case 'soundcloud':
            fetchSoundCloudPlaylists();
            break;
        case 'spotify':
            fetchSpotifyPlaylists();
            break;
        default:
            playlistContainer.innerHTML = '<p>Select a category to load playlists.</p>';
    }
}

// Initial load
updatePlaylists();

// Event listener for category change
playlistCategorySelect.addEventListener('change', updatePlaylists);

// Auto-refresh every 10 minutes
setInterval(updatePlaylists, REFRESH_INTERVAL);
