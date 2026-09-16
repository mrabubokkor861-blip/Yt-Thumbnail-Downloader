window.addEventListener('DOMContentLoaded', () => {
    const originalBtn = document.getElementById('downloadBtn');
    if (!originalBtn) return;

    // নতুন একটি রিসেট বা রিফ্রেশ বাটন নিচে তৈরি করে যুক্ত করা
    const container = originalBtn.parentElement;
    const resetBtn = document.createElement('button');
    resetBtn.id = 'resetBtn';
    resetBtn.innerText = '🔄 নতুন থাম্বনেইল নিন';
    resetBtn.style.cssText = 'background: #ef4444; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; width: 100%; display: none;';
    container.appendChild(resetBtn);

    originalBtn.addEventListener('click', async (e) => {
        // ডিফল্ট কাজ আটকিয়ে সরাসরি ব্লব ফেচ করে ডাউনলোড করা
        setTimeout(async () => {
            const img = document.querySelector('#thumbnailContainer img') || document.querySelector('.thumbnail-preview img');
            if (!img) return;
            const imageUrl = img.src;

            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'youtube-thumbnail.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
                
                // ডাউনলোড সফল হলে রিসেট বাটন দেখাবে
                resetBtn.style.display = 'block';
            } catch (err) {
                window.open(imageUrl, '_blank');
            }
        }, 500);
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('urlInput').value = '';
        const thumbContainer = document.getElementById('thumbnailContainer');
        if (thumbContainer) thumbContainer.innerHTML = '';
        resetBtn.style.display = 'none';
    });
});
