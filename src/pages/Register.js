import Header2 from "../components/Header2.js";
import Footer from "../components/footer.js";
import { showPopup } from "../components/popup.js";

const RegisterPage = () => {
  return `
    ${Header2()}
    <div class="bg-gray-100 flex flex-col justify-start items-center pt-20 px-4 pb-20">
      <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div class="flex flex-col items-center mb-6">
          <img src="assets/logo3.png" alt="Logo" class="w-20 mb-2" />
          <h2 class="text-xl font-semibold text-gray-800">Create Account</h2>
        </div>
        <form id="register-form">
          <div class="mb-4 text-left">
            <label for="name-input" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name-input" name="name" placeholder="Your Name"
              class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm focus:ring focus:ring-indigo-200" required />
          </div>
          <div class="mb-4 text-left">
            <label for="email-input" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email-input" name="email" placeholder="you@email.com"
              class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm focus:ring focus:ring-indigo-200" required />
          </div>
          <div class="mb-4 text-left">
            <label for="password-input" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password-input" name="password" placeholder="********"
              class="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm focus:ring focus:ring-indigo-200" required />
          </div>
          <button type="submit"
          id="register-page-btn"
            class="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition">Register</button>
        </form>
        <p class="mt-9 text-sm text-center text-gray-500">Already have an account?
          <a href="#/login" class="text-gray-800 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
    ${Footer()}
  `;
};

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export const setupRegisterForm = () => {
  // console.log("Disini Aman 1");
  if (location.hash === "#/register") {
    const form = document.getElementById("register-form");
    // console.log("Disini Aman 2");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // console.log("Disini Aman 3");
        const name = document.getElementById("name-input").value;
        const email = document.getElementById("email-input").value;
        const password = document.getElementById("password-input").value;

        if (!name || !email || !password) {
          showPopup("Semua kolom harus diisi", "error"); // Ganti alert dengan showPopup
          return;
        }

        try {
          // const res = await fetch("https://delightful-fascination-production.up.railway.app/register", {
          const res = await fetch(`${BACKEND_API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          console.log("Disini Aman 5");
          const data = await res.json();

          if (!res.ok) {
            showPopup(data.error || "Registrasi gagal", "error"); // Ganti alert dengan showPopup
            return;
          }

          showPopup("Registrasi berhasil!", "success"); // Ganti alert dengan showPopup
          window.location.hash = "/login";
        } catch (err) {
          showPopup("Terjadi kesalahan saat registrasi", "error"); // Ganti alert dengan showPopup
          console.error(err);

        }
      });
    }
  }
};

export default RegisterPage;
