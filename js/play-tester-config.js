/**
 * Configuration du flux testeurs Play Store.
 * Mettez à jour ces valeurs avant déploiement sur GitHub Pages.
 */
window.PLAY_TESTER_CONFIG = {
  // URL publique de l'API Railway (sans slash final)
  API_URL: "https://VOTRE-SERVICE.up.railway.app",

  // Lien opt-in test fermé (fallback si l'API ne renvoie pas play_store_url)
  PLAY_STORE_URL:
    "https://play.google.com/apps/testing/VOTRE.PACKAGE.ID",

  // Endpoint relatif ajouté à API_URL
  ADD_TESTER_PATH: "/add-tester",
};
