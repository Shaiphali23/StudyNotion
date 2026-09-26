import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      //Ignore clicks inside the element
      if (!ref.current || ref.current.contains(event.target)) return;

      //call handler if clicked outside
      handler(event);
    };

    //listen for mousedown and touchstart event
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    //cleanup on unmount or dependency change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Effect runs when ref or handler changes
}
