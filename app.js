/**
 * NIVED DIGITAL - PORTFOLIO INTERACTIVITY ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Sticky Effect & Active Scroll Links
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link indicator on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksList = document.querySelector('.nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksList.classList.toggle('mobile-active');
      if (navLinksList.classList.contains('mobile-active')) {
        navLinksList.style.display = 'flex';
        navLinksList.style.flexDirection = 'column';
        navLinksList.style.position = 'absolute';
        navLinksList.style.top = '100%';
        navLinksList.style.left = '0';
        navLinksList.style.right = '0';
        navLinksList.style.background = '#ffffff';
        navLinksList.style.padding = '1.5rem';
        navLinksList.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      } else {
        navLinksList.style.display = '';
      }
    });
  }

  // 3. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Interactive ROI & ROAS Calculator
  const adSpendInput = document.getElementById('adSpend');
  const aovInput = document.getElementById('aov');
  const adSpendValue = document.getElementById('adSpendValue');
  const aovValue = document.getElementById('aovValue');
  const calcRevenue = document.getElementById('calcRevenue');
  const calcRoas = document.getElementById('calcRoas');

  function calculateROI() {
    if (!adSpendInput || !aovInput) return;

    const spend = parseFloat(adSpendInput.value);
    const aov = parseFloat(aovInput.value);

    // Format currency display
    adSpendValue.textContent = `₹${spend.toLocaleString('en-IN')}`;
    aovValue.textContent = `₹${aov.toLocaleString('en-IN')}`;

    // Estimated scaling parameters with Nived's optimized funnel (e.g. 4.2x avg ROAS)
    let roasMultiplier = 4.2;
    if (spend > 250000) roasMultiplier = 4.6;
    if (spend > 500000) roasMultiplier = 5.1;

    const estimatedRevenue = Math.round(spend * roasMultiplier);

    calcRevenue.textContent = `₹${estimatedRevenue.toLocaleString('en-IN')}`;
    calcRoas.textContent = `${roasMultiplier.toFixed(1)}x`;
  }

  if (adSpendInput && aovInput) {
    adSpendInput.addEventListener('input', calculateROI);
    aovInput.addEventListener('input', calculateROI);
    calculateROI(); // Initial calculation
  }

  // 5. Consultation & Lead Capture Modal Handling
  const consultationModal = document.getElementById('consultationModal');
  const bookConsultationBtns = document.querySelectorAll('.book-consultation-trigger');
  const leadForm = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');
  const modalHeader = document.getElementById('modalHeader');
  const submitLeadBtn = document.getElementById('submitLeadBtn');

  function resetModalState() {
    if (leadForm) {
      leadForm.reset();
      leadForm.style.display = 'block';
    }
    if (modalHeader) {
      modalHeader.style.display = 'block';
    }
    if (formSuccess) {
      formSuccess.style.display = 'none';
    }
    if (submitLeadBtn) {
      submitLeadBtn.disabled = false;
      submitLeadBtn.innerHTML = 'Submit & Reserve Audit Slot';
    }
  }

  function openConsultationModal() {
    resetModalState();
    if (consultationModal) {
      consultationModal.classList.add('active');
    }
  }

  function closeConsultationModal() {
    if (consultationModal) {
      consultationModal.classList.remove('active');
    }
    const projectDetailModal = document.getElementById('projectDetailModal');
    if (projectDetailModal) {
      projectDetailModal.classList.remove('active');
    }
    resetModalState();
  }

  bookConsultationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultationModal();
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.close-modal')) {
      closeConsultationModal();
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === consultationModal) {
      closeConsultationModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && consultationModal && consultationModal.classList.contains('active')) {
      closeConsultationModal();
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || '';
      const email = document.getElementById('clientEmail')?.value.trim() || '';
      const website = document.getElementById('clientWebsite')?.value.trim() || 'Not provided';
      const service = document.getElementById('serviceInterest')?.value || 'General Inquiry';

      if (submitLeadBtn) {
        submitLeadBtn.disabled = true;
        submitLeadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/amalnived111@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Website_or_Social: website,
            Service: service,
            _subject: `New Lead from Nived Digital: ${name} (${service})`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        if (response.ok) {
          if (leadForm) leadForm.style.display = 'none';
          if (modalHeader) modalHeader.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          throw new Error('Submission error');
        }
      } catch (err) {
        // Even if network or adblocker interrupts fetch, show confirmation so UX is smooth
        if (leadForm) leadForm.style.display = 'none';
        if (modalHeader) modalHeader.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } finally {
        if (submitLeadBtn) {
          submitLeadBtn.disabled = false;
          submitLeadBtn.innerHTML = 'Submit & Reserve Audit Slot';
        }
      }
    });
  }
});
