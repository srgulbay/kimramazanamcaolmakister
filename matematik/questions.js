// questions.js - Matematik Yarışması Soruları ve Anlatım Metinleri

// --- SORU HAVUZU (MATEMATİK) ---
const questionPool = [
    // === Segment 1: Temel Toplama ve Çıkarma ===
    { questionId: 101, segmentId: 1, questionText: "5 elmaya 3 elma daha eklersek kaç elmamız olur?", options: ["7", "8", "9", "6"], correctAnswer: "8", minAge: 7, maxAge: 9 },
    { questionId: 102, segmentId: 1, questionText: "10 tane şekerden 4 tanesini yersek kaç şeker kalır?", options: ["5", "6", "7", "4"], correctAnswer: "6", minAge: 7, maxAge: 9 },
    { questionId: 103, segmentId: 1, questionText: "9 + 7 = ?", options: ["15", "16", "17", "18"], correctAnswer: "16", minAge: 7, maxAge: 10 },
    { questionId: 104, segmentId: 1, questionText: "15 - 6 = ?", options: ["8", "9", "10", "11"], correctAnswer: "9", minAge: 8, maxAge: 10 },
    { questionId: 105, segmentId: 1, questionText: "24 + 18 = ?", options: ["32", "40", "42", "44"], correctAnswer: "42", minAge: 9, maxAge: 11 },
    { questionId: 106, segmentId: 1, questionText: "50 - 23 = ?", options: ["26", "27", "37", "33"], correctAnswer: "27", minAge: 9, maxAge: 12 },
    { questionId: 107, segmentId: 1, questionText: "135 + 68 = ?", options: ["193", "200", "203", "213"], correctAnswer: "203", minAge: 10, maxAge: 13 },
    { questionId: 108, segmentId: 1, questionText: "300 - 145 = ?", options: ["155", "165", "145", "255"], correctAnswer: "155", minAge: 11, maxAge: 14 },
    { questionId: 109, segmentId: 1, questionText: "(-8) + 12 = ?", options: ["-20", "-4", "4", "20"], correctAnswer: "4", minAge: 12, maxAge: 15 },
    { questionId: 110, segmentId: 1, questionText: "15 - (-6) = ?", options: ["9", "-9", "21", "-21"], correctAnswer: "21", minAge: 13, maxAge: 16 },
    { questionId: 111, segmentId: 1, questionText: "(-10) - 5 = ?", options: ["-5", "5", "-15", "15"], correctAnswer: "-15", minAge: 13, maxAge: 17 },
    { questionId: 112, segmentId: 1, questionText: "Ali'nin 15 TL'si vardı. 8 TL'ye kalem aldı, sonra babası 10 TL verdi. Ali'nin kaç TL'si oldu?", options: ["7 TL", "17 TL", "23 TL", "33 TL"], correctAnswer: "17 TL", minAge: 10, maxAge: 14 },
    { questionId: 113, segmentId: 1, questionText: "Bir sepette 45 yumurta vardı, 18 tanesi kırıldı. Sepete 25 yumurta daha eklendi. Son durumda kaç yumurta var?", options: ["27", "52", "70", "88"], correctAnswer: "52", minAge: 11, maxAge: 15 },
    { questionId: 114, segmentId: 1, questionText: "Sıcaklık 12 dereceyken 15 derece düştü. Sonra 8 derece arttı. Son sıcaklık kaç derecedir?", options: ["-3", "5", "-7", "20"], correctAnswer: "5", minAge: 14, maxAge: 18 },
    { questionId: 115, segmentId: 1, questionText: "x + 15 = 7 ise, x kaçtır?", options: ["8", "-8", "22", "-22"], correctAnswer: "-8", minAge: 15, maxAge: 18 },

    // === Segment 2: Çarpma ve Bölme ===
    { questionId: 201, segmentId: 2, questionText: "4 tane 3'lü grup kaç eder?", options: ["7", "10", "12", "16"], correctAnswer: "12", minAge: 7, maxAge: 9 },
    { questionId: 202, segmentId: 2, questionText: "10 şekeri 2 kişiye eşit paylaştırırsak kişi başı kaç şeker düşer?", options: ["4", "5", "6", "8"], correctAnswer: "5", minAge: 7, maxAge: 9 },
    { questionId: 203, segmentId: 2, questionText: "6 x 7 = ?", options: ["13", "36", "42", "48"], correctAnswer: "42", minAge: 8, maxAge: 10 },
    { questionId: 204, segmentId: 2, questionText: "24 / 4 = ?", options: ["5", "6", "7", "8"], correctAnswer: "6", minAge: 8, maxAge: 11 },
    { questionId: 205, segmentId: 2, questionText: "Bir kutuda 8 kalem varsa, 5 kutuda toplam kaç kalem vardır?", options: ["13", "35", "40", "45"], correctAnswer: "40", minAge: 9, maxAge: 11 },
    { questionId: 206, segmentId: 2, questionText: "36 tane misketi 9 arkadaş eşit paylaşırsa her birine kaç misket düşer?", options: ["3", "4", "5", "6"], correctAnswer: "4", minAge: 9, maxAge: 12 },
    { questionId: 207, segmentId: 2, questionText: "15 x 10 = ?", options: ["25", "150", "1500", "1015"], correctAnswer: "150", minAge: 10, maxAge: 13 },
    { questionId: 208, segmentId: 2, questionText: "120 / 12 = ?", options: ["1", "10", "11", "12"], correctAnswer: "10", minAge: 10, maxAge: 14 },
    { questionId: 209, segmentId: 2, questionText: "(-5) x 9 = ?", options: ["4", "-4", "45", "-45"], correctAnswer: "-45", minAge: 12, maxAge: 15 },
    { questionId: 210, segmentId: 2, questionText: "(-60) / (-15) = ?", options: ["4", "-4", "75", "-75"], correctAnswer: "4", minAge: 13, maxAge: 16 },
    { questionId: 211, segmentId: 2, questionText: "Bir sayının 5 katı 75 ise, bu sayı kaçtır?", options: ["10", "15", "20", "25"], correctAnswer: "15", minAge: 11, maxAge: 15 },
    { questionId: 212, segmentId: 2, questionText: "Bir bölme işleminde bölen 8, bölüm 7, kalan 3 ise bölünen kaçtır?", options: ["53", "56", "59", "62"], correctAnswer: "59", minAge: 12, maxAge: 16 }, // Bölünen = Bölen * Bölüm + Kalan
    { questionId: 213, segmentId: 2, questionText: "2 x (5 + 3) = ?", options: ["13", "16", "10", "30"], correctAnswer: "16", minAge: 10, maxAge: 14 }, // İşlem önceliği
    { questionId: 214, segmentId: 2, questionText: "30 / 5 x 2 = ?", options: ["3", "12", "6", "10"], correctAnswer: "12", minAge: 11, maxAge: 15 }, // İşlem önceliği (soldan sağa)
    { questionId: 215, segmentId: 2, questionText: "4y = -24 ise, y kaçtır?", options: ["6", "-6", "20", "-20"], correctAnswer: "-6", minAge: 15, maxAge: 18 },

    // === Segment 3: Sayı Kavramları (Basamak, Tek/Çift, Asal vb.) ===
    { questionId: 301, segmentId: 3, questionText: "Aşağıdaki sayılardan hangisi çifttir?", options: ["11", "17", "23", "28"], correctAnswer: "28", minAge: 7, maxAge: 9 },
    { questionId: 302, segmentId: 3, questionText: "Aşağıdaki sayılardan hangisi tektir?", options: ["10", "16", "22", "25"], correctAnswer: "25", minAge: 7, maxAge: 9 },
    { questionId: 303, segmentId: 3, questionText: "58 sayısındaki 5 rakamının basamak değeri kaçtır?", options: ["5", "8", "50", "58"], correctAnswer: "50", minAge: 8, maxAge: 10 },
    { questionId: 304, segmentId: 3, questionText: "173 sayısındaki onlar basamağındaki rakam kaçtır?", options: ["1", "7", "3", "17"], correctAnswer: "7", minAge: 8, maxAge: 11 },
    { questionId: 305, segmentId: 3, questionText: "Sadece 1'e ve kendisine bölünebilen 1'den büyük sayılara ne denir?", options: ["Çift Sayı", "Tek Sayı", "Asal Sayı", "Basamak Değeri"], correctAnswer: "Asal Sayı", minAge: 10, maxAge: 13 },
    { questionId: 306, segmentId: 3, questionText: "Aşağıdakilerden hangisi asal sayıdır?", options: ["1", "4", "6", "11"], correctAnswer: "11", minAge: 10, maxAge: 14 },
    { questionId: 307, segmentId: 3, questionText: "En küçük asal sayı kaçtır?", options: ["0", "1", "2", "3"], correctAnswer: "2", minAge: 11, maxAge: 15 },
    { questionId: 308, segmentId: 3, questionText: "20'den küçük kaç tane asal sayı vardır?", options: ["6", "7", "8", "9"], correctAnswer: "8", minAge: 12, maxAge: 16 }, // 2, 3, 5, 7, 11, 13, 17, 19
    { questionId: 309, segmentId: 3, questionText: "12 sayısının pozitif tam sayı bölenleri kaç tanedir?", options: ["4", "5", "6", "7"], correctAnswer: "6", minAge: 12, maxAge: 16 }, // 1, 2, 3, 4, 6, 12
    { questionId: 310, segmentId: 3, questionText: "İki basamaklı en büyük çift sayı kaçtır?", options: ["90", "98", "99", "100"], correctAnswer: "98", minAge: 9, maxAge: 13 },
    { questionId: 311, segmentId: 3, questionText: "Rakamları farklı üç basamaklı en küçük tek sayı kaçtır?", options: ["100", "101", "102", "103"], correctAnswer: "103", minAge: 11, maxAge: 15 },
    { questionId: 312, segmentId: 3, questionText: "45 sayısının asal çarpanları hangileridir?", options: ["3 ve 5", "5 ve 9", "3 ve 15", "3, 5 ve 9"], correctAnswer: "3 ve 5", minAge: 13, maxAge: 17 }, // 45 = 3 * 3 * 5
    { questionId: 313, segmentId: 3, questionText: "1'den başka ortak böleni olmayan sayılara ne denir?", options: ["Asal Sayılar", "Aralarında Asal Sayılar", "Ardışık Sayılar", "Kompozit Sayılar"], correctAnswer: "Aralarında Asal Sayılar", minAge: 14, maxAge: 18 },
    { questionId: 314, segmentId: 3, questionText: "Aşağıdaki sayı çiftlerinden hangisi aralarında asaldır?", options: ["(6, 9)", "(8, 10)", "(7, 12)", "(10, 15)"], correctAnswer: "(7, 12)", minAge: 14, maxAge: 18 },
    { questionId: 315, segmentId: 3, questionText: "Bir sayının karesi olan sayılara ne denir? (Örn: 9 = 3²)", options: ["Asal Sayı", "Küp Sayı", "Tam Kare Sayı", "Negatif Sayı"], correctAnswer: "Tam Kare Sayı", minAge: 12, maxAge: 16 },

    // === Segment 4: Kesirler ve Ondalık Sayılar ===
    { questionId: 401, segmentId: 4, questionText: "Bir bütünün 2 eş parçasından birini gösteren kesir hangisidir?", options: ["1/3", "1/2", "2/1", "1/4"], correctAnswer: "1/2", minAge: 8, maxAge: 10 },
    { questionId: 402, segmentId: 4, questionText: "1/4 kesrinin okunuşu nedir?", options: ["Dört bölü bir", "Birde dört", "Dörtte bir", "Bir tam dört"], correctAnswer: "Dörtte bir", minAge: 8, maxAge: 11 },
    { questionId: 403, segmentId: 4, questionText: "Payı paydasından küçük olan kesirlere ne denir?", options: ["Tam Sayılı Kesir", "Bileşik Kesir", "Basit Kesir", "Denk Kesir"], correctAnswer: "Basit Kesir", minAge: 9, maxAge: 12 },
    { questionId: 404, segmentId: 4, questionText: "3/5 kesrinde payda kaçtır?", options: ["3", "5", "8", " bilinmez"], correctAnswer: "5", minAge: 9, maxAge: 12 },
    { questionId: 405, segmentId: 4, questionText: "1/2 + 1/2 = ?", options: ["1/4", "2/4", "1", "2"], correctAnswer: "1", minAge: 10, maxAge: 13 },
    { questionId: 406, segmentId: 4, questionText: "3/4 kesri ondalık olarak nasıl yazılır?", options: ["0.25", "0.50", "0.75", "3.4"], correctAnswer: "0.75", minAge: 11, maxAge: 14 },
    { questionId: 407, segmentId: 4, questionText: "0.5 ondalık sayısı hangi kesre eşittir?", options: ["1/5", "1/2", "1/4", "5/100"], correctAnswer: "1/2", minAge: 11, maxAge: 14 },
    { questionId: 408, segmentId: 4, questionText: "5/3 kesri nasıl bir kesirdir?", options: ["Basit Kesir", "Bileşik Kesir", "Tam Sayılı Kesir", "Birim Kesir"], correctAnswer: "Bileşik Kesir", minAge: 10, maxAge: 13 },
    { questionId: 409, segmentId: 4, questionText: "1 tam 1/4 kesrinin bileşik kesir karşılığı nedir?", options: ["1/4", "4/4", "5/4", "4/5"], correctAnswer: "5/4", minAge: 11, maxAge: 15 },
    { questionId: 410, segmentId: 4, questionText: "2/3 + 1/6 = ?", options: ["3/9", "1/2", "5/6", "3/6"], correctAnswer: "5/6", minAge: 12, maxAge: 16 }, // Payda eşitleme
    { questionId: 411, segmentId: 4, questionText: "1/2 x 3/4 = ?", options: ["4/6", "3/8", "3/6", "1/8"], correctAnswer: "3/8", minAge: 12, maxAge: 16 }, // Kesirlerde çarpma
    { questionId: 412, segmentId: 4, questionText: "2/5 / 1/5 = ?", options: ["2", "1/2", "2/25", "1"], correctAnswer: "2", minAge: 13, maxAge: 17 }, // Kesirlerde bölme
    { questionId: 413, segmentId: 4, questionText: "0.25 + 0.8 = ?", options: ["0.105", "1.05", "0.33", "1.5"], correctAnswer: "1.05", minAge: 11, maxAge: 15 },
    { questionId: 414, segmentId: 4, questionText: "Bir pastanın 1/3'ünü Ali, 1/6'sını Veli yedi. Pastanın ne kadarı yenmiştir?", options: ["1/9", "2/9", "1/2", "2/3"], correctAnswer: "1/2", minAge: 12, maxAge: 16 },
    { questionId: 415, segmentId: 4, questionText: "Devirli ondalık sayı 0.333... hangi kesre eşittir?", options: ["1/3", "3/10", "3/9", "1/30"], correctAnswer: "1/3", minAge: 15, maxAge: 18 }, // 3/9 = 1/3

    // === Segment 5: Ölçme (Uzunluk, Alan, Hacim, Zaman) ===
    { questionId: 501, segmentId: 5, questionText: "1 metre kaç santimetredir?", options: ["10", "100", "1000", "0.1"], correctAnswer: "100", minAge: 8, maxAge: 10 },
    { questionId: 502, segmentId: 5, questionText: "1 saat kaç dakikadır?", options: ["30", "50", "60", "100"], correctAnswer: "60", minAge: 7, maxAge: 9 },
    { questionId: 503, segmentId: 5, questionText: "1 kilometre kaç metredir?", options: ["10", "100", "1000", "10000"], correctAnswer: "1000", minAge: 9, maxAge: 12 },
    { questionId: 504, segmentId: 5, questionText: "Karenin bir kenarı 5 cm ise çevresi kaç cm'dir?", options: ["10", "15", "20", "25"], correctAnswer: "20", minAge: 9, maxAge: 12 },
    { questionId: 505, segmentId: 5, questionText: "Karenin bir kenarı 4 cm ise alanı kaç cm²'dir?", options: ["8", "12", "16", "20"], correctAnswer: "16", minAge: 10, maxAge: 13 },
    { questionId: 506, segmentId: 5, questionText: "Dikdörtgenin kısa kenarı 3m, uzun kenarı 6m ise çevresi kaç metredir?", options: ["9", "12", "18", "21"], correctAnswer: "18", minAge: 10, maxAge: 14 },
    { questionId: 507, segmentId: 5, questionText: "Dikdörtgenin kısa kenarı 5cm, uzun kenarı 8cm ise alanı kaç cm²'dir?", options: ["13", "26", "40", "45"], correctAnswer: "40", minAge: 11, maxAge: 15 },
    { questionId: 508, segmentId: 5, questionText: "1 dakika kaç saniyedir?", options: ["30", "60", "90", "100"], correctAnswer: "60", minAge: 7, maxAge: 10 },
    { questionId: 509, segmentId: 5, questionText: "Saat 14:30'dan 1 saat 15 dakika sonra saat kaç olur?", options: ["15:30", "15:45", "16:00", "16:15"], correctAnswer: "15:45", minAge: 9, maxAge: 13 },
    { questionId: 510, segmentId: 5, questionText: "Bir küpün bir ayrıtı 3 cm ise hacmi kaç cm³'tür?", options: ["9", "12", "18", "27"], correctAnswer: "27", minAge: 12, maxAge: 16 }, // Hacim = a³
    { questionId: 511, segmentId: 5, questionText: "1 litre kaç mililitredir?", options: ["10", "100", "1000", "10000"], correctAnswer: "1000", minAge: 10, maxAge: 14 },
    { questionId: 512, segmentId: 5, questionText: "Üçgenin alanı nasıl bulunur?", options: ["Taban x Yükseklik", "(Taban + Yükseklik) / 2", "Taban x Yükseklik / 2", "Çevre / 2"], correctAnswer: "Taban x Yükseklik / 2", minAge: 13, maxAge: 17 },
    { questionId: 513, segmentId: 5, questionText: "2.5 kilometre kaç metredir?", options: ["250", "2500", "25000", "25"], correctAnswer: "2500", minAge: 11, maxAge: 15 },
    { questionId: 514, segmentId: 5, questionText: "1.5 saat kaç dakikadır?", options: ["75", "80", "90", "150"], correctAnswer: "90", minAge: 10, maxAge: 14 },
    { questionId: 515, segmentId: 5, questionText: "Bir odanın alanı 20 m²'dir. Bu oda metrekare fiyatı 5 TL olan halı ile kaplanırsa kaç TL ödenir?", options: ["25 TL", "50 TL", "100 TL", "200 TL"], correctAnswer: "100 TL", minAge: 12, maxAge: 16 },

    // === Segment 6: Temel Geometri (Şekiller, Açılar) ===
    { questionId: 601, segmentId: 6, questionText: "Üç kenarı olan geometrik şekil hangisidir?", options: ["Kare", "Dikdörtgen", "Üçgen", "Daire"], correctAnswer: "Üçgen", minAge: 7, maxAge: 9 },
    { questionId: 602, segmentId: 6, questionText: "Dört kenarı eşit ve tüm açıları dik olan şekil hangisidir?", options: ["Dikdörtgen", "Üçgen", "Kare", "Yamuk"], correctAnswer: "Kare", minAge: 8, maxAge: 10 },
    { questionId: 603, segmentId: 6, questionText: "Karşılıklı kenarları eşit ve tüm açıları dik olan şekil hangisidir?", options: ["Kare", "Dikdörtgen", "Eşkenar Dörtgen", "Paralelkenar"], correctAnswer: "Dikdörtgen", minAge: 8, maxAge: 11 },
    { questionId: 604, segmentId: 6, questionText: "Köşesi ve kenarı olmayan yuvarlak şekil hangisidir?", options: ["Elips", "Kare", "Daire", "Küp"], correctAnswer: "Daire", minAge: 7, maxAge: 10 },
    { questionId: 605, segmentId: 6, questionText: "90 derecelik açıya ne ad verilir?", options: ["Dar Açı", "Geniş Açı", "Doğru Açı", "Dik Açı"], correctAnswer: "Dik Açı", minAge: 9, maxAge: 12 },
    { questionId: 606, segmentId: 6, questionText: "90 dereceden küçük açılara ne ad verilir?", options: ["Dik Açı", "Dar Açı", "Geniş Açı", "Tam Açı"], correctAnswer: "Dar Açı", minAge: 9, maxAge: 13 },
    { questionId: 607, segmentId: 6, questionText: "90 dereceden büyük, 180 dereceden küçük açılara ne ad verilir?", options: ["Doğru Açı", "Tam Açı", "Dar Açı", "Geniş Açı"], correctAnswer: "Geniş Açı", minAge: 10, maxAge: 14 },
    { questionId: 608, segmentId: 6, questionText: "Bir üçgenin iç açılarının toplamı kaç derecedir?", options: ["90", "180", "270", "360"], correctAnswer: "180", minAge: 11, maxAge: 15 },
    { questionId: 609, segmentId: 6, questionText: "Bir karenin iç açılarının her biri kaç derecedir?", options: ["45", "60", "90", "180"], correctAnswer: "90", minAge: 10, maxAge: 14 },
    { questionId: 610, segmentId: 6, questionText: "İki açının toplamı 90 derece ise bu açılara ne denir?", options: ["Bütünler Açılar", "Tümler Açılar", "Komşu Açılar", "Ters Açılar"], correctAnswer: "Tümler Açılar", minAge: 12, maxAge: 16 },
    { questionId: 611, segmentId: 6, questionText: "İki açının toplamı 180 derece ise bu açılara ne denir?", options: ["Tümler Açılar", "Ters Açılar", "Bütünler Açılar", "Yöndeş Açılar"], correctAnswer: "Bütünler Açılar", minAge: 13, maxAge: 17 },
    { questionId: 612, segmentId: 6, questionText: "Bir dairenin çevresinin çapına oranına ne ad verilir?", options: ["Yarıçap", "Alan", "Pi Sayısı (π)", "Hacim"], correctAnswer: "Pi Sayısı (π)", minAge: 14, maxAge: 18 },
    { questionId: 613, segmentId: 6, questionText: "Bir dik üçgende dik kenarların kareleri toplamı hipotenüsün karesine eşittir. Bu teorem nedir?", options: ["Thales Teoremi", "Öklid Teoremi", "Pisagor Teoremi", "Menelaus Teoremi"], correctAnswer: "Pisagor Teoremi", minAge: 15, maxAge: 18 },
    { questionId: 614, segmentId: 6, questionText: "Bir düzgün altıgenin bir iç açısı kaç derecedir?", options: ["90", "108", "120", "135"], correctAnswer: "120", minAge: 14, maxAge: 18 }, // (n-2)*180/n formülü, n=6
    { questionId: 615, segmentId: 6, questionText: "Bir küpün kaç köşesi vardır?", options: ["4", "6", "8", "12"], correctAnswer: "8", minAge: 11, maxAge: 15 },

    // === Segment 7: Yüzdeler ve Oranlar ===
    { questionId: 701, segmentId: 7, questionText: "Bir bütünün 100 eş parçasından birini ifade eden kavram nedir?", options: ["Kesir", "Ondalık", "Yüzde (%)", "Oran"], correctAnswer: "Yüzde (%)", minAge: 10, maxAge: 13 },
    { questionId: 702, segmentId: 7, questionText: "%50 ifadesi hangi kesre eşittir?", options: ["1/4", "1/2", "3/4", "1/50"], correctAnswer: "1/2", minAge: 10, maxAge: 14 },
    { questionId: 703, segmentId: 7, questionText: "100 sayısının %20'si kaçtır?", options: ["10", "20", "50", "80"], correctAnswer: "20", minAge: 11, maxAge: 14 },
    { questionId: 704, segmentId: 7, questionText: "50 sayısının %10'u kaçtır?", options: ["1", "5", "10", "50"], correctAnswer: "5", minAge: 11, maxAge: 15 },
    { questionId: 705, segmentId: 7, questionText: "Bir sınıfta 20 öğrencinin %25'i kız ise, kaç kız öğrenci vardır?", options: ["4", "5", "10", "15"], correctAnswer: "5", minAge: 12, maxAge: 16 },
    { questionId: 706, segmentId: 7, questionText: "%75 ifadesinin ondalık karşılığı nedir?", options: ["0.25", "0.50", "0.75", "7.5"], correctAnswer: "0.75", minAge: 11, maxAge: 15 },
    { questionId: 707, segmentId: 7, questionText: "2/5 kesrinin yüzde karşılığı nedir?", options: ["%20", "%25", "%40", "%50"], correctAnswer: "%40", minAge: 12, maxAge: 16 }, // (2/5) * 100 = 40
    { questionId: 708, segmentId: 7, questionText: "Bir ürünün fiyatı 80 TL iken %10 indirim yapılırsa yeni fiyatı kaç TL olur?", options: ["70 TL", "72 TL", "8 TL", "88 TL"], correctAnswer: "72 TL", minAge: 13, maxAge: 17 },
    { questionId: 709, segmentId: 7, questionText: "Bir ürüne %20 zam yapıldıktan sonraki fiyatı 120 TL ise, zamdan önceki fiyatı kaç TL idi?", options: ["96 TL", "100 TL", "108 TL", "144 TL"], correctAnswer: "100 TL", minAge: 14, maxAge: 18 }, // x * 1.20 = 120
    { questionId: 710, segmentId: 7, questionText: "İki çokluğun birbirine bölünerek karşılaştırılmasına ne denir?", options: ["Yüzde", "Kesir", "Oran", "Ölçek"], correctAnswer: "Oran", minAge: 12, maxAge: 15 },
    { questionId: 711, segmentId: 7, questionText: "Bir sepette 3 elma ve 5 portakal varsa, elmaların portakallara oranı nedir?", options: ["3/5", "5/3", "3/8", "8/3"], correctAnswer: "3/5", minAge: 12, maxAge: 16 },
    { questionId: 712, segmentId: 7, questionText: "İki oranın eşitliğine ne denir?", options: ["Oran", "Orantı", "Kesir", "Eşitlik"], correctAnswer: "Orantı", minAge: 13, maxAge: 17 },
    { questionId: 713, segmentId: 7, questionText: "Eğer a/b = c/d ise, aşağıdaki eşitliklerden hangisi her zaman doğrudur (içler-dışlar çarpımı)?", options: ["a+d = b+c", "a*d = b*c", "a*c = b*d", "a/c = d/b"], correctAnswer: "a*d = b*c", minAge: 14, maxAge: 18 },
    { questionId: 714, segmentId: 7, questionText: "Bir haritada 1 cm'lik uzunluk gerçekte 5 km'yi gösteriyorsa, bu haritanın ölçeği nedir?", options: ["1/5", "1/5000", "1/50000", "1/500000"], correctAnswer: "1/500000", minAge: 15, maxAge: 18 }, // 5 km = 5000 m = 500000 cm
    { questionId: 715, segmentId: 7, questionText: "Bir işi 3 işçi 10 günde bitiriyorsa, aynı işi 6 işçi kaç günde bitirir (ters orantı)?", options: ["5", "10", "15", "20"], correctAnswer: "5", minAge: 14, maxAge: 18 },

    // === Segment 8: Temel Cebir (Değişkenler, Denklemler) ===
    { questionId: 801, segmentId: 8, questionText: "Matematikte bilinmeyen değerleri temsil etmek için kullanılan harflere (x, y, a gibi) ne denir?", options: ["Sayı", "Katsayı", "Değişken", "Sabit"], correctAnswer: "Değişken", minAge: 11, maxAge: 14 },
    { questionId: 802, segmentId: 8, questionText: "'Bir sayının 3 fazlası' ifadesinin cebirsel karşılığı nedir?", options: ["3x", "x - 3", "x + 3", "x/3"], correctAnswer: "x + 3", minAge: 11, maxAge: 14 },
    { questionId: 803, segmentId: 8, questionText: "'Bir sayının 2 katı' ifadesinin cebirsel karşılığı nedir?", options: ["x + 2", "x - 2", "2x", "x/2"], correctAnswer: "2x", minAge: 11, maxAge: 15 },
    { questionId: 804, segmentId: 8, questionText: "x = 5 için, 2x + 1 ifadesinin değeri kaçtır?", options: ["7", "10", "11", "15"], correctAnswer: "11", minAge: 12, maxAge: 15 },
    { questionId: 805, segmentId: 8, questionText: "İçinde en az bir bilinmeyen ve eşitlik bulunan ifadelere ne denir?", options: ["Cebirsel İfade", "Oran", "Denklem", "Eşitsizlik"], correctAnswer: "Denklem", minAge: 12, maxAge: 16 },
    { questionId: 806, segmentId: 8, questionText: "x + 4 = 10 denklemini sağlayan x değeri kaçtır?", options: ["4", "6", "10", "14"], correctAnswer: "6", minAge: 12, maxAge: 15 },
    { questionId: 807, segmentId: 8, questionText: "3y = 18 denklemini sağlayan y değeri kaçtır?", options: ["3", "6", "9", "15"], correctAnswer: "6", minAge: 12, maxAge: 16 },
    { questionId: 808, segmentId: 8, questionText: "a - 5 = 7 denklemini sağlayan a değeri kaçtır?", options: ["2", "-2", "12", "-12"], correctAnswer: "12", minAge: 13, maxAge: 16 },
    { questionId: 809, segmentId: 8, questionText: "k / 2 = 9 denklemini sağlayan k değeri kaçtır?", options: ["4.5", "7", "11", "18"], correctAnswer: "18", minAge: 13, maxAge: 17 },
    { questionId: 810, segmentId: 8, questionText: "2x + 3 = 11 denklemini sağlayan x değeri kaçtır?", options: ["3", "4", "5", "8"], correctAnswer: "4", minAge: 14, maxAge: 18 },
    { questionId: 811, segmentId: 8, questionText: "5a - 2 = 3a + 6 denklemini sağlayan a değeri kaçtır?", options: ["2", "3", "4", "8"], correctAnswer: "4", minAge: 15, maxAge: 18 }, // 2a = 8
    { questionId: 812, segmentId: 8, questionText: "(x + 1) + (x + 2) = 15 ise x kaçtır?", options: ["5", "6", "7", "9"], correctAnswer: "6", minAge: 14, maxAge: 18 }, // 2x + 3 = 15
    { questionId: 813, segmentId: 8, questionText: "Bir sayının 3 katının 5 eksiği 16 ise, bu sayı kaçtır?", options: ["6", "7", "8", "9"], correctAnswer: "7", minAge: 14, maxAge: 18 }, // 3x - 5 = 16
    { questionId: 814, segmentId: 8, questionText: "'Benzer terimler' ne demektir?", options: ["Katsayıları aynı olan terimler", "Değişkenleri ve değişkenlerin üsleri aynı olan terimler", "Sabit sayılar", "Sonuçları aynı olan terimler"], correctAnswer: "Değişkenleri ve değişkenlerin üsleri aynı olan terimler", minAge: 13, maxAge: 17 },
    { questionId: 815, segmentId: 8, questionText: "3x + 5y - x + 2y ifadesinin en sade hali nedir?", options: ["2x + 7y", "3x + 7y", "2x + 5y", "8xy"], correctAnswer: "2x + 7y", minAge: 14, maxAge: 18 },

    // === Segment 9: Veri Analizi (Grafikler, Ortalama) ===
    { questionId: 901, segmentId: 9, questionText: "Bilgileri görsel olarak sunmak için kullanılan çizimlere ne denir?", options: ["Denklem", "Tablo", "Grafik", "Metin"], correctAnswer: "Grafik", minAge: 9, maxAge: 12 },
    { questionId: 902, segmentId: 9, questionText: "Verileri sütunlar kullanarak gösteren grafik türü hangisidir?", options: ["Çizgi Grafiği", "Daire Grafiği", "Sütun Grafiği", "Resim Grafiği"], correctAnswer: "Sütun Grafiği", minAge: 9, maxAge: 13 },
    { questionId: 903, segmentId: 9, questionText: "Verilerin zaman içindeki değişimini göstermek için genellikle hangi grafik türü kullanılır?", options: ["Sütun Grafiği", "Daire Grafiği", "Çizgi Grafiği", "Histogram"], correctAnswer: "Çizgi Grafiği", minAge: 10, maxAge: 14 },
    { questionId: 904, segmentId: 9, questionText: "Bir bütünün parçalarını göstermek için kullanılan, dilimlere ayrılmış grafik türü hangisidir?", options: ["Çizgi Grafiği", "Daire Grafiği", "Sütun Grafiği", "Serpilme Grafiği"], correctAnswer: "Daire Grafiği", minAge: 11, maxAge: 15 },
    { questionId: 905, segmentId: 9, questionText: "Bir veri grubundaki sayıların toplamının, veri sayısına bölünmesiyle elde edilen değer nedir?", options: ["Medyan (Ortanca)", "Mod (Tepe Değer)", "Aritmetik Ortalama", "Açıklık"], correctAnswer: "Aritmetik Ortalama", minAge: 11, maxAge: 15 },
    { questionId: 906, segmentId: 9, questionText: "3, 5, 7 sayılarının aritmetik ortalaması kaçtır?", options: ["3", "4", "5", "6"], correctAnswer: "5", minAge: 11, maxAge: 14 }, // (3+5+7)/3 = 15/3 = 5
    { questionId: 907, segmentId: 9, questionText: "Bir veri grubunda en çok tekrar eden değere ne ad verilir?", options: ["Ortalama", "Medyan", "Mod (Tepe Değer)", "Açıklık"], correctAnswer: "Mod (Tepe Değer)", minAge: 12, maxAge: 16 },
    { questionId: 908, segmentId: 9, questionText: "2, 4, 4, 6, 8 veri grubunun modu kaçtır?", options: ["2", "4", "6", " Bulunmaz"], correctAnswer: "4", minAge: 12, maxAge: 15 },
    { questionId: 909, segmentId: 9, questionText: "Bir veri grubu küçükten büyüğe sıralandığında ortadaki değere ne ad verilir?", options: ["Ortalama", "Mod", "Medyan (Ortanca)", "Açıklık"], correctAnswer: "Medyan (Ortanca)", minAge: 12, maxAge: 16 },
    { questionId: 910, segmentId: 9, questionText: "1, 3, 5, 7, 9 veri grubunun medyanı kaçtır?", options: ["3", "5", "6", "7"], correctAnswer: "5", minAge: 12, maxAge: 15 },
    { questionId: 911, segmentId: 9, questionText: "2, 4, 6, 8 veri grubunun medyanı kaçtır?", options: ["4", "5", "6", " Bulunmaz"], correctAnswer: "5", minAge: 13, maxAge: 17 }, // (4+6)/2 = 5
    { questionId: 912, segmentId: 9, questionText: "Bir veri grubundaki en büyük değer ile en küçük değer arasındaki farka ne denir?", options: ["Ortalama", "Mod", "Medyan", "Açıklık"], correctAnswer: "Açıklık", minAge: 11, maxAge: 15 },
    { questionId: 913, segmentId: 9, questionText: "5, 8, 12, 15 veri grubunun açıklığı kaçtır?", options: ["3", "7", "10", "15"], correctAnswer: "10", minAge: 11, maxAge: 14 }, // 15 - 5 = 10
    { questionId: 914, segmentId: 9, questionText: "Bir olayın gerçekleşme veya gerçekleşmeme olasılığını inceleyen matematik dalı nedir?", options: ["Cebir", "Geometri", "İstatistik", "Olasılık"], correctAnswer: "Olasılık", minAge: 14, maxAge: 18 },
    { questionId: 915, segmentId: 9, questionText: "Hilesiz bir zar atıldığında tek sayı gelme olasılığı kaçtır?", options: ["1/6", "2/6", "1/2", "1"], correctAnswer: "1/2", minAge: 14, maxAge: 18 }, // Tek sayılar: 1, 3, 5 (3 tane). Toplam olasılık: 6. 3/6 = 1/2

    // === Segment 10: Problem Çözme ve Mantık ===
    { questionId: 1001, segmentId: 10, questionText: "Bir problemin çözümünde ilk adım genellikle nedir?", options: ["Cevabı tahmin etmek", "Problemi dikkatlice okuyup anlamak", "Hemen işlem yapmaya başlamak", "Arkadaşına sormak"], correctAnswer: "Problemi dikkatlice okuyup anlamak", minAge: 8, maxAge: 12 },
    { questionId: 1002, segmentId: 10, questionText: "Ali, Veli'den 3 yaş büyüktür. Veli 7 yaşında ise Ali kaç yaşındadır?", options: ["4", "7", "10", "11"], correctAnswer: "10", minAge: 7, maxAge: 10 },
    { questionId: 1003, segmentId: 10, questionText: "Bir otobüste 15 yolcu vardı. İlk durakta 5 yolcu indi, 8 yolcu bindi. Otobüste kaç yolcu oldu?", options: ["10", "18", "23", "28"], correctAnswer: "18", minAge: 9, maxAge: 12 },
    { questionId: 1004, segmentId: 10, questionText: "3 kalem 6 TL ise, 5 kalem kaç TL'dir?", options: ["8 TL", "9 TL", "10 TL", "11 TL"], correctAnswer: "10 TL", minAge: 10, maxAge: 13 }, // 1 kalem 2 TL
    { questionId: 1005, segmentId: 10, questionText: "Bir çiftlikte tavuk ve koyunların toplam sayısı 10, ayak sayıları toplamı 26'dır. Çiftlikte kaç tavuk vardır?", options: ["5", "6", "7", "8"], correctAnswer: "7", minAge: 12, maxAge: 16 }, // Denklem veya deneme yanılma (7 tavuk*2 ayak + 3 koyun*4 ayak = 14+12=26)
    { questionId: 1006, segmentId: 10, questionText: "Bugün günlerden Salı ise, 10 gün sonra hangi gün olur?", options: ["Perşembe", "Cuma", "Cumartesi", "Pazar"], correctAnswer: "Cuma", minAge: 9, maxAge: 13 }, // 10 gün = 1 hafta + 3 gün. Salı + 3 gün = Cuma
    { questionId: 1007, segmentId: 10, questionText: "Bir sırada baştan 5., sondan 8. olan Ayşe'nin olduğu sırada toplam kaç kişi vardır?", options: ["11", "12", "13", "14"], correctAnswer: "12", minAge: 11, maxAge: 15 }, // 5 + 8 - 1 = 12
    { questionId: 1008, segmentId: 10, questionText: "Kare şeklindeki bir bahçenin çevresi 24 metredir. Bu bahçenin alanı kaç metrekaredir?", options: ["16", "24", "36", "48"], correctAnswer: "36", minAge: 12, maxAge: 16 }, // Çevre 24 ise bir kenar 6m. Alan 6*6=36
    { questionId: 1009, segmentId: 10, questionText: "Saat 09:00'da başlayan bir film 1 saat 40 dakika sürdüğüne göre, film saat kaçta biter?", options: ["10:00", "10:30", "10:40", "11:00"], correctAnswer: "10:40", minAge: 8, maxAge: 12 },
    { questionId: 1010, segmentId: 10, questionText: "Bir sayının yarısı ile çeyreğinin toplamı 15 ise, bu sayı kaçtır?", options: ["10", "15", "20", "30"], correctAnswer: "20", minAge: 14, maxAge: 18 }, // x/2 + x/4 = 15 => 3x/4 = 15 => 3x = 60 => x = 20
    { questionId: 1011, segmentId: 10, questionText: "Verilen bir problemi çözmek için farklı yollar düşünmek hangi beceriyi geliştirir?", options: ["Ezberleme", "Hızlı okuma", "Yaratıcı düşünme ve problem çözme", "Dinleme"], correctAnswer: "Yaratıcı düşünme ve problem çözme", minAge: 10, maxAge: 18 },
    { questionId: 1012, segmentId: 10, questionText: "Desen tamamlama: 2, 4, 7, 11, 16, ? Sonraki sayı ne olmalı?", options: ["20", "21", "22", "23"], correctAnswer: "22", minAge: 11, maxAge: 15 }, // Artış miktarı artıyor: +2, +3, +4, +5, +6
    { questionId: 1013, segmentId: 10, questionText: "Ali'nin yaşı, Veli'nin yaşının 2 katından 3 eksiktir. Veli 10 yaşında ise Ali kaç yaşındadır?", options: ["17", "20", "23", "13"], correctAnswer: "17", minAge: 13, maxAge: 17 }, // 2*10 - 3 = 17
    { questionId: 1014, segmentId: 10, questionText: "Bir torbada 5 kırmızı, 3 mavi top vardır. Torbadan rastgele çekilen bir topun mavi olma olasılığı nedir?", options: ["3/5", "5/8", "3/8", "1/3"], correctAnswer: "3/8", minAge: 14, maxAge: 18 },
    { questionId: 1015, segmentId: 10, questionText: "Mantık sorusu: İki kaplumbağa yarışıyor. Biri diğerine 'Senin önündeyim!' diyor. Diğeri de ona 'Hayır, ben senin önündeyim!' diyor. Bu nasıl mümkün olabilir?", options: ["Yalan söylüyorlar", "Biri çok hızlı", "Sırt sırta yarışıyorlar", "Mümkün değil"], correctAnswer: "Sırt sırta yarışıyorlar", minAge: 12, maxAge: 18 }, // Veya farklı yönlere gidiyorlar
];


// --- Anlatım Metinleri (MATEMATİK) ---
const quizSegments = [
    { segmentId: 1, narrationTitle: "Temel Toplama ve Çıkarma", narrationText: "Haydi sayılarla oynamaya başlayalım! Toplama işlemi sayıları bir araya getirir, çıkarma ise birbirinden ayırır. Günlük hayatta sıkça kullandığımız bu işlemleri hatırlayalım." },
    { segmentId: 2, narrationTitle: "Çarpma ve Bölme İşlemleri", narrationText: "Çarpma, tekrarlı toplamanın kısa yoludur. Bölme ise bir bütünü eşit parçalara ayırmak veya bir sayının içinde diğerinden kaç tane olduğunu bulmaktır. Şimdi bu işlemlere göz atalım." },
    { segmentId: 3, narrationTitle: "Sayı Kavramları", narrationText: "Sayıların dünyası çok geniştir! Rakamların yerlerine göre değerleri (basamak değeri), sayıların tek mi çift mi olduğu ve sadece bire ve kendisine bölünebilen özel sayılar (asal sayılar) gibi kavramları inceleyeceğiz." },
    { segmentId: 4, narrationTitle: "Kesirler ve Ondalık Sayılar", narrationText: "Bir bütünün eş parçalarını göstermek için kesirleri kullanırız. Virgüllü sayılar olan ondalık sayılar da kesirlerin farklı bir gösterimidir. Pay, payda, basit kesir, bileşik kesir gibi kavramları hatırlayalım." },
    { segmentId: 5, narrationTitle: "Ölçme Birimleri", narrationText: "Çevremizdeki nesnelerin uzunluğunu, alanını, ağırlığını veya geçen zamanı ölçmek için farklı birimler kullanırız. Metre, santimetre, saat, dakika, kilogram gibi temel ölçü birimlerini ve dönüşümleri inceleyelim." },
    { segmentId: 6, narrationTitle: "Temel Geometri", narrationText: "Etrafımızdaki şekilleri tanıyalım! Üçgenler, kareler, dikdörtgenler, daireler... Kenarları, köşeleri ve açıları vardır. Açıların çeşitlerini ve temel şekillerin özelliklerini gözden geçirelim." },
    { segmentId: 7, narrationTitle: "Yüzdeler ve Oranlar", narrationText: "Bir bütünün 100 parçasından kaçını aldığımızı yüzde (%) ile ifade ederiz. İndirimler, zamlar yüzde ile hesaplanır. Oran ise iki çokluğu karşılaştırmanın bir yoludur. Bu kavramları ve orantıyı öğrenelim." },
    { segmentId: 8, narrationTitle: "Temel Cebir", narrationText: "Matematikte bilinmeyenleri harflerle (x, y gibi) gösteririz. Bu harflere değişken denir. Değişkenler ve sayılarla yapılan işlemlere cebirsel ifadeler, içinde eşitlik olanlara ise denklemler denir. Basit denklemleri çözmeyi hatırlayalım." },
    { segmentId: 9, narrationTitle: "Veri Analizi ve Olasılık", narrationText: "Topladığımız bilgileri (verileri) anlamlı hale getirmek için grafikler, ortalama, mod (tepe değer) ve medyan (ortanca) gibi araçları kullanırız. Bir olayın olma ihtimalini ise olasılık ile hesaplarız." },
    { segmentId: 10, narrationTitle: "Problem Çözme ve Mantık", narrationText: "Matematik sadece işlem yapmak değil, aynı zamanda mantık yürütme ve problem çözme sanatıdır. Karşımıza çıkan problemleri anlama, plan yapma ve çözüme ulaşma adımlarını uygulayalım. Bazen cevaplar sayılarda değil, mantıkta gizlidir!" }
];
