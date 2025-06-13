
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import { createClient } from "@supabase/supabase-js";
import { showPopup } from "../components/popup.js";

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi upload gambar ke Supabase Storage
const uploadImageToSupabase = async (file, filename) => {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`user-uploads/${filename}`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  console.log("Upload result:", { data, error });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("images")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
};

const Analysis = () => {
  return `
    ${Header()}
    <main class="analysis-container">
      <section class="inner-analysis">
        <div class="analysis-content">
          <section class="upload-section" id="upload-section">
            <h2>Upload Skin Photo</h2>
            <div class="upload-box" id="upload-box">
              <input type="file" id="photo-input" accept="image/*" hidden />
              <label for="photo-input" class="upload-label" id="drop-area">
                <img src="/assets/upload-icon.png" alt="Upload" />
                <p><span>Drag & Drop</span> or <span class="browse">Browse</span> to upload</p>
              </label>
              <div class="preview-box hidden" id="preview-box">
                <img id="preview-image" src="" alt="Preview" />
              </div>
              <div class="button-group" id="upload-buttons">
                <button id="open-camera" class="camera-btn">
                  <img src="/assets/camera-icon.png" alt="Camera Icon" />
                </button>

                <div class="button-row">
                  <button id="change-image" class="hidden">Change Image</button>
                  <button id="submit-analysis">Submit for Analysis</button>
                </div>
              </div>
            </div>
          </section>

          <section class="result-section hidden" id="result-section">
            <h2>Diagnosis Result</h2>
            <div class="preview-box" id="preview-box-result"></div>
            <div id="diagnosis-info">
              <p><strong>Detected Condition:</strong><br> - </p>
              <p><strong>Explanation:</strong><br> - </p>
              <p><strong>Suggested Treatment:</strong><br> - </p>
            </div>
            <button id="save-result">Save to Profile</button>
          </section>
        </div>
      </section>
    </main>
    ${Footer()}
  `;
};

export const setupAnalysisEvents = () => {
  console.log("setupAnalysisEvents dijalankan");
  if (location.hash !== "#/analysis") return;

  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("photo-input");
  console.log("photo-input:", fileInput);
  const previewBox = document.getElementById("preview-box");
  const previewImage = document.getElementById("preview-image");
  const changeBtn = document.getElementById("change-image");
  const submitBtn = document.getElementById("submit-analysis");
  const resultSection = document.getElementById("result-section");
  const previewBoxResult = document.getElementById("preview-box-result");
  const label = document.querySelector(".upload-label");
  const cameraBtn = document.getElementById("open-camera");
  const saveResultBtn = document.getElementById("save-result");
  const diagnosisInfo = document.getElementById("diagnosis-info");

  let uploadedImage = "";


  // Tampilkan preview saat upload
  const showPreview = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      uploadedImage = e.target.result;

      previewBox.classList.remove('hidden');
      changeBtn.classList.remove('hidden');
      label.classList.add('hidden');
      cameraBtn.classList.add('full-width');
    };
    reader.readAsDataURL(file);
  };

  // Input file manual
  console.log('Menambahkan event listener ke photo-input');
  fileInput.addEventListener('change', (e) => {
    console.log('File dipilih:', e.target.files[0]);
    if (e.target.files.length > 0) {
      showPreview(e.target.files[0]);
    }
  });

  // Tombol ganti gambar
  changeBtn.addEventListener('click', () => {
    fileInput.value = '';
    uploadedImage = '';
    previewImage.src = '';
    previewBox.classList.add('hidden');
    changeBtn.classList.add('hidden');
    label.classList.remove('hidden');
    cameraBtn.classList.remove('full-width');
  });

  // Drag & Drop
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;

      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    }
  });

  // Submit Analisis
  submitBtn.addEventListener("click", async () => {
    const file = document.getElementById("photo-input").files[0];
    if (!file) {
      showPopup("Please upload a photo first.", "error");
      return;
    }

    resultSection.classList.remove("hidden");
    previewBoxResult.innerHTML = `
    <img src="${uploadedImage}" alt="Result" style="max-width:100%; border-radius: 4px;" />
  `;

    const formData = new FormData();
    formData.append("image", file);

    try {
      // const res = await fetch("https://delightful-fascination-production.up.railway.app/predict", {
      const res = await fetch(`${BACKEND_API_URL}/predict`, {
        method: "POST",
        body: formData, // Kirim form-data
      });

      if (!res.ok) throw new Error("Failed to fetch prediction");

      const data = await res.json();

      // Tampilkan hasil prediksi, penjelasan, dan pengobatan
      diagnosisInfo.innerHTML = `
      <p><strong>Detected Condition:</strong><br> ${data.prediction}</p>
      <p><strong>Explanation:</strong><br> ${data.explanation}</p>
      <p><strong>Suggested Treatment:</strong><br> ${data.treatment}</p>
    `;
    } catch (err) {
      console.error("Prediction error:", err);
      diagnosisInfo.innerHTML = `<p class="text-red-500">Failed to load prediction result.</p>`;
    }
  });

  saveResultBtn.addEventListener("click", async () => {
    if (!uploadedImage) {
      showPopup("Please upload a photo first.", "error");
      // alert("Please upload a photo first.");
      return;
    }

    // Ambil data user dari localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      showPopup("User tidak ditemukan. Silakan login ulang.", "error");
      // alert("User tidak ditemukan. Silakan login ulang.");
      return;
    }
    if (!uploadedImage) {
      alert("Please upload a photo first.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Anda belum login. Silakan login terlebih dahulu.");
        return;
      }

      // Kirim file ke backend untuk analisis
      const formData = new FormData();
      formData.append("image", fileInput.files[0]); // Gunakan key "image" sesuai dengan yang diharapkan backend

      const analyzeResponse = await fetch("http://localhost:9001/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`, // Gunakan token dari localStorage
        },
        body: formData, // FormData akan secara otomatis menetapkan Content-Type
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze image");
      }

      const { data } = await analyzeResponse.json();
      const { disease } = data;
      console.log("Analysis result:", data);

      // Ambil explanation dan treatment dari tabel dataDiseases
      const diseaseInfoResponse = await fetch(
        `http://localhost:9001/disease-info?disease=${encodeURIComponent(disease)}`
      );

      if (!diseaseInfoResponse.ok) {
        throw new Error("Failed to fetch disease information");
      }

      const { data: diseaseInfo } = await diseaseInfoResponse.json();

      // Tampilkan hasil diagnosa
      resultSection.classList.remove("hidden");
      previewBoxResult.innerHTML = `
        <img src="${uploadedImage}" alt="Result" style="max-width:100%; border-radius: 4px;" />
      `;

      // Update informasi diagnosa
      const diagnosisInfo = document.getElementById("diagnosis-info");
      diagnosisInfo.innerHTML = `
        <p><strong>Detected Condition:</strong><br> ${disease}</p>
        <p><strong>Explanation:</strong><br> ${diseaseInfo.explanation}</p>
        <p><strong>Suggested Treatment:</strong><br> ${diseaseInfo.treatment}</p>
      `;
    } catch (err) {
      console.error(err.message);
      alert("An error occurred. Please try again.");
    }

    const file = document.getElementById("photo-input").files[0];
    const imageUrl = await uploadImageToSupabase(
      file,
      `user-${user.id}-${Date.now()}.jpg`,
    );

    // Ambil info diagnosis
    const detectedLabel =
      diagnosisInfo
        .querySelector("p:nth-child(1)")
        .textContent.split(":")[1]
        ?.trim() || "-";

    const explanation =
      diagnosisInfo
        .querySelector("p:nth-child(2)")
        .textContent.split(":")[1]
        ?.trim() || "-";

    const treatment =
      diagnosisInfo
        .querySelector("p:nth-child(3)")
        .textContent.split(":")[1]
        ?.trim() || "-";

    // Buat payload dengan userId
    const payload = {
      label: detectedLabel,
      explanation: `${explanation} ${treatment}`,
      imageUrl,
      userId: user.id, // ← kirim user id
    };

    try {
      const res = await fetch(`${BACKEND_API_URL}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      showPopup("Saved to profile successfully!", "success");
      // alert("Saved to profile successfully!");
    } catch (err) {
      console.error("Error saving to profile:", err); // ← PENTING!
      showPopup("Failed to save: " + (err.message || JSON.stringify(err)), "error");
      // alert("Gagal menyimpan: " + (err.message || JSON.stringify(err)));
    }

    // Reset form
    fileInput.value = "";
    uploadedImage = "";
    previewImage.src = "";
    previewBox.classList.add("hidden");
    changeBtn.classList.add("hidden");
    label.classList.remove("hidden");
    cameraBtn.classList.remove("full-width");
    resultSection.classList.add("hidden");
  });
}

export default Analysis;
