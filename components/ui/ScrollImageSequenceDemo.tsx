import ScrollImageSequence from "./ScrollImageSequence";

// Replace these with your actual mouse frame images in /public/frames/
// e.g. /public/frames/mouse-001.jpg, mouse-002.jpg ... mouse-030.jpg
const MOUSE_FRAMES = Array.from(
  { length: 30 },
  (_, i) => `/frames/mouse-${String(i + 1).padStart(3, "0")}.jpg`
);

export default function ScrollImageSequenceDemo() {
  return (
    <ScrollImageSequence
      frames={MOUSE_FRAMES}
      scrollHeightVh={300}
      alt="TEAM FURY Valorant Mouse"
      heading="Scroll to Explore"
      subtext="Every detail, revealed as you scroll"
    />
  );
}
