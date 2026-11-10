"use client";

import { useRef, useState } from "react";

export function MarsTitle() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";

  function showGame() {
    setOpen(true);
    dialog.current?.showModal();
  }

  return (
    <>
      <h1 id="mars-heading">
        <span>LAST SHIFT</span>
        <span className="mars-heading__second"><em>:</em> <button className="mars-game-trigger" type="button" onClick={showGame} aria-label="MARS — open Freedoom">MARS</button></span>
      </h1>
      <dialog ref={dialog} className="freedoom-dialog" aria-labelledby="freedoom-title" onClose={() => setOpen(false)}>
        <div className="freedoom-dialog__header">
          <div><h2 id="freedoom-title">FREEDOOM</h2><p>A little trip to another Mars.</p></div>
          <button type="button" className="freedoom-dialog__close" onClick={() => dialog.current?.close()} aria-label="Close game">×</button>
        </div>
        {open && <iframe className="freedoom-dialog__game" src={`${base}/freedoom/index.html`} title="Play Freedoom" allow="fullscreen; autoplay" />}
        <div className="freedoom-dialog__footer">
          <p>Keyboard: arrows to move, Ctrl to fire, Space to use, Esc for menu.</p>
          <p>Freedoom by its contributors · Chocolate Doom engine · <a href={`${base}/freedoom/FREEDOOM-COPYING.txt`} target="_blank" rel="noreferrer">Game license</a> · <a href={`${base}/freedoom/FREEDOOM-CREDITS.txt`} target="_blank" rel="noreferrer">Credits</a> · <a href={`${base}/freedoom/COPYING`} target="_blank" rel="noreferrer">Engine license</a> · <a href="https://github.com/Saketh-Chandra/doom-wasm-pwa/tree/a77edfd8bbc7" target="_blank" rel="noreferrer">Engine source</a></p>
        </div>
      </dialog>
    </>
  );
}
