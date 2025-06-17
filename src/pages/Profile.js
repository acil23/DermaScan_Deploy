import { supabase } from "./skinAnalysis.js";
import { showPopup } from "../components/popup.js";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return `
    <main class="bg-gray-50 min-h-screen py-12 px-4 flex justify-center">
      <div class="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Profile Info -->
        <aside class="col-span-1 flex flex-col items-center text-center">
          <img src="assets/avatar.png" alt="Avatar" class="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300" />
          <h2 class="text-lg font-semibold text-gray-800">${user.name}</h2>
          <p class="text-sm text-gray-500 mb-4">${user.email}</p>
          <div class="flex flex-col gap-2 w-full px-6">
            <button onclick="navigateToEditProfile()" id="edit-profile-btn" class="bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition">Edit Profile</button>
            <button id="logout-btn" class="bg-gray-200 text-gray-700 text-sm py-2 rounded-md hover:bg-gray-300 transition">Logout</button>
          </div>
        </aside>

        <!-- Diagnosis History -->
        <section class="col-span-2">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Diagnosis History</h3>
          <div class="flex flex-col gap-6" id="diagnosis-history-list">
              <p class="text-gray-500 text-sm">Loading history...</p>
          </div>
        </section>

      </div>
    </main>
  `;
};

function renderDiagnosis(title, date, desc, imagePath, id) {
  return `
    <div class="relative bg-white/80 backdrop-blur-md p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:ring-1 hover:ring-indigo-300 transition group overflow-hidden">
      <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-400 rounded-l-xl"></div>
      <div class="flex flex-col sm:flex-row items-start gap-4 pl-4">
        <img src="${imagePath}" alt="${title}" class="w-20 h-20 sm:w-20 sm:h-20 w-full max-w-[80px] object-cover rounded-lg border border-gray-300 shadow-sm group-hover:scale-105 transition" />
        <div class="flex-1 max-w-full">
          <p class="text-lg font-semibold text-gray-800">${title}
            <span class="text-xs text-gray-500 ml-2">${date}</span>
          </p>
          <p class="text-sm text-gray-600 mt-1 leading-relaxed">${desc}</p>
        </div>
        <button class="text-red-600 hover:text-red-800 font-semibold delete-btn" data-id="${id}">Delete</button>
      </div>
    </div>
  `;
}

export const setupProfileEvents = async () => {
  if (location.hash !== "#/profile") return;

  const listContainer = document.getElementById("diagnosis-history-list");

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      listContainer.innerHTML = `<p class="text-sm text-gray-500">Please login first.</p>`;
      return;
    }

    const { data: history, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", user.id) // ← ini yang diganti
      .order("timestamp", { ascending: false });
    console.log(history.length);

    if (error) throw error;

    if (!history || history.length === 0) {
      listContainer.innerHTML = `<p class="text-sm text-gray-500">No diagnosis history found.</p>`;
      return;
    }

    listContainer.innerHTML = history
      .map((entry) => {
        const date = new Date(entry.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        return renderDiagnosis(
          entry.label,
          date,
          entry.explanation || "No explanation provided.",
          entry.image_url || "../assets/logo3.png",
          entry.id // jika kamu ingin pakai tombol delete
        );
      })
      .join("");
  } catch (error) {
    console.error("Error fetching history:", error);
    listContainer.innerHTML = `<p class="text-sm text-red-500">Failed to load diagnosis history.</p>`;
  }

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;

      if (!confirm("Are you sure you want to delete this entry?")) return;

      const originalText = button.innerHTML;
      button.innerHTML = `<span class="flex items-center gap-1">
    <svg class="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    Deleting...
  </span>`;
      button.disabled = true;

      try {
        const res = await fetch(`${BACKEND_API_URL}/history/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        setupProfileEvents(); // refresh ulang list
      } catch (err) {
        console.error("Error deleting entry:", err);
        showPopup("Failed to delete entry", "error");

        // Restore tombol
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  });

  // Tombol logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmLogout = confirm("Yakin ingin logout?");
      if (confirmLogout) {
        localStorage.removeItem("user"); // Hapus sesi user
        showPopup("Logout berhasil!", "success");
        window.location.hash = "/login"; // Redirect ke login page
      }
    });
  }
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    showPopup("Silakan login terlebih dahulu.", "error");
    window.location.hash = "/login";
    return;
  }
};

window.navigateToEditProfile = () => {
  window.location.href = "#/edit-profile";
};

export default Profile;
