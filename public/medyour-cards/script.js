(function() {
  // --- Profiles data ---
  const profiles = {
    19634721: {
      name: "Ahmed Elkady",
      title: "CEO",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "ak@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },
    78127475: {
      name: "Dr. Rania Elkady",
      title: "COO",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "rk@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },
    87213456: {
      name: "Nader Roshdy",
      title: "COO",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "nr@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },
    56341278: {
      name: "Dr. Ahmed Elsaadany",
      title: "Managing Director",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "as@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },
    10928374: {
      name: "Eng. Ibrahim Hamdy",
      title: "Operations Manager",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "ihs@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },
    78123465: {
      name: "Mohamed Ibrahim",
      title: "Technical Manager",
      phone1: "+20 105 600 7500",
      phone2: "+20 105 500 7600",
      email: "mia@medyour.com",
      instagram: "https://www.instagram.com/medyouregypt/",
      facebook: "https://www.facebook.com/profile.php?id=61576602431934",
      linkedin: "https://www.linkedin.com/company/medyouregypt/",
      twitter: "https://x.com/medyouregypt",
      website: "https://www.medyour.com",
      description: "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers."
    },

  };

  // --- Contact VCF mapping ---
  const vcfFiles = {
    19634721: "AhmedElkady.vcf",
    78127475: "drrania.vcf",
    87213456: "naderroushdy.vcf",
    56341278: "ahmedelsaadany.vcf",
    10928374: "ibrahimhamdy.vcf",
    78123465: "mohamedibrahim.vcf",
  
  };

  // --- QR Code mapping ---
  const qrCodes = {
    19634721: "ceo-ahmed-elkady.png",
    78127475: "coo-rania-elkady.png",
    87213456: "coo-nader-roshdy.png",
    56341278: "md-ahmed-elsaadany.png",
    10928374: "om-ibrahim-hamdy.png",
    78123465: "tm-mohamed-ibrahim.png"
  };

  function updateProfile(id) {
    const nameEl = document.getElementById('profile-name');
    const titleEl = document.getElementById('profile-title');
    const contactLink = document.getElementById('contact-link');
    // New: update contact card, social links, website, description
    const profile = profiles[id];
    if (!nameEl || !titleEl || !contactLink || !profile) return;
    nameEl.textContent = profile.name;
    titleEl.textContent = profile.title;
    document.title = `${profile.name} | ${profile.title}`;
    if (vcfFiles[id]) {
      contactLink.href = vcfFiles[id];
    } else {
      contactLink.href = '#';
    }
    // Update contact card
    const contactCard = document.querySelector('section.bg-white.rounded-xl.shadow');
    if (contactCard) {
      let addressHtml = '';
      if (profile.address) {
        addressHtml = `<a href="https://maps.google.com/?q=30.023063659668,31.5284881591797" target="_blank" class="text-xs sm:text-sm"><span class="text-base sm:text-lg font-normal">Address</span><br>${profile.address.replace(/,/g, '<br>')}</a>`;
      }
      contactCard.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-black text-white rounded-full p-2"><svg xmlns='http://www.w3.org/2000/svg' class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.05 11.05 0 003.89.74 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1c0 1.33.26 2.61.74 3.89a1 1 0 01-.21 1.11l-2.2 2.2z'></path></svg></span>
          <span class="font-semibold text-sm sm:text-base">Contact Me</span>
        </div>
        <hr class="mb-2">
        <a href="tel:${profile.phone1}" target="_blank" class="text-xs sm:text-sm mb-1">
          <span class="text-base sm:text-lg font-normal">Call Us</span><br>
          ${profile.phone1}
        </a>
        <a href="tel:${profile.phone2}" target="_blank" class="text-xs sm:text-sm mb-1">
          <span class="text-base sm:text-lg font-normal">Call Us</span><br>
          ${profile.phone2}
        </a>
        <a href="mailto:${profile.email}" target="_blank" class="text-xs sm:text-sm mb-1"><span class="text-base sm:text-lg font-normal">Email</span><br>${profile.email}</a>
        ${addressHtml}
      `;
    }
    // Update social links
    const socialLinks = document.querySelectorAll('section.w-full.max-w-md.mx-auto.py-2 a');
    if (socialLinks.length >= 4) {
      socialLinks[0].href = profile.instagram;
      socialLinks[1].href = profile.facebook;
      socialLinks[2].href = profile.linkedin;
      socialLinks[3].href = profile.twitter;
    }
    // Update website card
    const websiteCard = document.querySelector('div.bg-white.rounded-xl.shadow.flex.flex-col.items-center');
    if (websiteCard) {
      websiteCard.querySelector('a').href = profile.website;
      websiteCard.querySelector('a').textContent = profile.website.replace('https://', '');
      websiteCard.querySelector('p').textContent = profile.description;
    }
    // Update mail icon in icon row
    const mailIcon = document.getElementById('mail-icon');
    if (mailIcon) {
      if (profile && profile.email) {
        mailIcon.href = `mailto:${profile.email}`;
      } else {
        mailIcon.href = 'mailto:ak@medyour.com';
      }
    }
  }

  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  window.addEventListener('DOMContentLoaded', function() {
    // Hide landing overlay after 5 seconds
    setTimeout(function() {
      const overlay = document.getElementById('landing-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => overlay.style.display = 'none', 200);
      }
    }, 2000);

    // Set profile based on URL id
    const urlId = getIdFromUrl();
    if (urlId && profiles.hasOwnProperty(urlId)) {
      updateProfile(urlId);
    } else {
      updateProfile(1); // Default profile
    }

    // QR Code Download Button logic
    var qrBtn = document.getElementById('download-qr-btn');
    if (qrBtn) {
      qrBtn.addEventListener('click', function() {
        var id = getIdFromUrl();
        var qrFile = qrCodes[id];
        if (qrFile) {
          var qrPath = `image/qr-codes/${qrFile}`;
          var link = document.createElement('a');
          link.href = qrPath;
          link.download = qrFile;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('QR code not available for this profile.');
        }
      });
    }
  });
})(); 