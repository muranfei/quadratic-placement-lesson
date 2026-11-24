const state = {
  lang: "en",
  speedIndex: 1,
  answers: Array(6).fill(null),
  checked: Array(6).fill(false),
  correct: Array(6).fill(false),
};

const speeds = [0.75, 1, 1.25, 1.5, 2];

const quiz = [
  {
    en: "Which cells are fixed pads in this lesson?",
    zh: "本课中哪些单元是固定焊盘？",
    options: [
      { en: "A and D", zh: "A 和 D" },
      { en: "B and C", zh: "B 和 C" },
      { en: "E and F", zh: "E 和 F" },
    ],
    answer: 0,
    explainEn: "A remains at (0,0) and D remains at (8,8) throughout the solve.",
    explainZh: "整个求解过程中，A 固定在 (0,0)，D 固定在 (8,8)。",
  },
  {
    en: "A four-pin net spans 8 units horizontally and 8 vertically. What is its HPWL?",
    zh: "一个四端网络横向跨度为 8，纵向跨度为 8，其 HPWL 是多少？",
    options: [
      { en: "8", zh: "8" },
      { en: "16", zh: "16" },
      { en: "64", zh: "64" },
    ],
    answer: 1,
    explainEn: "HPWL is width plus height: 8 + 8 = 16.",
    explainZh: "HPWL 是宽加高：8 + 8 = 16。",
  },
  {
    en: "How does the starter total reach 52?",
    zh: "初始布局的总 HPWL 如何得到 52？",
    options: [
      { en: "4 × 8 + 16 + 4", zh: "4 × 8 + 16 + 4" },
      { en: "6 × 8 + 4", zh: "6 × 8 + 4" },
      { en: "8 + 8 + 8 + 8", zh: "8 + 8 + 8 + 8" },
    ],
    answer: 0,
    explainEn: "Four two-pin nets cost 8 each, the four-pin net costs 16, and E–F costs 4.",
    explainZh: "四个双端网络各为 8，四端网络为 16，E–F 为 4。",
  },
  {
    en: "Which update rule matches the quadratic-lite implementation?",
    zh: "哪条更新规则符合 quadratic-lite 的实现？",
    options: [
      { en: "new = average(neighbors)", zh: "新位置 = 邻居平均" },
      { en: "new = 0.55 × avg + 0.45 × old", zh: "新位置 = 0.55 × 平均 + 0.45 × 原位置" },
      { en: "new = random(neighbors)", zh: "新位置 = 邻居中的随机位置" },
    ],
    answer: 1,
    explainEn: "The 0.55/0.45 blend moves toward neighbors while retaining part of the old coordinate.",
    explainZh: "0.55/0.45 的混合会向邻居移动，同时保留部分原坐标。",
  },
  {
    en: "Why does the constrained result stop near 48 instead of 18.7?",
    zh: "为什么带约束的结果停在约 48，而不是 18.7？",
    options: [
      { en: "A and D keep most bounding boxes wide", zh: "A、D 使多数包围盒保持较大跨度" },
      { en: "E–F cannot move", zh: "E–F 不能移动" },
      { en: "The algorithm ignores all nets", zh: "算法忽略了所有网络" },
    ],
    answer: 0,
    explainEn: "Fixed pads preserve large spans. The force-directed 18.7 result does not use the same constraints.",
    explainZh: "固定焊盘保持了大跨度；18.7 的力导向结果没有使用相同约束。",
  },
  {
    en: "A layout has very low HPWL. What must still be checked?",
    zh: "一个布局的 HPWL 很低，还必须检查什么？",
    options: [
      { en: "Only the filename", zh: "只需要检查文件名" },
      { en: "Overlap and density", zh: "重叠与密度" },
      { en: "Nothing else", zh: "不需要检查其他内容" },
    ],
    answer: 1,
    explainEn: "Low wirelength can come from piling cells together. Density and legality remain mandatory.",
    explainZh: "线长很低可能是因为单元堆在一起，因此仍必须检查密度与合法性。",
  },
];

const video = document.querySelector("#lesson-video");
const chapterButtons = [...document.querySelectorAll("[data-seek]")];

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-set-lang]").forEach((button) => {
    const active = button.dataset.setLang === lang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  try {
    localStorage.setItem("quadratic-placement-language", lang);
  } catch {}
  renderQuiz();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function updateTime() {
  const readout = document.querySelector("#time-readout");
  readout.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 307.7)}`;
  let activeIndex = 0;
  chapterButtons.forEach((button, index) => {
    if (video.currentTime + 0.2 >= Number(button.dataset.seek)) activeIndex = index;
  });
  chapterButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === activeIndex);
  });
}

function cycleSpeed() {
  state.speedIndex = (state.speedIndex + 1) % speeds.length;
  const speed = speeds[state.speedIndex];
  video.playbackRate = speed;
  document.querySelector("#speed-value").textContent = `${speed}×`;
}

function updateHpwl() {
  const width = Number(document.querySelector("#hpwl-width").value);
  const height = Number(document.querySelector("#hpwl-height").value);
  const result = width + height;
  document.querySelector("#width-value").textContent = String(width);
  document.querySelector("#height-value").textContent = String(height);
  document.querySelector("#hpwl-result").textContent = String(result);
  document.querySelector("#hpwl-equation").textContent = `${width} + ${height} = ${result}`;
}

function optionText(option) {
  return state.lang === "en" ? option.en : option.zh;
}

function renderQuiz() {
  const list = document.querySelector("#quiz-list");
  list.replaceChildren();

  quiz.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const head = document.createElement("div");
    head.className = "quiz-head";
    const number = document.createElement("span");
    number.className = "quiz-index";
    number.textContent = String(index + 1).padStart(2, "0");
    const question = document.createElement("h3");
    question.className = "quiz-question";
    question.textContent = state.lang === "en" ? item.en : item.zh;
    head.append(number, question);

    const options = document.createElement("div");
    options.className = "quiz-options";
    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      if (state.answers[index] === optionIndex) button.classList.add("is-selected");
      if (state.checked[index] && optionIndex === item.answer) button.classList.add("is-correct");
      if (
        state.checked[index] &&
        state.answers[index] === optionIndex &&
        optionIndex !== item.answer
      ) {
        button.classList.add("is-wrong");
      }

      const key = document.createElement("span");
      key.className = "option-key";
      key.textContent = String.fromCharCode(65 + optionIndex);
      const copy = document.createElement("span");
      copy.textContent = optionText(option);
      button.append(key, copy);

      button.addEventListener("click", () => {
        if (state.correct[index]) return;
        state.answers[index] = optionIndex;
        state.checked[index] = false;
        renderQuiz();
      });
      options.append(button);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-actions";
    const check = document.createElement("button");
    check.type = "button";
    check.className = "check-button";
    check.textContent = state.lang === "en" ? "Check answer" : "提交答案";
    check.disabled = state.answers[index] === null || state.correct[index];
    check.addEventListener("click", () => {
      state.checked[index] = true;
      state.correct[index] = state.answers[index] === item.answer;
      renderQuiz();
    });

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    const isCorrect = state.checked[index] && state.answers[index] === item.answer;
    const isWrong = state.checked[index] && state.answers[index] !== item.answer;
    if (isCorrect) feedback.classList.add("is-visible", "is-correct");
    if (isWrong) feedback.classList.add("is-visible", "is-wrong");
    if (isCorrect) {
      feedback.textContent = `${state.lang === "en" ? "Correct. " : "正确。"}${state.lang === "en" ? item.explainEn : item.explainZh}`;
    } else if (isWrong) {
      feedback.textContent = `${state.lang === "en" ? "Not yet. " : "还不对。"}${state.lang === "en" ? item.explainEn : item.explainZh}`;
    }

    actions.append(check, feedback);
    card.append(head, options, actions);
    list.append(card);
  });

  updateScore();
}

function updateScore() {
  const score = state.correct.filter(Boolean).length;
  const percent = (score / quiz.length) * 100;
  document.querySelector("#score-value").textContent = String(score);
  document.querySelector("#score-progress").style.width = `${percent}%`;
  document.querySelector(".score-ring").style.background =
    `radial-gradient(circle, rgba(53,181,240,.11), transparent 65%),` +
    `conic-gradient(var(--cyan) 0 ${percent}%, rgba(121,211,247,.1) ${percent}% 100%)`;

  const message = document.querySelector("#score-message");
  if (score === quiz.length) {
    message.textContent =
      state.lang === "en"
        ? "Complete. You can explain the constrained placement result."
        : "完成。你已经能够解释受约束的布局结果。";
  } else if (score >= 4) {
    message.textContent =
      state.lang === "en"
        ? "Strong progress. Check the remaining constraint details."
        : "进展很好，再检查剩余的约束细节。";
  } else {
    message.textContent =
      state.lang === "en"
        ? "Make a choice, then check the reasoning."
        : "先选择，再检查推理。";
  }
}

function resetQuiz() {
  state.answers.fill(null);
  state.checked.fill(false);
  state.correct.fill(false);
  renderQuiz();
}

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.setLang));
});

chapterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    video.currentTime = Number(button.dataset.seek);
    video.scrollIntoView({ behavior: "smooth", block: "center" });
    updateTime();
  });
});

document.querySelector("#speed-button").addEventListener("click", cycleSpeed);
document.querySelector("#reset-quiz").addEventListener("click", resetQuiz);
document.querySelectorAll("#hpwl-width, #hpwl-height").forEach((input) => {
  input.addEventListener("input", updateHpwl);
});
video.addEventListener("timeupdate", updateTime);
video.addEventListener("loadedmetadata", updateTime);

let initialLanguage = "en";
try {
  initialLanguage = localStorage.getItem("quadratic-placement-language") || "en";
} catch {}
setLanguage(initialLanguage === "zh" ? "zh" : "en");
updateHpwl();
updateTime();
