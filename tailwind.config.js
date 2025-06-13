/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Pastikan path ini sesuai dengan struktur proyek Anda
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Di sini tempat Anda menambahkan kustomisasi tema, misalnya warna atau font
      colors: {
        primary_100: '#B6C3DA', // beri nama sesuai keinginan
        secondary_200: '#B6CAE2', // beri nama sesuai keinginan
      },
    },
  },
  plugins: [
    // Untuk Tailwind v4, @tailwindcss/typography tidak perlu didaftarkan di sini.
    // Plugin ini diimpor langsung di file CSS Anda.
  ],
};
