import { Closing } from "@/components/scenes/Closing";
import { Genesis } from "@/components/scenes/Genesis";
import { Intersection } from "@/components/scenes/Intersection";
import { Memory } from "@/components/scenes/Memory";
import { Modes } from "@/components/scenes/Modes";
import { Pricing } from "@/components/scenes/Pricing";
import { TheName } from "@/components/scenes/TheName";
import { Voice } from "@/components/scenes/Voice";

/**
 * El viaje continuo: 8 capítulos tejidos sobre UNA forma de luz persistente que
 * morfea con el scroll. Cada capítulo entra con un panel wipe (alma tiwis). No
 * son cajas: son estados del mismo organismo.
 */
export default function HomePage() {
  return (
    <>
      <Genesis />
      <TheName />
      <Intersection />
      <Modes />
      <Memory />
      <Voice />
      <Pricing />
      <Closing />
    </>
  );
}
