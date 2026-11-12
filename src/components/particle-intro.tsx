import type { CSSProperties } from "react";

function ScatterText({ text, offset = 0 }: { text: string; offset?: number }) {
  return <>{Array.from(text, (character, index) => {
    const n = index + offset;
    const style = {
      "--x": `${((n * 73) % 161) - 80}px`,
      "--y": `${((n * 47) % 121) - 60}px`,
      "--delay": `${((n * 37) % 420) + 160}ms`,
    } as CSSProperties;
    return <span className="particle-intro__letter" style={style} key={index}>{character === " " ? "\u00a0" : character}</span>;
  })}</>;
}

export function ParticleText({ text, highlightGermany = false }: { text: string; highlightGermany?: boolean }) {
  return (
    <span className="particle-text" aria-label={text}>
      <span aria-hidden="true">{text.split(" ").map((word, index, words) => (
        <span key={index}>
          <span className="particle-text__word" style={{ "--word-delay": `${Math.min(index * 35, 420)}ms` } as CSSProperties}>{highlightGermany && word === "Germany." ? <><span className="germany-flag">Germany</span>.</> : word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}</span>
    </span>
  );
}

export function ParticleIntro() {
  return (
    <div className="intro-hero__copy particle-intro">
      <div className="particle-intro__cloud" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => {
          const style = {
            "--px": `${(i * 73 + 13) % 100}%`,
            "--py": `${(i * 47 + 11) % 100}%`,
            "--dx": `${((i * 31) % 101) - 50}px`,
            "--dy": `${((i * 59) % 101) - 50}px`,
            "--delay": `${(i * 29) % 450}ms`,
          } as CSSProperties;
          return <i key={i} style={style} />;
        })}
      </div>
      <h1 id="intro-title" aria-label="Ivan Ozerov.">
        <span aria-hidden="true"><ScatterText text="Ivan" /><br /><ScatterText text="Ozerov" offset={4} /><span className="intro-hero__period particle-intro__letter" style={{ "--x": "32px", "--y": "-25px", "--delay": "400ms" } as CSSProperties}>.</span></span>
      </h1>
      <p className="intro-hero__desc">
        Independent developer.<br />Mobile apps & websites.
      </p>
    </div>
  );
}
