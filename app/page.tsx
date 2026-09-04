"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const photos = [
  { src: "/images/photo-01.jpg", alt: "Our first stop", caption: "The beginning of a very good day" },
  { src: "/images/photo-02.jpg", alt: "A moment from our walk", caption: "You, right there in front of me" },
  { src: "/images/photo-03.jpg", alt: "Flowers from our first date", caption: "A little something, chosen just for you" },
  { src: "/images/photo-04.jpg", alt: "A candid smile", caption: "My favorite view of the day" },
  { src: "/images/photo-05.jpg", alt: "The end of the evening", caption: "Already looking forward to next time" },
];

const chapters = [
  {
    number: "01",
    eyebrow: "the first stop",
    title: "We started here",
    copy: "Pizza 4P's — where the first hello turned into conversations I wished could keep unfolding.",
    detail: "Rain softly falling, flowers for you in my hands, and the feeling that this day was already becoming something special.",
  },
  {
    number: "02",
    eyebrow: "the wandering",
    title: "A smile worth keeping",
    copy: "One of those smiles that says more than words ever could.",
    detail: "The kind of smile that happens when you realize how grateful you are to be exactly where you are.",
  },
  {
    number: "03",
    eyebrow: "something sweet",
    title: "We shared bingsu",
    copy: "A bowl of bingsu between us — cool, sweet, and somehow even better because we got to share it together.",
    detail: "One more little reason I did not want the day to end.",
  },
];

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <span aria-hidden="true" className={`arrow arrow--${direction}`}>→</span>;
}

function PhotoFrame({
  src,
  alt,
  placeholder,
  className = "",
  sizes = "(max-width: 600px) 50vw, 30vw",
  priority = false,
}: {
  src: string;
  alt: string;
  placeholder: React.ReactNode;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // An image may be pulled from the browser cache before React attaches onLoad.
  // Checking `complete` after hydration makes the fade-in reliable in both cases.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={`photo-slot ${className}${loaded ? " has-image" : ""}`}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      <span className="photo-placeholder">{placeholder}</span>
    </div>
  );
}

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [openNote, setOpenNote] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleSong = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
        setOpenNote(false);
      }
      if (selectedPhoto !== null && event.key === "ArrowRight") setSelectedPhoto((selectedPhoto + 1) % photos.length);
      if (selectedPhoto !== null && event.key === "ArrowLeft") setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto]);

  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <a href="#top" className="monogram" aria-label="Back to the beginning">K <i>+</i> N</a>
        <div className="nav-links">
          <a href="#our-day">our day</a>
          <a href="#little-things">little things</a>
          <a href="#note">a note</a>
        </div>
        <button className="sound-toggle" type="button" onClick={toggleSong} aria-pressed={isPlaying}>
          <span className="sound-dot" /> {isPlaying ? "pause the moment" : "play our song"}
        </button>
      </nav>
      <audio ref={audioRef} src="/audio/our-song.mp3" preload="metadata" onEnded={() => setIsPlaying(false)} />

      <section className="hero" id="top">
        <div className="hero__scribble scribble">a little remembrance</div>
        <div className="hero__left reveal">
          <p className="kicker">OUR FIRST DATE &nbsp;·&nbsp; August 30, 2026</p>
          <h1>One lovely<br /><em>day,</em> with you.</h1>
          <p className="hero__intro">A collection of the places, flavors, and small moments I&apos;d like to hold on to.</p>
          <a className="round-link" href="#our-day"><span>come<br />along</span><Arrow /></a>
        </div>
        <div className="hero__photo-wrap reveal">
          <PhotoFrame className="hero__photo photo-slot--hero" src="/images/hero.jpg" alt="A favorite photograph from our first date" placeholder={<>add<br />hero.jpg</>} sizes="(max-width: 600px) 213px, (max-width: 880px) 290px, 438px" priority />
          <div className="photo-note">you made an ordinary day<br />feel like something to keep.</div>
          <span className="tape tape--one" />
          <span className="pressed-flower" aria-hidden="true">✳</span>
        </div>
        <div className="hero__date"><span>the</span><strong>first</strong><span>of many?</span></div>
        <div className="hero__line" />
      </section>

      <section className="opening reveal" aria-label="A short introduction">
        <span className="opening__mark">“</span>
        <p>I didn&apos;t know a few hours could leave behind<br />so many <em>beautiful</em> little things.</p>
        <span className="opening__mark opening__mark--end">”</span>
      </section>

      <section className="story" id="our-day">
        <div className="section-heading reveal">
          <p className="kicker">A VERY GOOD SUNDAY</p>
          <h2>How the day<br /><em>unfolded.</em></h2>
          <p>A day full of moments I&apos;ll be happy to remember.</p>
        </div>
        <div className="chapter-list">
          {chapters.map((chapter, index) => (
            <article className={`chapter chapter--${index + 1} reveal`} key={chapter.number}>
              <div className="chapter__number">{chapter.number}</div>
              <div className="chapter__body">
                <p className="kicker">{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p className="chapter__copy">{chapter.copy}</p>
                <p className="chapter__detail">{chapter.detail}</p>
              </div>
              <PhotoFrame className="chapter__visual" src={`/images/chapter-0${index + 1}.jpg`} alt={chapter.title} placeholder={<>add<br />chapter-0{index + 1}.jpg</>} sizes="(max-width: 600px) 172px, (max-width: 880px) 184px, 215px" />
              {index === 1 && <span className="chapter__doodle">♡</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="taste" id="little-things">
        <div className="taste__title reveal">
          <p className="kicker">WHAT WE SHARED</p>
          <h2>A very <em>delicious</em><br />day together.</h2>
        </div>
        <div className="menu-card reveal">
          <span className="menu-card__corner menu-card__corner--tl" />
          <span className="menu-card__corner menu-card__corner--br" />
          <p className="menu-card__place">PIZZA 4P&apos;S &amp; QUICHES</p>
          <p className="menu-card__date">TABLE FOR TWO &nbsp;·&nbsp; August 30, 2026</p>
          <div className="menu-items">
            <div><span>Pizza 4P&apos;s</span><i>—</i><span>the first delicious stop</span></div>
            <div><span>Bingsu at Quiches</span><i>—</i><span>cool, sweet, &amp; shared</span></div>
            <div><span>Good conversation</span><i>—</i><span>my favorite course</span></div>
            <div><span>Time together</span><i>—</i><span>never quite enough</span></div>
          </div>
          <p className="menu-card__foot">best served with you across the table</p>
        </div>
        <div className="taste__photo-wrap reveal">
          <PhotoFrame className="taste__photo" src="/images/food-feature.jpg" alt="Pizza 4P's and bingsu at Quiches from our date" placeholder={<>add<br />food-feature.jpg</>} sizes="250px" />
          <span className="tape tape--two" />
        </div>
      </section>

      <section className="messages" aria-label="A few words from me to you">
        <div className="messages__heading reveal">
          <p className="kicker">A FEW WORDS FOR YOU</p>
          <h2>Thank you,<br /><em>truly.</em></h2>
          <p>For being you, and for letting me share this day with you.</p>
        </div>
        <div className="messages__thread">
          <article className="message-card message-card--one reveal">
            <span className="message-card__from">A SMALL THANK YOU</span>
            <p>“Thank you for your warmth, your kindness, and every easy laugh we shared.”</p>
            <span className="message-card__heart">♡</span>
          </article>
          <article className="message-card message-card--two reveal">
            <span className="message-card__from">WHAT I ADMIRE</span>
            <p>“I admire and respect the person you are, and the way you make the world feel a little softer.”</p>
          </article>
          <article className="message-card message-card--three reveal">
            <span className="message-card__from">FROM ME TO YOU</span>
            <p>“I&apos;m grateful for our time together, and for the chance to keep getting to know you.”</p>
          </article>
        </div>
      </section>

      <section className="gallery" aria-label="Date photo gallery">
        <div className="gallery__intro reveal">
          <p className="kicker">THE LITTLE THINGS</p>
          <h2>Proof that<br />it <em>really</em> happened.</h2>
          <p>Tap a photo to make it bigger.</p>
        </div>
        <div className="gallery__grid">
          {photos.map((photo, index) => (
            <button className={`polaroid polaroid--${index + 1} reveal`} type="button" key={photo.src} onClick={() => setSelectedPhoto(index)} aria-label={`Open photo: ${photo.caption}`}>
              <PhotoFrame className="polaroid__image" src={photo.src} alt={photo.alt} placeholder={<>add<br />{photo.src.split("/").pop()}</>} sizes="(max-width: 600px) 50vw, 32vw" />
              <span className="polaroid__caption">{photo.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="letter" id="note">
        <div className="letter__stamp reveal">K + N<br /><span>first edition</span></div>
        <div className="letter__page reveal">
          <p className="kicker">A NOTE FOR YOU</p>
          <h2>Dear <em>Ngan,</em></h2>
          <p>I&apos;ve replayed this day in my head more than once — not because it was extravagant, but because it was <em>you.</em></p>
          <p>Thank you for showing up exactly as you are, for the easy laughs and the moments in between. Being with you made the whole world feel softer around the edges.</p>
          <p>I&apos;m really grateful that I get to know you. Here&apos;s to the next walk, the next shared dessert, and all the ordinary days we might make beautiful together.</p>
          <p className="letter__signoff">With a very happy heart,<br /><span>Khoi</span></p>
          <button className="letter__button" type="button" onClick={() => setOpenNote(true)}>one more thing <Arrow /></button>
        </div>
        <span className="letter__heart" aria-hidden="true">♥</span>
      </section>

      <footer>
        <p>made with a little bit of courage</p>
        <a href="#top">back to the beginning ↑</a>
      </footer>

      {selectedPhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setSelectedPhoto(null)}>
          <button className="lightbox__close" type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close photo viewer">×</button>
          <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length); }} aria-label="Previous photo">←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <div className="lightbox__image">
              <Image src={photos[selectedPhoto].src} alt={photos[selectedPhoto].alt} fill sizes="(max-width: 600px) 85vw, 690px" />
            </div>
            <figcaption>{photos[selectedPhoto].caption}</figcaption>
          </figure>
          <button className="lightbox__nav lightbox__nav--next" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % photos.length); }} aria-label="Next photo">→</button>
        </div>
      )}

      {openNote && (
        <div className="secret-note" role="dialog" aria-modal="true" aria-label="A final message" onClick={() => setOpenNote(false)}>
          <div className="secret-note__card" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setOpenNote(false)} aria-label="Close note">×</button>
            <span>for you, always</span>
            <p>Thank you for a first date that felt like the beginning of a favorite story.</p>
            <i>♡</i>
          </div>
        </div>
      )}
    </main>
  );
}
