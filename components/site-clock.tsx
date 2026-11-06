"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * The time in Amsterdam beside the name. The server
 * can't know the visitor's minute, so it renders an empty slot and the time fades in once the
 * page runs; the colon blinks once a second.
 */
export function SiteClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [hours, minutes] = now ? format.format(now).split(":") : ["00", "00"];

  return (
    <span className="site-clock" data-ready={now ? "" : undefined} aria-hidden={now ? undefined : true}>
      <span className="sr-only">Local time in Amsterdam: </span>
      {hours}
      <span className="site-clock__colon" aria-hidden="true">:</span>
      {minutes} Amsterdam
    </span>
  );
}
