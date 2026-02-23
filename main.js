// Game State Initialization
let state = {
    health: 100,
    sanity: 100,
    gold: 1000,
    timeDelayed: false,
    inventory: ["Stopped Golden Watch", "Mysterious Medicine"],
    currentScene: 1
};

// --- SCENE DEFINITIONS ---
const scenes = {
    1: {
        title: "The Garden of Oblivion",
        image: "Images/1.png",
        text: `You wake up with the overwhelming scent of white roses. You don't remember your name. In your pocket is a note: "Don't trust your memory, trust time." A mysterious gardener smiles and offers you to stay.`,
        choices: [
            {
                text: "Search the bushes.",
                action: () => {
                    updateInventory("add", "Rusty Key");
                    updateInventory("add", "Torn Map");
                    updateSanity(-20, "You found a hidden corpse... horrifying.");
                    showToast("Found Rusty Key and Torn Map!", "success");
                    goToScene(2);
                }
            },
            {
                text: "Ask him who you are.",
                action: () => {
                    updateInventory("add", "Golden Apple");
                    showToast("He gives you a Golden Apple.", "success");
                    goToScene(2);
                }
            },
            {
                text: "Sneak out silently.",
                action: () => {
                    showToast("You sneak out safely.", "success");
                    goToScene(2);
                }
            }
        ]
    },
    2: {
        title: "The Forest of Whispers",
        image: "Images/2.png",
        text: `You find a torn photo of a little girl and suddenly remember: she is your sick daughter! You enter a dark forest where the trees whisper your name in her voice.`,
        choices: [
            {
                text: "Follow the sound.",
                action: () => {
                    updateGold(-200, "It was a trap!");
                    updateSanity(-20, "The whispers mess with your mind.");
                    goToScene(3);
                }
            },
            {
                text: "Cover your ears and walk straight.",
                action: () => {
                    showToast("You passed safely.", "success");
                    goToScene(3);
                }
            },
            {
                text: "Help an injured man.",
                action: () => {
                    updateHealth(-20, "It's an ambush!");
                    updateInventory("add", "Protective Charm");
                    showToast("You fought them off and found a Protective Charm.", "success");
                    goToScene(3);
                }
            }
        ]
    },
    3: {
        title: "The Market of Illusions",
        image: "Images/3.png",
        text: `You reach a bizarre market next to a green river. The faceless locals recoil in horror when you show them your daughter's photo.`,
        choices: [
            {
                text: "Buy a weapon from a shady merchant. (-800 Gold)",
                condition: () => state.gold >= 800,
                action: () => {
                    updateGold(-800);
                    updateInventory("add", "Sharp Sword");
                    goToScene(4);
                }
            },
            {
                text: "Pay the fortune teller. (-200 Gold)",
                condition: () => state.gold >= 200,
                action: () => {
                    updateGold(-200);
                    updateInventory("add", "Mirror of Truth");
                    goToScene(4);
                }
            },
            {
                text: "Accept a stranger's free guidance.",
                action: () => {
                    if (state.inventory.includes("Rusty Key")) {
                        updateInventory("remove", "Rusty Key");
                        showToast("The stranger robbed you of your Rusty Key.", "danger");
                    } else {
                        updateGold(-100, "The stranger robbed you.");
                    }
                    goToScene(4);
                }
            }
        ]
    },
    4: {
        title: "The Windmill of Time",
        image: "Images/4.png",
        text: `A massive mechanical windmill blocks the path. The iron door is locked by gears missing a watch-shaped piece.`,
        choices: [
            {
                text: "Insert the Stopped Golden Watch.",
                condition: () => state.inventory.includes("Stopped Golden Watch"),
                action: () => {
                    updateInventory("remove", "Stopped Golden Watch");
                    updateInventory("add", "Silver Gear");
                    showToast("The door opens smoothly.", "success");
                    goToScene(5);
                }
            },
            {
                text: "Smash the lock with the Sharp Sword.",
                condition: () => state.inventory.includes("Sharp Sword"),
                action: () => {
                    updateHealth(-30, "The door breaks but debris falls on you.");
                    goToScene(5);
                }
            },
            {
                text: "Search for another way around.",
                action: () => {
                    updateTimeDelay();
                    goToScene(5);
                }
            }
        ]
    },
    5: {
        title: "The Mercury Bridge",
        image: "Images/5.png",
        text: `A stone bridge crosses a river of liquid mercury. An old crone demands proof of insight, asking: "I build bridges of silver. I have no eyes but see everything. What am I?"`,
        choices: [
            {
                text: "Show her the Mirror of Truth.",
                condition: () => state.inventory.includes("Mirror of Truth"),
                action: () => {
                    updateHealth(40, "She steps aside in fear and gives you a Healing Potion.");
                    goToScene(6);
                }
            },
            {
                text: "Answer: 'A Mirror'",
                action: () => {
                    showToast("She smiles and lets you pass.", "success");
                    goToScene(6);
                }
            },
            {
                text: "Threaten her.",
                action: () => {
                    updateHealth(-40, "She turns into a monster! The bridge breaks.");
                    goToScene(6);
                }
            }
        ]
    },
    6: {
        title: "The Fields of Glass",
        image: "Images/6.png",
        text: `A beautiful green field, but every blade of grass is made of razor-sharp glass.`,
        choices: [
            {
                text: "Walk very slowly.",
                action: () => {
                    updateHealth(20, "You found a Rare Herb!");
                    updateTimeDelay();
                    goToScene(7);
                }
            },
            {
                text: "Run through it.",
                action: () => {
                    updateHealth(-30, "You got cut crossing the field.");
                    goToScene(7);
                }
            },
            {
                text: "Push an old cart ahead of you.",
                action: () => {
                    showToast("Safe and fast, but the noise alerts the next danger.", "warning");
                    goToScene(7);
                }
            }
        ]
    },
    7: {
        title: "The Forest Guardian",
        image: "Images/7.png",
        text: `A colossal, glowing-eyed tiger blocks the exit of the forest.`,
        choices: [
            {
                text: "Fight with the Sharp Sword.",
                condition: () => state.inventory.includes("Sharp Sword"),
                action: () => {
                    updateHealth(-40, "You win, but sustain heavy injuries.");
                    goToScene(8);
                }
            },
            {
                text: "Throw the Golden Apple.",
                condition: () => state.inventory.includes("Golden Apple"),
                action: () => {
                    showToast("The magic apple puts the tiger to sleep.", "success");
                    goToScene(8);
                }
            },
            {
                text: "Distract it with the ticking Stopped Golden Watch.",
                condition: () => state.inventory.includes("Stopped Golden Watch"),
                action: () => {
                    updateInventory("remove", "Stopped Golden Watch");
                    showToast("Tiger chases the sound. You pass safely.", "success");
                    goToScene(8);
                }
            },
            {
                text: "Run blindly.",
                action: () => {
                    gameOver("The tiger catches you. You have been slain.");
                }
            }
        ]
    },
    8: {
        title: "The Maze of Mirrors",
        image: "Images/8.png",
        text: `A labyrinth of giant mirrors showing you alternate, perfect lives where your daughter is never sick. The illusions urge you to stay and rest.`,
        choices: [
            {
                text: "Use the Mirror of Truth.",
                condition: () => state.inventory.includes("Mirror of Truth"),
                action: () => {
                    showToast("The illusions shatter instantly, revealing the exit.", "success");
                    goToScene(9);
                }
            },
            {
                text: "Smash the mirrors.",
                action: () => {
                    updateSanity(-40, "The fractured reflections break your mind.");
                    goToScene(9);
                }
            },
            {
                text: "Surrender and rest.",
                action: () => {
                    gameOver("You fall asleep forever in the illusions.");
                }
            }
        ]
    },
    9: {
        title: "The Mercenary Camp",
        image: "Images/9.png",
        text: `You reach the ivory tower where your daughter is kept, but a camp of heavily armed mercenaries guards the entrance.`,
        choices: [
            {
                text: "Bribe them with 500 Gold.",
                condition: () => state.gold >= 500,
                action: () => {
                    updateGold(-500);
                    showToast("They take the money and let you in.", "success");
                    goToScene(10);
                }
            },
            {
                text: "Sneak through the back.",
                condition: () => state.inventory.includes("Rusty Key") && state.inventory.includes("Torn Map"),
                action: () => {
                    showToast("You enter undetected via the back routes.", "success");
                    goToScene(10);
                }
            },
            {
                text: "Fight your way in.",
                action: () => {
                    if (state.health > 50) {
                        state.health = 10;
                        updateUI();
                        showToast("Epic battle! You survived, but barely.", "warning");
                        goToScene(10);
                    } else {
                        gameOver("You were too weak to defeat the mercenaries.");
                    }
                }
            }
        ]
    },
    10: {
        title: "The Ivory Tower",
        image: "Images/10.png",
        text: `You enter the top room. Your pale daughter lies on the bed. You hold the mysterious medicine from your pocket.`,
        choices: [
            {
                text: "Approach the bed...",
                action: () => evaluateEndings()
            }
        ]
    }
};

// --- CORE FUNCTIONS ---

const healthEl = document.getElementById("health-value");
const sanityEl = document.getElementById("sanity-value");
const goldEl = document.getElementById("gold-value");
const inventoryListEl = document.getElementById("inventory-list");

const bgContainer = document.getElementById("background-image-container");
const sceneTitle = document.getElementById("scene-title");
const storyText = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const toastContainer = document.getElementById("toast-container");

function updateUI() {
    animateValue(healthEl, state.health);
    animateValue(sanityEl, state.sanity);
    animateValue(goldEl, state.gold);
    inventoryListEl.textContent = state.inventory.length ? state.inventory.join(" • ") : "Empty";
}

function animateValue(element, newValue) {
    if (parseInt(element.textContent) !== newValue) {
        element.parentElement.classList.add("pop");
        setTimeout(() => element.parentElement.classList.remove("pop"), 300);
        element.textContent = newValue;
    }
}

function updateHealth(amount, msgText = null) {
    state.health += amount;
    if (state.health > 100) state.health = 100;
    if (amount < 0 && msgText) showToast(msgText, "danger");
    else if (amount > 0 && msgText) showToast(msgText, "success");

    if (state.health <= 0) {
        gameOver("You have succumbed to your injuries.");
        return;
    }
    updateUI();
}

function updateSanity(amount, msgText = null) {
    state.sanity += amount;
    if (state.sanity > 100) state.sanity = 100;
    if (amount < 0 && msgText) showToast(msgText, "danger");

    if (state.sanity <= 0) {
        gameOver("Your mind has shattered entirely.");
        return;
    }
    updateUI();
}

function updateGold(amount, msgText = null) {
    state.gold += amount;
    if (state.gold < 0) state.gold = 0;
    if (amount < 0 && msgText) showToast(msgText, "warning");
    updateUI();
}

function updateInventory(action, item) {
    if (action === "add" && !state.inventory.includes(item)) {
        state.inventory.push(item);
    } else if (action === "remove") {
        const index = state.inventory.indexOf(item);
        if (index > -1) state.inventory.splice(index, 1);
    }
    updateUI();
}

function updateTimeDelay() {
    state.timeDelayed = true;
    showToast("This action took too much time...", "warning");
}

function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function goToScene(sceneNumber) {
    state.currentScene = sceneNumber;
    renderScene();
}

function renderScene() {
    const scene = scenes[state.currentScene];

    // Fade out text and choices
    storyText.classList.remove("visible");
    choicesContainer.style.transition = 'opacity 0.4s ease';
    choicesContainer.style.opacity = '0';

    setTimeout(() => {
        choicesContainer.innerHTML = '';
        sceneTitle.textContent = scene.title;
        storyText.textContent = scene.text;

        // Build choices
        scene.choices.forEach(choice => {
            if (!choice.condition || choice.condition()) {
                const btn = document.createElement("button");
                btn.className = "choice-btn";
                btn.innerHTML = choice.text;
                btn.onclick = choice.action;
                choicesContainer.appendChild(btn);
            }
        });

        // Background Image Crossfade
        const newImg = document.createElement('img');
        newImg.className = 'bg-image';
        newImg.src = scene.image;
        newImg.alt = "Scene Background";

        newImg.onerror = () => {
            newImg.onerror = null;
            newImg.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' fill='%2364748b' font-family='sans-serif' font-size='24' text-anchor='middle' dy='.3em'%3EPlaceholder: " + encodeURIComponent(scene.image) + "%3C/text%3E%3C/svg%3E";
        };

        newImg.onload = () => {
            // Find old images
            const oldImages = bgContainer.querySelectorAll('.bg-image');

            // Insert new image before the overlay
            bgContainer.insertBefore(newImg, bgContainer.querySelector('.overlay'));

            // Trigger reflow
            void newImg.offsetWidth;

            // Fade in new image
            newImg.classList.add('active');

            // Fade out and remove old images
            oldImages.forEach(img => {
                img.classList.remove('active');
                setTimeout(() => img.remove(), 1500); // Wait for CSS transition
            });

            // Fade in text
            storyText.classList.add("visible");
            choicesContainer.style.opacity = '1';
        };

        // Fallback if image fails or caches instantly
        if (newImg.complete) {
            newImg.onload();
        }

    }, 400); // Give time for text to fade out
}

function evaluateEndings() {
    choicesContainer.innerHTML = '';
    let endTitle = "";
    let endText = "";

    if (state.timeDelayed === true && state.health <= 20) {
        // Ending 1: Tragic Hero
        endTitle = "Tragic Hero";
        endText = "You arrive too late. Your injuries overwhelm you, and you collapse beside her bed. Game Over.";
    } else if (state.inventory.includes("Mirror of Truth") || state.inventory.includes("Torn Map")) {
        // Ending 2: Illusion Breaker
        endTitle = "Illusion Breaker";
        endText = "You examine the medicine closely and realize it's poison given by the gardener to wipe your memories! You throw it away, grab your daughter, and escape the tower, waking up together in the real world. You Win!";
    } else {
        // Ending 3: Blind Survivor
        endTitle = "Blind Survivor";
        endText = "You give her the medicine. She opens her eyes and smiles. You live in this strange land forever, always feeling that something isn't quite right. You Win... sort of.";
    }

    sceneTitle.textContent = "Ending: " + endTitle;
    storyText.textContent = endText;

    let restartBtn = document.createElement("button");
    restartBtn.className = "choice-btn";
    restartBtn.textContent = "Restart Game";
    restartBtn.onclick = () => location.reload();
    choicesContainer.appendChild(restartBtn);
}

function gameOver(message) {
    choicesContainer.innerHTML = '';
    sceneTitle.textContent = "Game Over";
    storyText.textContent = message;

    let restartBtn = document.createElement("button");
    restartBtn.className = "choice-btn";
    restartBtn.textContent = "Restart Game";
    restartBtn.onclick = () => location.reload();
    choicesContainer.appendChild(restartBtn);
}

// Init game
window.onload = () => {
    updateUI();
    renderScene();
};
