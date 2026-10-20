/**
 * إعدادات صفحات الموقع (الرئيسية، الدروس، إلخ...)
 * لإضافة درس جديد، قم بإضافة كائن جديد داخل مصفوفة PAGES.
 */
const EMAIL = "votre.adresse@exemple.com"; // <-- قم بتغييرها إلى بريدك الإلكتروني الشخصي

const PAGES = [
  {
    href: "pages/cours-8086.html",
    fr: {
      t: "Microprocesseur 8086 et MIPS",
      d: "Bus, registres, indicateurs, mémoire segmentée, interruptions, CISC/RISC, MIPS et complément à deux."
    },
    ar: {
      t: "المعالج Intel 8086 وMIPS",
      d: "الناقلات والمسجلات والمؤشرات والذاكرة المقطّعة والمقاطعات وCISC/RISC وMIPS والمتمم إلى 2."
    }
  }
];

const UI = {
  fr: { ok: "Disponible", go: "Ouvrir" },
  ar: { ok: "متاح", go: "فتح" }
};

/**
 * دالة عرض الدروس في الصفحة بناءً على اللغة الحالية
 */
function render(lang) {
  const container = document.getElementById("lessons");
  if (!container) return;
  
  const uiText = UI[lang || "fr"];
  lang = lang || "fr";

  container.innerHTML = PAGES.map(page => `
    <a class="lrow" href="${page.href}">
      <span>
        <b>${page[lang].t}</b>
        <small>${page[lang].d}</small>
      </span>
      <span class="badge">${uiText.ok}</span>
      <span class="go">${uiText.go}</span>
    </a>
  `).join("");
}

window.onLang = render;
render("fr");

/**
 * محاكاة مسجل (Register) بـ 16 بت تفاعلي
 */
(function () {
  const bitsContainer = document.getElementById("bits");
  if (!bitsContainer) return;

  let regValue = 0x8086;
  const bitElements = [];
  const hexDisplay = document.getElementById("rhex");

  function updateRegisterUI() {
    bitElements.forEach(([btn, index]) => {
      const bitState = (regValue >> index) & 1;
      btn.textContent = bitState;
      btn.classList.toggle("on", !!bitState);
    });
    
    hexDisplay.textContent = "0x" + regValue.toString(16).toUpperCase().padStart(4, "0") + " = " + regValue;
  }

  for (let i = 15; i >= 0; i--) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bit" + (i % 4 == 3 && i != 15 ? " gap" : "");
    btn.setAttribute("aria-label", "bit " + i);
    
    btn.onclick = () => {
      regValue ^= 1 << i;
      updateRegisterUI();
    };

    bitsContainer.appendChild(btn);
    bitElements.push([btn, i]);
  }

  updateRegisterUI();
})();

/**
 * معالجة نموذج الاتصال (Contact Form)
 */
const contactForm = document.getElementById("cform");
if (contactForm) {
  contactForm.onsubmit = event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    
    location.href = "mailto:" + EMAIL + 
      "?subject=" + encodeURIComponent(formData.get("s") || "Contact") + 
      "&body=" + encodeURIComponent((formData.get("m") || "") + "\n\n" + (formData.get("n") || ""));
  };
}

/**
 * قاموس الترجمة للغة العربية
 */
window.AR = [
  ["Comprendre le processeur", "افهم المعالج، بتًّا بتًّا."],
  ["Un cours d’architecture", "درس هندسة الحواسيب محوَّل إلى صفحات تفاعلية: مخططات الدرس وشروح للمبتدئين وعروض تجرّبها بنفسك."],
  ["Voir les cours$", "تصفّح الدروس"],
  ["À propos$", "حول الموقع"],
  ["Un registre de 16 bits", "مسجل من 16 بت"],
  ["Cliquez sur les bits", "انقر على البتات: كل 4 بتات تعطي رقمًا ست عشريًا."],
  ["Les cours$", "الدروس"],
  ["Voir tous les cours", "كل الدروس"],
  ["Pourquoi ce site", "لماذا هذا الموقع"],
  ["Expliqué simplement", "شرح مبسّط"],
  ["Chaque terme est défini", "كل مصطلح يُعرَّف كما في أول حصة، مع تشبيهات من الحياة اليومية."],
  ["Les schémas du cours", "مخططات الدرس"],
  ["Les pages du PDF", "صفحات الـ PDF مدمجة في كل جزء لتقارنها بالأصل."],
  ["À manipuler", "للتجربة"],
  ["Calculez une adresse", "احسب عنوانًا، أضئ المؤشرات، راقب النواقل: نتعلم بالتجربة."],
  ["Choisissez un chapitre.", "اختر فصلًا. ستُضاف صفحات أخرى مع الوقت."],
  ["Le projet", "المشروع"],
  ["Ce site transforme", "يحوّل هذا الموقع درس هندسة الحواسيب (PDF، شعبة SMI) إلى صفحات ويب تفاعلية. ينطلق من محتوى الدرس: المعالج 8086 وذاكرته المقطّعة ومقاطعاته، ثم المعالج MIPS."],
  ["Pour qui ?", "لمن؟"],
  ["Pour une personne", "لمن يكتشف الموضوع لأول مرة. تبدأ الشروح من الصفر: البت والبايت والست عشري، قبل المسجلات والذاكرة."],
  ["Comment c’est fait", "كيف صُنع؟"],
  ["Du HTML, du CSS", "HTML وCSS وJavaScript بسيطة بلا إطار عمل ولا خادم. يعمل بالفرنسية والعربية وبالوضعين الفاتح والداكن. وإضافة صفحة جديدة تتم بثلاث خطوات مشروحة في ملف README."],
  ["Limites$", "حدود"],
  ["Les explications sont", "الشروح مكتوبة انطلاقًا من ملف PDF وقد تحتوي على أخطاء: يبقى الدرس الأصلي هو المرجع."],
  ["Contact$", "اتصل بنا"],
  ["Une question, une erreur", "سؤال أو خطأ لاحظته أو فكرة لفصل جديد؟ راسلنا."],
  ["Votre nom$", "اسمك"],
  ["Sujet$", "الموضوع"],
  ["Message$", "الرسالة"],
  ["Envoyer par e-mail$", "أرسل بالبريد الإلكتروني"],
  ["Le bouton ouvre", "يفتح الزر تطبيق البريد لديك. استبدل العنوان في js/site.js."]
];