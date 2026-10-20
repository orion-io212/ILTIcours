/**
 * إعدادات الروابط والقائمة العلوية
 * كل صف يحتوي على: [معرف الصفحة، اسم الملف، النص بالفرنسية، النص بالعربية]
 */
const NAV = [
  ["home", "index.html", "Accueil", "الرئيسية"],
  ["cours", "cours.html", "Cours", "الدروس"],
  ["about", "about.html", "À propos", "حول"],
  ["contact", "contact.html", "Contact", "اتصل بنا"]
];

(function () {
  const rootDir = document.body.dataset.root || "";
  const currentNav = document.body.dataset.nav;

  // إنشاء الهيدر (Header) وإضافته في بداية الصفحة
  const header = document.createElement("header");
  header.className = "site";
  header.innerHTML = `
    <div class="wrap">
      <a class="logo" href="${rootDir}index.html"><i></i><b>ArchiCours</b></a>
      <nav class="main" aria-label="Menu">
        ${NAV.map(item => `
          <a href="${rootDir}${item[1]}" data-fr="${item[2]}" data-ar="${item[3]}" ${item[0] === currentNav ? 'aria-current="page"' : ""}>
            ${item[2]}
          </a>
        `).join("")}
      </nav>
      <button id="lg" class="alt" type="button" aria-label="Changer de langue / تغيير اللغة">العربية</button>
    </div>
  `;
  document.body.prepend(header);

  // إنشاء تذييل الصفحة (Footer) وإضافته في نهاية الصفحة
  const footer = document.createElement("footer");
  footer.className = "site";
  footer.innerHTML = `
    <div class="wrap">
      <span data-fr="Module Architecture Ordinateur, filière SMI." data-ar="مقياس هندسة الحواسيب، شعبة SMI.">
        Module Architecture Ordinateur, filière SMI.
      </span>
    </div>
  `;
  document.body.append(footer);
})();

/**
 * تحديث النصوص الثابتة في الهيدر والفوتر بناءً على اللغة المتاحة
 */
function shellLang(lang) {
  document.querySelectorAll("[data-fr]").forEach(el => {
    el.textContent = el.dataset[lang];
  });
}

// محرك الترجمة الديناميكي (يعتمد على القاموس المُعرف في window.AR)
const DICT = window.AR || [];
let currentLang = "fr";
const translationStore = new Map();

// محددات العناصر التي سيتم تطبيق الترجمة عليها
const SELECTORS = "h1, h2, h3, p, small, summary, label, button, nav:not(.main) a, figcaption, .tip, .chip b, .t, .mem div, .trk span, .tx";

/**
 * البحث عن الترجمة المناسبة للنص في القاموس
 */
function getArabicTranslation(text) {
  text = text.trim();
  for (const [key, value] of DICT) {
    if (key.endsWith("$")) {
      if (text === key.slice(0, -1)) return value;
    } else if (text.startsWith(key)) {
      return value;
    }
  }
  return null;
}

/**
 * حفظ النص الأصلي وتطبيق الترجمة الجديدة
 */
function storeAndApply(element, arabicText) {
  if (element.tagName === "LABEL") {
    const textNode = element.firstChild;
    if (textNode && textNode.nodeType === 3) {
      translationStore.set(element, { textNode, fr: textNode.nodeValue });
      textNode.nodeValue = arabicText;
    }
  } else {
    translationStore.set(element, { fr: element.innerHTML, ar: arabicText });
    element.textContent = arabicText;
  }
}

/**
 * ترجمة محتوى الصفحة إلى العربية
 */
function translateToArabic() {
  if (currentLang !== "ar") return;

  // ترجمة العناصر المحددة
  document.querySelectorAll(SELECTORS).forEach(el => {
    if (el.id === "lg") return;

    if (el.tagName === "LABEL") {
      const textNode = el.firstChild;
      if (textNode && textNode.nodeType === 3) {
        const arabic = getArabicTranslation(textNode.nodeValue);
        if (arabic && textNode.nodeValue !== arabic) {
          storeAndApply(el, arabic);
        }
      }
      return;
    }

    const arabic = getArabicTranslation(el.textContent);
    if (arabic && el.textContent.trim() !== arabic) {
      storeAndApply(el, arabic);
    }
  });

  // ترجمة عناصر الـ details الداخلية
  document.querySelectorAll("details").forEach(detailsEl => {
    detailsEl.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.nodeValue.trim()) {
        const arabic = getArabicTranslation(node.nodeValue);
        if (arabic) {
          translationStore.set(node, { fr: node.nodeValue });
          node.nodeValue = arabic;
        }
      }
    });
  });
}

/**
 * استعادة النصوص الأصلية (الفرنسية)
 */
function restoreOriginalLanguage() {
  translationStore.forEach((record, el) => {
    if (el.nodeType === 3) {
      el.nodeValue = record.fr;
    } else if (record.textNode) {
      record.textNode.nodeValue = record.fr;
    } else if (el.textContent === record.ar) {
      el.innerHTML = record.fr;
    }
  });
  translationStore.clear();
}

/**
 * تغيير لغة الصفحة بالكامل
 */
function setLanguage(lang) {
  currentLang = lang;
  const docElement = document.documentElement;
  
  docElement.lang = lang;
  docElement.dir = lang === "ar" ? "rtl" : "ltr";

  if (lang === "ar") {
    translateToArabic();
  } else {
    restoreOriginalLanguage();
  }

  document.getElementById("lg").textContent = lang === "ar" ? "Français" : "العربية";

  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}

  if (window.onLang) window.onLang(lang);
  shellLang(lang);
}

// ربط زر تغيير اللغة
document.getElementById("lg").onclick = () => setLanguage(currentLang === "ar" ? "fr" : "ar");

// إعادة تطبيق الترجمة عند التفاعل أو إدخال بيانات جديدة
["click", "input"].forEach(eventType => {
  document.addEventListener(eventType, () => setTimeout(translateToArabic, 0));
});

// التحقق من اللغة المحفوظة مسبقاً وتطبيقها
try {
  if (localStorage.getItem("lang") === "ar") {
    setLanguage("ar");
  }
} catch (e) {}

shellLang(currentLang);
if (window.onLang) window.onLang(currentLang);