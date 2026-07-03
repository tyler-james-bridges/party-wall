export type PartyConfig = {
  /** Name of the guest of honor, e.g. "Nora" */
  honoree: string;
  /** Age being celebrated, e.g. 3 */
  age: number;
  /** Title shown on the wall and upload pages */
  eventTitle: string;
  /** Subtitle shown under the title */
  eventSubtitle: string;
  /** Title of the auto-generated memory timeline */
  timelineTitle: string;
  /** Theme colors (any CSS color) */
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  /** Seconds each photo stays on screen in the slideshow */
  slideDurationSeconds: number;
  /** How often (seconds) the wall checks for new photos */
  pollIntervalSeconds: number;
};

const config: PartyConfig = {
  honoree: "Birthday Girl",
  age: 3,
  eventTitle: "Happy 3rd Birthday!",
  eventSubtitle: "Snap a photo and it shows up on the big screen",
  timelineTitle: "Her Year in Three",
  theme: {
    primary: "#f472b6",
    secondary: "#fbbf24",
    background: "#1e1b4b",
    text: "#ffffff",
  },
  slideDurationSeconds: 8,
  pollIntervalSeconds: 5,
};

export default config;
