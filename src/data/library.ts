export type MediaBook = { title: string; year: string; pages: string[] };
export type MediaAudio = { title: string; duration: string; src: string };
export type MediaVideo = { title: string; query: string };
export type Minister = {
  id: string;
  name: string;
  years: string;
  origin: string;
  tagline: string;
  bio: string;
  books: MediaBook[];
  audio: MediaAudio[];
  video: MediaVideo[];
};

// Sample audio tracks are royalty-free placeholders until real sermon files are added.
const sample = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const MINISTERS: Minister[] = [
  {
    id: "benson-idahosa",
    name: "Benson Idahosa",
    years: "1938 – 1998",
    origin: "Benin City, Nigeria",
    tagline: "Father of Pentecostalism in Nigeria",
    bio: "Archbishop Benson Andrew Idahosa founded Church of God Mission International and Benson Idahosa University, and trained a generation of African preachers in faith and evangelism.",
    books: [
      { title: "Fire in His Bones", year: "1980s", pages: ["Faith is not a feeling; it is a fixed decision to believe what God has said.", "When God calls a man, He does not wait for his qualifications. He qualifies the called.", "Africa will be saved by Africans who burn with the fire of the Holy Ghost."] },
      { title: "I Choose to Change", year: "1987", pages: ["Change begins in the mind before it is seen in the life.", "You cannot remain the same and expect a different harvest."] },
    ],
    audio: [
      { title: "Faith That Moves Mountains", duration: "6:12", src: sample(1) },
      { title: "The Power of the Holy Ghost", duration: "7:05", src: sample(2) },
    ],
    video: [{ title: "Benson Idahosa – Crusade Footage", query: "Benson Idahosa sermon" }],
  },
  {
    id: "benny-hinn",
    name: "Benny Hinn",
    years: "b. 1952",
    origin: "Jaffa, Israel",
    tagline: "Healing evangelist and teacher",
    bio: "Toufik Benedictus Hinn is known for large-scale miracle crusades and his teaching on the person of the Holy Spirit.",
    books: [
      { title: "Good Morning, Holy Spirit", year: "1990", pages: ["The Holy Spirit is not an influence; He is a Person who longs for fellowship.", "Every morning I learned to say: Good morning, Holy Spirit."] },
    ],
    audio: [{ title: "Knowing the Holy Spirit", duration: "5:44", src: sample(3) }],
    video: [{ title: "Benny Hinn – Miracle Crusade", query: "Benny Hinn crusade" }],
  },
  {
    id: "tl-osborn",
    name: "T.L. Osborn",
    years: "1923 – 2013",
    origin: "Oklahoma, USA",
    tagline: "Pioneer of mass open-air evangelism",
    bio: "Tommy Lee Osborn and his wife Daisy ministered in over 90 nations, preaching to vast crowds and publishing gospel literature in hundreds of languages.",
    books: [
      { title: "Healing the Sick", year: "1951", pages: ["Christ's redemption covers the whole man: spirit, soul and body.", "Healing is the children's bread, and it is time the children were fed."] },
      { title: "Soulwinning", year: "1963", pages: ["The greatest thing you can do with your life is bring someone else to Christ."] },
    ],
    audio: [{ title: "The Message That Works", duration: "8:30", src: sample(4) }],
    video: [{ title: "T.L. Osborn – Documentary", query: "TL Osborn documentary" }],
  },
  {
    id: "oral-roberts",
    name: "Oral Roberts",
    years: "1918 – 2009",
    origin: "Oklahoma, USA",
    tagline: "Healing ministry and seed-faith teacher",
    bio: "Granville Oral Roberts led tent healing campaigns, pioneered religious television and founded Oral Roberts University.",
    books: [
      { title: "Miracle of Seed-Faith", year: "1970", pages: ["Make God your source. Give as a seed sown. Expect a miracle.", "Something good is going to happen to you."] },
    ],
    audio: [{ title: "Expect a Miracle", duration: "6:50", src: sample(5) }],
    video: [{ title: "Oral Roberts – Tent Crusades", query: "Oral Roberts sermon" }],
  },
];

export const getMinister = (id: string) => MINISTERS.find((m) => m.id === id);
