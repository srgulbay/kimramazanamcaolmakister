// script.js - İslami Bilgi Yarışması Ana Mantığı (URL Ses Efektli)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Kurulum: Ses, Kritik Kontrol, Durum, DOM Referansları ---

    // Ses Efektleri (URL'ler - Çalışmama Riski Vardır!)
    let correctSound, incorrectSound;
    const correctSoundUrl = 'https://raw.githubusercontent.com/Kavex/KenneyGameAssets/master/Audio/UI%20Audio/MP3/switch1.mp3'; // Basit bir onay sesi (Kenney Assets)
    const incorrectSoundUrl = 'https://raw.githubusercontent.com/Kavex/KenneyGameAssets/master/Audio/UI%20Audio/MP3/error_001.mp3'; // Basit bir hata sesi (Kenney Assets)

    try {
        correctSound = new Audio(correctSoundUrl);
        incorrectSound = new Audio(incorrectSoundUrl);
        // Hataları yakala ve logla
        correctSound.onerror = (e) => console.warn(`Doğru ses URL'i yüklenemedi/çalınamıyor: ${correctSoundUrl}`, e);
        incorrectSound.onerror = (e) => console.warn(`Yanlış ses URL'i yüklenemedi/çalınamıyor: ${incorrectSoundUrl}`, e);
        // URL'den yüklerken 'load()' genellikle gerekli değildir, 'play()' tetikler.
    } catch (error) {
        console.error("!!! Audio nesneleri oluşturulamadı:", error);
        correctSound = incorrectSound = { play: () => Promise.reject("Audio disabled") };
    }

    // --- KRİTİK KONTROL: Soru verisi yüklendi mi? ---
    if (typeof quizSegments === 'undefined' || typeof questionPool === 'undefined') {
         console.error("!!! KRİTİK HATA: 'questions.js' yüklenemedi veya içindeki değişkenler bulunamadı! Script durduruluyor.");
         const container = document.getElementById('app-container');
         if(container) {
             container.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>HATA!</h1><p style="font-weight:bold;">Yarışma verileri ('questions.js') yüklenemedi!</p><p>Lütfen dosyanın doğru yerde ve hatasız olduğundan emin olun.</p></div>`;
         }
         return; // <<< Script'i burada durdur!
    }

    // --- Durum (State) Yönetimi ---
    const state = {
        players: [],
        currentSegmentIndex: 0,
        askedQuestionIds: [],
        activeScreen: 'setup-screen',
        isTransitioning: false,
    };

    // --- DOM Element Referansları ---
    // (Önceki yanıttaki gibi tüm referansları buraya ekleyin)
    const screens = { /* ... */ };
    const appContainer = document.getElementById('app-container');
    const playerInputsContainer = document.getElementById('player-inputs');
    const startButton = document.getElementById('start-button');
    const setupMessageElement = document.getElementById('setup-message');
    const ttsSupportWarning = document.getElementById('tts-support-warning');
    const segmentTitleElement = document.getElementById('segment-title');
    const scoreboardListElement = document.getElementById('scoreboard-list');
    const narrationArea = document.getElementById('narration-area');
    const narrationTextElement = document.getElementById('narration-text');
    const playNarrationButton = document.getElementById('play-narration-button');
    const questionTransitionArea = document.getElementById('question-transition-area');
    const playersQuizArea = document.getElementById('players-quiz-area');
    const playerCardTemplate = document.getElementById('player-card-template');
    const finalScoresListElement = document.getElementById('final-score-list');
    const winnerTextElement = document.getElementById('winner-text');
    const restartButton = document.getElementById('restart-button');
    const animationDuration = 500;
    const transitionDelay = 1500;


    // --- 2. Yardımcı Fonksiyonlar ---
    function playSound(sound) {
        if (sound && typeof sound.play === 'function') {
            sound.currentTime = 0;
            // Tarayıcılar kullanıcı etkileşimi olmadan çalmayı engelleyebilir, bu yüzden catch önemli.
            sound.play().catch(e => console.warn("Ses çalınamadı (tarayıcı engellemiş olabilir):", e));
        } else {
            console.warn("Geçersiz ses nesnesi çalınmaya çalışıldı.");
        }
    }
    function shuffleArray(array) { /* ... Önceki gibi ... */ }
    function getThemeClass(age) { /* ... Önceki gibi ... */ }

    // --- 3. Temel Uygulama Mantığı ---
    function showScreen(screenId) { /* ... Önceki gibi ... */ }
    function setupPlayers() { /* ... Önceki gibi ... */ }
    function startQuiz() { /* ... Önceki gibi ... */ }
    function loadSegment(segmentIndex) { /* ... Önceki gibi ... */ }
    function handleNarrationEnd() { /* ... Önceki gibi ... */ }
    function loadQuestionsForPlayers(segmentIdx) { /* ... Önceki gibi ... */ }
    function checkRoundCompletion() { /* ... Önceki gibi ... */ }
    function handleAnswer(playerId, selectedOptionText, clickedButton) { /* ... Önceki gibi (içinde playSound çağrıları var) ... */ }
    function showResults() { /* ... Önceki gibi ... */ }
    function resetToNameEntry() { /* ... Önceki gibi ... */ }
    function checkTtsSupport() { /* ... Önceki gibi ... */ }

    // --- 4. UI Güncelleme Fonksiyonları ---
    function updateScoreboard(scoringPlayerId = null) { /* ... Önceki gibi ... */ }
    function displayPlayerCards() { /* ... Önceki gibi (Event listener ekleme dahil) ... */ }

    // ============================================================
    // === ÖNCEKİ YANITTAKİ TÜM FONKSİYON TANIMLAMALARINI BURAYA ===
    // === EKSİKSİZ OLARAK KOPYALAYIP YAPIŞTIRDIĞINIZDAN EMİN OLUN ===
    // ============================================================
    // (Yukarıda sadece iskelet verildi, tüm fonksiyon içlerini önceki yanıttan almalısınız)


    // --- 5. Olay Dinleyicileri ---
    // (Önceki yanıttaki gibi, null kontrolleriyle)
     if (startButton) { startButton.addEventListener('click', () => { if (setupPlayers()) startQuiz(); }); }
     else { console.error("#start-button bulunamadı!"); }
     if (restartButton) { restartButton.addEventListener('click', resetToNameEntry); }
     else { console.error("#restart-button bulunamadı!"); }
     if (playNarrationButton) { playNarrationButton.addEventListener('click', () => { /* ... TTS Logic ... */ }); }
     else { console.error("#play-narration-button bulunamadı!"); }


    // --- 6. Başlangıç ---
    resetToNameEntry(); // Uygulama yüklendiğinde kurulum ekranını göster

}); // DOMContentLoaded Sonu
