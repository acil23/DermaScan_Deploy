
let allDiseases = [];
let activeFilter = "All";
let hasFetchedData = false;

const renderArticleCards = (filteredData) => {
  const container = document.getElementById("disease-article-list");
  if (!container) return;

  if (filteredData.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500">Tidak ada artikel yang cocok dengan filter "${activeFilter}".</p>`;
    return;
  }

  container.innerHTML = filteredData
    .map(
      (disease) => `
    <article class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl group">
      <div class="h-48 w-full bg-gray-200 overflow-hidden">
        <img src="${disease.image}" alt="${disease.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">${disease.title}</h2>
        <p class="text-gray-700 text-sm mb-4 flex-grow">${disease.description}</p>
        <a href="#/education/${disease.id}" class="text-sm text-blue-600 hover:text-blue-800 font-medium self-start">Read More</a>
      </div>
    </article>
  `
    )
    .join("");
};

const initFilterEventListeners = () => {
  const filterContainer = document.querySelector(".filter-buttons-container");
  if (filterContainer) {
    filterContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const newFilter = e.target.dataset.filter;

        if (newFilter === activeFilter) return;

        activeFilter = newFilter;

        filterContainer.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("bg-blue-600", "text-white");
          btn.classList.add("bg-gray-200", "text-gray-700");
        });
        e.target.classList.add("bg-blue-600", "text-white");
        e.target.classList.remove("bg-gray-200", "text-gray-700");

        const filteredDiseases =
          activeFilter === "All"
            ? allDiseases
            : allDiseases.filter((disease) =>
                disease.tags.includes(activeFilter)
              );

        renderArticleCards(filteredDiseases);
      }
    });
  }
};

const Education = async () => {
  if (!hasFetchedData) {
    try {
      const response = await fetch("data/diseases-data.json");
      if (!response.ok) throw new Error("Gagal mengambil data");
      allDiseases = await response.json();
      hasFetchedData = true;
    } catch (error) {
      console.error("Error fetching diseases data:", error);
      return `
        <main class="p-8 text-center"><p class="text-red-500">Gagal memuat konten edukasi.</p></main>
      `;
    }
  }

  const allTags = ["All", ...new Set(allDiseases.flatMap((d) => d.tags))];

  const filterButtonsHTML = allTags
    .map((tag) => {
      const isActive = tag === activeFilter;
      const activeClasses = "bg-blue-600 text-white";
      const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";
      return `
      <button 
        class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}"
        data-filter="${tag}"
      >
        ${tag}
      </button>
    `;
    })
    .join("");

  setTimeout(initFilterEventListeners, 0);

  return `
    <main class="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-8 filter-buttons-container">
          ${filterButtonsHTML}
        </div>
        <div id="disease-article-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <p class="col-span-full text-center text-gray-500">Loading articles...</p>
        </div>
      </div>
    </main>
  `;
};

const EducationPage = async () => {
  activeFilter = "All";

  const pageSkeleton = await Education();

  setTimeout(() => renderArticleCards(allDiseases), 0);

  return pageSkeleton;
};

export default EducationPage;
