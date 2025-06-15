import Header from "../components/header.js";
import Footer from "../components/footer.js";
import initHeaderEvents from "../components/headerEvents.js";

/**
 * @param {Function} PageContent - fungsi render halaman
 * @param {boolean} useLayout - apakah pakai header/footer atau tidak
 */
const renderPage = async (PageContent, useLayout = true) => {
  const app = document.getElementById("app");

  if (!app) {
    console.error("Element #app not found!");
    return;
  }

  const pageHtml = await PageContent();

  if (useLayout) {
    app.innerHTML = `
      ${Header()}
      ${pageHtml}
      ${Footer()}
    `;
    initHeaderEvents();
  } else {
    // Halaman seperti login/register dengan layout sendiri
    app.innerHTML = pageHtml;
  }
};

export default renderPage;
