// ✅ script.js (نهائي وخفيف)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------------- Firebase Config ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyD3bWxidID9NovC4RIQxUI4fKOqAql2K58",
  authDomain: "medyourprofiles.firebaseapp.com",
  projectId: "medyourprofiles",
  storageBucket: "medyourprofiles.appspot.com",
  messagingSenderId: "250236138150",
  appId: "1:250236138150:web:10619e4a0c0b2aeb75ba67"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ---------------- Helpers ---------------- */
const $ = (sel) => document.querySelector(sel);
const ensureHttp = (url) =>
  !url ? "" : /^https?:\/\//i.test(url) ? url : `https://${url}`;
const getId = () => new URLSearchParams(location.search).get("id")?.trim();

/* ---------------- Fetch card ---------------- */
async function fetchCard(id) {
  if (!id) return null;

  // أولاً جرّب document ID مباشر
  let snap = await getDoc(doc(db, "business_cards", id));
  if (snap.exists()) return { id: snap.id, ...snap.data() };

  // fallback: جرب legacyId
  const q = query(collection(db, "business_cards"), where("legacyId", "==", id));
  const res = await getDocs(q);
  if (!res.empty) return { id: res.docs[0].id, ...res.docs[0].data() };

  return null;
}

/* ---------------- Render UI ---------------- */
function render(card) {
  if (!card) return alert("Card not found.");

  const name = card.name || "Unnamed";
  const title = card.title || "—";
  const email = card.email || "ak@medyour.com";
  const phone1 = card.phone1 || "+20 105 600 7500";
  const phone2 = card.phone2 || "+20 105 500 7600";
  const website = ensureHttp(card.website || "https://www.medyour.com");

  document.title = `${name} | ${title}`;
  $("#profile-name")?.textContent = name;
  $("#profile-title")?.textContent = title;

  $("#contact-link")?.setAttribute(
    "href",
    card.vcfFilename ? `image/vcards/${card.vcfFilename}` : "#"
  );

  $("#mail-icon")?.setAttribute("href", `mailto:${email}`);

  // Contacts
  const contact = $("#contact-card");
  if (contact) {
    contact.innerHTML = `
      <a href="tel:${phone1}">${phone1}</a>
      <a href="tel:${phone2}">${phone2}</a>
      <a href="mailto:${email}">${email}</a>
    `;
  }

  // Socials
  const socials = [
    ensureHttp(card.instagram || "https://www.instagram.com/medyouregypt/"),
    ensureHttp(card.facebook || "https://www.facebook.com/profile.php?id=61576602431934"),
    ensureHttp(card.linkedin || "https://www.linkedin.com/company/medyouregypt/"),
    ensureHttp(card.twitter || "https://x.com/medyouregypt")
  ];
  document.querySelectorAll(".social-link").forEach((a, i) => (a.href = socials[i]));

  // Website
  const webLink = $("#website-link");
  const webDesc = $("#website-desc");
  if (webLink) {
    webLink.href = website;
    webLink.textContent = website.replace(/^https?:\/\//i, "");
  }
  if (webDesc) {
    webDesc.textContent =
      card.shortDescription ||
      card.description ||
      "Medyour — reliable, high-quality digital healthcare platform.";
  }

  // QR Download
  $("#download-qr-btn")?.addEventListener("click", () => {
    if (!card.qrFilename) return alert("QR not available.");
    const a = document.createElement("a");
    a.href = `image/qr-codes/${card.qrFilename}`;
    a.download = card.qrFilename;
    a.click();
  });
}

/* ---------------- Start ---------------- */
window.addEventListener("DOMContentLoaded", async () => {
  const overlay = $("#landing-overlay");
  setTimeout(() => {
    if (overlay) overlay.style.display = "none";
  }, 2000);

  const id = getId();
  const card = await fetchCard(id);
  render(card);
});
