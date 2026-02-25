// Game State Initialization
let state = {
    health: 100,
    sanity: 100,
    gold: 1000,
    timeDelayed: false,
    inventory: ["ساعة ذهبية متوقفة", "زجاجة دواء زرقاء"],
    currentScene: 1
};

// --- AUDIO SETUP ---
const bgAudio = document.getElementById("bg-audio");
const bonusAudio = document.getElementById("bonus-audio");
let bgMusicStarted = false;

function playBgMusic() {
    if (!bgMusicStarted && bgAudio) {
        bgAudio.volume = 0.5;
        bgAudio.play().catch(e => console.log("Audio play blocked", e));
        bgMusicStarted = true;
    }
}

function playBonusSound() {
    if (bonusAudio) {
        bonusAudio.currentTime = 0;
        bonusAudio.play().catch(e => console.log("Audio play blocked", e));
    }
}

// Ensure the music starts upon the first interaction
document.addEventListener("click", playBgMusic);

// --- SCENE DEFINITIONS ---
const scenes = {
    1: {
        title: "حديقة النسيان",
        image: "Images/1-cmpr.png",
        text: `تفتح عينيك بصعوبة على ضوء أبيض ساطع ولاذع. رائحة الورد الأبيض المحيط بك قوية جداً، تخدر عقلك وتجعلك غير قادر على تذكر اسمك. فجأة، تسمع صوت مقص يقطع الأغصان ببرود. البستاني يبتسم ابتسامة خالية من المشاعر ويعرض عليك نسيان ما يؤلمك.`,
        choices: [
            {
                text: "تتجاهله وتتراجع ببطء لتختبئ بين الشجيرات.",
                action: () => {
                    updateInventory("add", "مفتاح صدئ");
                    updateInventory("add", "خريطة ممزقة");
                    updateSanity(-20, "تتعثر في جثة مخبأة... مشهد مرعب.");
                    showToast("حصلت على مفتاح صدئ وخريطة ممزقة!", "success");
                    goToScene(2);
                }
            },
            {
                text: "تقترب منه بشجاعة وتسأله: 'من أنا؟ وما هذا المكان؟'",
                action: () => {
                    updateInventory("add", "تفاحة ذهبية");
                    showToast("أعطاك البستاني التفاحة الذهبية.", "success");
                    goToScene(2);
                }
            },
            {
                text: "تومئ برأسك كأنك موافق لتهدئته، وتتسلل بصمت وتركض.",
                action: () => {
                    showToast("نجحت في التسلل للخارج بسلام.", "success");
                    goToScene(2);
                }
            }
        ]
    },
    2: {
        title: "غابة الهمسات",
        image: "Images/2-cmpr.png",
        text: `تسقط منك نصف صورة ممزقة.. إنها ابنتك المريضة في أمس الحاجة إليك! الشجر يهمس بأصوات مقلقة وتتخللها أصوات بكاء ابنتك تطلب النجدة. الطريقة تنقسم أمامك.`,
        choices: [
            {
                text: "قلبك لا يتحمل صوتها، تندفع فوراً متتبعاً البكاء.",
                action: () => {
                    updateGold(-300, "وقعت في فخ لصوص! فقدت 300 عملة.");
                    updateSanity(-20, "الهمسات تتلاعب بعقلك.");
                    goToScene(3);
                }
            },
            {
                text: "لا تثق بذاكرتك. تسد أذنيك وتكمل سيرك متجاهلاً الأصوات.",
                action: () => {
                    showToast("نجحت في العبور بسلام متجاوزاً الأوهام.", "success");
                    goToScene(3);
                }
            },
            {
                text: "تلمح رجلاً ملقى على الأرض يطلب النجدة، تقترب لمساعدته.",
                action: () => {
                    updateHealth(-20, "إنه فخ! دخلت في عراك.");
                    updateInventory("add", "تعويذة سحرية");
                    showToast("خرجت من العراك بتعويذة سحرية.", "success");
                    goToScene(3);
                }
            }
        ]
    },
    3: {
        title: "سوق الأوهام",
        image: "Images/3-cmpr.png",
        text: `سوق عشوائي يمتد على ضفة نهر أخضر داكن. بمجرد رؤية الناس لصورة ابنتك، يتراجعون برعب وتصبح منبوذاً. التكتكة في رأسك تتسارع.`,
        choices: [
            {
                text: "تشتري سيفاً حاداً من تاجر أسلحة. (-800 عملة)",
                condition: () => state.gold >= 800,
                action: () => {
                    updateGold(-800);
                    updateInventory("add", "سيف حاد");
                    showToast("أصبحت مسلحاً بسيف حاد.", "success");
                    goToScene(4);
                }
            },
            {
                text: "تدخل خيمة عرافة عجوز. (-200 عملة)",
                condition: () => state.gold >= 200,
                action: () => {
                    updateGold(-200);
                    updateInventory("add", "مرآة الحقيقة");
                    showToast("العيون تكذب.. مرآة الحقيقة ستساعدك.", "success");
                    goToScene(4);
                }
            },
            {
                text: "تتقرب من شخص ودود ليرشدك مجاناً.",
                action: () => {
                    if (state.inventory.includes("مفتاح صدئ")) {
                        updateInventory("remove", "مفتاح صدئ");
                        showToast("غافلك الشخص وسرق المفتاح الصدئ!", "danger");
                    } else {
                        updateGold(-100, "تعرضت للسرقة! فقدت 100 عملة.");
                    }
                    goToScene(4);
                }
            }
        ]
    },
    4: {
        title: "طاحونة الوقت",
        image: "Images/4-cmpr.png",
        text: `طاحونة هواء عملاقة مسدودة. عند الباب، تجد آلية معقدة بها تجويف على شكل ساعة جيب. صوت التكتكة في رأسك يتعالى كأن الآلة تطلب نبضاً لتعمل.`,
        choices: [
            {
                text: "تضع الساعة الذهبية المتوقفة في التجويف.",
                condition: () => state.inventory.includes("ساعة ذهبية متوقفة"),
                action: () => {
                    updateInventory("remove", "ساعة ذهبية متوقفة");
                    updateInventory("add", "ترس فضي");
                    showToast("دارت العقارب وانفتح الباب وسقط لك ترس فضي.", "success");
                    goToScene(5);
                }
            },
            {
                text: "تسحب السيف وتضرب القفل بكل قوتك.",
                condition: () => state.inventory.includes("سيف حاد"),
                action: () => {
                    updateHealth(-30, "تحطم الباب، لكن سقطت عليك أجزاء من السقف وتنزف.");
                    goToScene(5);
                }
            },
            {
                text: "تتسلق الصخور الجانبية للالتفاف حولها.",
                action: () => {
                    updateTimeDelay();
                    goToScene(5);
                }
            }
        ]
    },
    5: {
        title: "جسر الزئبق",
        image: "Images/5-cmpr.png",
        text: `جسر زئبقي تقف عليه عجوز بقلنسوة ممزقة. تسألك: "أبني جسوراً من الفضة وتيجاناً من الذهب، ليس لي عيون وأرى كل شيء، أخبرك بمصيرك دون لسان.. من أنا؟"`,
        choices: [
            {
                text: "توجه مرآة الحقيقة نحوها بصمت.",
                condition: () => state.inventory.includes("مرآة الحقيقة"),
                action: () => {
                    updateHealth(40, "تراجعت العجوز رعباً ورمت لك علاجاً سحرياً.");
                    goToScene(6);
                }
            },
            {
                text: "الجواب: 'المرآة!'",
                action: () => {
                    showToast("تراجعت وسمحت لك بالمرور بسلام.", "success");
                    goToScene(6);
                }
            },
            {
                text: "تهددها بالسيف.",
                condition: () => state.inventory.includes("سيف حاد"),
                action: () => {
                    updateHealth(-40, "تحولت لوحش وضربت الجسر! قفزت وفقدت صحتك.");
                    goToScene(6);
                }
            }
        ]
    },
    6: {
        title: "حقول الزجاج",
        image: "Images/6-cmpr.png",
        text: `تنقشع الأبخرة لتكشف عن حقل من العشب، لكن كل ورقة عبارة عن زجاج حاد. يلوح البرج في الأفق العاجي منتظراً إياك.`,
        choices: [
            {
                text: "تمشي ببطء شديد، حاسباً كل خطوة.",
                action: () => {
                    updateHealth(20, "خطوت بحذر ووجدت عشبة طبية تعالجت بها.");
                    updateTimeDelay();
                    goToScene(7);
                }
            },
            {
                text: "تغمض عينيك وتركض بأقصى سرعة!",
                action: () => {
                    updateHealth(-30, "وصلت أسرع لكن الزجاج مزقك وتنزف بشدة.");
                    goToScene(7);
                }
            },
            {
                text: "تدفع عربة خشبية محطمة لتمهد الطريق.",
                action: () => {
                    showToast("عبرت بأمان، لكن الصوت العالي نبّه خطراً قادماً.", "warning");
                    goToScene(7);
                }
            }
        ]
    },
    7: {
        title: "حارس الغابة",
        image: "Images/7-cmpr.png",
        text: `نمر سحري عملاق، عيناه تشعان بلون أزرق يخترق الروح. اهتزاز الأرض يرجف عضلة قلبك. إنه يسد طريقك الأخير.`,
        choices: [
            {
                text: "تستل سيفك وتندفع للمعركة.",
                condition: () => state.inventory.includes("سيف حاد"),
                action: () => {
                    updateHealth(-40, "قتلت الوحش بصعوبة بالغة وواصلت طريقك مجروحاً.");
                    goToScene(8);
                }
            },
            {
                text: "تخرج التفاحة الذهبية وتدحرجها نحوه.",
                condition: () => state.inventory.includes("تفاحة ذهبية"),
                action: () => {
                    showToast("التهم الوحش التفاحة وسقط في سبات سحري عميق.", "success");
                    goToScene(8);
                }
            },
            {
                text: "تلقي بالساعة المتوقفة بعيداً.",
                condition: () => state.inventory.includes("ساعة ذهبية متوقفة"),
                action: () => {
                    updateInventory("remove", "ساعة ذهبية متوقفة");
                    showToast("انجذب الوحش لصوت التكتكة ونجوت! فقدت ساعتك.", "success");
                    goToScene(8);
                }
            },
            {
                text: "تركض بشكل أعمى محاولاً الهرب.",
                action: () => {
                    gameOver("لم تستطع الهرب. أمسك بك النمر ممزقاً جسدك.");
                }
            }
        ]
    },
    8: {
        title: "متاهة المرايا",
        image: "Images/8-cmpr.png",
        text: `جدران هائلة من المرايا تظهر لك انعكاسات مريحة وتهمس: "الدواء لن ينقذها. استرح وعش في الخيال الجميل." عقلك ينهار تحت وطأة الوهم.`,
        choices: [
            {
                text: "ترفع مرآة الحقيقة لكسر السحر.",
                condition: () => state.inventory.includes("مرآة الحقيقة"),
                action: () => {
                    showToast("ضرب الشعاع المرايا الكاذبة وظهر لك الطريق الحقيقي.", "success");
                    goToScene(9);
                }
            },
            {
                text: "تحطم المرايا بوحشية بأسلحتك.",
                action: () => {
                    updateSanity(-40, "تطايرت الشظايا وجرحت عقلك... تخرج مهلوساً.");
                    goToScene(9);
                }
            },
            {
                text: "تصّدق الانعكاس وتبقى في الوهم المريح.",
                action: () => {
                    gameOver("ابتلعك الزجاج وتحولت لمجرد انعكاس محبوس للأبد.");
                }
            }
        ]
    },
    9: {
        title: "معسكر المرتزقة",
        image: "Images/9-cmpr.png",
        text: `الأرض الأخيرة. معسكر محصن تحرسه شخصيات بدروع سوداء، عيونهم مجوفة ومشارطهم ضخمة. يضمنون ألا يوقظ أحد ابنتك النائمة في البرج.`,
        choices: [
            {
                text: "تلقي بـ 500 عملة عند قدمي قائدهم.",
                condition: () => state.gold >= 500,
                action: () => {
                    updateGold(-500);
                    showToast("يضحك ويشير لرجاله بفتح البوابة لك.", "success");
                    goToScene(10);
                }
            },
            {
                text: "تستخدم الخريطة الممزقة والمفتاح للتسلل بالخفاء.",
                condition: () => state.inventory.includes("مفتاح صدئ") && state.inventory.includes("خريطة ممزقة"),
                action: () => {
                    showToast("فتحت الباب السري وتجاوزت المعسكر غير مكتشف.", "success");
                    goToScene(10);
                }
            },
            {
                text: "تندفع في معركة انتحارية لبلوغ الباب.",
                action: () => {
                    if (state.health > 50) {
                        state.health = 10;
                        updateUI();
                        showToast("اقتحمت البوابة وسقطت بالداخل تنزف بشدة!", "warning");
                        goToScene(10);
                    } else {
                        gameOver("لم تملك القوة كافية للمعركة. سقطت مقتولاً أمام البوابة.");
                    }
                }
            }
        ]
    },
    10: {
        title: "البرج العاجي",
        image: "Images/10-cmpr.png",
        text: `دخلت الغرفة بصمت. السرير ترقد عليه ابنتك بسلام شاحب. تخرج زجاجة الدواء الزرقاء ويدك ترتجف...`,
        choices: [
            {
                text: "تقترب من السرير لإنقاذها...",
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
    inventoryListEl.textContent = state.inventory.length ? state.inventory.join(" • ") : "فارغ";
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

    // Check bonus conditions before gameover logic
    if (amount !== 0) playBonusSound();

    if (amount < 0 && msgText) showToast(msgText, "danger");
    else if (amount > 0 && msgText) showToast(msgText, "success");

    if (state.health <= 0) {
        gameOver("استسلم جسدك لجراحه الكثيرة، وسقطت مقتولاً.");
        return;
    }
    updateUI();
}

function updateSanity(amount, msgText = null) {
    state.sanity += amount;
    if (state.sanity > 100) state.sanity = 100;

    if (amount !== 0) playBonusSound();

    if (amount < 0 && msgText) showToast(msgText, "danger");

    if (state.sanity <= 0) {
        gameOver("تحطم عقلك تماماً وفقدت صوابك للأبد.");
        return;
    }
    updateUI();
}

function updateGold(amount, msgText = null) {
    state.gold += amount;
    if (state.gold < 0) state.gold = 0;

    if (amount !== 0) playBonusSound();

    if (amount < 0 && msgText) showToast(msgText, "warning");
    updateUI();
}

function updateInventory(action, item) {
    let changed = false;
    if (action === "add" && !state.inventory.includes(item)) {
        state.inventory.push(item);
        changed = true;
    } else if (action === "remove") {
        const index = state.inventory.indexOf(item);
        if (index > -1) {
            state.inventory.splice(index, 1);
            changed = true;
        }
    }

    if (changed) playBonusSound();
    updateUI();
}

function updateTimeDelay() {
    state.timeDelayed = true;
    showToast("استغرق هذا الفعل وقتاً طويلاً...", "warning");
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
                btn.onclick = () => {
                    playBgMusic(); // Safety to hit auto-play rules if first click is a choice
                    choice.action();
                };
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

    if (state.timeDelayed === true) {
        // Ending 1: Tragic Hero (توقف النبض)
        endTitle = "توقف النبض";
        endText = "تفتح زجاجة الدواء، لكن قبل أن تضع القطرة الأولى، تتوقف أنفاسها. يرتفع صوت تكتكة الساعة ليصبح صفيراً متصلاً يمزق الآذان... لقد خسرت السباق ضد الزمن.";
    } else if (state.inventory.includes("مرآة الحقيقة") && state.sanity > 0) {
        // Ending 3: Illusion Breaker (النهاية الحقيقية)
        endTitle = "كاسر الزجاج (النهاية الحقيقية)";
        endText = "تنظر لانعكاس الزجاجة في المرآة وتدرك الصاعقة: الدواء ما هو إلا سم للاستسلام! تحطم الزجاجة وتحمل ابنتك قافزاً من نافذة البرج. تسقط في الظلام وتفتح عينيك.. لتجد نفسك في غرفة العناية المركزة الحقيقية.. الطبيب المبتسم يخبرها: لقد تخطت الخطر. انتصرت.";
    } else {
        // Ending 2: Blind Survivor (السبات الجميل)
        endTitle = "السبات الجميل";
        endText = "تسكب الدواء ببطء. ابنتك تسعل وتفتح عينيها. تعيشان في حديقة الورد بسعادة.. لكن في سكون الليل، تستمر بسماع صوت صفير أجهزة طبية، متسائلاً إن كنتما تعيشان وهماً مريحاً هرباً من الحقيقة. (نهاية وهمية)";
    }

    sceneTitle.textContent = "النهاية: " + endTitle;
    storyText.textContent = endText;

    let restartBtn = document.createElement("button");
    restartBtn.className = "choice-btn";
    restartBtn.textContent = "إعادة اللعب";
    restartBtn.onclick = () => location.reload();
    choicesContainer.appendChild(restartBtn);
}

function gameOver(message) {
    choicesContainer.innerHTML = '';
    sceneTitle.textContent = "نهاية اللعبة";
    storyText.textContent = message;

    let restartBtn = document.createElement("button");
    restartBtn.className = "choice-btn";
    restartBtn.textContent = "إعادة اللعب";
    restartBtn.onclick = () => location.reload();
    choicesContainer.appendChild(restartBtn);
}

// Init game
window.onload = () => {
    updateUI();
    renderScene();
};
