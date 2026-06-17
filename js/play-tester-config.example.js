/**
 * Copiez ce fichier en play-tester-config.js (gitignored) pour le dev local :
 *   cp js/play-tester-config.example.js js/play-tester-config.js
 *
 * En production : l'URL est injectée par GitHub Actions (secret RAAGA_API_URL).
 */
window.PLAY_TESTER_CONFIG = {
  API_URL: "https://VOTRE-SERVICE.up.railway.app",
  SIGNUP_PATH: "/api/public/play-tester-signup/",
};
