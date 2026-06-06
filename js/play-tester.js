/**
 * Flux testeurs Google Play — landing GitHub Pages → API Railway → Play Store
 */
(function () {
  "use strict";

  const config = window.PLAY_TESTER_CONFIG || {};
  const form = document.getElementById("playTesterForm");
  if (!form) return;

  const emailInput = document.getElementById("playTesterEmail");
  const submitBtn = document.getElementById("playTesterSubmit");
  const feedbackEl = document.getElementById("playTesterFeedback");
  const defaultBtnHtml = submitBtn ? submitBtn.innerHTML : "";

  function getApiUrl() {
    const base = (config.API_URL || "").replace(/\/$/, "");
    const path = config.ADD_TESTER_PATH || "/add-tester";
    return base + path;
  }

  function getPlayStoreUrl(apiResponse) {
    if (apiResponse && apiResponse.play_store_url) {
      return apiResponse.play_store_url;
    }
    return config.PLAY_STORE_URL || "";
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    emailInput.disabled = isLoading;
    if (isLoading) {
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Inscription en cours…';
    } else {
      submitBtn.innerHTML = defaultBtnHtml;
    }
  }

  function showFeedback(message, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.className = "play-tester-feedback " + (type || "");
    feedbackEl.hidden = !message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    showFeedback("", "");

    const email = (emailInput.value || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      showFeedback("Veuillez saisir une adresse Gmail valide.", "error");
      return;
    }

    const apiUrl = getApiUrl();
    if (!apiUrl || apiUrl.includes("VOTRE-SERVICE")) {
      showFeedback(
        "Configuration incomplète : mettez à jour js/play-tester-config.js (API_URL).",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (_) {
        data = {};
      }

      if (!response.ok) {
        let msg =
          "Impossible de vous inscrire pour le moment. Réessayez plus tard.";
        if (data) {
          if (typeof data.message === "string") msg = data.message;
          else if (typeof data.detail === "string") msg = data.detail;
          else if (data.detail && typeof data.detail.message === "string") {
            msg = data.detail.message;
          }
        }
        showFeedback(msg, "error");
        setLoading(false);
        return;
      }

      const playUrl = getPlayStoreUrl(data);
      if (!playUrl || playUrl.includes("VOTRE.PACKAGE")) {
        showFeedback(
          "Inscription réussie ! Configurez PLAY_STORE_TEST_URL sur Railway ou play-tester-config.js.",
          "success"
        );
        setLoading(false);
        return;
      }

      showFeedback("Redirection vers Google Play…", "success");
      window.setTimeout(function () {
        window.location.href = playUrl;
      }, 600);
    } catch (error) {
      console.error("[play-tester]", error);
      showFeedback(
        "Erreur réseau. Vérifiez votre connexion ou réessayez.",
        "error"
      );
      setLoading(false);
    }
  }

  form.addEventListener("submit", handleSubmit);
})();
