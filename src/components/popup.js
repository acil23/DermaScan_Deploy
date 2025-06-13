export const showPopup = (message, type = "error") => {
  // Hapus popup sebelumnya jika ada
  const existingPopup = document.getElementById("popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Buat elemen popup
  const popup = document.createElement("div");
  popup.id = "popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.backgroundColor = type === "error" ? "#f44336" : "#4caf50"; // Merah untuk error, hijau untuk sukses
  popup.style.color = "#fff";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  popup.style.zIndex = "1000";
  popup.style.fontSize = "14px";
  popup.style.textAlign = "center";
  popup.innerText = message;

  // Tambahkan popup ke body
  document.body.appendChild(popup);

  // Hapus popup setelah 3 detik
  setTimeout(() => {
    popup.remove();
  }, 3000);
};
