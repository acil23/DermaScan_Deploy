import Header from "../components/header.js";
import Footer from "../components/footer.js";

// FUNGSI BANTUAN: Untuk merender satu bagian (seperti Gejala, Penyebab, dll)
const renderSection = (title, items) => {
  // Jika tidak ada data di array, jangan tampilkan apa-apa
  if (!items || items.length === 0) {
    return "";
  }

  // Ubah setiap item di array menjadi elemen paragraf <p>
  const contentHTML = items
    .map(
      (item) =>
        `<p>${item.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</p>`
    )
    .join("");

  return `
    <div class="mt-6">
      <h3 class="text-xl font-bold text-gray-800 mb-3">${title}</h3>
      <div class="space-y-3 text-gray-700">
        ${contentHTML}
      </div>
    </div>
  `;
};

const EducationDetails = async () => {
  const pathParts = location.hash.slice(1).split("/");
  const diseaseId = parseInt(pathParts[2], 10);

  let disease;
  let diseasesData = [];
  try {
    const response = await fetch("/data/diseases-data.json");
    if (!response.ok) throw new Error("Gagal mengambil data");
    diseasesData = await response.json();
    disease = diseasesData.find((d) => d.id === diseaseId);
  } catch (error) {
    console.error("Error fetching details data:", error);
  }

  if (!disease) {
    // ... (Kode 'Tidak Ditemukan' tetap sama)
    return `
      ${Header()}
      <main class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <a href="#/education" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">← Kembali ke List Penyakit</a>
          <div class="text-center mt-10"><h1 class="text-3xl font-bold">Penyakit Tidak Ditemukan</h1></div>
        </div>
      </main>
      ${Footer()}
    `;
  }

  const relatedArticlesHTML = diseasesData
    .filter(
      (otherDisease) =>
        otherDisease.id !== disease.id &&
        disease.tags.some((tag) => otherDisease.tags.includes(tag))
    )
    .slice(0, 3)
    .map(
      (related) => `
      <a href="#/education/${related.id}" class="block bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
        <div class="h-36 bg-gray-200 overflow-hidden"><img src="${related.image}" alt="${related.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"></div>
        <div class="p-4"><span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">${related.tags[0]}</span><h4 class="mt-2 font-semibold text-gray-800 group-hover:text-blue-600">${related.title}</h4></div>
      </a>
    `
    )
    .join("");

  return `
    ${Header()}
    <div class="header-article pl-6 bg-white py-3">
      <a href="#/education" class="inline-flex items-center text-sm text-gray-700 hover:text-blue-600 font-bold">
        <svg class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        Back to Education
      </a>
    </div>
    <main class="bg-white-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-4xl mx-auto">
          <article class="article-detail-view bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <span class="text-sm text-gray-500">Selasa, 10 Juni 2025</span>
              <span class="text-xs sm:text-sm text-white bg-blue-600 px-3 py-1 rounded-full font-semibold">${disease.tags[0]}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">${disease.title}</h1>
            <div class="w-full h-56 sm:h-72 lg:h-96 bg-gray-200 rounded-lg mb-8 flex justify-center items-center overflow-hidden">
  <img src="${disease.image}" alt="${disease.title}" class="max-w-full max-h-full object-contain">
</div>
            
            <div class="text-left space-y-4">
              <p class="text-lg text-gray-700">${disease["detailed-desc"]}</p>
              
              ${renderSection("Gejala", disease.gejala)}
              ${renderSection("Penyebab", disease.penyebab)}
              ${renderSection("Cara Penanganan", disease.cara_penanganan)}

              <div class="mt-8 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-800">
                <p class="font-bold">Penting!</p>
                <p class="mt-1">Informasi yang disajikan di sini bersifat umum dan tidak dapat menggantikan konsultasi medis profesional. Untuk diagnosis yang akurat dan penanganan terbaik, segera konsultasikan kondisi Anda dengan dokter atau ahli dermatologi.</p>
              </div>
            </div>
          </article>
          <footer class="mt-12 pt-8 border-t border-gray-200">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">Related Articles</h2>
            ${
              relatedArticlesHTML.length > 0
                ? `<div class="article-detail-view grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${relatedArticlesHTML}</div>`
                : '<p class="text-gray-500">Tidak ada artikel terkait yang ditemukan.</p>'
            }
          </footer>
        </div>
      </div>
    </main>
    ${Footer()}
  `;
};

export default EducationDetails;
