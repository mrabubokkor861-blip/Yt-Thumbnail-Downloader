document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const extractBtn = document.getElementById('extractBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

    // Advanced Parser for all YT Link types (watch?v=, youtu.be, shorts)
    const extractVideoID = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Verify if Thumbnail actually exists (YT returns a 120px gray placeholder if it fails)
    const verifyImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.width > 120 ? url : null);
            img.onerror = () => resolve(null);
            img.src = url;
        });
    };

    const handleExtraction = async () => {
        const url = urlInput.value.trim();
        const videoID = extractVideoID(url);

        if (!videoID) {
            errorMessage.classList.remove('hidden');
            resultsSection.classList.add('hidden');
            return;
        }

        errorMessage.classList.add('hidden');
        resultsSection.innerHTML = ''; // Clear previous results
        resultsSection.classList.remove('hidden');

        // Quality mappings based on standard YouTube API structure
        const qualities = [
            { label: 'High Quality (HD - 1280x720)', id: 'maxresdefault' },
            { label: 'Medium Quality (SD - 640x480)', id: 'sddefault' },
            { label: 'Normal Quality (MQ - 480x360)', id: 'hqdefault' }
        ];

        // Process and inject cards efficiently
        for (const quality of qualities) {
            const imgUrl = `https://i.ytimg.com/vi/${videoID}/${quality.id}.jpg`;
            const validUrl = await verifyImage(imgUrl);
            
            if (validUrl) {
                const card = document.createElement('div');
                card.className = 'thumbnail-card glass-panel';
                card.innerHTML = `
                    <div class="quality-badge">${quality.label}</div>
                    <div class="img-container">
                        <img src="${validUrl}" alt="YouTube Thumbnail - ${quality.label}" loading="lazy">
                    </div>
                    <button class="download-btn" onclick="triggerDownload('${validUrl}', 'YT_Thumbnail_${videoID}_${quality.id}.jpg')">
                        Download Thumbnail
                    </button>
                `;
                resultsSection.appendChild(card);
            }
        }
    };

    // Event Listeners
    extractBtn.addEventListener('click', handleExtraction);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleExtraction();
    });
});

// Robust cross-origin download logic 
// Attempts a direct force-download, falls back to a clean new tab view if CORS blocks it
window.triggerDownload = async (url, filename) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        // Fallback for strict browser CORS implementations
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};