export function parseLLMResponse(text) {
    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleaned);
}

const data1 = [
    {
        "videoId": "GmCn31pq8i0",
        "title": "A.R. Rahman - Ghanan Ghanan Best Video|Lagaan|Aamir Khan|Alka Yagnik|Udit Narayan",
        "channelTitle": "SonyMusicIndiaVEVO"
    },
    {
        "videoId": "9JDSGhhiOwI",
        "title": "Tere Bina - Full Video | A. R. Rahman | Aishwarya Rai | Abhishek Bachchan | Guru",
        "channelTitle": "Sony Music India"
    },
    {
        "videoId": "r7qovpFAGrQ",
        "title": "Lil Nas X - Old Town Road (Official Video) ft. Billy Ray Cyrus",
        "channelTitle": "LilNasXVEVO"
    },
    {
        "videoId": "A8Yr1OOeOT8",
        "title": "Shagoon - Tum Apna Ranjo Gum-Apni Pareshani - Jagjit Kaur",
        "channelTitle": "Shemaroo"
    },
    {
        "videoId": "63AdNP-Wu0k",
        "title": "कोई जब तुम्हारा हृदय तोड़ दे 4K - Manoj Kumar Songs | Mukesh | Purab Aur Pacchim Songs | Saira Banu",
        "channelTitle": "SuperHit Gaane"
    },
    {
        "videoId": "L3wKzyIN1yk",
        "title": "Rag'n'Bone Man - Human (Official Video)",
        "channelTitle": "RagnBoneManVEVO"
    },
    {
        "videoId": "u6bk53x2Kno",
        "title": "Koi Ladki Hai Song | Dil To Pagal Hai | Shah Rukh Khan, Madhuri Dixit, Karisma Kapoor | Lata, Udit",
        "channelTitle": "YRF"
    },
    {
        "videoId": "CTGLJbhPRNs",
        "title": "Chingam Chabake Full Video - Gori Tere Pyaar Mein|Kareena,Imran|Shankar M, Shalmali K",
        "channelTitle": "SonyMusicIndiaVEVO"
    },
    {
        "videoId": "FCWKGavielw",
        "title": "Chaudhary (Video) Amit Trivedi | Jubin Nautiyal, Mame Khan, Yohani | Bhavin, Aayushi | Bhushan K",
        "channelTitle": "T-Series"
    },
    {
        "videoId": "WGdoaRVOm8o",
        "title": "Chhalaang: Care Ni Karda | Rajkummar R, Nushrratt B | Yo Yo Honey Singh, Alfaaz, Hommie Dilliwala",
        "channelTitle": "T-Series"
    },
    {
        "videoId": "u0Y3EHuMktE",
        "title": "Ghana Kasoota |@raftaarmusic | Surbhi Jyoti | @RashmeetKaur | Avvy Sra | Latest Hit Dance Song 2021",
        "channelTitle": "Sony Music India"
    },
    {
        "videoId": "ANBRPZ8GGSk",
        "title": "Ho Sarhdi Aa Duniya Yaaran Di Chadh Ton (Official Song) | Shubh | Rokeya Na Rukkda Ae Veham Du Kadh",
        "channelTitle": "Deep Music"
    },
    {
        "videoId": "nWazIXT3Xno",
        "title": "Teri Dastaan - Full Song | Hichki | Rani Mukerji | Jasleen Royal",
        "channelTitle": "YRF"
    },
    {
        "videoId": "kd-6aw99DpA",
        "title": "Full Video: \"Chak Lein De\" | Chandni Chowk To China | Akshay Kumar, Deepika Padukone | Kailash Kher",
        "channelTitle": "T-Series"
    },
    {
        "videoId": "cKsWaDS3Rzs",
        "title": "Tech N9ne - Face Off (Lyrics) ft. The Rock | it's about drive it's about power the rock",
        "channelTitle": "TikTokTunes"
    },
    {
        "videoId": "MEg-oqI9qmw",
        "title": "Masked Wolf - Astronaut In The Ocean (Official Music Video)",
        "channelTitle": "Masked Wolf"
    },
    {
        "videoId": "3KFvoDDs0XM",
        "title": "Oh, Pretty Woman",
        "channelTitle": "Roy Orbison - Topic"
    },
    {
        "videoId": "XgdY_s1LsZc",
        "title": "Haule Haule - Full Song | Rab Ne Bana Di Jodi | Shah Rukh Khan | Anushka Sharma | Sukhwinder Singh",
        "channelTitle": "YRF"
    },
    {
        "videoId": "ltYjI3oN6zc",
        "title": "(Full Version) Bhai Rahgir Ye Hum Kaunsi Gaadi Pe Chadh Gaye | Rahgir",
        "channelTitle": "Rahgir Live"
    },
    {
        "videoId": "eFO3y_Q7i_Q",
        "title": "Premika Ne Pyaar se | Original Video | #trendingtracks #instatrending  | A.R. Rahman, & Udit Narayan",
        "channelTitle": "Ishtar Music"
    },
    {
        "videoId": "W0DM5lcj6mw",
        "title": "Imagine Dragons - Believer (Lyrics)",
        "channelTitle": "7clouds"
    },
    {
        "videoId": "mr_n9R3E_w4",
        "title": "Mera Dil Ye Pukare Aaja - Vaijayanti Mala, Lata Mangeshkar, Nagin, Emotional Song",
        "channelTitle": "Ultra Bollywood"
    },
    {
        "videoId": "9Za8ZtfHXXY",
        "title": "Oh Re Taal Mile | Sanjeev Kumar | Anokhi Raat | Bollywood Songs | Zahida | Mukri'",
        "channelTitle": "Shemaroo Filmi Gaane"
    },
    {
        "videoId": "ptqkTdtt7nI",
        "title": "चिंगारी कोई भड़के 4K - Chingari Koi Bhadke 4K Video Song - राजेश खन्ना - किशोर कुमार - अमर प्रेम",
        "channelTitle": "Gaane Naye Purane"
    },
    {
        "videoId": "F4vnfZ2Did4",
        "title": "Teri Duniya Se Hoke Majboor | Pavitra Paapi (1970) Songs | Tanuja | Balraj Sahni | Parikshit Sahni",
        "channelTitle": "Kishore Kumar Hit Songs"
    },
    {
        "videoId": "kR8rsh1AqRs",
        "title": "Dil Aisa Kisi Ne Mera Toda 4K Song | Amanush | Kishore Kumar | Sharmila Tagore | Uttam Kumar",
        "channelTitle": "SuperHit Gaane"
    },
    {
        "videoId": "1YDULSDalig",
        "title": "Ala Barfi - Full Video Song | Barfi | Ranbir Kapoor | Pritam | Mohit Chauhan",
        "channelTitle": "SonyMusicIndiaVEVO"
    },
    {
        "videoId": "YfPSnN4pqpw",
        "title": "Tumse Achha Kaun Hai - Mohammed Rafi @ Janwar - Shammi Kapoor, Rajshree",
        "channelTitle": "OrangeSadabaharFilms"
    },
    {
        "videoId": "TY2qO3lt-dE",
        "title": "जिया ओ जिया ओ जिया कुछ बोल दो Jiyaa O Jiyaa O Jiyaa Kuch Bol Do | HD Song- Dev Anand | Mohammed Rafi",
        "channelTitle": "HD Songs Bollywood"
    },
    {
        "videoId": "0U3QlZP5_No",
        "title": "Aalsi Dopahar",
        "channelTitle": "Rahgir - Topic"
    },
    {
        "videoId": "bDgsMwXcTkk",
        "title": "FEEL HAI (Official Video) BALI | BADSHAH | Hindi Rap 2021",
        "channelTitle": "Mr. BALI"
    },
    {
        "videoId": "Cc_cNEjAh_Y",
        "title": "Acha Lagta Hai Best Video - Aarakshan|Deepika Padukone|Saif Ali Khan|Shreya Ghoshal",
        "channelTitle": "SonyMusicIndiaVEVO"
    },
    {
        "videoId": "C02IJE_80Ok",
        "title": "उड जा हँस अकेला I UDJA HANS AKELA with Lyrics I Master Rana I Chetvani Bhajan I Hindi Bhajan",
        "channelTitle": "Soormandir Hindi"
    },
    {
        "videoId": "tLImVUXMVt4",
        "title": "YNG Martyr - Nike Ticks (Lyrics) | stay dripped to the feet nike ticks on fleek",
        "channelTitle": "TikTokTunes"
    },
    {
        "videoId": "Q1QcLbkYFaM",
        "title": "BoyWithUke - IDGAF ft. blackbear",
        "channelTitle": "BoyWithUkeVEVO"
    },
    {
        "videoId": "T2fjQrsKbAM",
        "title": "BoyWithUke - Understand",
        "channelTitle": "BoyWithUkeVEVO"
    },
    {
        "videoId": "C805Nt0JPIY",
        "title": "Talaash Muskaanein Jhooti Hai Full Video Song | Aamir Khan, Kareena Kapoor, Rani Mukherjee",
        "channelTitle": "T-Series"
    },
    {
        "videoId": "6AwXKJoKJz4",
        "title": "Kelis - Milkshake (Official Music Video)",
        "channelTitle": "KelisVEVO"
    },
    {
        "videoId": "UN6oMdALC_8",
        "title": "My Money Don’t Jiggle It Folds TikTok (Lyrics) Extended Version",
        "channelTitle": "TikTokTunes"
    },
    {
        "videoId": "pjolhlLBb6g",
        "title": "Will Joseph Cook - Be Around Me (Official Video)",
        "channelTitle": "Will Joseph Cook"
    },
    {
        "videoId": "QEbBuW8u1bA",
        "title": "CKay - Love Nwantiti [Acoustic Version]",
        "channelTitle": "CKay"
    },
    {
        "videoId": "UUCMtZCIYz4",
        "title": "BoyWithUke - Toxic (Lyrics)",
        "channelTitle": "Vibe Music"
    },
    {
        "videoId": "WY8W6NqtTlM",
        "title": "Earl - All That Glitters (Official Audio)",
        "channelTitle": "EarlVEVO"
    },
    {
        "videoId": "tAPVdPLCvYU",
        "title": "Sun Lo Na (Raw) - Suzonn",
        "channelTitle": "Suzonn"
    },
    {
        "videoId": "XJZiRY9Qe-I",
        "title": "Bandi Tot - Badhaai Do | Rajkummar Rao, Bhumi Pednekar | Ankit Tiwari, Nikhita Gandhi, Anurag Bhomia",
        "channelTitle": "Zee Music Company"
    },
    {
        "videoId": "H92bD3wqjoQ",
        "title": "Maange Manzooriyan - Badhaai Do | Rajkummar Rao, Bhumi Pednekar| Maalavika Manoj, Khamosh S, Azeem S",
        "channelTitle": "Zee Music Company"
    },
    {
        "videoId": "Z-ap5Fp2T6c",
        "title": "i'm bo yo.",
        "channelTitle": "boburnham"
    },
    {
        "videoId": "R8iaViNIy3U",
        "title": "Bo Burnham - Bezos I+II [HQ Extended Mix]",
        "channelTitle": "I Can't Stop Making Noise"
    },
    {
        "videoId": "Iw5xbunjgSg",
        "title": "Roja.  Hariharan & SP Balasubramaniam Duet",
        "channelTitle": "rish1rish"
    },
    {
        "videoId": "RJMgaEpnmuM",
        "title": "Saiman Says - Parichay PARODY",
        "channelTitle": "Yash Hu Yaar"
    },
    {
        "videoId": "V5En3Ks3OjE",
        "title": "Kaka New Song | Kale Je Libaas Di (Official Video) Ginni Kapoor | Punjabi song",
        "channelTitle": "Single Track Studio"
    }
]

export const data = [
    {
        "videoId": "-LWbeZUyQe8",
        "title": "Kachha Ghada ( Ye jo hans rahi hai duniya) Song by Rahgir | Music Shubhodeep Roy",
        "channelTitle": "Rahgir Live"
    },
    {
        "videoId": "N8DDpLCASNs",
        "title": "SHAMELESS (Official Video) | BALI | ENZO",
        "channelTitle": "Mr. BALI"
    },
    {
        "videoId": "gJLVTKhTnog",
        "title": "Anuv Jain - HUSN (Official Video)",
        "channelTitle": "Anuv Jain"
    },
    {
        "videoId": "sFMRqxCexDk",
        "title": "The Local Train - Aalas Ka Pedh - Choo Lo (Official Audio)",
        "channelTitle": "The Local Train"
    },
    {
        "videoId": "U0EI7XFkkV4",
        "title": "Farak - Taare | Official Music Video |",
        "channelTitle": "Farak"
    },
    {
        "videoId": "oafxkMv4xnc",
        "title": "Bairan – Animated Love Story | Banjaare (Official Video)",
        "channelTitle": "Banjaare"
    },
    {
        "videoId": "cEAAbk0tR2M",
        "title": "Paheli🥀(Lyrics) by Advait, Aryann Shabin, Mayavi, Sameeksha Sarkar💌 | Hindi Lofi Pop",
        "channelTitle": "Advait"
    },
    {
        "videoId": "lSf5ThEETPk",
        "title": "Ve Mahiya Tere Vaikhan Nu Chook Charkha -  Fareed Ayaz & Abu Muhammad Qawwal",
        "channelTitle": "Tasawwuf"
    },
    {
        "videoId": "7yBxLdnIxDs",
        "title": "gini - Sukoon | Official Music Video",
        "channelTitle": "gini"
    },
    {
        "videoId": "b-gjLgT4SUQ",
        "title": "Chaar Diwaari ft. Indian Ocean, Gini - Aashiqana | Parvana EP | Def Jam India",
        "channelTitle": "Chaar Diwaari"
    },
    {
        "videoId": "SK49I5xq7e8",
        "title": "Yaad Nahin Kya Kya Dekha Tha - Jagjit Singh Ghazals 'Saher' Album",
        "channelTitle": "Pop Chartbusters"
    },
    {
        "videoId": "Xi8Fabcb_MA",
        "title": "Chaand Baaliyan - Aditya A. (Official Video)",
        "channelTitle": "Aditya A"
    },
    {
        "videoId": "EiiOYwqk3A0",
        "title": "Aditya Rikhari - FAASLE",
        "channelTitle": "Aditya Rikhari"
    },
    {
        "videoId": "qoqlJGOQtuQ",
        "title": "Nusrat Fateh Ali Khan -Mera Piya Ghar Aaya Live at Washington University with english subtitles",
        "channelTitle": "Pure Knowledge"
    },
    {
        "videoId": "JY6BCXm6p-4",
        "title": "Ritviz - Barso [Official Music Video]",
        "channelTitle": "RITVIZ"
    },
    {
        "videoId": "CL6VAEI7kyk",
        "title": "Badal Barsa Bijuli Sawan Ko Pani (Original Song) Ananda Karki | Prashna Shakya | Nepali Girl",
        "channelTitle": "ThrottleVerse"
    },
    {
        "videoId": "ghe6YipmCQY",
        "title": "Garaj Garaj Jugalbandi Video Song | Bandish Bandits |  Farid Hasan, Mohammed Aman | Amazon Original",
        "channelTitle": "Prime Video India"
    },
    {
        "videoId": "7kR6tqaq_zY",
        "title": "Labb Par Aaye Video Song | Bandish Bandits | Javed Ali | Shankar Ehsaan Loy | Amazon Original",
        "channelTitle": "Prime Video India"
    },
    {
        "videoId": "lI5w2QwdYik",
        "title": "Bo Burnham: Inside  - Jeff Bezos",
        "channelTitle": "SaintNSinner"
    }
]