/**
 * Simple & Elegant Birthday Experience for Jermeena Umi
 * Vanilla ES6 JavaScript (Automatic Candle Blowout)
 */

document.addEventListener("DOMContentLoaded", () => {
  let candleCount = 0;
  const MAX_CANDLES = 20; // Set to 20 for her 20th birthday
  let isBlownOut = false;

  const defaultLetter = `Happy 20th Birthday, bes!


Grateful ako to have you in my life. Thank you for being such an amazing friend and for all the memories we've shared. Sobrang blessed ako na naging part ka ng buhay ko.

Welcome to your twenties! Wishing you nothing but happiness, good health, peace, and God's continuous guidance in every step you take. I pray that this new chapter of your life brings you closer to your dreams and fills your heart with joy.

I'm so proud of the person you're becoming, and I can't wait to see all the amazing things you'll achieve. Continue to be kind and stay true to yourself.

Palagi mong tandaan na kahit anong mangyari, nandito lang ako. I'll always be here to support you, celebrate your wins, at samahan ka sa mga highs and lows ng buhay.

May God continue to bless you abundantly, grant the desires of your heart according to His perfect will, and surround you with His love and grace every single day.

Enjoy your special day! You deserve all the love, laughter, and happiness today.

Happy 20th Birthday once again, Umi. God bless you always!`;

  // Pre-load audio elements
  const hbdAudio = document.getElementById("sfx-hbd");
  if (hbdAudio) {
    hbdAudio.load();
  }

  // --- AUDIO SYNTHESIS FALLBACKS ---
  const playSynthesizedSFX = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "sparkle") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          1800,
          ctx.currentTime + 0.25,
        );
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "blow") {
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 350;
        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        whiteNoise.start();
      }
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  };

  const playAudio = (id, synthType) => {
    const audioEl = document.getElementById(id);
    if (audioEl) {
      audioEl.currentTime = 0;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(
            `HTML Audio play failed for ${id}, using synth fallback:`,
            err,
          );
          playSynthesizedSFX(synthType);
        });
      }
    } else {
      playSynthesizedSFX(synthType);
    }
  };

  // --- BACKGROUND PARTICLE CANVAS ---
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * -0.4 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = ["#d8b4fe", "#c084fc", "#ffffff"][
        Math.floor(Math.random() * 3)
      ];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < 0 || this.x < 0 || this.x > canvas.width) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 50; i++) particles.push(new Particle());

  const animateCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  };
  animateCanvas();

  // --- INTRO SEQUENCE ---
  const introSequence = async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(500);
    document.getElementById("intro-text-1").classList.add("visible");
    playAudio("sfx-sparkle", "sparkle");
    await delay(1800);
    document.getElementById("intro-text-2").classList.add("visible");
    playAudio("sfx-sparkle", "sparkle");
    await delay(1800);
    document.getElementById("intro-text-3").classList.add("visible");
    await delay(1200);
    document.getElementById("intro-text-4").classList.add("visible");
    playAudio("sfx-sparkle", "sparkle");
    await delay(1000);
    document.getElementById("btn-start").classList.remove("hidden");
  };
  introSequence();

  document.getElementById("btn-start").addEventListener("click", () => {
    playAudio("sfx-click", "click");
    const intro = document.getElementById("intro-screen");
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.classList.add("hidden");
      document.getElementById("main-scene").classList.remove("hidden");
    }, 1500);
  });

  // --- INTERACTION 1: CANDLE ADDITION & AUTOMATIC BLOWOUT ---
  const cake = document.getElementById("cake");
  const candleContainer = document.getElementById("candle-container");
  const instructionText = document.getElementById("instruction-text");

  cake.addEventListener("click", (e) => {
    if (candleCount >= MAX_CANDLES || isBlownOut) return;

    candleCount++;
    playAudio("sfx-click", "click");
    spawnPopParticles(e.clientX, e.clientY, 4);

    const candle = document.createElement("div");
    candle.className = "candle";
    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);
    candleContainer.appendChild(candle);

    instructionText.textContent = `Click the cake to add candles (${candleCount} / ${MAX_CANDLES})`;

    // Pag umabot na sa 20 candles, kusa/automatic nang mamamatay ang kandila!
    if (candleCount === MAX_CANDLES) {
      instructionText.textContent = "Make a wish...";
      playAudio("sfx-sparkle", "sparkle");

      // Automatic blowout pagkatapos ng 1 segundo
      setTimeout(() => {
        extinguishCandles();
      }, 1000);
    }
  });

  const extinguishCandles = () => {
    if (isBlownOut) return;
    isBlownOut = true;

    playAudio("sfx-blow", "blow");

    document.querySelectorAll(".flame").forEach((f) => {
      f.classList.add("extinguished");
      const smoke = document.createElement("div");
      smoke.className = "smoke";
      f.parentElement.appendChild(smoke);
    });

    instructionText.textContent = "Your wish has been made ✨";

    if (window.confetti) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#9b51e0", "#d8b4fe", "#ffffff"],
      });
    }

    // Pagka-extinguish, automatic nang mag-pe-play ang HBD sound!
    setTimeout(() => {
      playAudio("sfx-hbd", "sparkle");
      document.getElementById("btn-next-letter").classList.remove("hidden");
    }, 1200);
  };

  // --- INTERACTION 2: LETTER WITH TYPEWRITER EFFECT ---
  document
    .getElementById("btn-next-letter")
    .addEventListener("click", async () => {
      playAudio("sfx-click", "click");
      document.getElementById("main-scene").classList.add("hidden");
      document.getElementById("letter-scene").classList.remove("hidden");

      let textToDisplay = defaultLetter;

      try {
        const res = await fetch("letter.txt");
        if (res.ok) textToDisplay = await res.text();
      } catch (e) {}

      const container = document.getElementById("typewriter-text");
      container.textContent = "";
      let idx = 0;

      const typeChar = () => {
        if (idx < textToDisplay.length) {
          container.textContent += textToDisplay.charAt(idx);
          idx++;
          setTimeout(typeChar, 35);
        } else {
          document.getElementById("btn-finish").classList.remove("hidden");
        }
      };
      typeChar();
    });

  // --- ENDING SCENE ---
  document.getElementById("btn-finish").addEventListener("click", () => {
    playAudio("sfx-click", "click");
    document.getElementById("letter-scene").classList.add("hidden");
    const finale = document.getElementById("finale-scene");
    finale.classList.remove("hidden");
    setTimeout(() => {
      finale.style.opacity = "1";
    }, 50);

    if (window.confetti) {
      setInterval(() => {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
        });
      }, 2500);
    }
  });

  // --- MINIMAL CURSOR EFFECT ---
  window.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.08) {
      spawnPopParticles(e.clientX, e.clientY, 1);
    }
  });

  function spawnPopParticles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "particle-pop";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const dx = (Math.random() - 0.5) * 80 + "px";
      const dy = (Math.random() - 0.5) * 80 + "px";
      el.style.setProperty("--dx", dx);
      el.style.setProperty("--dy", dy);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    }
  }
});
