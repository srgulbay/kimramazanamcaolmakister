// script.js - İslami Bilgi Yarışması Ana Mantığı

document.addEventListener('DOMContentLoaded', () => {

    // --- Ses Efektleri ---
    let correctSound, incorrectSound;
    try {
        correctSound = new Audio('dogru.mp3');
        incorrectSound = new Audio('yanlis.mp3');
        correctSound.onerror = (e) => console.warn("Ses dosyası hatası: 'dogru.mp3' yüklenemedi.", e);
        incorrectSound.onerror = (e) => console.warn("Ses dosyası hatası: 'yanlis.mp3' yüklenemedi.", e);
    } catch (error) {
        console.error("Audio nesneleri oluşturulamadı:", error);
        correctSound = incorrectSound = { play: () => Promise.reject("Audio disabled") };
    }

    // --- KRİTİK KONTROL ---
    if (typeof quizSegments === 'undefined' || typeof questionPool === 'undefined') {
         console.error("!!! KRİTİK HATA: 'questions.js' verileri bulunamadı! Script durduruluyor.");
         // index.html içinde bu durum zaten ele alınmalı, ancak burada da durduralım.
         document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>HATA!</h1><p>Gerekli soru verileri yüklenemedi. Lütfen 'questions.js' dosyasını kontrol edin.</p></div>`;
         return;
    }

    // --- Durum (State) Yönetimi ---
    const state = {
        players: [], // { id, name, age, score, themeClass, currentQuestion, answered, element? }
        currentSegmentIndex: 0,
        askedQuestionIds: [],
        activeScreen: 'setup-screen', // Aktif ekranın ID'si
        // Diğer durumlar eklenebilir
    };

    // --- DOM Elementleri ---
    const screens = {
        setup: document.getElementById('setup-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen'),
    };
    const nameEntryContainer = document.getElementById('name-entry');
    const startQuizButton = document.getElementById('start-quiz-button');
    const setupErrorElement = document.getElementById('setup-error');
    const ttsSupportWarning = document.getElementById('tts-support-warning');

    const segmentTitleElement = document.getElementById('segment-title');
    const scoreboardListElement = document.getElementById('scoreboard-list');
    const narrationArea = document.getElementById('narration-area');
    const narrationTextElement = document.getElementById('narration-text');
    const playNarrationButton = document.getElementById('play-narration-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const playersArea = document.getElementById('players-area');
    const playerCardTemplate = document.getElementById('player-card-template');

    const finalScoresElement = document.getElementById('final-scores');
    const winnerInfoElement = document.getElementById('winner-info');
    const restartQuizButton = document.getElementById('restart-quiz-button');

    const animationDuration = 600; // CSS ile eşleşmeli

    // --- Yardımcı Fonksiyonlar ---
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
        return 'theme-default';
    }

    // --- Ekran Yönetimi ---
    function showScreen(screenId) {
        state.activeScreen = screenId;
        for (const id in screens) {
            screens[id]?.classList.toggle('active', id === screenId.replace('-screen', ''));
        }
        console.log(`Aktif Ekran: ${screenId}`);
    }

    // --- UI Güncelleme Fonksiyonları ---
    function updateScoreboard(scoringPlayerId = null) {
        if (!scoreboardListElement) return;
        scoreboardListElement.innerHTML = ''; // İçeriği temizle

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        activePlayers.sort((a, b) => a.id - b.id); // ID'ye göre sırala

        activePlayers.forEach(player => {
            const listItem = document.createElement('li');
            listItem.dataset.playerId = player.id;
            listItem.classList.add(player.themeClass);

            const nameSpan = `<span class="name">${player.name}</span>`;
            const scoreSpan = `<span class="score">${player.score} Puan</span>`;
            listItem.innerHTML = `${nameSpan}${scoreSpan}`;

            if (player.id === scoringPlayerId) {
                listItem.classList.add('score-update-animation');
                setTimeout(() => {
                    const currentLi = scoreboardListElement?.querySelector(`li[data-player-id="${player.id}"]`);
                    currentLi?.classList.remove('score-update-animation');
                }, animationDuration);
            }
            scoreboardListElement.appendChild(listItem);
        });
    }

    function displayPlayerCards() {
        if (!playersArea || !playerCardTemplate) return;
        playersArea.innerHTML = ''; // Önce temizle

        state.players.forEach(player => {
            if (player.age >= 7 && player.age <= 18) {
                const cardClone = playerCardTemplate.content.cloneNode(true);
                const cardElement = cardClone.querySelector('.player-quiz-area');
                const infoEl = cardElement.querySelector('.player-info');
                const nameEl = cardElement.querySelector('.player-name');
                const ageEl = cardElement.querySelector('.player-age');
                const questionEl = cardElement.querySelector('.player-question');
                const optionsEl = cardElement.querySelector('.player-options');
                const feedbackEl = cardElement.querySelector('.player-feedback');

                cardElement.dataset.playerId = player.id;
                cardElement.classList.add(player.themeClass);
                if (nameEl) nameEl.textContent = player.name;
                if (ageEl) ageEl.textContent = `(${player.age} yaş)`;

                // Oyuncu nesnesine element referanslarını ekle
                player.elements = { card: cardElement, question: questionEl, options: optionsEl, feedback: feedbackEl };

                playersArea.appendChild(cardClone);
            }
        });
    }


    // --- Oyun Mantığı Fonksiyonları ---

    function setupPlayers() {
        state.players = []; // Önceki oyuncuları temizle
        const inputGroups = nameEntryContainer?.querySelectorAll('.player-input-group');
        let playerCount = 0;
        let allValid = true;

        if (!inputGroups) return false; // Input grupları yoksa çık

        inputGroups.forEach(group => {
            const id = parseInt(group.dataset.playerId);
            const nameInput = group.querySelector(`input[type="text"]`);
            const ageInput = group.querySelector(`input[type="number"]`);

            if (!nameInput || !ageInput) return;

            const name = nameInput.value.trim();
            const ageString = ageInput.value;
            let age = 0;
            let themeClass = '';

            // Yaş alanı boş değilse veya isim alanı boş değilse oyuncu olarak değerlendir
            if (name !== '' || ageString !== '') {
                 age = parseInt(ageString);
                 if (isNaN(age) || age < 7 || age > 18) {
                    if (setupErrorElement) setupErrorElement.textContent = `Oyuncu ${id} (${name || 'İsimsiz'}) için geçerli yaş (7-18) girilmelidir.`;
                    if (ageInput) ageInput.style.border = '2px solid red';
                    allValid = false;
                 } else {
                    playerCount++;
                    themeClass = getThemeClass(age);
                    if (ageInput) ageInput.style.border = ''; // Hata yoksa border'ı sıfırla
                     state.players.push({
                         id: id,
                         name: name || `Oyuncu ${id}`,
                         age: age,
                         score: 0,
                         themeClass: themeClass,
                         currentQuestion: null,
                         answered: false,
                         elements: null // Kart oluşturulunca eklenecek
                     });
                 }
            } else {
                 // İki alan da boşsa, hata borderını temizle (varsa)
                 if(ageInput) ageInput.style.border = '';
            }
        });

        if (!allValid) return false; // Yaş hatası varsa başlatma

        if (playerCount === 0) {
            if (setupErrorElement) setupErrorElement.textContent = 'Lütfen en az bir oyuncu için isim ve yaş girin.';
            return false; // Oyuncu yoksa başlatma
        }

        if (setupErrorElement) setupErrorElement.textContent = ''; // Hata yoksa mesajı temizle
        return true; // Kurulum başarılı
    }

    function startQuiz() {
        console.log("Quiz Başlatılıyor...");
        state.currentSegmentIndex = 0;
        state.askedQuestionIds = [];
        state.players.forEach(p => { p.score = 0; p.answered = false; p.currentQuestion = null; }); // Skorları sıfırla

        displayPlayerCards(); // Oyuncu kartlarını oluştur/göster
        updateScoreboard(); // Skorbordu sıfırla/göster
        showScreen('quiz-screen'); // Quiz ekranına geç
        loadSegment(state.currentSegmentIndex); // İlk segmenti yükle
    }

    function loadSegment(segmentIndex) {
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        if (segmentIndex >= quizSegments.length) {
            showResults(); // Tüm segmentler bitti, sonuçları göster
            return;
        }
        state.currentSegmentIndex = segmentIndex;
        const segmentData = quizSegments[segmentIndex];

        // UI Elementlerini güncelle
        if(segmentTitleElement) segmentTitleElement.textContent = segmentData.narrationTitle;
        if (narrationTextElement) narrationTextElement.textContent = segmentData.narrationText;
        if (narrationArea) narrationArea.style.display = 'block'; // Anlatım alanını göster
        if (playNarrationButton) { playNarrationButton.disabled = false; playNarrationButton.textContent = "Anlatımı Dinle"; }
        if (playersArea) playersArea.style.display = 'none'; // Sorular gelene kadar oyuncu alanını gizle
        if (loadingIndicator) loadingIndicator.style.display = 'none'; // Yükleniyor'u gizle

        // Oyuncu kartlarındaki önceki durumları temizle
        state.players.forEach(player => {
            if (player.elements) {
                player.answered = false; // Cevap durumunu sıfırla
                 if (player.elements.feedback) player.elements.feedback.textContent = '';
                 if (player.elements.card) player.elements.card.classList.remove('animate-correct', 'animate-incorrect');
                 if (player.elements.card) player.elements.card.style.borderColor = 'transparent';
                 // Butonları temizle ve aktif et
                 if (player.elements.options) {
                     player.elements.options.innerHTML = ''; // Önceki seçenekleri temizle (yeni sorular için)
                 }
                 if(player.elements.question) player.elements.question.textContent = "Soru bekleniyor...";
            }
        });
         // Anlatımı otomatik oynatmak yerine butona basılmasını bekle
         // VEYA TTS yoksa/istenmiyorsa direkt soruları yükle:
         // handleNarrationEnd(); // Bunu kullanırsak anlatım otomatik geçilir
    }

    function handleNarrationEnd() {
        console.log("Anlatım bitti/geçildi, sorular yükleniyor.");
        if(playNarrationButton) playNarrationButton.disabled = true;
        if(narrationArea) narrationArea.style.display = 'none'; // Anlatımı gizle
        if(loadingIndicator) loadingIndicator.style.display = 'block'; // Yükleniyor'u göster

        // Kısa bir gecikmeyle soruları yükle ve göster
        setTimeout(() => {
            loadQuestionsForPlayers(state.currentSegmentIndex);
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (playersArea) playersArea.style.display = 'flex'; // Oyuncu alanını göster
             // Kartları görünür yap
             state.players.forEach(player => {
                 if (player.elements?.card) { // Null check
                     player.elements.card.classList.add('visible');
                 }
             });
        }, 300); // Kısa gecikme
    }

    function loadQuestionsForPlayers(segmentIdx) {
        let currentRoundSelectedIds = []; // Bu turda aynı sorunun farklı oyunculara gelmesini engelle

        state.players.forEach(player => {
            if (!player.elements) return; // Kartı olmayan oyuncuyu atla

            player.answered = false;
            player.currentQuestion = null;
            const { card, question: questionEl, options: optionsEl, feedback: feedbackEl } = player.elements;

            // Temizlik
            if (card) card.classList.remove('animate-correct', 'animate-incorrect');
            if (card) card.style.borderColor = 'transparent';
            if (optionsEl) optionsEl.innerHTML = '';
            if (feedbackEl) feedbackEl.textContent = '';
            if (questionEl) questionEl.textContent = 'Soru aranıyor...';

            const suitableQuestions = questionPool.filter(q =>
                q.segmentId === quizSegments[segmentIdx].segmentId &&
                player.age >= q.minAge &&
                player.age <= q.maxAge &&
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
                    shuffledOptions.forEach(option => {
                        const button = document.createElement('button');
                        // Temaya uygun buton stili için class ekle (CSS halleder)
                        // button.classList.add('btn-option'); // Genel stil için
                        button.textContent = option;
                        button.onclick = () => handleAnswer(player.id, option);
                        optionsEl.appendChild(button);
                    });
                }
            } else {
                if (questionEl) questionEl.textContent = 'Size uygun soru bulunamadı.';
                player.answered = true; // Soru yoksa cevaplamış say
            }
        });
        checkRoundCompletion(true); // Turun bitip bitmediğini kontrol et (ilk yüklemede de)
    }

    function checkRoundCompletion(initialLoad = false) {
        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        if (activePlayers.length === 0) {
            console.log("Aktif oyuncu yok.");
            if (!initialLoad) showResults(); // Oyuncu kalmadıysa sonuçları göster
            return;
        }

        const allAnswered = activePlayers.every(p => p.answered);

        if (allAnswered) {
             // Sadece ilk yüklemede değilse gecikmeyle geç
            const delay = initialLoad ? 50 : 1800; // İlk yüklemede bekleme, cevap sonrası bekle

            setTimeout(() => {
                console.log("Tur tamamlandı, sonraki segmente geçiliyor.");
                if(loadingIndicator) loadingIndicator.style.display = 'block';
                playerAreaElements.forEach(el => { if(el) el.classList.remove('visible'); }); // Kartları gizle
                setTimeout(() => {
                    if(playersArea) playersArea.style.display = 'none';
                    loadSegment(state.currentSegmentIndex + 1); // Sonraki segment
                }, 300);
            }, delay);
        }
    }

    function handleAnswer(playerId, selectedOption) {
        const player = state.players.find(p => p.id === playerId);
        // Ek kontroller: Oyuncu var mı, elementleri var mı, cevaplamış mı, sorusu var mı?
        if (!player || !player.elements || player.answered || !player.currentQuestion) {
            console.warn(`handleAnswer: Geçersiz durum veya oyuncu ${playerId}`);
            return;
        }

        player.answered = true;
        const { card: sectionEl, options: optionsEl, feedback: feedbackEl } = player.elements;
        const playerOptionButtons = optionsEl?.getElementsByTagName('button');

        if (!feedbackEl || !sectionEl || !optionsEl || !playerOptionButtons) {
             console.error(`UI elements missing for player ${playerId}. Cannot handle answer.`);
             checkRoundCompletion(); // Yine de turu kontrol et
             return;
        }

        // Butonları pasifleştir ve işaretle
        for (let btn of playerOptionButtons) {
            btn.disabled = true;
            if (btn.textContent === player.currentQuestion.correctAnswer) {
                btn.classList.add('correct-answer-highlight');
            }
            if (btn.textContent === selectedOption && selectedOption !== player.currentQuestion.correctAnswer) {
                btn.classList.add('user-incorrect-choice');
            }
        }

        let scored = false;
        if (selectedOption === player.currentQuestion.correctAnswer) {
            player.score++;
            scored = true;
            feedbackEl.textContent = "Doğru!";
            feedbackEl.className = 'player-feedback feedback-correct';
            sectionEl.classList.add('animate-correct');
            playSound(correctSound);
        } else {
            feedbackEl.textContent = `Yanlış! Doğru: ${player.currentQuestion.correctAnswer}`;
            feedbackEl.className = 'player-feedback feedback-incorrect';
            sectionEl.classList.add('animate-incorrect');
            playSound(incorrectSound);
        }

        // Animasyon sınıfını kaldır
        setTimeout(() => {
             if(sectionEl) sectionEl.classList.remove('animate-correct', 'animate-incorrect');
        }, animationDuration);

        updateScoreboard(scored ? player.id : null);
        checkRoundCompletion(); // Tur bitti mi kontrol et
    }

    function showResults() {
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        console.log("Sonuçlar Gösteriliyor.");
        if (!finalScoresElement || !winnerInfoElement) return;

        finalScoresElement.innerHTML = ''; // Temizle
        let maxScore = -1;
        let winners = [];

        const activePlayers = state.players.filter(p => p.age >= 7 && p.age <= 18);
        if (activePlayers.length === 0) {
             winnerInfoElement.textContent = "Yarışan oyuncu bulunamadı.";
             winnerInfoElement.className = 'no-winner'; // Stili değiştir
             showScreen('results-screen');
             return;
        }

        const sortedPlayers = [...activePlayers].sort((a, b) => b.score - a.score);

        sortedPlayers.forEach(player => {
            const resultLine = document.createElement('div');
            resultLine.classList.add('result-line', player.themeClass); // Tema sınıfı ekle
            resultLine.innerHTML = `<span class="name">${player.name} (${player.age} yaş)</span> <span class="score">${player.score} Puan</span>`;
            finalScoresElement.appendChild(resultLine);

            if (player.score > maxScore) {
                maxScore = player.score;
                winners = [player.name];
            } else if (player.score === maxScore && maxScore >= 0) {
                winners.push(player.name);
            }
        });

        // Kazanan mesajını ayarla
        winnerInfoElement.classList.remove('no-winner'); // Varsa no-winner stilini kaldır
        if (maxScore <= 0 ) {
            winnerInfoElement.textContent = "Kimse puan alamadı!";
             winnerInfoElement.classList.add('no-winner');
        } else if (winners.length > 1) {
            winnerInfoElement.textContent = `Kazananlar: ${winners.join(', ')} (${maxScore} puan)!`;
        } else {
            winnerInfoElement.textContent = `Kazanan: ${winners[0]} (${maxScore} puan)!`;
        }
        showScreen('results-screen'); // Sonuç ekranını göster
    }

    function resetToNameEntry() {
        if ('speechSynthesis'in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        // Inputları temizle
         const nameInputs = nameEntryContainer?.querySelectorAll('input[type="text"]');
         const ageInputs = nameEntryContainer?.querySelectorAll('input[type="number"]');
         nameInputs?.forEach(input => input.value = '');
         ageInputs?.forEach(input => { input.value = ''; input.style.border = ''; });

        if(setupErrorElement) setupErrorElement.textContent = ''; // Hata mesajını temizle
        if (scoreboardListElement) scoreboardListElement.innerHTML = ''; // Skorbordu temizle

        checkTtsSupport();
        showScreen('setup-screen'); // Kurulum ekranını göster
    }

    function checkTtsSupport() {
        const hasTts = 'speechSynthesis' in window && window.speechSynthesis;
        if(ttsSupportWarning) ttsSupportWarning.style.display = hasTts ? 'none' : 'block';
        if(playNarrationButton) playNarrationButton.style.display = hasTts ? 'inline-block' : 'none'; // Varsa göster/gizle
    }

     // --- Olay Dinleyicileri ---
     if (startQuizButton) {
         startQuizButton.addEventListener('click', () => {
            if (setupPlayers()) { // Oyuncu bilgileri geçerliyse
                startQuiz();
            }
         });
     } else { console.error("#start-quiz-button bulunamadı!"); }

     if (restartQuizButton) {
        restartQuizButton.addEventListener('click', resetToNameEntry);
     } else { console.error("#restart-quiz-button bulunamadı!"); }

     if (playNarrationButton) {
         playNarrationButton.addEventListener('click', () => {
            const segmentData = quizSegments[state.currentSegmentIndex];
            if (!segmentData || !segmentData.narrationText) return;

            if (!('speechSynthesis' in window) || !window.speechSynthesis) {
                alert("TTS desteklenmiyor.");
                handleNarrationEnd(); // Direkt sorulara geç
                return;
            }
            window.speechSynthesis.cancel(); // Öncekiyi durdur
            const utterance = new SpeechSynthesisUtterance(segmentData.narrationText);
            utterance.lang = 'tr-TR';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onend = handleNarrationEnd; // Bitince soruları yükle
            utterance.onerror = (event) => {
                console.error('TTS Hatası:', event);
                alert(`Seslendirme hatası: ${event.error}. Sorulara devam ediliyor.`);
                handleNarrationEnd(); // Hata olsa da devam et
            };
            playNarrationButton.disabled = true; // Oynatılırken pasif yap
            window.speechSynthesis.speak(utterance);
         });
     } else { console.error("#play-narration-btn bulunamadı!"); }


    // --- Başlangıç ---
    resetToNameEntry(); // Uygulama yüklendiğinde kurulum ekranıyla başla

}); // DOMContentLoaded Sonu
