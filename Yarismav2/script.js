// script.js - İslami Bilgi Yarışması Ana Mantığı (Gözden Geçirilmiş)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Kurulum: Ses, Kritik Kontrol, Durum, DOM Referansları ---

    // Ses Efektleri (Yerel - Hata Kontrollü)
    let correctSound, incorrectSound;
    try {
        // dogru.mp3 ve yanlis.mp3 dosyalarının index.html ile AYNI KLASÖRDE olduğundan emin olun!
        correctSound = new Audio('dogru.mp3');
        incorrectSound = new Audio('yanlis.mp3');
        correctSound.onerror = (e) => console.warn("Ses dosyası hatası: 'dogru.mp3' yüklenemedi.", e);
        incorrectSound.onerror = (e) => console.warn("Ses dosyası hatası: 'yanlis.mp3' yüklenemedi.", e);
    } catch (error) {
        console.error("!!! Audio nesneleri oluşturulamadı:", error);
        correctSound = incorrectSound = { play: () => Promise.reject("Audio disabled") };
    }

    // Kritik Kontrol: Soru verileri yüklendi mi?
    if (typeof quizSegments === 'undefined' || typeof questionPool === 'undefined') {
        console.error("!!! KRİTİK HATA: 'questions.js' verileri bulunamadı! Uygulama başlatılamıyor.");
        const container = document.getElementById('app-container');
        if (container) {
            container.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>HATA!</h1><p style="font-weight:bold;">Yarışma verileri ('questions.js') yüklenemedi!</p><p>Lütfen dosyanın doğru yerde ve hatasız olduğundan emin olun.</p></div>`;
        }
        return; // <<< Script'i durdur!
    }

    // Oyun Durumu (State)
    const state = {
        players: [], // { id, name, age, score, themeClass, elements: { card, question, options, feedback } }
        currentSegmentIndex: 0,
        askedQuestionIds: [],
        activeScreen: 'setup-screen',
        isTransitioning: false, // Segment geçişi sırasında tekrar işlem yapılmasını önler
    };

    // DOM Element Referansları (Yeni index.html'e göre güncellendi)
    const screens = {
        setup: document.getElementById('setup-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen'),
    };
    const appContainer = document.getElementById('app-container');
    const playerInputsContainer = document.getElementById('player-inputs');
    const startButton = document.getElementById('start-button');
    const setupMessageElement = document.getElementById('setup-message');
    const ttsWarningElement = document.getElementById('tts-warning'); // ID güncellendi

    const segmentTitleElement = document.getElementById('segment-title');
    const scoreboardListElement = document.getElementById('scoreboard-list');
    const narrationArea = document.getElementById('narration-area');
    const narrationTextElement = document.getElementById('narration-text');
    const playNarrationButton = document.getElementById('play-narration-button');
    const questionTransitionArea = document.getElementById('question-transition-area');
    const playersQuizArea = document.getElementById('players-quiz-area'); // Oyuncu kartlarının ekleneceği alan
    const playerCardTemplate = document.getElementById('player-card-template');

    const finalScoresListElement = document.getElementById('final-score-list');
    const winnerTextElement = document.getElementById('winner-text');
    const restartButton = document.getElementById('restart-button');

    const animationDuration = 500; // CSS animation süresi (ms)
    const transitionDelay = 1800; // Cevap sonrası bekleme süresi (ms)

    // --- 2. Yardımcı Fonksiyonlar ---

    function playSound(sound) {
        // Güvenlik kontrolü
        if (sound && typeof sound.play === 'function') {
            sound.currentTime = 0; // Başa sar
            sound.play().catch(e => console.warn("Ses çalınamadı (tarayıcı engeli olabilir):", e));
        }
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getThemeClass(age) {
        if (age >= 7 && age <= 10) return 'theme-child';
        if (age >= 11 && age <= 14) return 'theme-teen';
        if (age >= 15 && age <= 18) return 'theme-young-adult';
        return 'theme-default'; // Gerekirse varsayılan
    }

    // --- 3. Temel Uygulama Mantığı ---

    function showScreen(screenId) {
        if (!appContainer) return;
        state.activeScreen = screenId;
        appContainer.querySelectorAll('.screen').forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        console.log(`Ekran Aktif: ${screenId}`);
    }

    // Oyuncu bilgilerini inputlardan okur ve state.players'ı doldurur
    function setupPlayers() {
        state.players = [];
        const inputGroups = playerInputsContainer?.querySelectorAll('.player-input-group');
        let playerCount = 0;
        let allAgesValid = true;
        if(setupMessageElement) setupMessageElement.textContent = '';
        if(setupMessageElement) setupMessageElement.style.display = 'none';


        if (!inputGroups || inputGroups.length === 0) {
             console.error("Oyuncu giriş alanları bulunamadı.");
             if(setupMessageElement) {
                 setupMessageElement.textContent = 'Hata: Oyuncu giriş alanları yüklenemedi.';
                 setupMessageElement.style.display = 'block';
             }
             return false;
        }

        inputGroups.forEach(group => {
            // data-player-index kullanılıyor (HTML'deki gibi)
            const index = parseInt(group.dataset.playerIndex); // index 0, 1, 2 olacak
            const id = index + 1; // id 1, 2, 3 olacak
            const nameInput = group.querySelector('input[type="text"]');
            const ageInput = group.querySelector('input[type="number"]');

            if (nameInput === null || ageInput === null) {
                console.warn(`Oyuncu ${id} için inputlar bulunamadı.`);
                return; // Bu grubu atla
            }

            const name = nameInput.value.trim();
            const ageString = ageInput.value;
            ageInput.style.borderColor = ''; // Hata stilini temizle

            if (name !== '' || ageString !== '') { // En az biri doluysa
                const age = parseInt(ageString);
                if (!isNaN(age) && age >= 7 && age <= 18) { // Yaş geçerliyse
                    playerCount++;
                    state.players.push({
                        id: id, // 1, 2, 3
                        name: name || `Oyuncu ${id}`,
                        age: age,
                        score: 0,
                        themeClass: getThemeClass(age),
                        answered: false,
                        currentQuestion: null,
                        elements: null // Kart oluşturulunca eklenecek
                    });
                } else if (ageString !== '') { // Yaş girilmiş ama geçersizse
                    if (setupMessageElement) {
                        setupMessageElement.textContent = `Oyuncu ${id} (${name || 'İsimsiz'}) için geçerli yaş (7-18) girilmelidir.`;
                        setupMessageElement.style.display = 'block';
                    }
                    ageInput.style.borderColor = 'var(--error-color)';
                    allAgesValid = false;
                }
                // İsim var ama yaş yoksa veya geçersizse, hata vermeden oyuncu olarak eklemiyoruz.
            }
        });

        if (!allAgesValid) return false; // Geçersiz yaş varsa başlatma

        if (playerCount === 0) {
            if (setupMessageElement) {
                setupMessageElement.textContent = 'Lütfen en az bir oyuncu için isim ve geçerli yaş girin.';
                setupMessageElement.style.display = 'block';
            }
            return false;
        }

        console.log("Geçerli Oyuncular:", state.players);
        return true; // Kurulum başarılı
    }

    // Yarışmayı başlatır
    function startQuiz() {
        console.log("Yarışma başlıyor...");
        state.currentSegmentIndex = 0;
        state.askedQuestionIds = [];
        state.isTransitioning = false;
        // Sadece state içinde var olan oyuncuların skorunu sıfırla
        state.players.forEach(p => { p.score = 0; p.answered = false; p.currentQuestion = null; });

        displayPlayerCards(); // Oyuncu kartlarını HTML'e ekle
        updateScoreboard();   // Skorbordu oluştur/güncelle
        showScreen('quiz-screen'); // Quiz ekranını göster
        loadSegment(state.currentSegmentIndex); // İlk segmenti yükle
    }

    // Belirli bir segmenti yükler (anlatım veya sorular)
    function loadSegment(segmentIndex) {
        if (state.isTransitioning) return;

        if ('speechSynthesis'in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        if (segmentIndex >= quizSegments.length) {
            showResults(); return;
        }

        state.currentSegmentIndex = segmentIndex;
        const segmentData = quizSegments[segmentIndex];
        console.log(`Segment ${segmentIndex + 1} yükleniyor: ${segmentData.narrationTitle}`);

        if (segmentTitleElement) segmentTitleElement.textContent = segmentData.narrationTitle;
        if (narrationTextElement) narrationTextElement.textContent = segmentData.narrationText;
        if (narrationArea) narrationArea.style.display = 'block'; // Anlatımı göster
        if (playNarrationButton) { playNarrationButton.disabled = false; playNarrationButton.textContent = "Anlatımı Dinle"; }
        if (playersQuizArea) playersQuizArea.style.display = 'none'; // Oyuncu kartlarını gizle
        if (questionTransitionArea) questionTransitionArea.style.display = 'none';

        // Oyuncu kartlarını sıfırla
        state.players.forEach(player => {
            if (player.elements) {
                player.answered = false;
                if (player.elements.feedback) player.elements.feedback.textContent = '';
                if (player.elements.card) {
                    player.elements.card.classList.remove('visible', 'animate-correct', 'animate-incorrect');
                    player.elements.card.style.borderColor = 'transparent';
                }
                if (player.elements.options) player.elements.options.innerHTML = '';
                if (player.elements.question) player.elements.question.textContent = "Soru bekleniyor...";
            }
        });
        checkTtsSupport(); // TTS durumuna göre butonu ayarla
    }

    // Anlatım bittiğinde veya geçildiğinde çağrılır
    function handleNarrationEnd() {
        if (state.isTransitioning) return;
        console.log("Anlatım bitti/geçildi.");
        if (playNarrationButton) playNarrationButton.disabled = true;
        if (narrationArea) narrationArea.style.display = 'none';
        if (questionTransitionArea) questionTransitionArea.style.display = 'block';

        setTimeout(() => {
            loadQuestionsForPlayers(state.currentSegmentIndex);
            if (questionTransitionArea) questionTransitionArea.style.display = 'none';
            if (playersQuizArea) playersQuizArea.style.display = 'flex'; // Kartları göstermeye hazırla
            state.players.forEach(player => {
                player.elements?.card?.classList.add('visible'); // Görünür yap
            });
        }, 500);
    }

    // Aktif oyuncular için soruları bulur ve kartlara yükler
    function loadQuestionsForPlayers(segmentIdx) {
        if (state.isTransitioning) return;
        console.log(`Segment ${segmentIdx + 1} için sorular yükleniyor.`);
        let currentRoundSelectedIds = [];

        state.players.forEach(player => {
            if (!player.elements || !(player.age >= 7 && player.age <= 18)) {
                if (player.age >= 7 && player.age <= 18) player.answered = true;
                return;
            }
            player.answered = false; // Her soru yüklemede sıfırla
            player.currentQuestion = null;
            const { card, question: questionEl, options: optionsEl, feedback: feedbackEl } = player.elements;

            card?.classList.remove('animate-correct', 'animate-incorrect');
            if(card) card.style.borderColor = 'transparent';
            if(optionsEl) optionsEl.innerHTML = '';
            if(feedbackEl) feedbackEl.textContent = '';
            if(questionEl) questionEl.textContent = 'Soru aranıyor...';

            const suitableQuestions = questionPool.filter(q =>
                q.segmentId === quizSegments[segmentIdx].segmentId &&
                player.age >= q.minAge && player.age <= q.maxAge &&
                !state.askedQuestionIds.includes(q.questionId) &&
                !currentRoundSelectedIds.includes(q.questionId)
            );

            if (suitableQuestions.length > 0) {
                const questionData = suitableQuestions[Math.floor(Math.random() * suitableQuestions.length)];
                player.currentQuestion = questionData;
                state.askedQuestionIds.push(questionData.questionId);
                currentRoundSelectedIds.push(questionData.questionId);

                if (questionEl) questionEl.textContent = questionData.questionText;
                if (optionsEl) {
                    const shuffledOptions = shuffleArray([...questionData.options]);
                    shuffledOptions.forEach(optionText => {
                        const button = document.createElement('button');
                        button.textContent = optionText;
                        // Event listener displayPlayerCards içinde eklendi
                        optionsEl.appendChild(button);
                    });
                }
                 console.log(`Oyuncu ${player.id} için soru ${questionData.questionId} yüklendi.`);
            } else {
                if (questionEl) questionEl.textContent = 'Size uygun soru bulunamadı.';
                player.answered = true; // Soru yoksa cevaplamış say
                 console.log(`Oyuncu ${player.id} için uygun soru bulunamadı.`);
            }
        });
        // Turun bitip bitmediğini kontrol et (sorular yüklendikten hemen sonra)
        // Eğer kimseye soru bulunamadıysa veya herkesin sorusu yüklendiyse tur bitmiş olabilir.
         setTimeout(checkRoundCompletion, 50); // DOM'a zaman tanımak için kısa timeout
    }

     // Tüm aktif oyuncuların cevap verip vermediğini kontrol eder ve gerekirse sonraki segmente geçer
     function checkRoundCompletion() {
        if (state.isTransitioning) return;

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        if (activePlayers.length === 0) {
             console.log("checkRoundCompletion: Aktif oyuncu yok.");
             showResults(); // Sonuçları göster
             return;
        }

        const allAnswered = activePlayers.every(p => p.answered);

        // Loglama
        console.log("--- checkRoundCompletion ---");
        activePlayers.forEach(p => console.log(`Oyuncu ${p.id} (${p.name}): answered=${p.answered}`));
        console.log(`Tümü cevapladı: ${allAnswered}`);
        console.log("--------------------------");


        if (allAnswered) {
            state.isTransitioning = true;
            console.log(">>> Tur tamamlandı, geçiş başlıyor...");
            if(questionTransitionArea) questionTransitionArea.style.display = 'block';

            setTimeout(() => { // Efektler için bekle
                console.log(">>> Geçiş zaman aşımı doldu.");
                state.players.forEach(p => p.elements?.card?.classList.remove('visible')); // Kartları gizle

                setTimeout(() => { // display:none için ek süre
                    if(playersQuizArea) playersQuizArea.style.display = 'none';
                    loadSegment(state.currentSegmentIndex + 1);
                    state.isTransitioning = false;
                    console.log(">>> Geçiş tamamlandı.");
                }, animationDuration);

            }, transitionDelay);
        }
     }


    // Bir oyuncu cevap verdiğinde çalışır
    function handleAnswer(playerId, selectedOptionText, clickedButton) {
        if (state.isTransitioning) { console.warn("Geçiş sırasında cevap engellendi."); return; }

        const player = state.players.find(p => p.id === playerId);
        if (!player || !player.elements || player.answered || !player.currentQuestion) return;

        player.answered = true; // Cevapladı olarak işaretle
        console.log(`Oyuncu ${player.id} cevapladı: ${selectedOptionText}. Tüm aktifler kontrol edilecek.`);

        const { card: sectionEl, options: optionsEl, feedback: feedbackEl } = player.elements;
        const allButtons = optionsEl?.getElementsByTagName('button');
        if (!feedbackEl || !sectionEl || !optionsEl || !allButtons) return; // Güvenlik kontrolü

        // Butonları pasifleştir ve işaretle
        let correctAnswerButton = null;
        for (let btn of allButtons) {
            btn.disabled = true;
            if (btn.textContent === player.currentQuestion.correctAnswer) {
                btn.classList.add('correct-answer-highlight');
                correctAnswerButton = btn;
            }
            if (btn === clickedButton && selectedOptionText !== player.currentQuestion.correctAnswer) {
                btn.classList.add('user-incorrect-choice');
            }
        }

        let scored = false;
        const isCorrect = (selectedOptionText === player.currentQuestion.correctAnswer);

        if (isCorrect) {
            player.score++; scored = true;
            feedbackEl.textContent = "Doğru!"; feedbackEl.className = 'feedback-area feedback-correct';
            sectionEl?.classList.add('animate-correct');
            playSound(correctSound);
        } else {
            feedbackEl.textContent = `Yanlış! Doğru: ${player.currentQuestion.correctAnswer}`; feedbackEl.className = 'feedback-area feedback-incorrect';
            sectionEl?.classList.add('animate-incorrect');
            playSound(incorrectSound);
        }

        // Animasyon sınıfını kaldır
        setTimeout(() => { sectionEl?.classList.remove('animate-correct', 'animate-incorrect'); }, animationDuration);

        updateScoreboard(scored ? player.id : null);
        checkRoundCompletion(); // Her cevaptan sonra tur bitimini kontrol et
    }

    // Oyuncu kartlarını oluşturur ve DOM'a ekler
    function displayPlayerCards() {
        if (!playersQuizArea || !playerCardTemplate) {
             console.error("Oyuncu alanı veya şablon bulunamadı!");
             return;
        }
        playersQuizArea.innerHTML = ''; // Temizle

        state.players.forEach(player => {
            if (player.age >= 7 && player.age <= 18) {
                try {
                    const cardClone = playerCardTemplate.content.cloneNode(true);
                    const cardElement = cardClone.querySelector('.player-card');
                    if (!cardElement) throw new Error("Şablonda .player-card bulunamadı");

                    const nameEl = cardElement.querySelector('.player-name');
                    const ageEl = cardElement.querySelector('.player-age');
                    const questionEl = cardElement.querySelector('.question-text');
                    const optionsEl = cardElement.querySelector('.options-container');
                    const feedbackEl = cardElement.querySelector('.feedback-area');

                    if (!nameEl || !ageEl || !questionEl || !optionsEl || !feedbackEl) {
                        throw new Error(`Oyuncu ${player.id} kartı için bazı iç elementler eksik.`);
                    }

                    // Element referanslarını state'e kaydet
                    player.elements = { card: cardElement, question: questionEl, options: optionsEl, feedback: feedbackEl };

                    cardElement.dataset.playerId = player.id;
                    cardElement.classList.add(player.themeClass);
                    nameEl.textContent = player.name;
                    ageEl.textContent = `(${player.age} yaş)`;

                    // Event Delegation: Seçeneklere tıklamayı dinle
                    optionsEl.addEventListener('click', (event) => {
                        if (event.target.tagName === 'BUTTON' && !event.target.disabled) {
                            handleAnswer(player.id, event.target.textContent, event.target);
                        }
                    });

                    playersQuizArea.appendChild(cardClone);

                } catch (error) {
                     console.error(`Oyuncu ${player.id} için kart oluşturulurken hata:`, error);
                     // Hata durumunda bu oyuncuyu pasif hale getirebiliriz
                     player.age = 0; // Geçersiz kıl
                     player.elements = null;
                }
            } else {
                player.elements = null; // Aktif değilse elementleri null yap
            }
        });
    }


    // Sonuçları gösterir
    function showResults() {
        if (state.isTransitioning) state.isTransitioning = false;
        // ... (TTS cancel vs.) ...
        console.log("Sonuçlar gösteriliyor.");
        if (!finalScoresListElement || !winnerTextElement) return;

        finalScoresListElement.innerHTML = '';
        winnerTextElement.textContent = '';
        winnerTextElement.className = ''; // Stil sınıfını temizle
        let maxScore = -1;
        let winners = [];

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);

        // Sonuçları skor sırasına göre al
        const sortedPlayers = [...activePlayers].sort((a, b) => b.score - a.score);

        if (sortedPlayers.length === 0) {
             winnerTextElement.textContent = "Yarışan oyuncu bulunamadı.";
             winnerTextElement.classList.add('no-winner');
             showScreen('results-screen');
             return;
        }

        // Final skor listesini oluştur
        sortedPlayers.forEach(player => {
             const resultLine = document.createElement('li');
             resultLine.classList.add('result-line', player.themeClass);
             resultLine.innerHTML = `<span class="name">${player.name} (${player.age} yaş)</span> <span class="score">${player.score} Puan</span>`;
             finalScoresListElement.appendChild(resultLine);

             // Kazanan(lar)ı belirle
             if (player.score > maxScore) { maxScore = player.score; winners = [player.name]; }
             else if (player.score === maxScore && maxScore >= 0) { winners.push(player.name); }
         });

        // Kazanan mesajını ayarla
        if (maxScore <= 0 ) {
            winnerTextElement.textContent = "Kimse puan alamadı!";
            winnerTextElement.classList.add('no-winner');
        } else if (winners.length > 1) {
            winnerTextElement.textContent = `Kazananlar: ${winners.join(', ')} (${maxScore} puan)!`;
        } else {
            winnerTextElement.textContent = `Kazanan: ${winners[0]} (${maxScore} puan)!`;
        }
        showScreen('results-screen');
    }

    // Kurulum ekranına sıfırlar
    function resetToNameEntry() {
        console.log("Kurulum ekranına sıfırlanıyor.");
        if (state.isTransitioning) state.isTransitioning = false;
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) { /* ... cancel ... */ }

        // Inputları temizle
        const allNameInputs = playerInputsContainer?.querySelectorAll('input[type="text"]');
        const allAgeInputs = playerInputsContainer?.querySelectorAll('input[type="number"]');
        allNameInputs?.forEach(input => input.value = '');
        allAgeInputs?.forEach(input => { input.value = ''; input.style.borderColor = ''; });

        if(setupMessageElement) { setupMessageElement.textContent = ''; setupMessageElement.style.display = 'none'; }
        if (scoreboardListElement) scoreboardListElement.innerHTML = '';

        // State'i sıfırla
        state.players = []; // Oyuncuları tamamen temizle
        state.askedQuestionIds = [];
        state.currentSegmentIndex = 0;

        checkTtsSupport();
        showScreen('setup-screen');
    }

    // TTS desteğini kontrol eder
    function checkTtsSupport() {
        const hasTts = 'speechSynthesis' in window && window.speechSynthesis;
        if(ttsWarningElement) ttsWarningElement.style.display = hasTts ? 'none' : 'block';
        // Anlatım butonu sadece quiz ekranında görünmeli, burada gizlenebilir
        // if(playNarrationButton) playNarrationButton.style.display = 'none';
    }


    // --- 5. Olay Dinleyicileri ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log("Başlat butonuna tıklandı.");
            if (setupPlayers()) { // Oyuncuları kurmayı dene
                startQuiz(); // Başarılıysa yarışmayı başlat
            } else {
                 console.log("Oyuncu kurulumu başarısız, yarışma başlatılmadı.");
            }
        });
    } else { console.error("#start-button bulunamadı!"); }

    if (restartButton) {
        restartButton.addEventListener('click', resetToNameEntry);
    } else { console.error("#restart-button bulunamadı!"); }

    if (playNarrationButton) {
         playNarrationButton.addEventListener('click', () => {
             console.log("Anlatım oynatma butonuna tıklandı.");
             const segmentData = quizSegments[state.currentSegmentIndex];
             if (!segmentData?.narrationText) return;

             if (!('speechSynthesis' in window && window.speechSynthesis)) {
                 console.warn("TTS desteklenmiyor, anlatım geçiliyor.");
                 handleNarrationEnd(); return; // Destek yoksa direkt geç
             }
             window.speechSynthesis.cancel(); // Öncekiyi durdur

             const utterance = new SpeechSynthesisUtterance(segmentData.narrationText);
             utterance.lang = 'tr-TR'; utterance.rate = 0.9; utterance.pitch = 1;
             utterance.onend = handleNarrationEnd; // Bitince soruları yükle
             utterance.onerror = (event) => { console.error('TTS Hatası:', event); handleNarrationEnd(); }; // Hata olsa da geç

             playNarrationButton.disabled = true; // Oynatılırken pasif
             window.speechSynthesis.speak(utterance);
         });
     } else { console.error("#play-narration-button bulunamadı!"); }


    // --- 6. Başlangıç ---
    resetToNameEntry(); // Uygulama ilk açıldığında kurulum ekranını göster

}); // DOMContentLoaded Sonu
