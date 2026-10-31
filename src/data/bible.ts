export type Testament = "ot" | "nt" | "eth" | "hist";
export type Book = { slug: string; name: string; group: Testament; chapters: number };

const mk = (group: Testament, list: [string, number][]): Book[] =>
  list.map(([name, chapters]) => ({
    name,
    chapters,
    group,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));

export const OLD_TESTAMENT = mk("ot", [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31], ["2 Samuel", 24],
  ["1 Kings", 22], ["2 Kings", 25], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10],
  ["Nehemiah", 13], ["Esther", 10], ["Job", 42], ["Psalms", 150], ["Proverbs", 31],
  ["Ecclesiastes", 12], ["Song of Solomon", 8], ["Isaiah", 66], ["Jeremiah", 52], ["Lamentations", 5],
  ["Ezekiel", 48], ["Daniel", 12], ["Hosea", 14], ["Joel", 3], ["Amos", 9],
  ["Obadiah", 1], ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3],
  ["Zephaniah", 3], ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4],
]);

export const NEW_TESTAMENT = mk("nt", [
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21], ["Acts", 28],
  ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13], ["Galatians", 6], ["Ephesians", 6],
  ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6],
  ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1], ["Hebrews", 13], ["James", 5],
  ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5], ["2 John", 1], ["3 John", 1],
  ["Jude", 1], ["Revelation", 22],
]);

export const ETHIOPIAN = mk("eth", [
  ["1 Enoch", 108], ["Jubilees", 50], ["1 Meqabyan", 36], ["2 Meqabyan", 14], ["3 Meqabyan", 20],
  ["4 Baruch", 9], ["Rest of the Words of Baruch", 9], ["Ethiopic Clement", 8],
]);

export const HISTORICAL = mk("hist", [
  ["Book of Jasher", 91], ["Didache", 16], ["Gospel of Nicodemus", 29], ["1 Maccabees", 16],
  ["2 Maccabees", 15], ["Tobit", 14], ["Judith", 16], ["Sirach (Ecclesiasticus)", 51], ["Wisdom of Solomon", 19],
]);

export const ALL_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT, ...ETHIOPIAN, ...HISTORICAL];
export const getBook = (slug: string) => ALL_BOOKS.find((b) => b.slug === slug);

export const GROUP_LABEL: Record<Testament, string> = {
  ot: "Old Testament",
  nt: "New Testament",
  eth: "Ethiopian Orthodox Canon",
  hist: "Historical & Lost Books",
};

/* ---------- Chapter content ---------- */
export type Segment = string | { red: string };
export type CrossRef = { label: string; book: string; chapter: number; verse: number; text: string };
export type Commentary = { source: string; body: string; lexical?: { word: string; lang: "Hebrew" | "Greek" | "Ge'ez"; translit: string; meaning: string }[] };
export type Verse = { n: number; heading?: string; text: Segment[]; refs?: CrossRef[]; commentary?: Commentary[] };
export type Chapter = { book: string; chapter: number; intro?: string; verses: Verse[] };

const v = (n: number, text: Segment[] | string, extra: Partial<Verse> = {}): Verse => ({
  n,
  text: typeof text === "string" ? [text] : text,
  ...extra,
});

const GENESIS_1: Chapter = {
  book: "genesis",
  chapter: 1,
  intro: "The account of creation: God speaks order, light and life into being over six days.",
  verses: [
    v(1, "In the beginning God created the heaven and the earth.", {
      heading: "The Creation of the World",
      refs: [
        { label: "John 1:1", book: "john", chapter: 1, verse: 1, text: "In the beginning was the Word..." },
        { label: "1 Enoch 1:2", book: "1-enoch", chapter: 1, verse: 2, text: "...a holy vision in the heavens..." },
        { label: "Hebrews 11:3", book: "hebrews", chapter: 11, verse: 3, text: "The worlds were framed by the word of God." },
      ],
      commentary: [
        { source: "Matthew Henry", body: "The first verse teaches that the world had a beginning, and that God alone is its Maker. Creation is not eternal; God is." },
        { source: "Hebrew Exegesis", body: "The verb bara is used in Scripture only with God as subject, denoting creative activity without pre-existing material.", lexical: [
          { word: "בְּרֵאשִׁית", lang: "Hebrew", translit: "bereshit", meaning: "in the beginning; at the head of" },
          { word: "בָּרָא", lang: "Hebrew", translit: "bara", meaning: "to create (divine action only)" },
          { word: "אֱלֹהִים", lang: "Hebrew", translit: "Elohim", meaning: "God; plural of majesty with singular verb" },
        ] },
      ],
    }),
    v(2, "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.", {
      commentary: [{ source: "Hebrew Exegesis", body: "Tohu va-bohu describes an unformed, uninhabited state, which the following days answer: forming (days 1-3) and filling (days 4-6).", lexical: [
        { word: "רוּחַ", lang: "Hebrew", translit: "ruach", meaning: "spirit, wind, breath" },
        { word: "מְרַחֶפֶת", lang: "Hebrew", translit: "merachefet", meaning: "hovering, brooding (as a bird over its young)" },
      ] }],
    }),
    v(3, "And God said, Let there be light: and there was light.", {
      refs: [
        { label: "John 1:5", book: "john", chapter: 1, verse: 5, text: "And the light shineth in darkness..." },
        { label: "2 Corinthians 4:6", book: "2-corinthians", chapter: 4, verse: 6, text: "God, who commanded the light to shine out of darkness..." },
      ],
      commentary: [{ source: "Chikuni Study Notes", body: "Creation by speech. The pattern 'God said... and it was so' frames the whole chapter and anticipates the Word of John 1." }],
    }),
    v(4, "And God saw the light, that it was good: and God divided the light from the darkness."),
    v(5, "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."),
    v(6, "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.", { heading: "The Second and Third Days" }),
    v(7, "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so."),
    v(8, "And God called the firmament Heaven. And the evening and the morning were the second day."),
    v(9, "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so."),
    v(10, "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good."),
    v(11, "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so."),
    v(12, "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good."),
    v(13, "And the evening and the morning were the third day."),
    v(14, "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:", { heading: "Lights in the Heavens", refs: [
      { label: "1 Enoch 2:1", book: "1-enoch", chapter: 2, verse: 1, text: "Observe how the luminaries do not change their orbits." },
    ] }),
    v(15, "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so."),
    v(16, "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also."),
    v(17, "And God set them in the firmament of the heaven to give light upon the earth,"),
    v(18, "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good."),
    v(19, "And the evening and the morning were the fourth day."),
    v(20, "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.", { heading: "Creatures of Sea, Sky and Land" }),
    v(21, "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good."),
    v(22, "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth."),
    v(23, "And the evening and the morning were the fifth day."),
    v(24, "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so."),
    v(25, "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good."),
    v(26, "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.", {
      heading: "The Creation of Mankind",
      refs: [
        { label: "Colossians 1:15", book: "colossians", chapter: 1, verse: 15, text: "Who is the image of the invisible God..." },
        { label: "Jubilees 2:14", book: "jubilees", chapter: 2, verse: 14, text: "And after all this He created man..." },
      ],
      commentary: [{ source: "Hebrew Exegesis", body: "'Let us' has been read as a plural of deliberation, the heavenly court, or an early hint of plurality within the one God.", lexical: [
        { word: "צֶלֶם", lang: "Hebrew", translit: "tselem", meaning: "image, representation" },
        { word: "דְּמוּת", lang: "Hebrew", translit: "demut", meaning: "likeness, resemblance" },
      ] }],
    }),
    v(27, "So God created man in his own image, in the image of God created he him; male and female created he them."),
    v(28, "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it."),
    v(29, "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat."),
    v(30, "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so."),
    v(31, "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."),
  ],
};

const JOHN_1: Chapter = {
  book: "john",
  chapter: 1,
  intro: "The prologue of John: the eternal Word becomes flesh, and the first disciples follow Jesus.",
  verses: [
    v(1, "In the beginning was the Word, and the Word was with God, and the Word was God.", {
      heading: "The Word Became Flesh",
      refs: [
        { label: "Genesis 1:1", book: "genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
        { label: "1 John 1:1", book: "1-john", chapter: 1, verse: 1, text: "That which was from the beginning..." },
        { label: "Revelation 19:13", book: "revelation", chapter: 19, verse: 13, text: "His name is called The Word of God." },
      ],
      commentary: [
        { source: "Greek Exegesis", body: "John echoes Genesis 1:1 deliberately. Theos without the article in the final clause describes the Word's nature: what God was, the Word was.", lexical: [
          { word: "Λόγος", lang: "Greek", translit: "Logos", meaning: "word, reason, divine self-expression" },
          { word: "πρὸς τὸν θεόν", lang: "Greek", translit: "pros ton theon", meaning: "with God; face-to-face toward God" },
        ] },
        { source: "Matthew Henry", body: "The evangelist begins with the eternity of Christ, His distinction from the Father, and His essential deity." },
      ],
    }),
    v(2, "The same was in the beginning with God."),
    v(3, "All things were made by him; and without him was not any thing made that was made.", { refs: [
      { label: "Genesis 1:3", book: "genesis", chapter: 1, verse: 3, text: "And God said, Let there be light." },
      { label: "Colossians 1:16", book: "colossians", chapter: 1, verse: 16, text: "For by him were all things created." },
    ] }),
    v(4, "In him was life; and the life was the light of men."),
    v(5, "And the light shineth in darkness; and the darkness comprehended it not.", { commentary: [
      { source: "Greek Exegesis", body: "Katelaben can mean 'understood' or 'overcame'. Both readings fit: darkness neither grasped nor defeated the light.", lexical: [
        { word: "κατέλαβεν", lang: "Greek", translit: "katelaben", meaning: "seized, overcame, comprehended" },
      ] },
    ] }),
    v(6, "There was a man sent from God, whose name was John.", { heading: "The Witness of John the Baptist" }),
    v(7, "The same came for a witness, to bear witness of the Light, that all men through him might believe."),
    v(8, "He was not that Light, but was sent to bear witness of that Light."),
    v(9, "That was the true Light, which lighteth every man that cometh into the world."),
    v(10, "He was in the world, and the world was made by him, and the world knew him not."),
    v(11, "He came unto his own, and his own received him not."),
    v(12, "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:"),
    v(13, "Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God."),
    v(14, "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.", {
      refs: [
        { label: "1 Enoch 1:4", book: "1-enoch", chapter: 1, verse: 4, text: "The eternal God will tread upon the earth..." },
        { label: "Philippians 2:7", book: "philippians", chapter: 2, verse: 7, text: "...was made in the likeness of men." },
      ],
      commentary: [{ source: "Greek Exegesis", body: "Eskēnōsen literally means 'pitched his tent', recalling the tabernacle where God's glory dwelt among Israel.", lexical: [
        { word: "ἐσκήνωσεν", lang: "Greek", translit: "eskēnōsen", meaning: "tabernacled, dwelt in a tent" },
        { word: "μονογενής", lang: "Greek", translit: "monogenēs", meaning: "only, unique, one of a kind" },
      ] }],
    }),
    v(15, "John bare witness of him, and cried, saying, This was he of whom I spake, He that cometh after me is preferred before me: for he was before me."),
    v(16, "And of his fulness have all we received, and grace for grace."),
    v(17, "For the law was given by Moses, but grace and truth came by Jesus Christ."),
    v(18, "No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him."),
    v(19, "And this is the record of John, when the Jews sent priests and Levites from Jerusalem to ask him, Who art thou?"),
    v(29, "The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.", { heading: "Behold, the Lamb of God", refs: [
      { label: "Isaiah 53:7", book: "isaiah", chapter: 53, verse: 7, text: "He is brought as a lamb to the slaughter." },
    ] }),
    v(35, "Again the next day after John stood, and two of his disciples;", { heading: "Jesus Calls the First Disciples" }),
    v(36, "And looking upon Jesus as he walked, he saith, Behold the Lamb of God!"),
    v(37, "And the two disciples heard him speak, and they followed Jesus."),
    v(38, ["Then Jesus turned, and saw them following, and saith unto them, ", { red: "What seek ye?" }, " They said unto him, Rabbi, (which is to say, being interpreted, Master,) where dwellest thou?"]),
    v(39, ["He saith unto them, ", { red: "Come and see." }, " They came and saw where he dwelt, and abode with him that day: for it was about the tenth hour."], {
      commentary: [{ source: "Chikuni Study Notes", body: "Jesus' first words in John are an invitation, not a command. Discipleship begins with coming and seeing." }],
    }),
    v(40, "One of the two which heard John speak, and followed him, was Andrew, Simon Peter's brother."),
    v(41, "He first findeth his own brother Simon, and saith unto him, We have found the Messias, which is, being interpreted, the Christ."),
    v(42, ["And he brought him to Jesus. And when Jesus beheld him, he said, ", { red: "Thou art Simon the son of Jona: thou shalt be called Cephas," }, " which is by interpretation, A stone."]),
    v(43, ["The day following Jesus would go forth into Galilee, and findeth Philip, and saith unto him, ", { red: "Follow me." }]),
    v(47, ["Jesus saw Nathanael coming to him, and saith of him, ", { red: "Behold an Israelite indeed, in whom is no guile!" }]),
    v(48, ["Nathanael saith unto him, Whence knowest thou me? Jesus answered and said unto him, ", { red: "Before that Philip called thee, when thou wast under the fig tree, I saw thee." }]),
    v(49, "Nathanael answered and saith unto him, Rabbi, thou art the Son of God; thou art the King of Israel."),
    v(50, ["Jesus answered and said unto him, ", { red: "Because I said unto thee, I saw thee under the fig tree, believest thou? thou shalt see greater things than these." }]),
    v(51, ["And he saith unto him, ", { red: "Verily, verily, I say unto you, Hereafter ye shall see heaven open, and the angels of God ascending and descending upon the Son of man." }], {
      refs: [
        { label: "Genesis 28:12", book: "genesis", chapter: 28, verse: 12, text: "...the angels of God ascending and descending on it." },
        { label: "Daniel 7:13", book: "daniel", chapter: 7, verse: 13, text: "...one like the Son of man came with the clouds of heaven." },
      ],
    }),
  ],
};

const ENOCH_1: Chapter = {
  book: "1-enoch",
  chapter: 1,
  intro: "The opening blessing of Enoch: a vision of the coming judgment and the Holy One's appearance upon Sinai. (R.H. Charles translation, adapted.)",
  verses: [
    v(1, "The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.", { heading: "The Parable of Enoch", commentary: [
      { source: "Ge'ez Notes", body: "1 Enoch (Mashafa Henok) is canonical in the Ethiopian Orthodox Tewahedo Church and survives complete only in Ge'ez.", lexical: [
        { word: "ሄኖክ", lang: "Ge'ez", translit: "Henok", meaning: "Enoch; 'dedicated'" },
      ] },
    ] }),
    v(2, "And he took up his parable and said: Enoch a righteous man, whose eyes were opened by God, saw the vision of the Holy One in the heavens, which the angels showed me, and from them I heard everything, and from them I understood as I saw, but not for this generation, but for a remote one which is for to come.", { refs: [
      { label: "Genesis 5:24", book: "genesis", chapter: 5, verse: 24, text: "And Enoch walked with God: and he was not; for God took him." },
    ] }),
    v(3, "Concerning the elect I said, and took up my parable concerning them: The Holy Great One will come forth from His dwelling,"),
    v(4, "And the eternal God will tread upon the earth, even on Mount Sinai, and appear from His camp, and appear in the strength of His might from the heaven of heavens.", { heading: "The Coming of the Holy One", refs: [
      { label: "Exodus 19:18", book: "exodus", chapter: 19, verse: 18, text: "And mount Sinai was altogether on a smoke." },
    ] }),
    v(5, "And all shall be smitten with fear, and the Watchers shall quake, and great fear and trembling shall seize them unto the ends of the earth."),
    v(6, "And the high mountains shall be shaken, and the high hills shall be made low, and shall melt like wax before the flame.", { refs: [
      { label: "Micah 1:4", book: "micah", chapter: 1, verse: 4, text: "The mountains shall be molten under him... as wax before the fire." },
    ] }),
    v(7, "And the earth shall be wholly rent in sunder, and all that is upon the earth shall perish, and there shall be a judgement upon all men."),
    v(8, "But with the righteous He will make peace, and will protect the elect, and mercy shall be upon them. And they shall all belong to God, and they shall be prospered, and they shall all be blessed. And He will help them all, and light shall appear unto them, and He will make peace with them."),
    v(9, "And behold! He cometh with ten thousands of His holy ones to execute judgement upon all, and to destroy all the ungodly: and to convict all flesh of all the works of their ungodliness which they have ungodly committed, and of all the hard things which ungodly sinners have spoken against Him.", {
      refs: [
        { label: "Jude 1:14-15", book: "jude", chapter: 1, verse: 14, text: "Enoch also, the seventh from Adam, prophesied of these, saying, Behold, the Lord cometh with ten thousands of his saints." },
        { label: "Deuteronomy 33:2", book: "deuteronomy", chapter: 33, verse: 2, text: "He came with ten thousands of saints." },
      ],
      commentary: [{ source: "Chikuni Study Notes", body: "This verse is quoted almost word-for-word in Jude 14-15, showing that 1 Enoch was known and valued in the apostolic church." }],
    }),
  ],
};

export const CHAPTERS: Chapter[] = [GENESIS_1, JOHN_1, ENOCH_1];
export const getChapter = (book: string, chapter: number) =>
  CHAPTERS.find((c) => c.book === book && c.chapter === chapter);

export const segmentsToText = (s: Segment[]) => s.map((x) => (typeof x === "string" ? x : x.red)).join("");
