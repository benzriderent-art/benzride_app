package benzride_api.config;

import benzride_api.entity.Admin;
import benzride_api.entity.Motor;
import benzride_api.entity.Tour;
import benzride_api.entity.enums.TourCategory;
import benzride_api.entity.enums.TransmissionType;
import benzride_api.repository.AdminRepository;
import benzride_api.repository.MotorRepository;
import benzride_api.repository.TourBookingRepository;
import benzride_api.repository.TourRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Value("${admin.password:benzrental2024}")
    private String adminPassword;

    private static final String SEED_VERSION_MARKER = "Ubud Sacred Temple Circuit";

    @Bean
    public CommandLineRunner seedData(
            AdminRepository adminRepository,
            MotorRepository motorRepository,
            TourRepository tourRepository,
            TourBookingRepository tourBookingRepository,
            BCryptPasswordEncoder passwordEncoder) {
        return args -> {

            // ── Admin ─────────────────────────────────────────────────────────
            if (adminRepository.findByUsername("admin").isEmpty()) {
                adminRepository.save(Admin.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode(adminPassword))
                        .build());
            }

            // ── Motors ────────────────────────────────────────────────────────
            if (motorRepository.count() == 0) {
                motorRepository.saveAll(List.of(
                    Motor.builder().name("Honda Beat").cc(110).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(80000L).priceWeek(500000L).priceMonth(1500000L).build(),
                    Motor.builder().name("Honda Vario 125").cc(125).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(90000L).priceWeek(560000L).priceMonth(1700000L).build(),
                    Motor.builder().name("Honda Scoopy").cc(110).transmission(TransmissionType.AUTOMATIC).year(2022).available(true).priceDay(85000L).priceWeek(530000L).priceMonth(1600000L).build(),
                    Motor.builder().name("Honda PCX 160").cc(160).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(125000L).priceWeek(780000L).priceMonth(2300000L).build(),
                    Motor.builder().name("Yamaha NMAX 155").cc(155).transmission(TransmissionType.AUTOMATIC).year(2022).available(true).priceDay(135000L).priceWeek(840000L).priceMonth(2500000L).build(),
                    Motor.builder().name("Honda ADV 160").cc(160).transmission(TransmissionType.AUTOMATIC).year(2023).available(false).priceDay(155000L).priceWeek(965000L).priceMonth(2800000L).build()
                ));
            }

            // ── Tours — reset & re-seed jika belum ada atau belum punya konten EN ──
            boolean needReseed = tourRepository.findAll().stream()
                    .noneMatch(t -> SEED_VERSION_MARKER.equals(t.getName()) && t.getNameEn() != null);
            if (needReseed) {
                tourBookingRepository.deleteAll();
                tourRepository.deleteAll();
                seedTours(tourRepository);
            }
        };
    }

    private void seedTours(TourRepository repo) {

        List<String> commonBring = List.of(
            "Pakaian santai & nyaman",
            "Sunscreen & kacamata hitam",
            "Kamera / HP untuk foto",
            "Uang tunai Rp 50.000–100.000 (tips & oleh-oleh)",
            "Sandal atau sepatu tertutup"
        );
        List<String> sunriseBring = List.of(
            "Jaket hangat (suhu pagi pegunungan dingin)",
            "Pakaian santai & nyaman",
            "Sunscreen & kacamata hitam",
            "Kamera / HP untuk foto",
            "Uang tunai Rp 50.000–100.000",
            "Sandal atau sepatu tertutup"
        );
        List<String> beachBring = List.of(
            "Pakaian renang / baju ganti",
            "Sunscreen SPF tinggi",
            "Kamera / HP waterproof atau tahan cipratan",
            "Uang tunai Rp 50.000–100.000",
            "Sandal pantai",
            "Handuk kecil"
        );

        // English what-to-bring lists
        List<String> commonBringEn = List.of(
            "Comfortable casual clothing",
            "Sunscreen & sunglasses",
            "Camera / smartphone",
            "Cash IDR 50,000–100,000 (tips & souvenirs)",
            "Sandals or closed-toe shoes"
        );
        List<String> sunriseBringEn = List.of(
            "Warm jacket (cold mountain morning temperatures)",
            "Comfortable casual clothing",
            "Sunscreen & sunglasses",
            "Camera / smartphone",
            "Cash IDR 50,000–100,000",
            "Sandals or closed-toe shoes"
        );
        List<String> beachBringEn = List.of(
            "Swimwear / change of clothes",
            "High SPF sunscreen",
            "Waterproof camera / smartphone or splash-proof case",
            "Cash IDR 50,000–100,000",
            "Beach sandals",
            "Small towel"
        );

        repo.saveAll(List.of(

            // ── CULTURAL 1 ────────────────────────────────────────────────────
            Tour.builder()
                .name("Ubud Sacred Temple Circuit")
                .nameEn("Ubud Sacred Temple Circuit")
                .description("Susuri jejak spiritual Bali melalui empat pura bersejarah yang belum banyak dikenal wisatawan — Pura Kehen dengan pinakel megalitik, Goa Gajah yang misterius, Gunung Kawi dengan candi batu raksasa, dan Pura Tirta Empul untuk ritual melukat penyucian diri.")
                .descriptionEn("Explore Bali's spiritual heart through four historic temples off the beaten path — the tiered Pura Kehen, the mysterious Goa Gajah, the megalithic Gunung Kawi, and the sacred Tirta Empul for a traditional melukat purification ritual.")
                .category(TourCategory.CULTURAL)
                .durationHours(9)
                .pricePerPerson(480000L)
                .maxParticipants(6)
                .location("Bangli & Gianyar, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
                    "https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80",
                    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Air minum & camilan",
                    "Tiket masuk semua lokasi",
                    "Kain sarung & selendang pura"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Water & light snacks",
                    "All entrance fees",
                    "Sarong & temple sash"
                ))
                .highlights(List.of(
                    "Pura Kehen — pura bertingkat kerajaan Bangli",
                    "Goa Gajah — situs arkeologi abad ke-9",
                    "Gunung Kawi — candi batu megalitik",
                    "Pura Tirta Empul — ritual melukat",
                    "Desa Tampaksiring — pemandangan sawah"
                ))
                .highlightsEn(List.of(
                    "Pura Kehen — tiered royal temple of Bangli",
                    "Goa Gajah — 9th-century archaeological site",
                    "Gunung Kawi — megalithic rock-cut temples",
                    "Tirta Empul — sacred purification ritual",
                    "Tampaksiring village — stunning rice field views"
                ))
                .itinerary(List.of(
                    "08:00 | Pick-up di hotel/villa",
                    "09:15 | Pura Kehen — pura kerajaan bertingkat",
                    "10:30 | Goa Gajah — situs arkeologi mistis",
                    "11:30 | Gunung Kawi — candi batu raksasa",
                    "13:00 | Makan siang di warung lokal Tampaksiring",
                    "14:30 | Pura Tirta Empul — ritual melukat",
                    "16:00 | Pasar seni Ubud (opsional)",
                    "17:00 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "08:00 | Hotel/villa pick-up",
                    "09:15 | Pura Kehen — tiered royal temple",
                    "10:30 | Goa Gajah — mystical archaeological site",
                    "11:30 | Gunung Kawi — giant rock-cut temples",
                    "13:00 | Local lunch at Tampaksiring warung",
                    "14:30 | Tirta Empul — sacred purification ritual",
                    "16:00 | Ubud Art Market (optional)",
                    "17:00 | Return to hotel/villa"
                ))
                .whatToBring(commonBring)
                .whatToBringEn(commonBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(true)
                .available(true)
                .build(),

            // ── CULTURAL 2 ────────────────────────────────────────────────────
            Tour.builder()
                .name("Artisan Village Trail")
                .nameEn("Artisan Village Trail")
                .description("Telusuri desa-desa pengrajin legendaris Bali dan saksikan sendiri proses pembuatan karya seni tangan — dari ukiran perak Celuk, ukiran kayu Mas, lukisan tradisional Batuan, hingga kain tenun Klungkung. Sempurna untuk pecinta seni dan budaya.")
                .descriptionEn("Journey through Bali's legendary artisan villages and witness the creation of handcrafted masterpieces — from Celuk's silver jewelry, Mas' wood carvings, Batuan's traditional paintings, to Klungkung's hand-woven fabrics. Perfect for art and culture lovers.")
                .category(TourCategory.CULTURAL)
                .durationHours(7)
                .pricePerPerson(420000L)
                .maxParticipants(8)
                .location("Gianyar & Klungkung, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
                    "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Air minum",
                    "Tur workshop gratis di setiap desa"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Water",
                    "Free workshop tour at every village"
                ))
                .highlights(List.of(
                    "Celuk — desa pengrajin perak & emas",
                    "Mas — desa ukiran kayu tradisional",
                    "Batuan — desa lukisan hitam-putih khas Bali",
                    "Klungkung — pasar Semarapura & kain tenun",
                    "Sukawati — pasar seni terbesar Bali"
                ))
                .highlightsEn(List.of(
                    "Celuk — silver & gold jewelry village",
                    "Mas — traditional wood carving village",
                    "Batuan — black & white traditional painting village",
                    "Klungkung — Semarapura market & hand-woven fabrics",
                    "Sukawati — Bali's largest art market"
                ))
                .itinerary(List.of(
                    "09:00 | Pick-up di hotel/villa",
                    "10:00 | Celuk — workshop perak & emas",
                    "11:15 | Mas — studio ukiran kayu",
                    "12:00 | Batuan — galeri lukisan tradisional",
                    "13:00 | Makan siang di Klungkung",
                    "14:30 | Kerta Gosa — balai pengadilan bersejarah",
                    "15:30 | Pasar Sukawati — oleh-oleh seni",
                    "16:30 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "09:00 | Hotel/villa pick-up",
                    "10:00 | Celuk — silver & gold workshop",
                    "11:15 | Mas — wood carving studio",
                    "12:00 | Batuan — traditional painting gallery",
                    "13:00 | Lunch in Klungkung",
                    "14:30 | Kerta Gosa — historic courthouse",
                    "15:30 | Sukawati Art Market — souvenirs",
                    "16:30 | Return to hotel/villa"
                ))
                .whatToBring(commonBring)
                .whatToBringEn(commonBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(false)
                .available(true)
                .build(),

            // ── NATURE 1 ──────────────────────────────────────────────────────
            Tour.builder()
                .name("Twin Waterfalls Jungle Trek")
                .nameEn("Twin Waterfalls Jungle Trek")
                .description("Petualangan ke jantung hutan tropis Bali — menelusuri jalan setapak berbatu menuju dua air terjun spektakuler yang masih sangat asri: Nungnung yang megah (57 meter) dan Kanto Lampo yang bak tirai kristal. Tour terbaik untuk jiwa petualang.")
                .descriptionEn("An adventure into the heart of Bali's tropical jungle — trekking along rocky paths to two spectacular and pristine waterfalls: the majestic Nungnung (57 meters) and the crystal-curtain Kanto Lampo. The ultimate tour for adventure seekers.")
                .category(TourCategory.NATURE)
                .durationHours(8)
                .pricePerPerson(520000L)
                .maxParticipants(6)
                .location("Badung & Gianyar, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80",
                    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Air minum & snack energi",
                    "Tiket masuk lokasi wisata"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Water & energy snacks",
                    "Entrance fees to all sites"
                ))
                .highlights(List.of(
                    "Air Terjun Nungnung — 57 meter, tersembunyi di hutan",
                    "Air Terjun Kanto Lampo — aliran tirai kristal",
                    "Treking 20 menit di hutan tropis Bali",
                    "Pemandangan sawah bertingkat sepanjang jalan",
                    "Desa tradisional di lembah Petanu"
                ))
                .highlightsEn(List.of(
                    "Nungnung Waterfall — 57 meters, hidden in the jungle",
                    "Kanto Lampo Waterfall — crystal curtain flow",
                    "20-minute trek through Bali's tropical forest",
                    "Terraced rice field views along the way",
                    "Traditional village in Petanu valley"
                ))
                .itinerary(List.of(
                    "08:00 | Pick-up di hotel/villa",
                    "09:30 | Air Terjun Nungnung (treking 20 menit)",
                    "11:30 | Istirahat & snack di warung lokal",
                    "12:30 | Air Terjun Kanto Lampo",
                    "14:00 | Makan siang di desa Gianyar",
                    "15:30 | Jalan pulang via sawah Tegalalang (foto stop)",
                    "16:30 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "08:00 | Hotel/villa pick-up",
                    "09:30 | Nungnung Waterfall (20-min trek)",
                    "11:30 | Rest & snacks at local warung",
                    "12:30 | Kanto Lampo Waterfall",
                    "14:00 | Lunch in Gianyar village",
                    "15:30 | Return via Tegalalang rice terraces (photo stop)",
                    "16:30 | Return to hotel/villa"
                ))
                .whatToBring(List.of(
                    "Sepatu/sandal grip untuk medan berbatu & basah",
                    "Pakaian yang bisa basah atau baju ganti",
                    "Sunscreen & kacamata hitam",
                    "Kamera / HP tahan air atau plastik pelindung",
                    "Uang tunai Rp 50.000–100.000"
                ))
                .whatToBringEn(List.of(
                    "Grip sandals/shoes for rocky & wet terrain",
                    "Clothes that can get wet, or a change of clothes",
                    "Sunscreen & sunglasses",
                    "Waterproof camera / smartphone or protective case",
                    "Cash IDR 50,000–100,000"
                ))
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(false)
                .available(true)
                .build(),

            // ── NATURE 2 ──────────────────────────────────────────────────────
            Tour.builder()
                .name("North Bali Highland Adventure")
                .nameEn("North Bali Highland Adventure")
                .description("Jelajahi Bali Utara yang masih perawan — melewati perkebunan kopi dan cengkeh berbukit, desa Munduk yang dingin dan sejuk, kembar danau Tamblingan dan Buyan yang diselimuti kabut pagi, hingga Pura Ulun Danu di tepi Danau Beratan yang ikonik.")
                .descriptionEn("Discover untouched North Bali — winding through hilly coffee and clove plantations, the cool and serene Munduk village, the mist-covered twin lakes Tamblingan and Buyan, and the iconic Ulun Danu temple on the shores of Lake Beratan.")
                .category(TourCategory.NATURE)
                .durationHours(10)
                .pricePerPerson(580000L)
                .maxParticipants(6)
                .location("Buleleng & Tabanan, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
                    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Air minum & buah lokal",
                    "Tiket masuk Pura Ulun Danu"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Water & local fruits",
                    "Entrance fees to Pura Ulun Danu"
                ))
                .highlights(List.of(
                    "Danau Tamblingan & Buyan — twin lake tersembunyi",
                    "Desa Munduk — perkebunan kopi & cengkeh",
                    "Pura Ulun Danu Beratan — pura di atas danau",
                    "Air Terjun Gitgit — di tepi jalan Singaraja",
                    "Panorama pegunungan Bali Tengah"
                ))
                .highlightsEn(List.of(
                    "Tamblingan & Buyan Lakes — hidden twin lakes",
                    "Munduk village — coffee & clove plantation",
                    "Pura Ulun Danu Beratan — temple on the lake",
                    "Gitgit Waterfall — roadside North Bali gem",
                    "Central Bali highland panorama"
                ))
                .itinerary(List.of(
                    "07:00 | Pick-up di hotel/villa",
                    "09:00 | Danau Tamblingan & Buyan — viewpoint",
                    "10:15 | Desa Munduk — icip kopi lokal",
                    "11:30 | Air Terjun Gitgit",
                    "13:00 | Makan siang di Singaraja",
                    "14:30 | Perjalanan kembali via Bedugul",
                    "15:30 | Pura Ulun Danu Beratan",
                    "17:00 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "07:00 | Hotel/villa pick-up",
                    "09:00 | Tamblingan & Buyan Lakes — viewpoint",
                    "10:15 | Munduk village — taste local coffee",
                    "11:30 | Gitgit Waterfall",
                    "13:00 | Lunch in Singaraja",
                    "14:30 | Return via Bedugul",
                    "15:30 | Pura Ulun Danu Beratan",
                    "17:00 | Return to hotel/villa"
                ))
                .whatToBring(commonBring)
                .whatToBringEn(commonBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(true)
                .available(true)
                .build(),

            // ── SUNRISE 1 ─────────────────────────────────────────────────────
            Tour.builder()
                .name("Batur Volcano Sunrise Ride")
                .nameEn("Batur Volcano Sunrise Ride")
                .description("Pengalaman yang tak bisa dilupakan — berangkat dini hari menembus dinginnya pegunungan Kintamani menuju kaldera Gunung Batur yang aktif. Saksikan matahari terbit memancarkan cahaya jingga di atas Danau Batur sambil menikmati sarapan tradisional Bali.")
                .descriptionEn("An unforgettable experience — departing before dawn through the cold Kintamani highlands to the caldera of active Mount Batur. Watch the sunrise paint the sky in shades of orange above Lake Batur while enjoying a traditional Balinese breakfast.")
                .category(TourCategory.SUNRISE)
                .durationHours(6)
                .pricePerPerson(560000L)
                .maxParticipants(6)
                .location("Kintamani, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&q=80",
                    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Sarapan tradisional Bali di tepi danau",
                    "Kopi & teh Kintamani arabika"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Traditional Balinese breakfast by the lake",
                    "Kintamani arabica coffee & tea"
                ))
                .highlights(List.of(
                    "Sunrise spektakuler di kaldera Batur",
                    "Danau Batur dari ketinggian 1.717 mdpl",
                    "Pemandangan Gunung Agung dari kejauhan",
                    "Sarapan nasi jinggo pinggir danau",
                    "Kopi arabika Kintamani — single origin Bali"
                ))
                .highlightsEn(List.of(
                    "Spectacular sunrise at Batur caldera",
                    "Lake Batur from 1,717 meters above sea level",
                    "Mount Agung panorama in the distance",
                    "Nasi jinggo breakfast by the lakeside",
                    "Single-origin Kintamani arabica coffee"
                ))
                .itinerary(List.of(
                    "03:30 | Pick-up di hotel/villa (dini hari)",
                    "05:00 | Tiba di viewpoint kaldera Kintamani",
                    "05:30 | Sunrise — golden hour di atas danau",
                    "07:00 | Sarapan tradisional Bali tepi danau",
                    "08:00 | Cicip kopi arabika Kintamani",
                    "09:00 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "03:30 | Hotel/villa pick-up (pre-dawn)",
                    "05:00 | Arrive at Kintamani caldera viewpoint",
                    "05:30 | Sunrise — golden hour above the lake",
                    "07:00 | Traditional Balinese breakfast by the lake",
                    "08:00 | Taste Kintamani arabica coffee",
                    "09:00 | Return to hotel/villa"
                ))
                .whatToBring(sunriseBring)
                .whatToBringEn(sunriseBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(48)
                .featured(true)
                .available(true)
                .build(),

            // ── SUNRISE 2 ─────────────────────────────────────────────────────
            Tour.builder()
                .name("Sidemen Valley Dawn Ride")
                .nameEn("Sidemen Valley Dawn Ride")
                .description("Rasakan Bali yang sesungguhnya — berkendara ke Sidemen di Bali Timur sebelum matahari terbit. Saksikan kabut tipis mengangkat dari lembah sawah hijau berlatar belakang Gunung Agung yang megah. Salah satu sunrise view terbaik di Bali yang masih sepi wisatawan.")
                .descriptionEn("Experience the real Bali — riding to Sidemen in East Bali before sunrise. Watch the thin mist lift from lush green rice fields framed by the majestic Mount Agung. One of Bali's best sunrise views, still untouched by mass tourism.")
                .category(TourCategory.SUNRISE)
                .durationHours(5)
                .pricePerPerson(380000L)
                .maxParticipants(8)
                .location("Sidemen, Karangasem")
                .images(List.of(
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Sarapan di warung lokal Sidemen"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Breakfast at a local Sidemen warung"
                ))
                .highlights(List.of(
                    "Sawah Sidemen berlatar Gunung Agung",
                    "Sunrise di lembah tersembunyi Bali Timur",
                    "Desa Sidemen — masih sangat otentik",
                    "Subak — sistem irigasi sawah UNESCO",
                    "Kopi Bali & jajan pasar lokal"
                ))
                .highlightsEn(List.of(
                    "Sidemen rice fields against Mount Agung backdrop",
                    "Sunrise in East Bali's hidden valley",
                    "Sidemen village — authentically untouched",
                    "Subak — UNESCO rice irrigation system",
                    "Bali coffee & local pastries"
                ))
                .itinerary(List.of(
                    "04:30 | Pick-up di hotel/villa",
                    "06:00 | Tiba di Sidemen — viewpoint sawah",
                    "06:15 | Sunrise & golden hour foto",
                    "07:30 | Sarapan di warung lokal Sidemen",
                    "08:30 | Jalan kaki di antara sawah",
                    "09:30 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "04:30 | Hotel/villa pick-up",
                    "06:00 | Arrive at Sidemen — rice field viewpoint",
                    "06:15 | Sunrise & golden hour photography",
                    "07:30 | Breakfast at local Sidemen warung",
                    "08:30 | Walk through the rice fields",
                    "09:30 | Return to hotel/villa"
                ))
                .whatToBring(sunriseBring)
                .whatToBringEn(sunriseBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(false)
                .available(true)
                .build(),

            // ── BEACH 1 ───────────────────────────────────────────────────────
            Tour.builder()
                .name("Bukit Peninsula Secret Coves")
                .nameEn("Bukit Peninsula Secret Coves")
                .description("Temukan pantai-pantai tersembunyi di semenanjung Bukit yang hanya bisa diakses dengan motor — Bias Tugal dengan air bening dan batu karang dramatis, Suluban yang mystical di bawah tebing, Padang Padang yang pernah jadi lokasi film, dan Dreamland yang luar biasa.")
                .descriptionEn("Discover the Bukit Peninsula's hidden beaches only accessible by motorcycle — crystal-clear Bias Tugal with dramatic rock formations, the mystical cliff-base Suluban, Padang Padang from the Eat Pray Love film, and the legendary Dreamland.")
                .category(TourCategory.BEACH)
                .durationHours(8)
                .pricePerPerson(450000L)
                .maxParticipants(8)
                .location("Bukit Peninsula, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
                    "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Air minum & kelapa muda segar",
                    "Tiket masuk Pura Uluwatu"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Water & fresh young coconut",
                    "Entrance fees to Pura Uluwatu"
                ))
                .highlights(List.of(
                    "Bias Tugal — hidden beach eksklusif",
                    "Pantai Suluban — di bawah tebing karang",
                    "Padang Padang — Eat Pray Love beach",
                    "Dreamland Beach — ombak surfer kelas dunia",
                    "Pura Uluwatu saat sunset golden hour"
                ))
                .highlightsEn(List.of(
                    "Bias Tugal — exclusive hidden beach",
                    "Suluban Beach — beneath the clifftop",
                    "Padang Padang — Eat Pray Love beach",
                    "Dreamland Beach — world-class surfer waves",
                    "Pura Uluwatu at sunset golden hour"
                ))
                .itinerary(List.of(
                    "09:00 | Pick-up di hotel/villa",
                    "10:00 | Bias Tugal — hidden beach via jalan setapak",
                    "11:30 | Pantai Suluban — di bawah tebing",
                    "12:30 | Makan siang seafood di Dreamland",
                    "14:00 | Padang Padang Beach",
                    "15:30 | Pantai Dreamland",
                    "17:00 | Pura Uluwatu — sunset",
                    "18:00 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "09:00 | Hotel/villa pick-up",
                    "10:00 | Bias Tugal — hidden beach via clifftop trail",
                    "11:30 | Suluban Beach — beneath the cliffs",
                    "12:30 | Seafood lunch at Dreamland",
                    "14:00 | Padang Padang Beach",
                    "15:30 | Dreamland Beach",
                    "17:00 | Pura Uluwatu — sunset",
                    "18:00 | Return to hotel/villa"
                ))
                .whatToBring(beachBring)
                .whatToBringEn(beachBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(true)
                .available(true)
                .build(),

            // ── BEACH 2 ───────────────────────────────────────────────────────
            Tour.builder()
                .name("Karangasem Coastal Loop")
                .nameEn("Karangasem Coastal Loop")
                .description("Petualangan sepanjang pesisir Bali Timur yang masih alami — dari laguna biru Candidasa, pasir putih Virgin Beach yang tenang, snorkeling di terumbu karang Jemeluk Amed yang kaya, hingga melihat bangkai kapal USAT Liberty di Tulamben yang jadi spot diving legendaris.")
                .descriptionEn("An adventure along East Bali's untouched coastline — from the blue lagoon of Candidasa, the serene white-sand Virgin Beach, snorkeling at Amed's vibrant Jemeluk reef, to viewing the legendary WWII shipwreck USAT Liberty at Tulamben, just 3 meters underwater.")
                .category(TourCategory.BEACH)
                .durationHours(9)
                .pricePerPerson(620000L)
                .maxParticipants(6)
                .location("Karangasem & Amed, Bali")
                .images(List.of(
                    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
                    "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80"
                ))
                .includes(List.of(
                    "Guide lokal profesional (Indonesia & Inggris)",
                    "Motor & bensin selama tour",
                    "Helm fullface & jas hujan",
                    "Peralatan snorkeling lengkap",
                    "Makan siang seafood di Amed",
                    "Air minum"
                ))
                .includesEn(List.of(
                    "Professional local guide (English & Indonesian)",
                    "Motorcycle & fuel throughout the tour",
                    "Full-face helmet & rain jacket",
                    "Complete snorkeling equipment",
                    "Seafood lunch in Amed",
                    "Water"
                ))
                .highlights(List.of(
                    "Candidasa Lagoon — biru tenang, sepi wisatawan",
                    "Virgin Beach (Pasir Putih) — pantai tersembunyi premium",
                    "Snorkeling Jemeluk Amed — terumbu karang spektakuler",
                    "USAT Liberty Tulamben — kapal perang WWII di kedalaman 3m",
                    "Pantai hitam vulkanik Amed"
                ))
                .highlightsEn(List.of(
                    "Candidasa Lagoon — crystal blue, crowd-free",
                    "Virgin Beach (Pasir Putih) — premium hidden beach",
                    "Jemeluk Amed snorkeling — spectacular coral reef",
                    "USAT Liberty Tulamben — WWII warship at 3m depth",
                    "Amed's black volcanic beach"
                ))
                .itinerary(List.of(
                    "07:00 | Pick-up di hotel/villa",
                    "09:00 | Candidasa Lagoon — foto & bersantai",
                    "10:00 | Virgin Beach (Pasir Putih)",
                    "11:30 | Snorkeling Jemeluk, Amed",
                    "13:00 | Makan siang seafood di Amed",
                    "14:30 | USAT Liberty Tulamben — snorkeling/lihat dari pantai",
                    "16:00 | Pantai hitam vulkanik Amed",
                    "17:30 | Kembali ke hotel/villa"
                ))
                .itineraryEn(List.of(
                    "07:00 | Hotel/villa pick-up",
                    "09:00 | Candidasa Lagoon — photos & relaxation",
                    "10:00 | Virgin Beach (Pasir Putih)",
                    "11:30 | Snorkeling at Jemeluk, Amed",
                    "13:00 | Seafood lunch in Amed",
                    "14:30 | USAT Liberty Tulamben — snorkel/view from shore",
                    "16:00 | Amed black volcanic beach",
                    "17:30 | Return to hotel/villa"
                ))
                .whatToBring(beachBring)
                .whatToBringEn(beachBringEn)
                .guideLanguage("Indonesia & English")
                .minBookingHours(24)
                .featured(false)
                .available(true)
                .build()

        ));
    }
}
