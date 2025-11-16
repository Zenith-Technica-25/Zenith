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
// SELF CARE TIPS
const tips = [
    "Don't forget to stay hydrated!", "Don't be afraid to ask for help!", "Take the time to plan at least one fun activity every day", "Sleep is very important. Aim for 8-10 hours a night!", "Try some aromatherapy!", "Aim for the Sun and land amongst the stars!", "Even in the darkest night, there's a star to guide the way", "Don't forget to go outside and face the sky!"
];

function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    var randomTip = Math.floor(Math.random() * tips.length);
    // Click → open popup
    shootingStar.addEventListener("click", () => {
        document.getElementById("starPopup").style.display = "flex";
        document.getElementById("tipText").innerHTML = tips[randomTip];
    });

    // Random positions
    const startX = Math.random() * 100;
    const startY = Math.random() * 30;
    shootingStar.style.top = `${startY}vh`;
    shootingStar.style.left = `${startX}vw`;

    // Random animation speed
    const duration = Math.random() * 1 + 10;
    shootingStar.style.animationDuration = `${duration}s`;

    // FIX: Append to proper container!
    shooterContainer.appendChild(shootingStar);

    shootingStar.addEventListener('animationend', () => {
        shootingStar.remove();
    });
}

setInterval(() => {
    if (Math.random() < 0.3) {
        createShootingStar();
    }
}, 1000);




// Close popup
document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("starPopup").style.display = "none";
});

// Load stacked shuttle modules
const moduleContainer = document.getElementById("shuttleStack");
const count = parseInt(localStorage.getItem("shuttleModules") || "0");

const moduleImages = [
  "shuttle_images/Shuttle_Mod1.png",
  "shuttle_images/Shuttle_Mod2.png",
  "shuttle_images/Shuttle_Mod3.png",
  "shuttle_images/Shuttle_Mod4.png"
];

for (let i = 0; i < count; i++) {
  const img = document.createElement("img");
  img.src = moduleImages[i % 4];  // rotates 1→4
  moduleContainer.appendChild(img);
}


