import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/C.css';

// Import your images
import birthday1Front from '../assets/C_themes/birthday-1/front.png';
import birthday1Inside from '../assets/C_themes/birthday-1/inside.png';
import birthday2Front from '../assets/C_themes/birthday-2/front.png';
import birthday2Inside from '../assets/C_themes/birthday-2/inside.png';
import bearsFront from '../assets/C_themes/bears/front.png';
import bearsInside from '../assets/C_themes/bears/inside.png';
// Import music file
import birthdayMusic from '../assets/C_music/birthday-1.mp3';
import goodvibesMusic from '../assets/C_music/good-vibes.mp3';

const themes = [
  { 
    id: 'birthday-1', 
    name: 'Birthday - 1',
    frontImage: birthday1Front,
    insideImage: birthday1Inside
  },
  { 
    id: 'birthday-2', 
    name: 'Birthday - 2',
    frontImage: birthday2Front,
    insideImage: birthday2Inside
  },
  { 
    id: 'bears', 
    name: 'Bears',
    frontImage: bearsFront,
    insideImage: bearsInside
  }
];

const musicTracks = [
  { id: 'birthday-1', name: 'Happy Birthday', src: birthdayMusic},
  { id: 'goodvibes', name: 'Good Vibes', src: goodvibesMusic},
];

const MAX_CHARACTERS = 200; // You can adjust this number as needed

const C = () => {
  const [cardData, setCardData] = useState({
    content: '',
    theme: 'birthday-1',
    music: 'birthday-1',
    isPreviewOpen: false,
    isPlaying: false,
    isSaved: false,
    saveError: null,
  });

  // Add refs for the card preview
  const cardPreviewRef = useRef(null);

  // Add audio element reference
  const audioRef = useRef(null);

  // Get current theme configuration
  const currentTheme = themes.find(theme => theme.id === cardData.theme);
  // Get current music track
  const currentMusic = musicTracks.find(track => track.id === cardData.music);

  // Helper function to convert an image to a data URL
  const convertImageToDataURL = async (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.error('Error loading image:', imagePath);
        // Fallback to a colored background if image loading fails
        resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
      };
      img.src = imagePath;
    });
  };

  // Helper function to convert an audio file to a data URL
  const convertAudioToDataURL = async (audioPath) => {
    try {
      const response = await fetch(audioPath);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting audio to data URL:', error);
      // Return a placeholder or empty audio data URL
      return 'data:audio/mp3;base64,';
    }
  };

  // Function to toggle audio playback in preview
  const toggleAudio = (e) => {
    e.stopPropagation();
    if (cardData.isPlaying) {
      audioRef.current.pause();
      setCardData({ ...cardData, isPlaying: false });
    } else {
      // Set volume to 0.05 (5% of full volume) before playing
      audioRef.current.volume = 0.05;
      audioRef.current.play().catch(error => {
        console.log('Play prevented:', error);
      });
      setCardData({ ...cardData, isPlaying: true });
    }
  };

  // Function to save the card as an interactive HTML file
  const handleSaveAsInteractive = async () => {
    try {
      console.log("Save Card button clicked"); // Debug log
      
      // Get the current theme configuration
      const currentTheme = themes.find(theme => theme.id === cardData.theme);
      
      // Get current music track
      const currentMusic = musicTracks.find(track => track.id === cardData.music);
      
      // Convert images to data URLs
      const frontImageDataUrl = await convertImageToDataURL(currentTheme.frontImage);
      const insideImageDataUrl = await convertImageToDataURL(currentTheme.insideImage);
      
      // Convert music file to data URL
      const musicDataUrl = await convertAudioToDataURL(currentMusic.src);
      
      // Create the HTML content
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Melody - Interactive Card</title>
  <!-- Fallback font from Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Winky+Sans:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
  <style>
    :root {
      --gradient-pink: #ff77e9;
      --gradient-yellow: #ffd700;
      --dark-bg: #1a1a2e;
      --card-bg: #16213e;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: var(--dark-bg);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    
    .preview-card {
      width: 330px;
      height: 510px;
      position: relative;
      perspective: 1500px;
      margin-top: 1rem;
      transform-style: preserve-3d;
    }
    
    .preview-card-front {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(var(--dark-bg), var(--dark-bg)) padding-box,
        linear-gradient(
          45deg,
          var(--gradient-pink),
          var(--gradient-yellow)
        )
        border-box;
      border: 2px solid transparent;
      border-radius: 1rem;
      transform-origin: left;
      transition: transform 1s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    
    .preview-card.open .preview-card-front {
      transform: rotateY(-120deg);
    }
    
    .preview-card-inside {
      position: absolute;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 1rem;
      padding: 0;
      color: #333;
      opacity: 0;
      transition: opacity 0.5s ease;
      transform-style: preserve-3d;
      box-sizing: border-box;
      border: 2px solid transparent;
      overflow: hidden;
    }
    
    .card-front-image,
    .card-inside-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    
    .card-letter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2rem;
      border-radius: 1rem;
      width: 80%;
      max-height: 80%;
      overflow-y: auto;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.5s ease;
      box-sizing: border-box;
    }
    
    .preview-card.open .card-letter {
      opacity: 1;
    }
    
    .card-prompt {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.5);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      color: white;
      backdrop-filter: blur(4px);
      z-index: 5000;
      transition: all 0.3s ease;
      min-width: 100px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      pointer-events: auto !important;
      /* Button specific styles */
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .card-prompt:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: translateX(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .preview-card.open .card-prompt {
      display: none;
    }
    
    .close-prompt {
      bottom: 20px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 1000;
      pointer-events: auto !important;
      opacity: 0;
    }

    .open-prompt {
      bottom: 20px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 1000;
      pointer-events: auto !important;
    }
    
    .preview-card.open .close-prompt {
      opacity: 1;
      display: block;
    }
    
    .close-prompt:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: translateX(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .card-content {
      color: #000;
      font-family: "Winky Sans", sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      white-space: pre-wrap;
      text-align: center;
      width: 100%;
      text-indent: 0;
      margin: 0;
      padding: 0;
      display: block;
      -webkit-text-indent: 0;
      text-indent: 0 !important;
    }
    
    /* Fix for potential paragraph issues */
    .card-content p {
      text-indent: 0;
      margin: 0;
      padding: 0;
    }
    
    .gradient-bg {
      background: linear-gradient(
        135deg,
        var(--gradient-pink),
        var(--gradient-yellow)
      );
      opacity: 0.15;
      filter: blur(100px);
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      z-index: -1;
    }

    /* Ensure only buttons are clickable */
    .preview-card-front, .preview-card-inside, .card-letter, .card-content, .card-front-image, .card-inside-image {
      pointer-events: none !important;
    }
    
    .card-prompt {
      cursor: pointer !important;
      pointer-events: auto !important;
    }

    .preview-card.open .preview-card-inside {
      opacity: 1;
    }
    
    /* Audio control styles */
    .audio-controls {
      position: absolute;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      gap: 10px;
      opacity: 1;
      transition: opacity 0.3s ease;
      pointer-events: auto !important;
    }
    
    .audio-button {
      background: rgba(0, 0, 0, 0.15);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      pointer-events: auto !important;
      position: relative;
    }
    
    .audio-button:hover {
      background: rgba(0, 0, 0, 0.3);
      transform: scale(1.1);
    }

    /* Music play message styles */
    .music-play-message {
      font-family: "Winky Sans", sans-serif;
      position: relative;
      margin-bottom: 1rem;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 1.2rem;
      color: white;
      backdrop-filter: blur(4px);
      z-index: 5000;
      transition: all 0.3s ease;
      text-align: center;
      pointer-events: none;
      display: none;
    }
  </style>
</head>
<body>
  <div class="gradient-bg"></div>
  <div class="container">
    <div class="music-play-message" id="music-play-message">Click anywhere to play music</div>
    
    <div class="preview-card" id="interactive-card" style="margin: auto;">
      <div class="preview-card-front">
        <img 
          src="${frontImageDataUrl}" 
          alt="${currentTheme.name} card front"
          class="card-front-image"
        />
      </div>
      
      <button class="card-prompt" id="open-button">Open Card</button>
      
      <!-- Audio controls moved outside of preview-card-inside -->
      <div class="audio-controls">
        <button class="audio-button" id="toggle-audio">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
          </svg>
        </button>
      </div>
      
      <div class="preview-card-inside">
        <img 
          src="${insideImageDataUrl}" 
          alt="${currentTheme.name} card inside"
          class="card-inside-image"
        />
        <div class="card-letter">
          <div class="card-content">${cardData.content || 'Your message will appear here...'}</div>
        </div>
        <button class="card-prompt close-prompt" id="close-button">Close Card</button>
      </div>
    </div>
  </div>

  <!-- Hidden audio element -->
  <audio id="background-music" loop autoplay>
    <source src="${musicDataUrl}" type="audio/mp3">
    Your browser does not support the audio element.
  </audio>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const card = document.getElementById('interactive-card');
      const openButton = document.getElementById('open-button');
      const closeButton = document.getElementById('close-button');
      const audio = document.getElementById('background-music');
      const toggleAudioButton = document.getElementById('toggle-audio');
      const musicPlayMessage = document.getElementById('music-play-message');
      let isMusicPlaying = false;
      
      // Function to play music
      function playMusic() {
        if (!isMusicPlaying) {
          audio.volume = 0.05; // Set volume to 5%
          audio.play().then(() => {
            console.log('Audio started playing');
            isMusicPlaying = true;
            updateAudioButtonIcon();
            // Hide the message after music starts playing
            musicPlayMessage.style.display = 'none';
          }).catch(error => {
            console.log('Play prevented:', error);
            // Show message if autoplay was prevented
            musicPlayMessage.style.display = 'block';
          });
        }
      }
      
      // Try to autoplay immediately when the page loads
      playMusic();
      
      // Add click event listener to the entire document as fallback
      document.addEventListener('click', function() {
        playMusic();
      }, { once: true });
      
      // Open card when clicking open button only
      openButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Open button clicked');
        card.classList.add('open');
      });
      
      // Close card when clicking close button
      closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Close button clicked');
        card.classList.remove('open');
      });
      
      // Toggle audio play/pause
      toggleAudioButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMusicPlaying) {
          audio.pause();
          isMusicPlaying = false;
        } else {
          // Set volume to 0.05 (5% of full volume) before playing
          audio.volume = 0.05;
          audio.play().catch(error => {
            console.log('Play prevented:', error);
          });
          isMusicPlaying = true;
        }
        updateAudioButtonIcon();
      });
      
      // Update audio button icon based on play state
      function updateAudioButtonIcon() {
        if (isMusicPlaying) {
          toggleAudioButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
        } else {
          toggleAudioButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
        }
      }

      // Add these styles to make only buttons clickable
      document.head.insertAdjacentHTML('beforeend', 
        '<style>' +
        '.preview-card-front, .preview-card-inside, .card-letter, .card-content, .card-front-image, .card-inside-image {' +
        '  pointer-events: none !important;' +
        '}' +
        '.card-prompt, .audio-button {' +
        '  cursor: pointer !important;' +
        '  pointer-events: auto !important;' +
        '}' +
        '</style>'
      );
      
      // Make sure audio controls are always visible and clickable
      const audioControls = document.querySelector('.audio-controls');
      if (audioControls) {
        audioControls.style.opacity = '1';
        audioControls.style.pointerEvents = 'auto';
      }
      
      // Add event listener for when card is opened/closed to adjust audio controls position
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            const isOpen = card.classList.contains('open');
          }
        });
      });
      
      observer.observe(card, { attributes: true });
    });
  </script>
</body>
</html>
      `;
      
      console.log("Creating download link"); // Debug log
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Check if the device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile devices, try to download using a more compatible approach
        console.log("Mobile device detected, attempting to download");
        
        // Create a temporary link element with download attribute
        const link = document.createElement('a');
        link.href = url;
        link.download = 'card-melody.html';
        link.target = '_blank';
        
        // Add a message to inform the user
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.zIndex = '9999';
        message.style.textAlign = 'center';
        message.style.maxWidth = '80%';
        message.innerHTML = `
          <p>If the download doesn't start automatically:</p>
          <ol style="text-align: left;">
            <li>Open the card in the new tab</li>
            <li>Use your browser's menu (three dots)</li>
            <li>Select "Download" or "Save page as"</li>
          </ol>
          <button id="close-message" style="margin-top: 10px; padding: 5px 10px; background: #ff77e9; border: none; border-radius: 5px; color: white;">Got it</button>
        `;
        
        // Add the message to the page
        document.body.appendChild(message);
        
        // Add event listener to close the message
        document.getElementById('close-message').addEventListener('click', () => {
          document.body.removeChild(message);
        });
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // For desktop, download the file
        console.log("Desktop device detected, downloading file");
        const a = document.createElement('a');
        a.href = url;
        a.download = 'card-melody.html';
        document.body.appendChild(a);
        
        console.log("Triggering download"); // Debug log
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      }
      
      // Update state to indicate successful save
      setCardData(prev => ({
        ...prev,
        isSaved: true,
        saveError: null
      }));
      
      console.log("Card saved successfully"); // Debug log
    } catch (error) {
      console.error("Error saving card:", error);
      setCardData(prev => ({
        ...prev,
        saveError: 'Failed to save card. Please try again.'
      }));
    }
  };

  // Function to open card in full screen mode
  const openFullScreenCard = async () => {
    try {
      // Get the current theme configuration
      const currentTheme = themes.find(theme => theme.id === cardData.theme);
      
      // Get current music track
      const currentMusic = musicTracks.find(track => track.id === cardData.music);
      
      // Convert images to data URLs
      const frontImageDataUrl = await convertImageToDataURL(currentTheme.frontImage);
      const insideImageDataUrl = await convertImageToDataURL(currentTheme.insideImage);
      
      // Convert music file to data URL
      const musicDataUrl = await convertAudioToDataURL(currentMusic.src);
      
      // Create the HTML content (same HTML template as before)
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Melody - Interactive Card</title>
  <!-- Fallback font from Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Winky+Sans:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
  <style>
    :root {
      --gradient-pink: #ff77e9;
      --gradient-yellow: #ffd700;
      --dark-bg: #1a1a2e;
      --card-bg: #16213e;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: var(--dark-bg);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    
    .preview-card {
      width: 330px;
      height: 510px;
      position: relative;
      perspective: 1500px;
      margin-top: 1rem;
      transform-style: preserve-3d;
    }
    
    .preview-card-front {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(var(--dark-bg), var(--dark-bg)) padding-box,
        linear-gradient(
          45deg,
          var(--gradient-pink),
          var(--gradient-yellow)
        )
        border-box;
      border: 2px solid transparent;
      border-radius: 1rem;
      transform-origin: left;
      transition: transform 1s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    
    .preview-card.open .preview-card-front {
      transform: rotateY(-120deg);
    }
    
    .preview-card-inside {
      position: absolute;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 1rem;
      padding: 0;
      color: #333;
      opacity: 0;
      transition: opacity 0.5s ease;
      transform-style: preserve-3d;
      box-sizing: border-box;
      border: 2px solid transparent;
      overflow: hidden;
    }
    
    .card-front-image,
    .card-inside-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    
    .card-letter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2rem;
      border-radius: 1rem;
      width: 80%;
      max-height: 80%;
      overflow-y: auto;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.5s ease;
      box-sizing: border-box;
    }
    
    .preview-card.open .card-letter {
      opacity: 1;
    }
    
    .card-prompt {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.5);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      color: white;
      backdrop-filter: blur(4px);
      z-index: 5000;
      transition: all 0.3s ease;
      min-width: 100px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      pointer-events: auto !important;
      /* Button specific styles */
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .card-prompt:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: translateX(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .preview-card.open .card-prompt {
      display: none;
    }
    
    .close-prompt {
      bottom: 20px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 1000;
      pointer-events: auto !important;
      opacity: 0;
    }

    .open-prompt {
      bottom: 20px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 1000;
      pointer-events: auto !important;
    }
    
    .preview-card.open .close-prompt {
      opacity: 1;
      display: block;
    }
    
    .close-prompt:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: translateX(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .card-content {
      color: #000;
      font-family: "Winky Sans", sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      white-space: pre-wrap;
      text-align: center;
      width: 100%;
      text-indent: 0;
      margin: 0;
      padding: 0;
      display: block;
      -webkit-text-indent: 0;
      text-indent: 0 !important;
    }
    
    /* Fix for potential paragraph issues */
    .card-content p {
      text-indent: 0;
      margin: 0;
      padding: 0;
    }
    
    .gradient-bg {
      background: linear-gradient(
        135deg,
        var(--gradient-pink),
        var(--gradient-yellow)
      );
      opacity: 0.15;
      filter: blur(100px);
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      z-index: -1;
    }

    /* Ensure only buttons are clickable */
    .preview-card-front, .preview-card-inside, .card-letter, .card-content, .card-front-image, .card-inside-image {
      pointer-events: none !important;
    }
    
    .card-prompt {
      cursor: pointer !important;
      pointer-events: auto !important;
    }

    .preview-card.open .preview-card-inside {
      opacity: 1;
    }
    
    /* Audio control styles */
    .audio-controls {
      position: absolute;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      gap: 10px;
      opacity: 1;
      transition: opacity 0.3s ease;
      pointer-events: auto !important;
    }
    
    .audio-button {
      background: rgba(0, 0, 0, 0.15);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      pointer-events: auto !important;
      position: relative;
    }
    
    .audio-button:hover {
      background: rgba(0, 0, 0, 0.3);
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div class="gradient-bg"></div>
  <div class="container">
    
    <div class="preview-card" id="interactive-card" style="margin: auto;">
      <div class="preview-card-front">
        <img 
          src="${frontImageDataUrl}" 
          alt="${currentTheme.name} card front"
          class="card-front-image"
        />
      </div>
      
      <button class="card-prompt" id="open-button">Open Card</button>
      
      <!-- Audio controls moved outside of preview-card-inside -->
      <div class="audio-controls">
        <button class="audio-button" id="toggle-audio">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
          </svg>
        </button>
      </div>
      
      <div class="preview-card-inside">
        <img 
          src="${insideImageDataUrl}" 
          alt="${currentTheme.name} card inside"
          class="card-inside-image"
        />
        <div class="card-letter">
          <div class="card-content">${cardData.content || 'Your message will appear here...'}</div>
        </div>
        <button class="card-prompt close-prompt" id="close-button">Close Card</button>
      </div>
    </div>
  </div>

  <!-- Hidden audio element -->
  <audio id="background-music" loop autoplay>
    <source src="${musicDataUrl}" type="audio/mp3">
    Your browser does not support the audio element.
  </audio>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const card = document.getElementById('interactive-card');
      const openButton = document.getElementById('open-button');
      const closeButton = document.getElementById('close-button');
      const audio = document.getElementById('background-music');
      const toggleAudioButton = document.getElementById('toggle-audio');
      let isMusicPlaying = false;
      
      // Function to play music
      function playMusic() {
        if (!isMusicPlaying) {
          audio.volume = 0.05; // Set volume to 5%
          audio.play().then(() => {
            console.log('Audio started playing');
            isMusicPlaying = true;
            updateAudioButtonIcon();
          }).catch(error => {
            console.log('Play prevented:', error);
          });
        }
      }
      
      // Try to autoplay immediately when the page loads
      playMusic();
      
      // Add click event listener to the entire document as fallback
      document.addEventListener('click', function() {
        playMusic();
      }, { once: true });
      
      // Open card when clicking open button only
      openButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Open button clicked');
        card.classList.add('open');
      });
      
      // Close card when clicking close button
      closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Close button clicked');
        card.classList.remove('open');
      });
      
      // Toggle audio play/pause
      toggleAudioButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMusicPlaying) {
          audio.pause();
          isMusicPlaying = false;
        } else {
          // Set volume to 0.05 (5% of full volume) before playing
          audio.volume = 0.05;
          audio.play().catch(error => {
            console.log('Play prevented:', error);
          });
          isMusicPlaying = true;
        }
        updateAudioButtonIcon();
      });
      
      // Update audio button icon based on play state
      function updateAudioButtonIcon() {
        if (isMusicPlaying) {
          toggleAudioButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
        } else {
          toggleAudioButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
        }
      }

      // Add these styles to make only buttons clickable
      document.head.insertAdjacentHTML('beforeend', 
        '<style>' +
        '.preview-card-front, .preview-card-inside, .card-letter, .card-content, .card-front-image, .card-inside-image {' +
        '  pointer-events: none !important;' +
        '}' +
        '.card-prompt, .audio-button {' +
        '  cursor: pointer !important;' +
        '  pointer-events: auto !important;' +
        '}' +
        '</style>'
      );
      
      // Make sure audio controls are always visible and clickable
      const audioControls = document.querySelector('.audio-controls');
      if (audioControls) {
        audioControls.style.opacity = '1';
        audioControls.style.pointerEvents = 'auto';
      }
      
      // Add event listener for when card is opened/closed to adjust audio controls position
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            const isOpen = card.classList.contains('open');
          }
        });
      });
      
      observer.observe(card, { attributes: true });
    });
  </script>
</body>
</html>
      `;
      
      console.log("Creating download link"); // Debug log
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Check if the device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile devices, use a more reliable method to open in a new tab
        console.log("Mobile device detected, opening in new tab");
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // For desktop, use the original method
        console.log("Desktop device detected, opening in new tab");
        const newWindow = window.open(url, '_blank');
        
        // Clean up the URL after the window loads
        if (newWindow) {
          newWindow.addEventListener('load', () => {
            URL.revokeObjectURL(url);
          });
        }
      }
      
    } catch (error) {
      console.error("Error opening full screen card:", error);
      setCardData(prev => ({
        ...prev,
        saveError: 'Failed to open card in full screen. Please try again.'
      }));
    }
  };

  // Add this function to handle content changes with character limit
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARACTERS) {
      setCardData({ ...cardData, content: newContent });
      console.log("Content updated:", newContent); // Debug log
    }
  };

  return (
    <div className="container">
      {/* Audio element for preview */}
      <audio ref={audioRef} src={currentMusic.src} loop />
      
      <div className="gradient-bg"></div>
      <div className="project-page">
        <div className="project-header">
          <Link to="/" className="back-button">← Back to Home</Link>
          <div className="project-title-container">
            <h1 className="project-title">Card Melody</h1>
            <p className="project-description">A digital card that sings from the heart 🎵</p>
          </div>
        </div>

        <div className="card-melody-container">
          {/* Left side - Card Customization */}
          <div className="card-customization">
            <div className="customization-section">
              <h3>Card Content</h3>
              <div className="textarea-container">
                <textarea
                  className="card-content-input"
                  placeholder="Write your heartfelt message here..."
                  value={cardData.content}
                  onChange={handleContentChange}
                  rows={6}
                  maxLength={MAX_CHARACTERS}
                />
                <div className="character-count">
                  {cardData.content.length}/{MAX_CHARACTERS} characters
                </div>
              </div>
            </div>

            <div className="customization-section">
              <h3>Choose Theme</h3>
              <div className="select-wrapper">
                <select
                  className="custom-select"
                  value={cardData.theme}
                  onChange={(e) => setCardData({ ...cardData, theme: e.target.value })}
                >
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="customization-section">
              <h3>Choose Music</h3>
              <div className="select-wrapper">
                <select
                  className="custom-select"
                  value={cardData.music}
                  onChange={(e) => {
                    const newMusic = e.target.value;
                    setCardData({ ...cardData, music: newMusic, isPlaying: true });
                  }}
                >
                  {musicTracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Save Button moved to the left box */}
            <div className="save-button-container">
              <button 
                className="save-button save-interactive-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveAsInteractive();
                }}
                disabled={!cardData.content || cardData.content.trim() === ''}
              >
                Save Card
              </button>
              
              {cardData.saveError && (
                <div className="error-message">{cardData.saveError}</div>
              )}
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="card-preview">
            <h3>Preview</h3>
            <div 
              ref={cardPreviewRef}
              className={`preview-card ${cardData.theme} ${cardData.isPreviewOpen ? 'open' : ''}`}
            >
              <div 
                className="preview-card-front"
                onClick={() => {
                  console.log("Card front clicked, opening card");
                  // Try to auto-play music when card is opened
                  audioRef.current.volume = 0.05; // Set volume to 5%
                  audioRef.current.play().catch(error => {
                    console.log('Auto-play prevented. Click the sound button to play music.');
                  });
                  setCardData({ ...cardData, isPreviewOpen: true, isPlaying: true });
                }}
              >
                <img 
                  src={currentTheme.frontImage} 
                  alt={`${currentTheme.name} card front`}
                  className="card-front-image"
                />
              </div>
              
              {!cardData.isPreviewOpen && (
                <button 
                  className="card-prompt open-prompt"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Open button clicked");
                    setCardData({ ...cardData, isPreviewOpen: true });
                  }}
                >
                  Open Card
                </button>
              )}
              
              <div className="audio-controls">
                <button 
                  className="audio-button" 
                  onClick={toggleAudio}
                >
                  {cardData.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ opacity: 0.3 }}>
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ opacity: 0.3 }}>
                      <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                      <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                      <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="preview-card-inside" style={{ transform: 'none' }}>
                <img 
                  src={currentTheme.insideImage} 
                  alt={`${currentTheme.name} card inside`}
                  className="card-inside-image"
                />
                <div className="card-letter">
                  <div className="card-content">
                    {cardData.content || 'Your message will appear here...'}
                  </div>
                </div>
                {cardData.isPreviewOpen && (
                  <>
                    <button 
                      className="card-prompt close-prompt" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Close button clicked");
                        // Don't pause music when card is closed
                        setCardData({ ...cardData, isPreviewOpen: false });
                      }}
                    >
                      Close Card
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Full Screen Button */}
            <div className="fullscreen-button-container">
              <button 
                className="fullscreen-button"
                onClick={openFullScreenCard}
                disabled={!cardData.content || cardData.content.trim() === ''}
              >
                View Full Screen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C; 