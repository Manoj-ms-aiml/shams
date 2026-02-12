interface Subtitle {
  time: number;
  text: string;
}

interface SeasonData {
  title: string;
  subtitles: Subtitle[];
}

export const seasonData: Record<number, SeasonData> = {
  1: {
    title: "THE FOUNDATION",
    subtitles: [
      { time: 0.0, text: "Chapter One." },
      { time: 2.0, text: "The person everyone knows." },
      { time: 4.5, text: "Shams walks into a room and things shift." },
      { time: 7.5, text: "Not loudly. Not forcefully." },
      { time: 10.0, text: "But undeniably." },
      { time: 12.5, text: "There's a warmth that follows." },
      { time: 15.0, text: "A presence that makes people feel seen." },
      { time: 18.0, text: "Valued." },
      { time: 20.0, text: "Like they matter." },
      { time: 22.5, text: "Because to Shams, they do." },
      { time: 25.0, text: "Every conversation carries weight." },
      { time: 28.0, text: "Every moment of attention feels genuine." },
      { time: 31.0, text: "Because it is." },
      { time: 33.5, text: "This is the foundation." },
      { time: 36.0, text: "Built on authenticity." },
      { time: 38.5, text: "Compassion." },
      { time: 40.5, text: "And an unwavering belief in others." },
    ],
  },
  2: {
    title: "THE JOURNEY",
    subtitles: [
      { time: 0.0, text: "Chapter Two." },
      { time: 2.0, text: "Growth through challenges." },
      { time: 5.0, text: "The path hasn't always been easy." },
      { time: 8.0, text: "There have been moments of doubt." },
      { time: 11.0, text: "Times when the weight felt too heavy." },
      { time: 14.5, text: "But Shams kept moving forward." },
      { time: 17.5, text: "Not because it was easy." },
      { time: 20.0, text: "But because it mattered." },
      { time: 23.0, text: "Every challenge became a lesson." },
      { time: 26.0, text: "Every setback, a setup for growth." },
      { time: 29.5, text: "The journey shaped character." },
      { time: 32.5, text: "Built resilience." },
      { time: 35.0, text: "And revealed strength that was always there." },
      { time: 38.5, text: "Waiting to be discovered." },
    ],
  },
  3: {
    title: "THE IMPACT",
    subtitles: [
      { time: 0.0, text: "Chapter Three." },
      { time: 2.0, text: "Touching lives along the way." },
      { time: 5.5, text: "The ripples are everywhere." },
      { time: 8.0, text: "In the friend who felt heard." },
      { time: 11.0, text: "The stranger who received a smile." },
      { time: 14.0, text: "The colleague who found encouragement." },
      { time: 17.5, text: "Shams doesn't keep score." },
      { time: 20.5, text: "Doesn't track the good done." },
      { time: 23.5, text: "But others remember." },
      { time: 26.0, text: "They remember the moment someone cared." },
      { time: 29.5, text: "When it felt like no one else did." },
      { time: 32.5, text: "The impact is real." },
      { time: 35.0, text: "Lasting." },
      { time: 37.0, text: "And more profound than words can capture." },
    ],
  },
  4: {
    title: "THE TRUTH",
    subtitles: [
      { time: 0.0, text: "Chapter Four." },
      { time: 2.5, text: "What matters most." },
      { time: 5.5, text: "In a world that often feels disconnected..." },
      { time: 9.0, text: "Shams is a reminder." },
      { time: 11.5, text: "Of what it means to truly care." },
      { time: 14.5, text: "To show up." },
      { time: 16.5, text: "To be present." },
      { time: 19.0, text: "To make someone feel like they're not invisible." },
      { time: 23.0, text: "The world needs more of this." },
      { time: 26.0, text: "More kindness." },
      { time: 28.5, text: "More thoughtfulness." },
      { time: 31.0, text: "More Shams." },
      { time: 33.5, text: "And here's the truth..." },
      { time: 36.5, text: "The light Shams brings to others..." },
      { time: 40.0, text: "Is the same light that lives within." },
      { time: 43.5, text: "Always has." },
      { time: 46.0, text: "Always will." },
    ],
  },
};
