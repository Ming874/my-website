"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const highScoreRef = useRef<number>(0);
  const dinoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dinoHighScore");
    if (saved) {
      highScoreRef.current = parseInt(saved, 10);
    }
    
    // Load custom sprite sheet
    const img = new Image();
    img.src = "/custom-dino.png";
    img.onload = () => {
      dinoImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let isPlaying = false;
    let isGameOver = false;

    let score = 0;
    let gameSpeed = 0.8; 
    let frame = 0;
    let nextObstacleFrame = 0;

    const DINO_W = 30;
    const DINO_H = 40;
    const DINO_DUCK_H = 25;

    const dino = {
      x: 50,
      y: 0,
      vy: 0,
      jumpPower: -6.5,
      gravity: 0.15,
      isJumping: false,
      isDucking: false,
    };

    let obstacles: { 
      x: number; 
      y: number; 
      w: number; 
      h: number; 
      type: 'cactus' | 'bird'; 
      frameOffset: number;
    }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const isMobile = window.innerWidth < 640;
        const scaleFactor = isMobile ? 0.6 : 1; // 60% size on mobile allows seeing 1.6x further
        
        canvas.width = parent.clientWidth / scaleFactor;
        canvas.height = 200 / scaleFactor;
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const spawnObstacle = () => {
      const typeRand = Math.random();
      
      if (score > 15 && typeRand > 0.6) {
        // Spawn Bird
        const heightLevel = Math.floor(Math.random() * 3); 
        let yOffset = 10;
        if (heightLevel === 1) yOffset = 30;
        else if (heightLevel === 2) yOffset = 50;
        
        obstacles.push({
          x: canvas.width,
          y: yOffset,
          w: 60, // Shorter forgiving hitbox
          h: 15,
          type: 'bird',
          frameOffset: Math.floor(Math.random() * 20),
        });
      } else {
        // Spawn Refined Cactus
        const height = 22 + Math.random() * 12; // 22 to 34 px (smaller)
        const width = 14 + Math.random() * 6;   // 14 to 20 px (thinner)
        
        obstacles.push({
          x: canvas.width,
          y: 0,
          w: width,
          h: height,
          type: 'cactus',
          frameOffset: 0,
        });
      }
      
      const minFrames = Math.max(120, 200 - gameSpeed * 5);
      const maxFrames = Math.max(180, 350 - gameSpeed * 5);
      nextObstacleFrame = frame + minFrames + Math.random() * (maxFrames - minFrames);
    };

    const resetGame = () => {
      dino.y = 0;
      dino.vy = 0;
      dino.isJumping = false;
      dino.isDucking = false;
      obstacles = [];
      score = 0;
      gameSpeed = 0.8;
      frame = 0;
      nextObstacleFrame = 50; 
      isPlaying = true;
      isGameOver = false;
    };

    const jump = () => {
      if (isGameOver) {
        resetGame();
        return;
      }
      if (!isPlaying) {
        isPlaying = true;
        nextObstacleFrame = frame + 60;
      }
      if (!dino.isJumping) {
        dino.vy = dino.jumpPower;
        dino.isJumping = true;
        dino.isDucking = false;
      }
    };

    const duck = (isDown: boolean) => {
      if (!isPlaying || isGameOver) return;
      dino.isDucking = isDown;
      if (isDown && dino.isJumping) {
        dino.vy += 3; // Fast drop
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        duck(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        duck(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
        if (e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.target === canvas && touchStartY > 0) {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        if (currentY - touchStartY > 30) {
          duck(true);
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
        duck(false);
        if (e.changedTouches.length > 0) {
          const touchEndY = e.changedTouches[0].clientY;
          if (touchEndY - touchStartY <= 30) {
            jump();
          }
        } else {
          jump();
        }
        touchStartY = 0;
      }
    };
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Custom Drawing Functions
    const drawCustomDino = (ctx: CanvasRenderingContext2D, x: number, y: number, isDead: boolean) => {
      ctx.save();
      ctx.translate(x, y);

      if (dino.isDucking && !isDead && !dino.isJumping) {
        ctx.scale(1, 0.6);
        ctx.translate(0, 16);
      }

      if (isDead) {
        ctx.translate(DINO_W/2, DINO_H);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-DINO_W/2, -DINO_H);
      }

      const img = dinoImgRef.current;
      if (img) {
        // Sprite sheet is 5x5
        const sw = img.width / 5;
        const sh = img.height / 5;
        
        let frameIndex = 0;
        if (isDead) {
          frameIndex = 24; // Last frame for dead
        } else if (dino.isJumping) {
          frameIndex = 0; // First frame for jump
        } else {
          // Running animation (loop through 0-24), slowed down further
          frameIndex = Math.floor(frame / 15) % 25;
        }

        const col = frameIndex % 5;
        const row = Math.floor(frameIndex / 5);

        // Render the image much larger because the character only occupies a small center portion of the 5x5 grid cell
        const RENDER_SIZE = 150; 
        const offsetX = DINO_W / 2 - RENDER_SIZE / 2;
        // Shift up slightly so the feet touch the bottom of the collision box
        const offsetY = DINO_H / 2 - RENDER_SIZE / 2 - 5; 

        ctx.drawImage(img, col * sw, row * sh, sw, sh, offsetX, offsetY, RENDER_SIZE, RENDER_SIZE);
      }

      ctx.restore();
    };

    const drawDerpyCactus = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isDark: boolean) => {
      ctx.save();
      ctx.translate(x, y); // Translate to base of cactus

      const color = isDark ? "#ffffff" : "#111827";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const trunkW = w * 0.35; // Thinner trunk

      // Main trunk
      ctx.beginPath();
      ctx.roundRect(-trunkW/2, -h, trunkW, h, trunkW/2);
      ctx.fill();
      ctx.stroke();

      // Left branch
      ctx.beginPath();
      ctx.moveTo(-trunkW/2, -h * 0.45);
      ctx.lineTo(-w/2, -h * 0.45);
      ctx.lineTo(-w/2, -h * 0.75);
      ctx.stroke();

      // Right branch (only on taller cacti)
      if (h > 26) {
        ctx.beginPath();
        ctx.moveTo(trunkW/2, -h * 0.6);
        ctx.lineTo(w/2, -h * 0.6);
        ctx.lineTo(w/2, -h * 0.85);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawFunnyTextBird = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frameOff: number, isDark: boolean) => {
      ctx.save();
      const flapY = Math.sin((frame + frameOff) * 0.15) * 5;
      
      const color = isDark ? "#ffffff" : "#111827";
      ctx.fillStyle = color;
      ctx.font = "bold 12px sans-serif"; // Smaller font
      ctx.textAlign = "left";
      ctx.fillText("我不會畫烏鴉", x, y - h + flapY);
      
      ctx.restore();
    };


    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use DOM class to guarantee we match the actual visible theme
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? "#ffffff" : "#111827"; // Use pure white for scoreboard/ground
      
      const GROUND_Y = canvas.height * 0.9;

      // Ground line
      ctx.fillStyle = textColor;
      ctx.fillRect(0, GROUND_Y, canvas.width, 1);

      if (!isPlaying && !isGameOver) {
        ctx.fillStyle = textColor;
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        // Keep the text at the same visual distance from the ground as before
        ctx.fillText("Press SPACE to jump", canvas.width / 2, GROUND_Y - 60);
      }

      // Draw Obstacles FIRST (so they are behind the Dino)
      obstacles.forEach((obs) => {
        if (obs.type === 'cactus') {
          drawDerpyCactus(ctx, obs.x, GROUND_Y, obs.w, obs.h, isDark);
        } else {
          drawFunnyTextBird(ctx, obs.x, GROUND_Y - obs.y, obs.w, obs.h, obs.frameOffset, isDark);
        }
      });

      // Draw Dino IN FRONT
      const dHeight = dino.isDucking ? DINO_DUCK_H : DINO_H;
      // Force dino to ground if dead
      const drawDinoY = isGameOver ? (GROUND_Y - DINO_H) : (GROUND_Y - dHeight - dino.y);
      drawCustomDino(ctx, dino.x, drawDinoY, isGameOver);

      // Draw Score
      ctx.fillStyle = textColor;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right";
      const currentScore = Math.floor(score);
      const scoreStr = currentScore.toString().padStart(5, "0");
      const hiStr = highScoreRef.current > 0 ? `HI ${highScoreRef.current.toString().padStart(5, "0")}  ` : "";
      // Keep score at the same relative height (GROUND_Y - 70)
      ctx.fillText(hiStr + scoreStr, canvas.width - 20, GROUND_Y - 70);

      if (isGameOver) {
        ctx.fillStyle = textColor;
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        // Keep Game Over text at the same relative height (GROUND_Y - 50)
        ctx.fillText("GAME OVER", canvas.width / 2, GROUND_Y - 50);
      }
    };

    const update = () => {
      if (isPlaying) {
        frame++;
        
        gameSpeed += 0.0003; // Slower acceleration
        score += gameSpeed * 0.015;

        dino.y -= dino.vy;
        dino.vy += dino.gravity;

        if (dino.y <= 0) {
          dino.y = 0;
          dino.isJumping = false;
          dino.vy = 0;
        }

        if (frame >= nextObstacleFrame) {
          spawnObstacle();
        }

        const GROUND_Y = canvas.height * 0.9;

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].x -= gameSpeed;

          const obs = obstacles[i];

          // Hitbox margins
          const dMargin = 10; // Forgiving margin for Dino
          const oMarginX = obs.type === 'bird' ? 10 : 12; // Bird is text, needs less X margin
          const oMarginY = obs.type === 'bird' ? 2 : 12; // Bird height is only 15, so Y margin must be small

          const dCurrentHeight = dino.isDucking ? DINO_DUCK_H : DINO_H;
          const dCurrentWidth = DINO_W;

          // Hitbox for Dino
          const dx = dino.x + dMargin;
          const dy = GROUND_Y - dCurrentHeight - dino.y + dMargin;
          const dw = dCurrentWidth - dMargin * 2;
          const dh = dCurrentHeight - dMargin * 2;

          // Hitbox for Obstacle
          const ox = obs.x + oMarginX;
          const oy = GROUND_Y - obs.h - obs.y + oMarginY;
          const ow = obs.w - oMarginX * 2;
          const oh = obs.h - oMarginY * 2;

          const collidesX = dx < ox + ow && dx + dw > ox;
          const collidesY = dy < oy + oh && dy + dh > oy;

          if (collidesX && collidesY) {
            isPlaying = false;
            isGameOver = true;
            
            const finalScore = Math.floor(score);
            if (finalScore > highScoreRef.current) {
              highScoreRef.current = finalScore;
              localStorage.setItem("dinoHighScore", finalScore.toString());
            }
          }

          if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1);
          }
        }
      }

      draw();
      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [resolvedTheme]);

  return (
    <div className="absolute bottom-full left-0 w-full overflow-visible pointer-events-none" style={{ height: "200px", marginBottom: "-1px" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer pointer-events-auto"
        onClick={() => {
           window.dispatchEvent(new KeyboardEvent('keydown', {'code': 'Space'}));
        }}
      />
    </div>
  );
}
