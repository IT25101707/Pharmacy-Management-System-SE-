import React, { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------
   Real-time layer (no backend change needed)
   - useLive(fn)      : runs fn now, then every few seconds while the tab is
                        visible, and again when: the tab regains focus, the
                        network comes back, or ANY data is saved (this tab or
                        another open tab).
   - announceChange() : called after every successful POST/PUT/DELETE.
   - <LiveStatus/>    : header badge  "Live · synced 4s ago" / "Offline".
   --------------------------------------------------------------- */

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("pms-live") : null;
if (channel) channel.onmessage = () => window.dispatchEvent(new Event("pms:changed"));

export const net = { ok: true, last: Date.now(), listeners: new Set() };

export function reportNet(ok) {
  net.ok = ok;
  if (ok) net.last = Date.now();
  net.listeners.forEach((f) => f());
}

export function announceChange() {
  window.dispatchEvent(new Event("pms:changed"));
  channel?.postMessage("changed");
}

export function useLive(fn, deps = [], every = 10000) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    let alive = true,
      busy = false,
      pending;
    const run = async () => {
      if (!alive || busy) return;
      busy = true;
      try {
        await ref.current();
      } catch {
        /* api() already reports the connection state */
      } finally {
        busy = false;
      }
    };
    const tick = () => {
      if (!document.hidden && navigator.onLine) run();
    };
    const soon = () => {
      clearTimeout(pending);
      pending = setTimeout(tick, 350);
    };
    run();
    const timer = setInterval(tick, every);
    window.addEventListener("pms:changed", soon);
    window.addEventListener("focus", soon);
    window.addEventListener("online", soon);
    document.addEventListener("visibilitychange", soon);
    return () => {
      alive = false;
      clearInterval(timer);
      clearTimeout(pending);
      window.removeEventListener("pms:changed", soon);
      window.removeEventListener("focus", soon);
      window.removeEventListener("online", soon);
      document.removeEventListener("visibilitychange", soon);
    };
  }, deps);
}

function ago(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export function LiveStatus() {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((x) => x + 1);
    net.listeners.add(f);
    const t = setInterval(f, 1000);
    window.addEventListener("online", f);
    window.addEventListener("offline", f);
    return () => {
      net.listeners.delete(f);
      clearInterval(t);
      window.removeEventListener("online", f);
      window.removeEventListener("offline", f);
    };
  }, []);
  const off = !net.ok || !navigator.onLine;
  return (
    <span
      className={`live-status ${off ? "off" : "on"}`}
      title={off ? "Cannot reach the server. Retrying automatically." : "Data refreshes automatically"}
    >
      <i />
      {off ? "Offline · retrying" : `Live · synced ${ago(Date.now() - net.last)}`}
    </span>
  );
}
