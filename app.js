document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const extractBtn = document.getElementById('extractBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

    // Robust Youtube ID Extractor (Shorts, Standard, & Mobile Links)
    const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const processExtraction = () => {
        const url = urlInput.value.trim();
        const videoID = getYouTubeID(url);

        if (!videoID) {
            errorMessage.classList.remove('hidden');
            resultsSection.classList.add('hidden');
            return;
        }

        errorMessage.classList.add('hidden');
        resultsSection.innerHTML = ''; 
        resultsSection.classList.remove('hidden');

        // 3 Exact Qualities in Descending Order
        const qualities = [
            { title: 'High Quality (HD - 1280x720)', key: 'maxresdefault' },
            { title: 'Medium Quality (SD - 640x480)', key: 'sddefault' },
            { title: 'Normal Quality (MQ - 480x360)', key: 'hqdefault' }
        ];

        qualities.forEach(q => {
            const imgUrl = `https://img.youtube.com/vi/${videoID}/${q.key}.jpg`;
            
            const card = document.createElement('div');
            card.className = 'thumbnail-card glass-card';
            card.innerHTML = `
                <div class="badge">${q.title}</div>
                <div class="img-wrapper">
                    <img src="${imgUrl}" alt="${q.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${videoID}/hqdefault.jpg'">
                </div>
                <a href="${imgUrl}" target="_blank" download="Thumbnail_${videoID}.jpg" class="download-link">
                    Download Thumbnail
                </a>
            `;
            resultsSection.appendChild(card);
        });
    };

    extractBtn.addEventListener('click', processExtraction);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processExtraction();
    });
});
