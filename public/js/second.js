
// STAR BACKGROUND
const starsContainer = document.querySelector('.stars');
const numStars = 200;
const maxStarSize = 3;
for (let i = 0; i < numStars; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  const size = Math.random() * maxStarSize + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.opacity = Math.random() * 0.8 + 0.2;
  star.style.animationDuration = `${Math.random() * 3 + 2}s`;
  starsContainer.appendChild(star);
}

// SHOOTING STARS
const shooterContainer = document.querySelector('.shooters');
function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');

    // Random start position (mostly top-left to top-right diagonal)
    const startX = Math.random() * 100; // percent of viewport width
    const startY = Math.random() * 30; // top 30% of viewport height
    shootingStar.style.top = `${startY}vh`;
    shootingStar.style.left = `${startX}vw`;

    // Random animation duration
    const duration = Math.random() * 1 + 10; // 0.8s - 1.8s
    shootingStar.style.animationDuration = `${duration}s`;

    starsContainer.appendChild(shootingStar);

    // Remove after animation ends
    shootingStar.addEventListener('animationend', () => {
        shootingStar.remove();
    });
}

// Create shooting stars at random intervals
setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every interval
        createShootingStar();
    }
}, 1000);