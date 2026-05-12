import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const usePinnedScrollProgress = ({
  sectionRef,
  pinRef,
  frames,
  onUpdate,
  scrub = 1,
}) => {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;

      if (!section || !pin) return undefined;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * Math.max(frames, 1)}`,
        pin,
        scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          onUpdateRef.current?.(progress);
        },
      });

      onUpdateRef.current?.(0);

      return () => {
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [frames, scrub] }
  );
};

export default usePinnedScrollProgress;
