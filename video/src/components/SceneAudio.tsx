import React from "react";
import { Audio, staticFile } from "remotion";

type Props = {
  name: string;
  volume?: number;
};

/** Scene-local narration track. Plays from frame 0 of the enclosing sequence. */
export const SceneAudio: React.FC<Props> = ({ name, volume = 1 }) => {
  return <Audio src={staticFile(`audio/${name}.mp3`)} volume={volume} />;
};
