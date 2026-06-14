document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const apiKeyInput = document.getElementById('apiKey');
  const videoIdInput = document.getElementById('videoId');
  const submitBtn = document.getElementById('submit-btn');
  const loadingDiv = document.getElementById('loading');
  
  const successCard = document.getElementById('success-card');
  const errorCard = document.getElementById('error-card');
  
  const songTitleEl = document.getElementById('song-title');
  const downloadUrlEl = document.getElementById('download-url');
  const errorMessageEl = document.getElementById('error-message');
  const qualityDisplayEl = document.getElementById('quality-display');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    const videoId = videoIdInput.value.trim();
    
    // Get selected quality
    let quality = "128";
    const qualityOptions = document.getElementsByName('quality');
    for (let option of qualityOptions) {
      if (option.checked) {
        quality = option.value;
        break;
      }
    }

    if (!apiKey) {
      showError("Please enter your RapidAPI Key.");
      return;
    }
    
    if (!videoId) {
      showError("Please enter a Video ID.");
      return;
    }

    // Reset UI
    successCard.style.display = 'none';
    errorCard.style.display = 'none';
    loadingDiv.style.display = 'block';
    submitBtn.disabled = true;

    try {
      const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${encodeURIComponent(videoId)}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      const data = await response.json();

      loadingDiv.style.display = 'none';
      submitBtn.disabled = false;

      if (data.status === 'ok') {
        let safeLink = '#';
        if (data.link) {
          try {
            const urlObj = new URL(data.link);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
              safeLink = urlObj.href;
            }
          } catch (e) {
            // Invalid URL
          }
        }
        showSuccess(data.title, safeLink, quality);
      } else {
        showError(data.msg || 'Conversion failed. Please check the Video ID or API Key.');
      }
    } catch (error) {
      loadingDiv.style.display = 'none';
      submitBtn.disabled = false;
      showError("An error occurred while fetching the data. " + error.message);
    }
  });

  function showSuccess(title, link, quality) {
    successCard.style.display = 'block';
    errorCard.style.display = 'none';
    
    songTitleEl.textContent = title;
    downloadUrlEl.href = link;
    qualityDisplayEl.textContent = `${quality} kbps`;
  }

  function showError(message) {
    errorCard.style.display = 'block';
    successCard.style.display = 'none';
    
    errorMessageEl.textContent = message;
  }
});
