/* =========================================================
   A LITTLE WORLD — FOR HINATA 💗
   Cinematic Romantic Experience Controller
   ========================================================= */

// Navigation Stack
let navHistory = ['page1'];
let currentPageId = 'page1';

/* =========================================================
   1. UNIFIED AUDIO ENGINE WITH INSTANT AUTO-PLAY
========================================================= */
const audioElements = {
    'mz3': document.getElementById('audio-mz3'),
    'memory1': document.getElementById('audio-memory1'),
    'memory2': document.getElementById('audio-memory2'),
    'memory3': document.getElementById('audio-memory3'),
    'memory4': document.getElementById('audio-memory4'),
    'letter': document.getElementById('audio-letter'),
    'magic': document.getElementById('audio-magic'),
    'night': document.getElementById('audio-night'),
    'surprise': document.getElementById('audio-surprise')
};

const audioTrackNames = {
    'mz3': '♫ MZ3 — Eternal Melody',
    'memory1': '♫ Memory Song 1',
    'memory2': '♫ Memory Song 2',
    'memory3': '♫ Memory Song 3',
    'memory4': '♫ Memory Song 4',
    'letter': '♫ Love Letter Theme',
    'magic': '♫ Something Magical',
    'night': '♫ Night Sky Serenade',
    'surprise': '♫ Final Surprise'
};

let currentAudioKey = 'mz3';
let isAudioMuted = false;
let userInteracted = false;

const audioToggle = document.getElementById('audioToggle');
const audioTrackName = document.getElementById('audioTrackName');

function playTrack(key) {
    if (!key || !audioElements[key]) return;

    // Stop all other audio immediately to prevent overlap
    Object.keys(audioElements).forEach(k => {
        if (k !== key && audioElements[k]) {
            audioElements[k].pause();
            audioElements[k].currentTime = 0;
        }
    });

    currentAudioKey = key;
    const currentAudio = audioElements[key];

    if (audioTrackName && audioTrackNames[key]) {
        audioTrackName.textContent = audioTrackNames[key];
    }

    if (!isAudioMuted) {
        currentAudio.play().then(() => {
            updateAudioWidgetUI(true);
        }).catch(() => {
            // Autoplay blocked by browser policy until first gesture
            updateAudioWidgetUI(false);
        });
    }
}

function updateAudioWidgetUI(isPlaying) {
    if (!audioToggle) return;
    if (isPlaying && !isAudioMuted) {
        audioToggle.classList.add('playing');
    } else {
        audioToggle.classList.remove('playing');
    }
}

function toggleAudio() {
    userInteracted = true;
    const currentAudio = audioElements[currentAudioKey];
    if (!currentAudio) return;

    if (currentAudio.paused || isAudioMuted) {
        isAudioMuted = false;
        currentAudio.play().then(() => {
            updateAudioWidgetUI(true);
        }).catch(() => {});
    } else {
        isAudioMuted = true;
        currentAudio.pause();
        updateAudioWidgetUI(false);
    }
}

if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
    });
}

// Eagerly start music automatically on first page load
function startOpeningMusicImmediately() {
    playTrack('mz3');
}

function unlockAudioOnAnyGesture() {
    if (userInteracted) return;
    userInteracted = true;
    const currentAudio = audioElements[currentAudioKey];
    if (currentAudio && !isAudioMuted && currentAudio.paused) {
        currentAudio.play().then(() => {
            updateAudioWidgetUI(true);
        }).catch(() => {});
    }
}

// Attach multiple listeners to catch any first user touch/move immediately
['pointerdown', 'touchstart', 'pointermove', 'touchmove', 'click', 'scroll', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudioOnAnyGesture, { passive: true, once: false });
});

// Attempt immediate playback
startOpeningMusicImmediately();
window.addEventListener('load', startOpeningMusicImmediately);


/* =========================================================
   2. PAGE NAVIGATION SYSTEM
========================================================= */
const allPages = document.querySelectorAll('.page');

function navigateToPage(pageRef) {
    userInteracted = true;
    let targetPageId = typeof pageRef === 'number' ? `page${pageRef}` : pageRef;
    if (pageRef === 'memoryDetail') targetPageId = 'pageMemoryDetail';

    if (currentPageId === targetPageId) return;

    navHistory.push(targetPageId);
    switchView(targetPageId);
}

function goBack() {
    userInteracted = true;
    if (navHistory.length > 1) {
        navHistory.pop(); // remove current
        const prevPageId = navHistory[navHistory.length - 1];
        switchView(prevPageId);
    } else {
        switchView('page1');
    }
}

function switchView(targetPageId) {
    currentPageId = targetPageId;

    allPages.forEach(p => {
        if (p.id === targetPageId) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });

    // Handle Page-specific setups & music
    if (targetPageId === 'page1') {
        playTrack('mz3');
    } else if (targetPageId === 'page2') {
        playTrack('mz3');
        updateMemoryCarousel();
    } else if (targetPageId === 'pageMemoryDetail') {
        playTrack(`memory${currentMemoryIndex + 1}`);
        renderSingleMemoryView();
    } else if (targetPageId === 'page3') {
        playTrack('letter');
        startLetterTypewriter();
    } else if (targetPageId === 'page4') {
        playTrack('magic');
        resetMagicPage();
    } else if (targetPageId === 'page5') {
        playTrack('magic');
        resetScratchCard();
    } else if (targetPageId === 'page6') {
        playTrack('night');
        initNightStars();
    } else if (targetPageId === 'page7') {
        playTrack('surprise');
        startFinalAnticipation();
    }
}

window.navigateToPage = navigateToPage;
window.goBack = goBack;


/* =========================================================
   3. PAGE 1 — LOBBY / PLAYFUL NO BUTTON
========================================================= */
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const choiceArea = document.getElementById('choiceArea');

if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        navigateToPage(2);
    });
}

function moveNoButton() {
    if (!noBtn || !choiceArea) return;
    const areaRect = choiceArea.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(10, areaRect.width - btnRect.width);
    const maxY = Math.max(10, areaRect.height - btnRect.height);

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}

if (noBtn) {
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton();
    }, { passive: false });
}


/* =========================================================
   4. PAGE 2 & 2B — MEMORIES GALLERY & DEDICATED VIEW
========================================================= */
const memoriesData = [
    {
        image: '1000163977.jpg',
        title: 'That smile ❤️',
        caption: 'A timeless picture I could look at for an eternity. The world fades when you smile.',
        roman: 'CHERISHED MOMENT I',
        tag: 'MEMORY 01',
        songName: 'Playing: Memory Song 1'
    },
    {
        image: '1000163978.jpg',
        title: 'A tender moment ✨',
        caption: 'Some quiet moments gently etch themselves into the heart forever.',
        roman: 'CHERISHED MOMENT II',
        tag: 'MEMORY 02',
        songName: 'Playing: Memory Song 2'
    },
    {
        image: '1000163979.jpg',
        title: 'My favorite memory 💗',
        caption: 'With you, the simplest second turns into pure poetry and warmth.',
        roman: 'CHERISHED MOMENT III',
        tag: 'MEMORY 03',
        songName: 'Playing: Memory Song 3'
    },
    {
        image: '1000163980.jpg',
        title: 'Still smiling 🦋',
        caption: 'And somehow, every single time I remember this, my heart feels at peace.',
        roman: 'CHERISHED MOMENT IV',
        tag: 'MEMORY 04',
        songName: 'Playing: Memory Song 4'
    }
];

let currentMemoryIndex = 0;

const memoryStage = document.getElementById('memoryStage');
const memoryCard = document.getElementById('memoryCard');
const memoryImage = document.getElementById('memoryImage');
const memoryNumber = document.getElementById('memoryNumber');
const memoryTitle = document.getElementById('memoryTitle');
const memoryCaptionPreview = document.getElementById('memoryCaptionPreview');
const memoryDots = document.getElementById('memoryDots');
const openMemoryBtn = document.getElementById('openMemoryBtn');

// Carousel Dots
function renderMemoryDots() {
    if (!memoryDots) return;
    memoryDots.innerHTML = '';
    memoriesData.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `memory-dot ${idx === currentMemoryIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            currentMemoryIndex = idx;
            updateMemoryCarousel();
        });
        memoryDots.appendChild(dot);
    });
}

function updateMemoryCarousel(direction = 0) {
    const item = memoriesData[currentMemoryIndex];
    if (!item) return;

    if (direction !== 0 && memoryCard) {
        memoryCard.style.transition = 'transform 0.35s ease, opacity 0.25s ease';
        memoryCard.style.transform = `translateX(${-direction * 45}px) rotate(${-direction * 4}deg) scale(0.96)`;
        memoryCard.style.opacity = '0.3';

        setTimeout(() => {
            memoryImage.src = item.image;
            if (memoryNumber) memoryNumber.textContent = `0${currentMemoryIndex + 1} / 04`;
            if (memoryTitle) memoryTitle.textContent = item.title;
            if (memoryCaptionPreview) memoryCaptionPreview.textContent = item.caption;

            memoryCard.style.transform = `translateX(${direction * 45}px) rotate(${direction * 4}deg) scale(0.96)`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    memoryCard.style.transform = 'translateX(0) rotate(0) scale(1)';
                    memoryCard.style.opacity = '1';
                });
            });
        }, 160);
    } else {
        if (memoryImage) memoryImage.src = item.image;
        if (memoryNumber) memoryNumber.textContent = `0${currentMemoryIndex + 1} / 04`;
        if (memoryTitle) memoryTitle.textContent = item.title;
        if (memoryCaptionPreview) memoryCaptionPreview.textContent = item.caption;
    }

    renderMemoryDots();
}

function nextMemory() {
    currentMemoryIndex = (currentMemoryIndex + 1) % memoriesData.length;
    updateMemoryCarousel(1);
}

function prevMemory() {
    currentMemoryIndex = (currentMemoryIndex - 1 + memoriesData.length) % memoriesData.length;
    updateMemoryCarousel(-1);
}

document.getElementById('memoryNext')?.addEventListener('click', (e) => {
    e.stopPropagation();
    nextMemory();
});

document.getElementById('memoryPrev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    prevMemory();
});

// Swipe & Drag for Memory Card
let memStartX = 0;
let memStartY = 0;
let memCurrX = 0;
let memPointerId = null;
let memIsDragging = false;

function onMemPointerDown(e) {
    if (e.target.closest('.memory-arrow') || e.target.closest('.open-memory-btn') || e.target.closest('.floating-feather')) return;
    memPointerId = e.pointerId;
    memStartX = e.clientX;
    memStartY = e.clientY;
    memCurrX = e.clientX;
    memIsDragging = true;
    memoryCard?.classList.add('dragging');
}

function onMemPointerMove(e) {
    if (!memIsDragging || e.pointerId !== memPointerId || !memoryCard) return;
    memCurrX = e.clientX;
    const dx = memCurrX - memStartX;
    const dy = e.clientY - memStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        memoryCard.style.transform = `translateX(${dx}px) rotate(${dx * 0.02}deg)`;
        memoryCard.style.opacity = String(Math.max(0.6, 1 - Math.abs(dx) / 500));
    }
}

function onMemPointerUp(e) {
    if (!memIsDragging || e.pointerId !== memPointerId || !memoryCard) return;
    const dx = memCurrX - memStartX;
    const dy = e.clientY - memStartY;
    memIsDragging = false;
    memoryCard.classList.remove('dragging');
    memoryCard.style.opacity = '1';

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) nextMemory();
        else prevMemory();
    } else {
        memoryCard.style.transform = 'translateX(0) rotate(0)';
    }
    memPointerId = null;
}

if (memoryStage) {
    memoryStage.addEventListener('pointerdown', onMemPointerDown);
    memoryStage.addEventListener('pointermove', onMemPointerMove);
    memoryStage.addEventListener('pointerup', onMemPointerUp);
    memoryStage.addEventListener('pointercancel', onMemPointerUp);
}

// Open Dedicated Memory View
openMemoryBtn?.addEventListener('click', () => {
    navigateToPage('memoryDetail');
});

// Dedicated Memory View Render (NO PREVIOUS / NEXT BUTTONS)
const singleMemoryImg = document.getElementById('singleMemoryImg');
const singleMemoryTag = document.getElementById('singleMemoryTag');
const singleMemoryNumberText = document.getElementById('singleMemoryNumberText');
const singleMemoryTitle = document.getElementById('singleMemoryTitle');
const singleMemoryCaption = document.getElementById('singleMemoryCaption');
const singleMemorySongName = document.getElementById('singleMemorySongName');

function renderSingleMemoryView() {
    const item = memoriesData[currentMemoryIndex];
    if (!item) return;

    if (singleMemoryImg) singleMemoryImg.src = item.image;
    if (singleMemoryTag) singleMemoryTag.textContent = item.tag;
    if (singleMemoryNumberText) singleMemoryNumberText.textContent = item.roman;
    if (singleMemoryTitle) singleMemoryTitle.textContent = item.title;
    if (singleMemoryCaption) singleMemoryCaption.textContent = item.caption;
    if (singleMemorySongName) singleMemorySongName.textContent = item.songName;
}


/* =========================================================
   5. PAGE 3 — LOVE LETTER
========================================================= */
const typedLetterEl = document.getElementById('typedLetter');
const letterContentText = `There are some rare souls who quietly enter your life,
and then there is you.

Somehow, you became the quiet beauty in my thoughts,
the warmth in every smile,
and all the gentle moments I never want time to take away.

I don't know what destiny has written in the pages ahead,
but one truth stands eternal in my soul:

Whenever I gaze back upon my life's story,
I will bow my head in gratitude that somewhere in it,
there lived a celestial grace named Hinata.

You are not merely a memory I cherish.
You are a sacred feeling I carry.

And if I could choose one sanctuary in this universe
to guard all my sweetest memories forever,
I would choose every second that had you in it.`;

let letterTyped = false;

function startLetterTypewriter() {
    if (letterTyped || !typedLetterEl) return;
    letterTyped = true;
    typedLetterEl.innerHTML = '';

    const words = letterContentText.split(/(\s+)/);
    let idx = 0;

    function typeNextWord() {
        if (idx >= words.length) return;
        const span = document.createElement('span');
        span.className = 'typed-word';
        span.textContent = words[idx];
        typedLetterEl.appendChild(span);
        idx++;
        const delay = words[idx - 1]?.trim() === '' ? 18 : 38;
        setTimeout(typeNextWord, delay);
    }

    setTimeout(typeNextWord, 600);
}


/* =========================================================
   6. PAGE 4 — SOMETHING MAGICAL (GESTURE CANVAS TO SECRET PAGE)
========================================================= */
const magicPhotoLayer = document.getElementById('magicPhotoLayer');
const magicGestureCanvas = document.getElementById('magicGestureLayer');
const magicSuccessModal = document.getElementById('magicSuccess');
let magicPhotosList = [];
let magicPhotoIndexCounter = 0;
let lastMagicPhotoTime = 0;

let magicCanvasCtx = null;
let magicStardustTrail = [];
let magicAnimId = null;

let magicGesturePoints = 0;
let magicGestureTriggered = false;

function resizeMagicGestureCanvas() {
    if (!magicGestureCanvas) return;
    const rect = magicGestureCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    magicGestureCanvas.width = rect.width * dpr;
    magicGestureCanvas.height = rect.height * dpr;
    magicCanvasCtx = magicGestureCanvas.getContext('2d');
    magicCanvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnMagicPhoto(x, y) {
    if (!magicPhotoLayer) return;
    const now = performance.now();
    if (now - lastMagicPhotoTime < 180) return; // debounce
    lastMagicPhotoTime = now;

    const item = memoriesData[magicPhotoIndexCounter % memoriesData.length];
    magicPhotoIndexCounter++;

    const photo = document.createElement('img');
    photo.src = item.image;
    photo.className = 'magic-photo';
    photo.style.left = `${x}px`;
    photo.style.top = `${y}px`;
    const randomRot = (Math.random() * 16 - 8).toFixed(1);
    photo.style.setProperty('--rot', `${randomRot}deg`);

    magicPhotoLayer.appendChild(photo);
    magicPhotosList.push(photo);

    // CRITICAL REQUIREMENT: STRICTLY MAX 3 VISIBLE PHOTOS
    if (magicPhotosList.length > 3) {
        const oldest = magicPhotosList.shift();
        oldest.classList.add('removing');
        setTimeout(() => {
            oldest.remove();
        }, 500);
    }
}

function addMagicStardust(x, y) {
    for (let i = 0; i < 4; i++) {
        magicStardustTrail.push({
            x: x + (Math.random() * 20 - 10),
            y: y + (Math.random() * 20 - 10),
            size: Math.random() * 3 + 1.2,
            alpha: 1,
            color: Math.random() > 0.4 ? '#f7d794' : '#f7b2cb',
            decay: Math.random() * 0.035 + 0.02
        });
    }
}

function renderMagicStardust() {
    if (!magicCanvasCtx || !magicGestureCanvas) return;
    magicCanvasCtx.clearRect(0, 0, magicGestureCanvas.clientWidth, magicGestureCanvas.clientHeight);

    for (let i = magicStardustTrail.length - 1; i >= 0; i--) {
        const p = magicStardustTrail[i];
        p.alpha -= p.decay;
        p.size *= 0.98;
        if (p.alpha <= 0) {
            magicStardustTrail.splice(i, 1);
            continue;
        }

        magicCanvasCtx.save();
        magicCanvasCtx.globalAlpha = p.alpha;
        magicCanvasCtx.fillStyle = p.color;
        magicCanvasCtx.shadowColor = '#f7b2cb';
        magicCanvasCtx.shadowBlur = 8;
        magicCanvasCtx.beginPath();
        magicCanvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        magicCanvasCtx.fill();
        magicCanvasCtx.restore();
    }

    if (currentPageId === 'page4') {
        magicAnimId = requestAnimationFrame(renderMagicStardust);
    }
}

function triggerMagicSecretTransition() {
    if (magicGestureTriggered) return;
    magicGestureTriggered = true;

    if (magicSuccessModal) magicSuccessModal.classList.add('show');

    setTimeout(() => {
        if (magicSuccessModal) magicSuccessModal.classList.remove('show');
        navigateToPage(5);
        magicGestureTriggered = false;
    }, 850);
}

let isMagicDrawing = false;
let lastMagicDrawX = 0;
let lastMagicDrawY = 0;

function handleMagicMove(e) {
    if (currentPageId !== 'page4') return;
    const x = e.clientX;
    const y = e.clientY;

    // Temporary Photo & Stardust Discovery on all pointer moves
    addMagicStardust(x, y);
    spawnMagicPhoto(x, y);

    // Deliberate Scratch / Draw Gesture Detection
    if (isMagicDrawing || e.buttons === 1) {
        const dist = Math.hypot(x - lastMagicDrawX, y - lastMagicDrawY);
        if (dist > 8) {
            magicGesturePoints += Math.min(dist / 10, 3);
            lastMagicDrawX = x;
            lastMagicDrawY = y;
        }

        if (magicGesturePoints >= 18 && !magicGestureTriggered) {
            triggerMagicSecretTransition();
        }
    }
}

function handleMagicDown(e) {
    if (currentPageId !== 'page4') return;
    isMagicDrawing = true;
    lastMagicDrawX = e.clientX;
    lastMagicDrawY = e.clientY;
    handleMagicMove(e);
}

function handleMagicUp() {
    isMagicDrawing = false;
}

if (magicGestureCanvas) {
    magicGestureCanvas.addEventListener('pointerdown', handleMagicDown);
    magicGestureCanvas.addEventListener('pointermove', handleMagicMove);
    magicGestureCanvas.addEventListener('pointerup', handleMagicUp);
    magicGestureCanvas.addEventListener('pointercancel', handleMagicUp);
}

function resetMagicPage() {
    magicGesturePoints = 0;
    magicGestureTriggered = false;
    isMagicDrawing = false;
    magicPhotosList.forEach(p => p.remove());
    magicPhotosList = [];
    magicPhotoIndexCounter = 0;
    magicStardustTrail = [];
    magicSuccessModal?.classList.remove('show');
    resizeMagicGestureCanvas();
    cancelAnimationFrame(magicAnimId);
    renderMagicStardust();
}


/* =========================================================
   7. PAGE 5 — MAGIC / SECRET SCRATCH PAGE (ULTRA-REALISTIC)
========================================================= */
const scratchCanvas = document.getElementById('scratchCanvas');
const scratchTextContainer = document.getElementById('scratchText');
const scratchProgressFill = document.getElementById('scratchProgressFill');
const scratchHintText = document.getElementById('scratchHintText');
const continueNightBtn = document.getElementById('continueNightBtn');

const scratchVerses = [
    "Teri aankhon mein jo dekha,",
    "woh manzar yaad reh gaya,",
    "Teri baaton ka woh lehja,",
    "mere dil mein utar gaya.",
    "",
    "Teri zulfon ki woh khushboo,",
    "meri saanson mein bas gayi,",
    "Teri ek pyari si muskaan,",
    "meri duniya hi badal gayi.",
    "",
    "Tere zikr se meri shaamein,",
    "mehakti si guzar gayi,",
    "Tere khwaab mein meri raatein,",
    "sanwarti hi guzar gayi.",
    "",
    "Na jaane kaisi mohabbat hai,",
    "na jaane kaisa asar tera,",
    "Tu saamne ho toh lagta hai,",
    "mukammal hai jahaan mera."
];

let scratchCtx = null;
let isScratching = false;
let scratchStrokeCount = 0;
let isScratchFinished = false;

function setupScratchCanvas() {
    if (!scratchCanvas) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    scratchCanvas.width = rect.width * dpr;
    scratchCanvas.height = rect.height * dpr;
    scratchCtx = scratchCanvas.getContext('2d');
    scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    paintGildedFoil();
}

function paintGildedFoil() {
    if (!scratchCtx || !scratchCanvas) return;
    const w = scratchCanvas.clientWidth;
    const h = scratchCanvas.clientHeight;

    scratchCtx.globalCompositeOperation = 'source-over';

    const grad = scratchCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#c49354');
    grad.addColorStop(0.25, '#f5d392');
    grad.addColorStop(0.5, '#fff0c7');
    grad.addColorStop(0.75, '#d8a467');
    grad.addColorStop(1, '#a76d38');

    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, w, h);

    // Gilded Foil Shimmer Dust
    for (let i = 0; i < 900; i++) {
        scratchCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`;
        scratchCtx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    // Border Filigree
    scratchCtx.strokeStyle = 'rgba(255, 245, 225, 0.5)';
    scratchCtx.lineWidth = 1.5;
    scratchCtx.strokeRect(10, 10, w - 20, h - 20);

    scratchCtx.fillStyle = 'rgba(60, 30, 15, 0.75)';
    scratchCtx.font = '600 12px Cinzel, serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.fillText('✦ SCRATCH TO REVEAL SECRET ✦', w / 2, h / 2);
}

function eraseAt(x, y) {
    if (!scratchCtx || isScratchFinished) return;
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 32, 0, Math.PI * 2);
    scratchCtx.fill();

    scratchStrokeCount++;
    const progress = Math.min(100, Math.round((scratchStrokeCount / 14) * 100));
    if (scratchProgressFill) scratchProgressFill.style.width = `${progress}%`;

    // Fast completion after 10-14 strokes or direct reveals
    if (scratchStrokeCount >= 12 && !isScratchFinished) {
        completeScratchReveal();
    }
}

function completeScratchReveal() {
    isScratchFinished = true;
    if (scratchProgressFill) scratchProgressFill.style.width = '100%';
    if (scratchHintText) scratchHintText.innerHTML = '<span>✨ Secret Fully Revealed! ✨</span>';
    continueNightBtn?.classList.add('show');

    // Fade out canvas smoothly
    if (scratchCanvas) {
        scratchCanvas.style.transition = 'opacity 0.8s ease';
        scratchCanvas.style.opacity = '0';
        setTimeout(() => {
            if (scratchCtx) scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        }, 800);
    }
}

function populateScratchVerses() {
    if (!scratchTextContainer) return;
    scratchTextContainer.innerHTML = '';
    scratchVerses.forEach(line => {
        if (line === '') {
            scratchTextContainer.appendChild(document.createElement('br'));
        } else {
            const p = document.createElement('div');
            p.className = 'scratch-line';
            p.textContent = line;
            scratchTextContainer.appendChild(p);
        }
    });
}

function handleScratchPointer(e) {
    if (!isScratching || !scratchCanvas) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    eraseAt(x, y);
}

if (scratchCanvas) {
    scratchCanvas.addEventListener('pointerdown', (e) => {
        isScratching = true;
        handleScratchPointer(e);
    });
    scratchCanvas.addEventListener('pointermove', handleScratchPointer);
    scratchCanvas.addEventListener('pointerup', () => { isScratching = false; });
    scratchCanvas.addEventListener('pointercancel', () => { isScratching = false; });
}

function resetScratchCard() {
    isScratchFinished = false;
    scratchStrokeCount = 0;
    if (scratchCanvas) {
        scratchCanvas.style.opacity = '1';
        scratchCanvas.style.transition = 'none';
    }
    if (scratchProgressFill) scratchProgressFill.style.width = '0%';
    if (scratchHintText) scratchHintText.innerHTML = '<span>✦ Stroke the golden leaf to reveal the secret ✦</span>';
    continueNightBtn?.classList.remove('show');
    populateScratchVerses();
    setTimeout(setupScratchCanvas, 80);
}


/* =========================================================
   8. PAGE 6 — NIGHT SKY STARS
========================================================= */
function initNightStars() {
    const starsLayer = document.getElementById('nightStars');
    if (!starsLayer) return;
    starsLayer.innerHTML = '';

    for (let i = 0; i < 140; i++) {
        const star = document.createElement('span');
        star.className = 'night-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.75 + 0.25}`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;

        if (Math.random() > 0.8) {
            star.style.background = '#f7d794';
            star.style.boxShadow = '0 0 6px rgba(247, 215, 148, 0.85)';
        }

        starsLayer.appendChild(star);
    }

    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    starsLayer.appendChild(shootingStar);
}


/* =========================================================
   9. PAGE 7 — FINAL SURPRISE SEQUENCE (PRESERVED 6-7S)
========================================================= */
const anticipationSequence = document.getElementById('anticipationSequence');
const anticipationFloatingLayer = document.getElementById('anticipationFloatingLayer');
const anticipationProgress = document.getElementById('anticipationProgress');
const finalIntro = document.getElementById('finalIntro');
const finalGiftBox = document.getElementById('finalGiftBox');
const finalRevealContainer = document.getElementById('finalRevealContainer');

const anticipationPhotosList = [
    '1000163977.jpg',
    '1000163978.jpg',
    '1000163979.jpg',
    '1000163980.jpg'
];

let anticipationTimer = null;
let anticipationInterval = null;

function startFinalAnticipation() {
    clearInterval(anticipationInterval);
    clearTimeout(anticipationTimer);

    if (anticipationSequence) anticipationSequence.classList.remove('hide');
    if (finalIntro) finalIntro.classList.remove('show');
    if (finalRevealContainer) finalRevealContainer.classList.remove('show');
    if (anticipationProgress) anticipationProgress.style.width = '0%';
    if (anticipationFloatingLayer) anticipationFloatingLayer.innerHTML = '';

    const startTime = Date.now();
    const durationMs = 6500; // 6.5 seconds

    anticipationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / durationMs) * 100);
        if (anticipationProgress) anticipationProgress.style.width = `${progress}%`;
    }, 50);

    let photoSpawnCount = 0;
    function spawnFloatingMemory() {
        if (currentPageId !== 'page7' || !anticipationFloatingLayer) return;

        const imgIdx = photoSpawnCount % anticipationPhotosList.length;
        photoSpawnCount++;

        const card = document.createElement('div');
        card.className = 'anticipation-photo';
        const targetRot = (Math.random() * 24 - 12).toFixed(1);
        card.style.setProperty('--target-rot', `${targetRot}deg`);

        const posX = Math.random() * 60 + 15;
        const posY = Math.random() * 45 + 10;
        card.style.left = `${posX}%`;
        card.style.top = `${posY}%`;

        const img = document.createElement('img');
        img.src = anticipationPhotosList[imgIdx];
        card.appendChild(img);

        anticipationFloatingLayer.appendChild(card);

        requestAnimationFrame(() => {
            card.classList.add('active');
        });

        setTimeout(() => {
            card.classList.remove('active');
            setTimeout(() => card.remove(), 800);
        }, 1800);
    }

    const spawnTimer = setInterval(spawnFloatingMemory, 750);
    spawnFloatingMemory();

    anticipationTimer = setTimeout(() => {
        clearInterval(spawnTimer);
        clearInterval(anticipationInterval);
        if (anticipationSequence) anticipationSequence.classList.add('hide');

        setTimeout(() => {
            if (finalIntro) finalIntro.classList.add('show');
        }, 500);
    }, durationMs);
}

if (finalGiftBox) {
    finalGiftBox.addEventListener('click', () => {
        if (finalIntro) finalIntro.classList.remove('show');
        setTimeout(() => {
            if (finalRevealContainer) finalRevealContainer.classList.add('show');
        }, 400);
    });
}


/* =========================================================
   10. GLOBAL AMBIENT BACKGROUND PARTICLES
========================================================= */
const ambientCanvas = document.getElementById('ambientCanvas');
let ambientCtx = null;
let ambientParticles = [];

function setupAmbientCanvas() {
    if (!ambientCanvas) return;
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
    ambientCtx = ambientCanvas.getContext('2d');

    ambientParticles = [];
    const count = window.innerWidth < 768 ? 24 : 45;
    for (let i = 0; i < count; i++) {
        ambientParticles.push({
            x: Math.random() * ambientCanvas.width,
            y: Math.random() * ambientCanvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.5 - 0.2,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.6 + 0.2,
            color: Math.random() > 0.5 ? '#f7d794' : '#f7b2cb'
        });
    }
}

function renderAmbientParticles() {
    if (!ambientCtx || !ambientCanvas) return;
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

    ambientParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
            p.y = ambientCanvas.height + 10;
            p.x = Math.random() * ambientCanvas.width;
        }
        if (p.x < -10) p.x = ambientCanvas.width + 10;
        if (p.x > ambientCanvas.width + 10) p.x = -10;

        ambientCtx.save();
        ambientCtx.globalAlpha = p.alpha;
        ambientCtx.fillStyle = p.color;
        ambientCtx.beginPath();
        ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ambientCtx.fill();
        ambientCtx.restore();
    });

    requestAnimationFrame(renderAmbientParticles);
}


/* =========================================================
   11. INITIALIZATION & RESIZE LISTENERS
========================================================= */
window.addEventListener('resize', () => {
    setupAmbientCanvas();
    if (currentPageId === 'page4') resizeMagicGestureCanvas();
    if (currentPageId === 'page5') setupScratchCanvas();
});

window.addEventListener('load', () => {
    setupAmbientCanvas();
    renderAmbientParticles();
    updateMemoryCarousel();
    initNightStars();
    switchView('page1');
});