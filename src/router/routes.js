import Home from "../pages/Home.js";
import Analysis, { setupAnalysisEvents } from "../pages/skinAnalysis.js";
import EducationPage from "../pages/Education.js";
import Profile, { setupProfileEvents } from "../pages/Profile.js";
import About from "../pages/About.js";
import LoginPage, { setupLoginForm } from "../pages/Login.js";
import RegisterPage, { setupRegisterForm } from "../pages/Register.js";
import EditProfile from "../pages/EditProfile.js";
import EducationDetails from "../pages/education-details.js";

const routes = {
  "/": { render: Home },
  "/analysis": { render: Analysis, setup: setupAnalysisEvents },
  "/education": { render: EducationPage },
  "/profile": { render: Profile, setup: setupProfileEvents },
  "/about": { render: About },
  "/login": { render: LoginPage, setup: setupLoginForm },
  "/register": { render: RegisterPage, setup: setupRegisterForm },
  "/edit-profile": { render: EditProfile },
};

const router = async () => {
  const path = location.hash.slice(1) || "/";
  let viewObj;

  if (path.startsWith("/education/")) {
    viewObj = { render: EducationDetails };
  } else {
    viewObj = routes[path] || { render: Home };
  }

  const appElement = document.getElementById("app");
  if (!appElement) {
    console.error("Element with ID 'app' not found.");
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      appElement.innerHTML = '<p class="text-center p-8">Loading page...</p>';
      const viewHtml = await viewObj.render();
      appElement.innerHTML = viewHtml;

      if (typeof viewObj.setup === "function") {
        viewObj.setup();
      }
    });
  } else {
    // Fallback jika browser belum mendukung
    appElement.innerHTML = '<p class="text-center p-8">Loading page...</p>';
    const viewHtml = await viewObj.render();
    appElement.innerHTML = viewHtml;

    if (typeof viewObj.setup === "function") {
      viewObj.setup();
    }
  }
};

export default router;
