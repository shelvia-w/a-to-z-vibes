import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/M.css';

// Import background music
import backgroundMusic from '../assets/M_music/bgm.mp3';

// Define candle themes as constants
const candleThemes = {
    white: {
        name: 'White',
        flame: '#FF4500',
        path: 'M_candles/white'
    }
    // Add more themes here when available
};

const M = () => {
    // Combine all state into a single object
    const [state, setState] = useState({
        age: '',
        cakeDesign: 'chocolate',
        candleTheme: 'white',
        candlesLit: false,
        isBlown: false,
        isMusicPlaying: false,
        isMuted: false,
        isMicrophoneReady: false,
        currentVolume: 0
    });

    const [numberImages, setNumberImages] = useState({});
    const [cakeImage, setCakeImage] = useState(null);
    const audioRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const volumeIntervalRef = useRef(null);

    // Load cake image when design changes
    useEffect(() => {
        const loadCakeImage = async () => {
            try {
                const image = await import(`../assets/M_cakes/${state.cakeDesign}.png`);
                setCakeImage(image.default);
            } catch (error) {
                console.error(`Error loading cake image for ${state.cakeDesign}:`, error);
            }
        };

        loadCakeImage();
    }, [state.cakeDesign]);

    // Define playMusic with useCallback to avoid dependency issues
    const playMusic = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play().then(() => {
                setState(prev => ({ ...prev, isMusicPlaying: true }));
            }).catch(error => {
                console.log('Play prevented:', error);
            });
        }
    }, []);

    // Initialize background music
    useEffect(() => {
        // Define handleUserInteraction in the outer scope
        const handleUserInteraction = () => {
            playMusic();
            // Remove event listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        // Try to autoplay immediately
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play().then(() => {
                console.log('Audio started playing automatically');
                setState(prev => ({ ...prev, isMusicPlaying: true }));
            }).catch(error => {
                console.log('Initial autoplay prevented:', error);
                // If autoplay fails, set up click/keydown listeners as fallback
                document.addEventListener('click', handleUserInteraction);
                document.addEventListener('keydown', handleUserInteraction);
            });
        }

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, [playMusic]); // Add playMusic as a dependency

    // Add a separate effect to handle music state changes
    useEffect(() => {
        if (audioRef.current) {
            if (state.isMusicPlaying) {
                audioRef.current.play().catch(error => {
                    console.log('Play prevented:', error);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [state.isMusicPlaying]);

    // Load number images when theme changes
    useEffect(() => {
        const loadNumberImages = async () => {
            const images = {};
            for (let i = 0; i <= 9; i++) {
                try {
                    const image = await import(`../assets/${candleThemes[state.candleTheme].path}/${i}.png`);
                    images[i] = image.default;
                } catch (error) {
                    console.error(`Error loading number image ${i}:`, error);
                }
            }
            setNumberImages(images);
        };

        loadNumberImages();
    }, [state.candleTheme]);

    // Add cleanup for microphone when component unmounts
    useEffect(() => {
        return () => {
            // Clear interval
            if (volumeIntervalRef.current) {
                clearInterval(volumeIntervalRef.current);
                volumeIntervalRef.current = null;
            }
            
            // Stop all tracks in the media stream
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                });
                mediaStreamRef.current = null;
            }
            
            // Reset microphone ready state
            setState(prev => ({ ...prev, isMicrophoneReady: false }));
        };
    }, []);

    const handleReadyToBlow = async () => {
        try {
            console.log('Requesting microphone access...');
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            console.log('Microphone access granted:', mediaStreamRef.current);
            
            // Set up a simple volume check using the audio track
            const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
            
            // Create a simple audio element to monitor volume
            const audioElement = new Audio();
            audioElement.srcObject = mediaStreamRef.current;
            audioElement.muted = true; // Mute to prevent feedback
            
            // Define the volume threshold needed to blow out candles
            const VOLUME_THRESHOLD = 30;
            
            // Set up volume monitoring
            try {
                // Modern way to check for AudioContext support
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    console.log('AudioContext is supported');
                    const audioContext = new AudioContext();
                    
                    // Resume the audio context (required by modern browsers)
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume();
                    }
                    
                    const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    
                    // Start monitoring volume
                    volumeIntervalRef.current = setInterval(() => {
                        if (!state.candlesLit || state.isBlown) return;
                        
                        const dataArray = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(dataArray);
                        
                        // Calculate average volume
                        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                        
                        console.log('Current volume:', average, 'Threshold:', VOLUME_THRESHOLD);
                        
                        // Update state with new volume
                        setState(prev => ({ ...prev, currentVolume: average }));
                        
                        // Update flame elements
                        updateFlames(average);
                        
                        // Check if candles should be blown out
                        if (average > VOLUME_THRESHOLD && state.candlesLit && !state.isBlown) {
                            console.log('Candles blown out!');
                            
                            // Add a visual effect when candles are blown out
                            const flameElements = document.querySelectorAll('.flame');
                            flameElements.forEach(flame => {
                                flame.style.transition = 'all 0.5s ease-out';
                                flame.style.transform = 'translateX(-50%) scale(0)';
                                flame.style.opacity = '0';
                            });
                            
                            // Delay the state change to allow for the animation
                            setTimeout(() => {
                                handleStateChange('isBlown', true);
                                handleStateChange('candlesLit', false);
                            }, 500);
                        }
                    }, 100);
                } else {
                    throw new Error('AudioContext not supported');
                }
            } catch (audioError) {
                console.warn('AudioContext error, using fallback method:', audioError);
                
                // Fallback for browsers that don't support AudioContext
                volumeIntervalRef.current = setInterval(() => {
                    if (!state.candlesLit || state.isBlown) return;
                    
                    // Simulate volume changes based on time
                    const simulatedVolume = Math.sin(Date.now() / 500) * 50 + 50;
                    
                    console.log('Simulated volume:', simulatedVolume, 'Threshold:', VOLUME_THRESHOLD);
                    
                    // Update state with simulated volume
                    setState(prev => ({ ...prev, currentVolume: simulatedVolume }));
                    
                    // Update flame elements
                    updateFlames(simulatedVolume);
                    
                    // Check if candles should be blown out
                    if (simulatedVolume > VOLUME_THRESHOLD && state.candlesLit && !state.isBlown) {
                        console.log('Candles blown out!');
                        
                        // Add a visual effect when candles are blown out
                        const flameElements = document.querySelectorAll('.flame');
                        flameElements.forEach(flame => {
                            flame.style.transition = 'all 0.5s ease-out';
                            flame.style.transform = 'translateX(-50%) scale(0)';
                            flame.style.opacity = '0';
                        });
                        
                        // Delay the state change to allow for the animation
                        setTimeout(() => {
                            handleStateChange('isBlown', true);
                            handleStateChange('candlesLit', false);
                        }, 500);
                    }
                }, 100);
            }
            
            console.log('Audio setup complete');
            setState(prev => ({ ...prev, isMicrophoneReady: true }));
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to blow out the candles!');
        }
    };

    const updateFlames = (volume) => {
        console.log('Updating flames with volume:', volume);
        
        const flameElements = document.querySelectorAll('.flame');
        console.log('Found flame elements:', flameElements.length);
        
        if (flameElements.length === 0) {
            console.warn('No flame elements found in the DOM');
            return;
        }
        
        // Scale the volume to be more dramatic
        const scaledVolume = Math.min(100, volume);
        console.log('Scaled volume:', scaledVolume);
        
        // Threshold for blowing out candles
        const threshold = 30;
        
        // Super dramatic scaling - flames will be almost invisible at 30% volume
        let scale;
        
        if (scaledVolume >= threshold) {
            // At or above threshold, flames are almost gone
            scale = 0.01;
        } else if (scaledVolume >= threshold * 0.7) {
            // Between 70% and 100% of threshold, flames shrink dramatically
            // Map from [threshold*0.7, threshold] to [0.3, 0.01]
            const range = threshold - (threshold * 0.7);
            const position = scaledVolume - (threshold * 0.7);
            const percentage = position / range;
            scale = 0.3 - (percentage * 0.29);
        } else if (scaledVolume >= threshold * 0.3) {
            // Between 30% and 70% of threshold, flames shrink moderately
            // Map from [threshold*0.3, threshold*0.7] to [0.8, 0.3]
            const range = (threshold * 0.7) - (threshold * 0.3);
            const position = scaledVolume - (threshold * 0.3);
            const percentage = position / range;
            scale = 0.8 - (percentage * 0.5);
        } else {
            // Below 30% of threshold, flames are mostly full size
            // Map from [0, threshold*0.3] to [1.0, 0.8]
            const range = threshold * 0.3;
            const percentage = scaledVolume / range;
            scale = 1.0 - (percentage * 0.2);
        }
        
        // Add flicker effect
        const flickerIntensity = volume > threshold * 0.7 ? 0.2 : 0.05;
        const flicker = Math.random() * flickerIntensity;
        scale = Math.max(0.01, scale + flicker);
        
        console.log('Calculated scale:', scale);
        
        flameElements.forEach((flame, index) => {
            flame.style.transform = `translateX(-50%) scale(${scale})`;
            
            // Make opacity more dramatic as it approaches threshold
            let opacity;
            
            if (scaledVolume >= threshold) {
                opacity = 0.1; // Almost invisible
            } else if (scaledVolume >= threshold * 0.7) {
                // Between 70% and 100% of threshold
                const range = threshold - (threshold * 0.7);
                const position = scaledVolume - (threshold * 0.7);
                const percentage = position / range;
                opacity = 0.3 - (percentage * 0.2);
            } else if (scaledVolume >= threshold * 0.3) {
                // Between 30% and 70% of threshold
                const range = (threshold * 0.7) - (threshold * 0.3);
                const position = scaledVolume - (threshold * 0.3);
                const percentage = position / range;
                opacity = 0.5 - (percentage * 0.2);
            } else {
                // Below 30% of threshold
                const range = threshold * 0.3;
                const percentage = scaledVolume / range;
                opacity = 0.7 - (percentage * 0.2);
            }
            
            flame.style.opacity = opacity;
            console.log(`Flame ${index} updated with scale ${scale} and opacity ${opacity}`);
        });
    };

    const handleLightCandles = () => {
        if (!state.age) {
            alert('Please enter an age first!');
            return;
        }
        if (state.age.length > 2) {
            alert('Age must be 2 digits or less!');
            return;
        }
        
        handleStateChange('candlesLit', true);
        handleStateChange('isBlown', false);
    };

    // Add toggle pause function
    const togglePause = useCallback(() => {
        if (audioRef.current) {
            if (state.isMusicPlaying) {
                audioRef.current.pause();
                setState(prev => ({ ...prev, isMusicPlaying: false }));
            } else {
                audioRef.current.play().catch(error => {
                    console.log('Play prevented:', error);
                });
                setState(prev => ({ ...prev, isMusicPlaying: true }));
            }
        }
    }, [state.isMusicPlaying]);

    // Add restart music function
    const restartMusic = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => {
                console.log('Play prevented:', error);
            });
            setState(prev => ({ ...prev, isMusicPlaying: true }));
        }
    }, []);

    // Add reset cake function
    const resetCake = useCallback(() => {
        setState(prev => ({
            ...prev,
            candlesLit: false,
            isBlown: false
        }));
    }, []);

    const handleStateChange = (key, value) => {
        if (key === 'age') {
            // Only allow numbers and limit to 2 digits
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 2) {
                setState(prevState => ({
                    ...prevState,
                    [key]: numericValue
                }));
            }
        } else {
            setState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    const renderAgeNumbers = () => {
        return state.age.split('').map((digit, index) => (
            <div key={index} className="number-container">
                <img 
                    src={numberImages[digit]} 
                    alt={digit} 
                    className="age-number"
                />
                {state.candlesLit && !state.isBlown && (
                    <div 
                        className="flame"
                        style={{ 
                            backgroundColor: candleThemes[state.candleTheme].flame
                        }}
                    ></div>
                )}
            </div>
        ));
    };

    return (
        <div className="container">
            {/* Audio element for background music */}
            <audio ref={audioRef} src={backgroundMusic} loop />
            
            <div className="gradient-bg"></div>
            <div className="project-page">
                <div className="project-header">
                    <Link to="/" className="back-button">← Back to Home</Link>
                    <div className="project-title-container">
                        <h1 className="project-title">Make a Wish</h1>
                        <p className="project-description">Blow out the candles 🕯️ and make a wish</p>
                    </div>
                </div>

                <div className="cake-melody-container">
                    {/* Left side - Cake Customization */}
                    <div className="cake-customization">
                        <div className="customization-section">
                            <h3>Cake Design</h3>
                            <div className="select-wrapper">
                                <select 
                                    className="custom-select"
                                    value={state.cakeDesign} 
                                    onChange={(e) => handleStateChange('cakeDesign', e.target.value)}
                                >
                                    <option value="chocolate">Chocolate</option>
                                    <option value="vanilla">Vanilla</option>
                                    <option value="strawberry">Strawberry</option>
                                    <option value="lemon">Lemon</option>
                                </select>
                            </div>
                        </div>

                        <div className="customization-section">
                            <h3>Candle Theme</h3>
                            <div className="select-wrapper">
                                <select 
                                    className="custom-select"
                                    value={state.candleTheme} 
                                    onChange={(e) => handleStateChange('candleTheme', e.target.value)}
                                >
                                    {Object.entries(candleThemes).map(([key, theme]) => (
                                        <option key={key} value={key}>{theme.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="customization-section">
                            <h3>Your Age</h3>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    maxLength="2"
                                    value={state.age} 
                                    onChange={(e) => handleStateChange('age', e.target.value)}
                                    placeholder="Enter your age (0-99)"
                                />
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="action-button light-button" 
                                onClick={handleLightCandles}
                                disabled={state.candlesLit || state.isBlown || !state.age}
                            >
                                Light Candles
                            </button>
                            <button 
                                className="action-button ready-button" 
                                onClick={handleReadyToBlow}
                                disabled={state.isMicrophoneReady || !state.candlesLit}
                                style={{ 
                                    backgroundColor: state.isMicrophoneReady ? '#4CAF50' : '#f0f0f0',
                                    color: state.isMicrophoneReady ? 'white' : '#666'
                                }}
                            >
                                {state.isMicrophoneReady ? '✓ Microphone Ready' : 'Ready to Blow'}
                            </button>
                            <button 
                                className="action-button reset-button" 
                                onClick={resetCake}
                                disabled={!state.candlesLit && !state.isBlown}
                            >
                                Reset Cake
                            </button>
                        </div>
                    </div>

                    {/* Right side - Preview */}
                    <div className="cake-preview">
                        <h3>Preview</h3>
                        <div className="cake-container" style={{ marginTop: '150px', position: 'relative' }}>
                            {cakeImage && (
                                <img 
                                    src={cakeImage} 
                                    alt={`${state.cakeDesign} cake`} 
                                    className="cake-image" 
                                    style={{ maxWidth: '400px', height: 'auto' }} 
                                />
                            )}
                            <div className="numbers-container" style={{ 
                                position: 'absolute', 
                                top: '0', 
                                left: '0', 
                                right: '0',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '20px',
                                transform: 'translateY(-80%)'
                            }}>
                                {renderAgeNumbers()}
                            </div>
                            
                            {/* Volume Bar */}
                            {state.candlesLit && !state.isBlown && (
                                <div className="volume-bar-container">
                                    <h3 className="volume-bar-label">Blow to extinguish</h3>
                                    <div className="volume-bar">
                                        <div 
                                            className="volume-bar-fill" 
                                            style={{ 
                                                width: `${Math.min(100, (state.currentVolume / 30) * 100)}%`,
                                                background: state.currentVolume > 25 
                                                    ? 'linear-gradient(to right, #ff4444, #ff8800)' 
                                                    : undefined
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Audio controls section - moved to bottom of page */}
            <div className="audio-controls-container">
                <h3 className="audio-controls-title">Audio Control</h3>
                <div className="audio-controls">
                    <button 
                        className="play-pause-button" 
                        onClick={togglePause}
                        title={state.isMusicPlaying ? "Pause Music" : "Play Music"}
                    >
                        {state.isMusicPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </button>
                    <button 
                        className="play-pause-button restart-button" 
                        onClick={restartMusic}
                        title="Restart Music"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default M;