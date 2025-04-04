// script.js - İslami Bilgi Yarışması Ana Mantığı

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Kurulum: Ses, Kritik Kontrol, Durum, DOM Referansları ---

    // Ses Efektleri (Hata Kontrollü)
    let correctSound, incorrectSound;
    try {
        // BU DOSYALARIN index.html İLE AYNI KLASÖRDE OLDUĞUNDAN EMİN OLUN!
        correctSound = new Audio('dogru.mp3');
        incorrectSound = new Audio('yanlis.mp3');
        correctSound.onerror = (e) => console.warn("Ses dosyası hatası: 'dogru.mp3' yüklenemedi.", e);
        incorrectSound.onerror = (e) => console.warn("Ses dosyası hatası: 'yanlis.mp3' yüklenemedi.", e);
        // İsteğe bağlı: Sesleri önceden yüklemeye çalış (tarayıcıya bağlı)
        correctSound.load();
        incorrectSound.load();
    } catch (error) {
        console.error("!!! Audio nesneleri oluşturulamadı. Sesler çalışmayacak.", error);
        correctSound = incorrectSound = { play: () => Promise.reject("Audio disabled") }; // Hata durumunda boş fonksiyon ata
    }

    // Kritik Kontrol: Soru verileri yüklendi mi?
    if (typeof quizSegments === 'undefined' || typeof questionPool === 'undefined') {
        console.error("!!! KRİTİK HATA: 'questions.js' yüklenemedi veya içindeki değişkenler bulunamadı! Script durduruluyor.");
        const container = document.getElementById('app-container'); // Ana konteyneri bul
        if (container) {
            container.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>HATA!</h1><p style="font-weight:bold;">Yarışma verileri ('questions.js') yüklenemedi!</p><p>Lütfen dosyanın doğru yerde ve hatasız olduğundan emin olun.</p></div>`;
        }
        return; // <<< Script'i burada durdur!
    }

    // Oyun Durumu (State)
    const state = {
        players: [], // { id, name, age, score, themeClass, elements: { card, question, options, feedback } }
        currentSegmentIndex: 0,
        askedQuestionIds: [],
        activeScreen: 'setup-screen',
        isTransitioning: false, // Geçiş animasyonları sırasında tekrar işlem yapılmasını önler
    };

    // DOM Element Referansları
    const screens = {
        setup: document.getElementById('setup-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen'),
    };
    const appContainer = document.getElementById('app-container'); // Ana konteyner
    const playerInputsContainer = document.getElementById('player-inputs');
    const startButton = document.getElementById('start-button'); // ID değişti!
    const setupMessageElement = document.getElementById('setup-message');
    const ttsSupportWarning = document.getElementById('tts-support-warning'); // index.html'de ID eklendi varsayıyoruz

    const segmentTitleElement = document.getElementById('segment-title');
    const scoreboardListElement = document.getElementById('scoreboard-list');
    const narrationArea = document.getElementById('narration-area');
    const narrationTextElement = document.getElementById('narration-text');
    const playNarrationButton = document.getElementById('play-narration-button'); // ID değişti!
    const questionTransitionArea = document.getElementById('question-transition-area');
    const playersQuizArea = document.getElementById('players-quiz-area'); // ID değişti!
    const playerCardTemplate = document.getElementById('player-card-template');

    const finalScoresListElement = document.getElementById('final-score-list'); // ID değişti!
    const winnerTextElement = document.getElementById('winner-text'); // ID değişti!
    const restartButton = document.getElementById('restart-button'); // ID değişti!

    const animationDuration = 500; // CSS ile eşleşmeli (ms) - 0.5s
    const transitionDelay = 1500; // Cevap sonrası bekleme

    // --- 2. Yardımcı Fonksiyonlar ---

    function playSound(sound) {
        if (sound && typeof sound.play === 'function') {
            sound.currentTime = 0;
            sound.play().catch(e => console.warn("Ses çalınamadı:", e));
        }
    }

    function shuffleArray(array) {
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
        // Tüm ekranları dolaş, sadece aktif olanı göster
        appContainer.querySelectorAll('.screen').forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        console.log(`Ekran değiştirildi: ${screenId}`);
    }

    function setupPlayers() {
        state.players = [];
        const inputGroups = playerInputsContainer?.querySelectorAll('.player-input-group');
        let playerCount = 0;
        let allValid = true;
        if(setupMessageElement) setupMessageElement.textContent = ''; // Önceki hatayı temizle

        if (!inputGroups || inputGroups.length === 0) {
            console.error("Oyuncu giriş alanları bulunamadı.");
            if (setupMessageElement) setupMessageElement.textContent = 'Oyuncu giriş alanları yüklenemedi.';
            return false;
        }

        inputGroups.forEach(group => {
            const id = parseInt(group.dataset.playerId);
            const nameInput = group.querySelector(`input[type="text"]`);
            const ageInput = group.querySelector(`input[type="number"]`);

            if (!id || !nameInput || !ageInput) return;

            const name = nameInput.value.trim();
            const ageString = ageInput.value;
            ageInput.style.borderColor = ''; // Önceki hatayı temizle

            if (name !== '' || ageString !== '') {
                const age = parseInt(ageString);
                if (isNaN(age) || age < 7 || age > 18) {
                    if(ageString !== '') { // Sadece yaş girilmiş ve hatalıysa uyar
                         if (setupMessageElement) setupMessageElement.textContent = `Oyuncu ${id} (${name || 'İsimsiz'}) için geçerli yaş (7-18) girilmelidir.`;
                         ageInput.style.borderColor = 'var(--error-color)';
                         allValid = false;
                    }
                    // İsim girilmiş ama yaş boşsa veya hatalıysa, oyuncu sayılmaz ama hata vermez
                } else {
                    // Hem isim hem geçerli yaş varsa oyuncuyu ekle
                    playerCount++;
                    state.players.push({
                        id: id,
                        name: name || `Oyuncu ${id}`,
                        age: age,
                        score: 0,
                        themeClass: getThemeClass(age),
                        answered: false,
                        currentQuestion: null,
                        elements: null // Kart oluşturulunca atanacak
                    });
                }
            }
        });

        if (!allValid) return false; // Geçersiz yaş varsa başlatma

        if (playerCount === 0) {
            if (setupMessageElement) setupMessageElement.textContent = 'Lütfen en az bir oyuncu için isim ve geçerli yaş girin.';
            return false;
        }

        console.log("Oyuncular kuruldu:", state.players);
        return true; // Kurulum başarılı
    }

    function startQuiz() {
        console.log("Yarışma başlıyor...");
        state.currentSegmentIndex = 0;
        state.askedQuestionIds = [];
        state.isTransitioning = false; // Geçiş bayrağını sıfırla
        state.players.forEach(p => { p.score = 0; p.answered = false; p.currentQuestion = null; });

        displayPlayerCards(); // Oyuncu kartlarını HTML'e ekle
        updateScoreboard();   // Skorbordu ilk kez oluştur/güncelle
        showScreen('quiz-screen'); // Quiz ekranını göster
        loadSegment(state.currentSegmentIndex); // İlk segmenti yükle
    }

    function loadSegment(segmentIndex) {
        if (state.isTransitioning) return; // Zaten geçiş varsa tekrar yükleme

        // TTS durdurma
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        // Son segment mi kontrolü
        if (segmentIndex >= quizSegments.length) {
            showResults();
            return;
        }

        state.currentSegmentIndex = segmentIndex;
        const segmentData = quizSegments[segmentIndex];
        console.log(`Segment ${segmentIndex + 1} yükleniyor: ${segmentData.narrationTitle}`);

        // UI Güncellemeleri
        if (segmentTitleElement) segmentTitleElement.textContent = segmentData.narrationTitle;
        if (narrationTextElement) narrationTextElement.textContent = segmentData.narrationText;
        if (narrationArea) narrationArea.style.display = 'block';
        if (playNarrationButton) { playNarrationButton.disabled = false; playNarrationButton.textContent = "Anlatımı Dinle"; }
        if (playersQuizArea) playersQuizArea.style.display = 'none'; // Kartları gizle
        if (questionTransitionArea) questionTransitionArea.style.display = 'none'; // Geçiş mesajını gizle

        // Oyuncu kartlarını sıfırla
        state.players.forEach(player => {
            if (player.elements) {
                player.answered = false;
                if (player.elements.feedback) player.elements.feedback.textContent = '';
                if (player.elements.card) {
                    player.elements.card.classList.remove('visible', 'animate-correct', 'animate-incorrect');
                    player.elements.card.style.borderColor = 'transparent';
                }
                if (player.elements.options) player.elements.options.innerHTML = ''; // Seçenekleri temizle
                if (player.elements.question) player.elements.question.textContent = "Soru bekleniyor...";
            }
        });

        // TTS desteğini kontrol et ve butonu ayarla
        checkTtsSupport();
        // İsteğe bağlı: Eğer TTS yoksa veya kullanıcı istemiyorsa anlatımı otomatik geç
        // if (!('speechSynthesis' in window && window.speechSynthesis)) {
        //     handleNarrationEnd();
        // }
    }

    function handleNarrationEnd() {
        if (state.isTransitioning) return;
        console.log("Anlatım bitti/geçildi.");
        if (playNarrationButton) playNarrationButton.disabled = true;
        if (narrationArea) narrationArea.style.display = 'none';
        if (questionTransitionArea) questionTransitionArea.style.display = 'block'; // Yükleniyor mesajını göster

        setTimeout(() => {
            loadQuestionsForPlayers(state.currentSegmentIndex);
            if (questionTransitionArea) questionTransitionArea.style.display = 'none';
            if (playersQuizArea) playersQuizArea.style.display = 'flex';
            // Kartları görünür yap
            state.players.forEach(player => {
                player.elements?.card?.classList.add('visible');
            });
        }, 500); // Kısa gecikme
    }

    function loadQuestionsForPlayers(segmentIdx) {
        if (state.isTransitioning) return;
        console.log(`Segment ${segmentIdx + 1} için sorular yükleniyor.`);
        let currentRoundSelectedIds = [];

        state.players.forEach(player => {
            // Sadece aktif ve kartı olan oyuncular için
            if (!player.elements || !(player.age >= 7 && player.age <= 18)) {
                if (player.age >= 7 && player.age <= 18) player.answered = true; // Kartı yoksa ama aktifse cevaplamış say
                return;
            }

            player.answered = false;
            player.currentQuestion = null;
            const { card, question: questionEl, options: optionsEl, feedback: feedbackEl } = player.elements;

            // Temizlik
            card?.classList.remove('animate-correct', 'animate-incorrect');
            if (card) card.style.borderColor = 'transparent';
            if (optionsEl) optionsEl.innerHTML = '';
            if (feedbackEl) feedbackEl.textContent = '';
            if (questionEl) questionEl.textContent = 'Soru aranıyor...';

            // Uygun soruları bul...
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
                        // Event listener artık displayPlayerCards içinde eklendi (event delegation)
                        optionsEl.appendChild(button);
                    });
                }
            } else {
                if (questionEl) questionEl.textContent = 'Size uygun soru bulunamadı.';
                player.answered = true; // Soru yoksa cevaplamış say
            }
        });
        // Turun başlangıcında da kontrol et (belki kimseye soru bulunmadı)
        // Kısa bir timeout ile çağırmak, DOM güncellemelerine zaman tanır
        setTimeout(() => checkRoundCompletion(), 50);
    }

     // TUR BİTİM KONTROLÜ (Güncellenmiş)
     function checkRoundCompletion() {
        if (state.isTransitioning) return; // Zaten geçişteyse çık

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        if (activePlayers.length === 0) {
            console.log("Aktif oyuncu yok, sonuçlara gidiliyor.");
            showResults();
            return;
        }

        const allAnswered = activePlayers.every(p => p.answered);

        // Loglama
        console.log("--- checkRoundCompletion ---");
        activePlayers.forEach(p => console.log(`Oyuncu ${p.id}: answered=${p.answered}`));
        console.log(`Tümü cevapladı: ${allAnswered}`);
        console.log("--------------------------");

        if (allAnswered) {
            state.isTransitioning = true; // Geçişi başlat
            console.log(">>> Tur tamamlandı, geçiş başlıyor...");
            if(questionTransitionArea) questionTransitionArea.style.display = 'block'; // Geçiş mesajı

            setTimeout(() => {
                console.log(">>> Geçiş zaman aşımı doldu.");
                state.players.forEach(p => p.elements?.card?.classList.remove('visible')); // Kartları gizle (animasyonla)

                setTimeout(() => { // display:none için ek süre
                    if(playersQuizArea) playersQuizArea.style.display = 'none';
                    loadSegment(state.currentSegmentIndex + 1); // Sonraki segmenti yükle
                    state.isTransitioning = false; // Geçiş bitti
                    console.log(">>> Geçiş tamamlandı.");
                }, animationDuration); // CSS animasyon/transition süresi

            }, transitionDelay); // Cevap sonrası bekleme süresi
        }
     }


     // CEVAP İŞLEME (Güncellenmiş - Event Delegation ile çalışacak)
     function handleAnswer(playerId, selectedOptionText, clickedButton) {
        if (state.isTransitioning) return; // Geçiş sırasında işlem yapma

        const player = state.players.find(p => p.id === playerId);
        if (!player || !player.elements || player.answered || !player.currentQuestion) {
             console.warn(`handleAnswer: Geçersiz durum - Oyuncu: ${playerId}`);
             return;
        }

        player.answered = true; // Cevapladı
        console.log(`Oyuncu ${player.id} cevapladı: ${selectedOptionText}`);

        const { card: sectionEl, options: optionsEl, feedback: feedbackEl } = player.elements;
        const allButtons = optionsEl?.getElementsByTagName('button');

        if (!feedbackEl || !sectionEl || !optionsEl || !allButtons) return; // Element kontrolü

        // Tüm butonları pasifleştir
        for (let btn of allButtons) { btn.disabled = true; }

        let scored = false;
        const isCorrect = (selectedOptionText === player.currentQuestion.correctAnswer);

        // Geri bildirim ve efektler
        if (isCorrect) {
            player.score++;
            scored = true;
            feedbackEl.textContent = "Doğru!";
            feedbackEl.className = 'feedback-area feedback-correct'; // Class'ı tam ata
            sectionEl?.classList.add('animate-correct');
            clickedButton?.classList.add('correct-answer-highlight'); // Sadece doğruyu işaretle
            playSound(correctSound);
        } else {
            feedbackEl.textContent = `Yanlış! Doğru Cevap: ${player.currentQuestion.correctAnswer}`;
            feedbackEl.className = 'feedback-area feedback-incorrect'; // Class'ı tam ata
            sectionEl?.classList.add('animate-incorrect');
            clickedButton?.classList.add('user-incorrect-choice'); // Yanlış seçimi işaretle
             // Doğru cevabı da bul ve işaretle
             for (let btn of allButtons) {
                 if (btn.textContent === player.currentQuestion.correctAnswer) {
                     btn.classList.add('correct-answer-highlight');
                     break; // Bulunca döngüden çık
                 }
             }
            playSound(incorrectSound);
        }

        // Animasyon sınıfını kaldır
        setTimeout(() => {
            sectionEl?.classList.remove('animate-correct', 'animate-incorrect');
        }, animationDuration);

        updateScoreboard(scored ? player.id : null);
        checkRoundCompletion(); // Tur bitti mi kontrol et
    }


     // KART OLUŞTURMA VE EVENT LISTENER EKLEME
     function displayPlayerCards() {
        if (!playersQuizArea || !playerCardTemplate) return;
        playersQuizArea.innerHTML = ''; // Temizle

        state.players.forEach(player => {
            if (player.age >= 7 && player.age <= 18) { // Sadece aktif oyuncular için kart oluştur
                 const cardClone = playerCardTemplate.content.cloneNode(true);
                 const cardElement = cardClone.querySelector('.player-card');
                 if (!cardElement) return; // Şablon hatası varsa atla

                 // Element referanslarını al ve sakla
                 const nameEl = cardElement.querySelector('.player-name');
                 const ageEl = cardElement.querySelector('.player-age');
                 const questionEl = cardElement.querySelector('.question-text');
                 const optionsEl = cardElement.querySelector('.options-container');
                 const feedbackEl = cardElement.querySelector('.feedback-area');

                 player.elements = { card: cardElement, question: questionEl, options: optionsEl, feedback: feedbackEl };

                 // Kart bilgilerini doldur
                 cardElement.dataset.playerId = player.id;
                 cardElement.classList.add(player.themeClass);
                 if (nameEl) nameEl.textContent = player.name;
                 if (ageEl) ageEl.textContent = `(${player.age} yaş)`;

                 // Event Delegation: Seçeneklere tıklamayı dinle
                 if (optionsEl) {
                     optionsEl.addEventListener('click', (event) => {
                         // Sadece butonlara tıklandıysa işlem yap
                         if (event.target.tagName === 'BUTTON') {
                             handleAnswer(player.id, event.target.textContent, event.target);
                         }
                     });
                 }

                 playersQuizArea.appendChild(cardClone);
            } else {
                player.elements = null; // Aktif olmayan oyuncunun elementleri null olsun
            }
        });
    }

     // SONUÇ GÖSTERME
     function showResults() {
        if (state.isTransitioning) state.isTransitioning = false; // Geçişi bitir
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) { /* ... cancel ... */ }
        console.log("Sonuçlar gösteriliyor.");
        if (!finalScoresListElement || !winnerTextElement) return;

        finalScoresListElement.innerHTML = '';
        winnerTextElement.textContent = ''; // Önceki kazananı temizle
        winnerTextElement.className = ''; // Kazanan stilini temizle
        let maxScore = -1;
        let winners = [];

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        if (activePlayers.length === 0) {
             winnerTextElement.textContent = "Yarışan oyuncu bulunamadı.";
             winnerTextElement.classList.add('no-winner');
             showScreen('results-screen');
             return;
        }

        const sortedPlayers = [...activePlayers].sort((a, b) => b.score - a.score);

        sortedPlayers.forEach(player => {
             const resultLine = document.createElement('li'); // li olarak değiştirildi
             resultLine.classList.add('result-line', player.themeClass);
             resultLine.innerHTML = `<span class="name">${player.name} (${player.age} yaş)</span> <span class="score">${player.score} Puan</span>`;
             finalScoresListElement.appendChild(resultLine);

             if (player.score > maxScore) { maxScore = player.score; winners = [player.name]; }
             else if (player.score === maxScore && maxScore >= 0) { winners.push(player.name); }
         });

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

     // BAŞLANGICA DÖN
     function resetToNameEntry() {
        if (state.isTransitioning) state.isTransitioning = false; // Geçişi durdur
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) { /* ... cancel ... */ }

        // Inputları temizle
        const allNameInputs = playerInputsContainer?.querySelectorAll('input[type="text"]');
        const allAgeInputs = playerInputsContainer?.querySelectorAll('input[type="number"]');
        allNameInputs?.forEach(input => input.value = '');
        allAgeInputs?.forEach(input => { input.value = ''; input.style.borderColor = ''; });

        if(setupMessageElement) setupMessageElement.textContent = '';
        if (scoreboardListElement) scoreboardListElement.innerHTML = '';

        // Oyuncu state'ini sıfırla ama referansları koru
        state.players.forEach(p => {
             p.score = 0; p.age = 0; p.answered = false; p.currentQuestion = null; p.elements = null; p.themeClass = '';
        });
        state.askedQuestionIds = [];
        state.currentSegmentIndex = 0;


        checkTtsSupport();
        showScreen('setup-screen');
    }

     // TTS DESTEK KONTROLÜ
     function checkTtsSupport() {
        const hasTts = 'speechSynthesis' in window && window.speechSynthesis;
        if(ttsSupportWarning) ttsSupportWarning.style.display = hasTts ? 'none' : 'block';
         // TTS butonu sadece quiz ekranında anlamlı, belki burada gizlenmeli?
         // if(playNarrationButton) playNarrationButton.style.display = 'none';
     }

    // --- 5. Olay Dinleyicileri ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (setupPlayers()) { // Kurulum başarılıysa başlat
                startQuiz();
            }
        });
    } else { console.error("#start-button bulunamadı!"); }

    if (restartButton) {
        restartButton.addEventListener('click', resetToNameEntry);
    } else { console.error("#restart-button bulunamadı!"); }

    if (playNarrationButton) {
         playNarrationButton.addEventListener('click', () => {
            const segmentData = quizSegments[state.currentSegmentIndex];
            if (!segmentData?.narrationText) return; // Metin yoksa çık

            if (!('speechSynthesis' in window && window.speechSynthesis)) {
                 console.warn("TTS desteklenmiyor, anlatım geçiliyor.");
                 handleNarrationEnd(); return;
            }
            window.speechSynthesis.cancel(); // Öncekiyi durdur
            const utterance = new SpeechSynthesisUtterance(segmentData.narrationText);
            utterance.lang = 'tr-TR'; utterance.rate = 0.9; utterance.pitch = 1;
            utterance.onend = handleNarrationEnd;
            utterance.onerror = (event) => { console.error('TTS Hatası:', event); handleNarrationEnd(); };
            playNarrationButton.disabled = true;
            window.speechSynthesis.speak(utterance);
         });
     } else { console.error("#play-narration-button bulunamadı!"); }


    // --- 6. Başlangıç ---
    resetToNameEntry(); // Uygulama ilk açıldığında kurulum ekranını göster

}); // DOMContentLoaded Sonu
