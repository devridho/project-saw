let kriteria = [], bobot = [], tipe = [], alternatif = [];

function bukaInputNilai() {
  // Ambil input dari form
  kriteria = document.getElementById("kriteria").value.split(',').map(k => k.trim());
  bobot = document.getElementById("bobot").value.split(',').map(Number);
  tipe = document.getElementById("tipe").value.split(',').map(t => t.trim().toLowerCase());
  alternatif = document.getElementById("alternatif").value.split(',').map(a => a.trim());

  // Tampilkan popup konfirmasi sebelum lanjut input nilai
  document.getElementById("popupModal").style.display = "flex";
}

function tutupPopup() {
  document.getElementById("popupModal").style.display = "none";
}

function lanjutKeFormNilai() {
  const form = document.getElementById("nilaiForm");
  form.innerHTML = "";

  alternatif.forEach((alt, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${alt}</strong><br>`;
    for (let j = 0; j < kriteria.length; j++) {
      div.innerHTML += `<input type="text" name="nilai_${i}_${j}" placeholder="${kriteria[j]}" required><br>`;
    }
    form.appendChild(div);
    form.appendChild(document.createElement("hr"));
  });

  document.getElementById("popupModal").style.display = "none";
  document.getElementById("nilaiInputArea").style.display = "block";
}

function hitungSAW() {
  const nilai = {};

  // Ambil nilai input
  for (let i = 0; i < alternatif.length; i++) {
    nilai[alternatif[i]] = [];
    for (let j = 0; j < kriteria.length; j++) {
      const input = document.querySelector(`[name="nilai_${i}_${j}"]`).value;
      const val = parseFloat(input);
      nilai[alternatif[i]].push(isNaN(val) ? 0 : val);
    }
  }

  // Normalisasi nilai
  for (let j = 0; j < kriteria.length; j++) {
    const kolom = alternatif.map(alt => nilai[alt][j]);
    if (tipe[j] === "benefit") {
      const max = Math.max(...kolom);
      alternatif.forEach(alt => {
        nilai[alt][j] = max !== 0 ? nilai[alt][j] / max : 0;
      });
    } else if (tipe[j] === "cost") {
      const min = Math.min(...kolom);
      alternatif.forEach(alt => {
        nilai[alt][j] = nilai[alt][j] !== 0 ? min / nilai[alt][j] : 0;
      });
    }
  }

  // Hitung skor akhir
  const hasil = {};
  alternatif.forEach(alt => {
    hasil[alt] = nilai[alt].reduce((acc, val, idx) => acc + val * bobot[idx], 0);
  });

  // Tentukan alternatif terbaik
  const terbaik = Object.keys(hasil).reduce((a, b) => hasil[a] > hasil[b] ? a : b);

  // Tampilkan hasil ke dalam popup
  let resultText = "Hasil Akhir (Skor):\n";
  for (let [alt, skor] of Object.entries(hasil)) {
    resultText += `${alt}: ${skor.toFixed(4)}\n`;
  }
  resultText += `\nAlternatif Terbaik: ${terbaik}`;

  document.getElementById("popupHasilText").innerText = resultText;
  document.getElementById("resultModal").style.display = "flex";
}

function tutupPopupHasil() {
  document.getElementById("resultModal").style.display = "none";
}
