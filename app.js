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
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const leadForm = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');

  bookConsultationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      consultationModal.classList.add('active');
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      consultationModal.classList.remove('active');
      const projectDetailModal = document.getElementById('projectDetailModal');
      if (projectDetailModal) projectDetailModal.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === consultationModal) {
      consultationModal.classList.remove('active');
    }
    const projectDetailModal = document.getElementById('projectDetailModal');
    if (e.target === projectDetailModal) {
      projectDetailModal.classList.remove('active');
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      leadForm.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }
});
