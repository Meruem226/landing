/**
 * Modal testeur Play Store — landing GitHub Pages → API Django Railway.
 */
(function () {
  "use strict";

  function resolveConfig() {
    const fromScript = window.PLAY_TESTER_CONFIG || {};
    const metaBase = document
      .querySelector('meta[name="raaga-api-base"]')
      ?.getAttribute("content")
      ?.trim();
    return {
      API_URL: fromScript.API_URL || metaBase || "",
      SIGNUP_PATH: fromScript.SIGNUP_PATH || "/api/public/play-tester-signup/",
    };
  }

  const config = resolveConfig();
  const modal = document.getElementById("testerModal");
  const introPanel = document.getElementById("testerIntroPanel");
  const formPanel = document.getElementById("testerFormPanel");
  const successPanel = document.getElementById("testerSuccessPanel");
  const form = document.getElementById("testerSignupForm");
  const feedbackEl = document.getElementById("testerFeedback");
  const submitBtn = document.getElementById("testerSubmitBtn");

  if (!modal) return;

  function apiUrl() {
    const base = (config.API_URL || "").replace(/\/$/, "");
    const path = config.SIGNUP_PATH || "/api/public/play-tester-signup/";
    return base + path;
  }

  function showPanel(panel) {
    [introPanel, formPanel, successPanel].forEach(function (p) {
      if (p) p.hidden = p !== panel;
    });
  }

  function setFeedback(msg, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg || "";
    feedbackEl.className = "tester-feedback" + (type ? " " + type : "");
    feedbackEl.hidden = !msg;
  }

  function openModal(showForm) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    showPanel(showForm ? formPanel : introPanel);
    setFeedback("");
    if (form) form.reset();
    if (showForm) {
      window.setTimeout(function () {
        document.getElementById("testerEmail")?.focus();
      }, 80);
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  window.openTesterModal = openModal;
  window.closeTesterModal = closeModal;

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-tester-download]");
    if (!trigger) return;
    e.preventDefault();
    openModal(false);
  });

  modal.querySelectorAll("[data-tester-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.getElementById("testerContinueBtn")?.addEventListener("click", function () {
    showPanel(formPanel);
    document.getElementById("testerEmail")?.focus();
  });

  document.getElementById("testerBackBtn")?.addEventListener("click", function () {
    showPanel(introPanel);
    setFeedback("");
  });

  form?.addEventListener("submit", async function (e) {
    e.preventDefault();
    setFeedback("");

    const email = (document.getElementById("testerEmail")?.value || "").trim();
    const whatsapp = (document.getElementById("testerWhatsapp")?.value || "").trim();

    if (!email || !whatsapp) {
      setFeedback("Veuillez remplir l'e-mail et le numéro WhatsApp.", "error");
      return;
    }

    const url = apiUrl();
    if (!config.API_URL || url.includes("VOTRE-SERVICE")) {
      setFeedback("Configuration API manquante. Contactez l'équipe Raaga.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email, whatsapp: whatsapp }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        const errMsg =
          data.email?.[0] ||
          data.whatsapp?.[0] ||
          data.error ||
          data.detail ||
          "Erreur lors de l'envoi. Réessayez.";
        setFeedback(errMsg, "error");
        return;
      }

      showPanel(successPanel);
      const msgEl = document.getElementById("testerSuccessMessage");
      if (msgEl) {
        msgEl.textContent =
          data.message ||
          "Merci ! Nous vous contacterons par e-mail et WhatsApp pour activer votre accès testeur.";
      }
    } catch (err) {
      console.error("[play-tester]", err);
      setFeedback(
        "Impossible de joindre le serveur (accès refusé ou réseau). Réessayez dans un instant.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
    }
  });
})();
