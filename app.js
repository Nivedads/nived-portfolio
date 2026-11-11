/**
 * ==========================================================================
 * NIVED DIGITAL — MODERN ELITE PORTFOLIO INTERACTIVITY ENGINE
 * Fast, Vanilla JS, Zero External Library Dependencies
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 0. THEME TOGGLE (OPTIONAL)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    const themeIcon = themeToggleBtn.querySelector('i');
    const savedTheme = localStorage.getItem('nived_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.remove('theme-dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    } else {
      document.body.classList.add('theme-dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      const isDark = document.body.classList.contains('theme-dark');
      localStorage.setItem('nived_theme', isDark ? 'dark' : 'light');
      if (themeIcon) {
        if (isDark) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      }
    });
  }


  // ------------------------------------------------------------------------
  // 1. STICKY NAVBAR & ACTIVE SCROLL SPY
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .dm-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.dm-back-top');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Navbar compact background state
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy: highlight current section in navigation
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE HAMBURGER MENU
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav link or CTA button inside drawer
    navMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. ANIMATED NUMBER COUNTERS (HERO STATS)
  // ------------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  let countersTriggered = false;

  function runCounters() {
    if (countersTriggered) return;
    const heroStats = document.querySelector('.hero-stats-wrapper');
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      countersTriggered = true;
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 1600; // ms
        const steps = 40;
        const stepTime = duration / steps;
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
            clearInterval(timer);
          } else {
            counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', runCounters, { passive: true });
  runCounters();

  // ------------------------------------------------------------------------
  // 4. SWIPEABLE PORTFOLIO CAROUSEL & CATEGORY FILTER ENGINE
  // ------------------------------------------------------------------------
  const sliderTrack = document.getElementById('portfolioSliderTrack');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const paginationDotsContainer = document.getElementById('sliderPaginationDots');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const filterTabs = document.querySelectorAll('.filter-tab, .dm-filter-tab');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));

  function getVisibleCards() {
    return projectCards.filter(card => card.style.display !== 'none');
  }

  function getStepDistance() {
    const visible = getVisibleCards();
    if (!visible.length) return 340;
    const firstCard = visible[0];
    const gap = parseFloat(window.getComputedStyle(sliderTrack).gap) || 20;
    return firstCard.offsetWidth + gap;
  }

  function updateSliderState() {
    if (!sliderTrack) return;
    const visible = getVisibleCards();
    const total = visible.length;
    if (totalSlidesNum) totalSlidesNum.textContent = total;

    if (total === 0) {
      if (currentSlideNum) currentSlideNum.textContent = '0';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    const scrollLeft = sliderTrack.scrollLeft;
    const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
    const step = getStepDistance();
    
    // Determine active index
    let activeIdx = Math.round(scrollLeft / step);
    if (activeIdx < 0) activeIdx = 0;
    if (activeIdx >= total) activeIdx = total - 1;

    // Check boundary
    if (scrollLeft >= maxScroll - 15) {
      activeIdx = total - 1;
    }

    // Update counter
    if (currentSlideNum) {
      currentSlideNum.textContent = activeIdx + 1;
    }

    // Update arrow buttons
    if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;

    // Update dots
    const dots = paginationDotsContainer ? paginationDotsContainer.querySelectorAll('.slider-dot') : [];
    dots.forEach((dot, idx) => {
      if (idx === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function renderPaginationDots() {
    if (!paginationDotsContainer) return;
    const visible = getVisibleCards();
    paginationDotsContainer.innerHTML = '';

    visible.forEach((card, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', idx);
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);

      dot.addEventListener('click', () => {
        scrollToCardIndex(idx);
      });

      paginationDotsContainer.appendChild(dot);
    });

    if (totalSlidesNum) {
      totalSlidesNum.textContent = visible.length;
    }
  }

  function scrollToCardIndex(index) {
    if (!sliderTrack) return;
    const visible = getVisibleCards();
    if (index < 0 || index >= visible.length) return;
    const targetCard = visible[index];
    
    // Calculate scroll offset within track
    const trackPaddingLeft = parseFloat(window.getComputedStyle(sliderTrack).paddingLeft) || 0;
    const targetScrollLeft = targetCard.offsetLeft - sliderTrack.offsetLeft - trackPaddingLeft;
    
    sliderTrack.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth'
    });
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getStepDistance();
      sliderTrack.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getStepDistance();
      sliderTrack.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Scroll event for real-time tracking
  let scrollTimeout;
  if (sliderTrack) {
    sliderTrack.addEventListener('scroll', () => {
      updateSliderState();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateSliderState, 60);
    }, { passive: true });
  }

  // Filter tabs integration
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      // Reset track scroll & re-render dots
      if (sliderTrack) {
        sliderTrack.scrollTo({ left: 0, behavior: 'auto' });
      }
      renderPaginationDots();
      setTimeout(updateSliderState, 50);
    });
  });

  // Initial setup
  renderPaginationDots();
  setTimeout(updateSliderState, 100);

  // Keyboard arrow navigation when hovering slider
  if (sliderTrack) {
    window.addEventListener('keydown', (e) => {
      const rect = sliderTrack.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        const step = getStepDistance();
        sliderTrack.scrollBy({ left: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        const step = getStepDistance();
        sliderTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. INTERACTIVE ROAS & REVENUE CALCULATOR
  // ------------------------------------------------------------------------
  const budgetSlider = document.getElementById('budgetSlider');
  const aovSlider = document.getElementById('aovSlider');
  const budgetValue = document.getElementById('budgetValue');
  const aovValue = document.getElementById('aovValue');
  const projectedRevenue = document.getElementById('projectedRevenue');
  const projectedRoas = document.getElementById('projectedRoas');
  const projectedOrders = document.getElementById('projectedOrders');
  const projectedCac = document.getElementById('projectedCac');
  const goalRadios = document.querySelectorAll('input[name="calcGoal"]');

  function formatINR(number) {
    return '₹' + Math.round(number).toLocaleString('en-IN');
  }

  function updateCalculator() {
    if (!budgetSlider || !aovSlider) return;

    const spend = parseFloat(budgetSlider.value);
    const aov = parseFloat(aovSlider.value);
    const selectedGoal = document.querySelector('input[name="calcGoal"]:checked')?.value || 'ecommerce';

    // Update label displays
    budgetValue.textContent = formatINR(spend);
    aovValue.textContent = formatINR(aov);

    let baseRoas = 4.2;
    if (selectedGoal === 'ecommerce') {
      // Dynamic realistic curve: smaller spends hold slightly higher ROAS, scaling maintains 3.8x - 4.6x
      if (spend <= 50000) baseRoas = 4.6;
      else if (spend <= 150000) baseRoas = 4.3;
      else if (spend <= 400000) baseRoas = 4.0;
      else baseRoas = 3.8;
    } else {
      // Lead Gen: high-ticket service valuation
      baseRoas = 4.5;
    }

    const grossRevenue = spend * baseRoas;
    const estimatedOrders = Math.round(grossRevenue / aov);
    const cac = estimatedOrders > 0 ? Math.round(spend / estimatedOrders) : 0;

    projectedRevenue.textContent = formatINR(grossRevenue);
    projectedRoas.textContent = baseRoas.toFixed(2) + 'x';
    projectedOrders.textContent = estimatedOrders.toLocaleString('en-IN');
    projectedCac.textContent = formatINR(cac);
  }

  if (budgetSlider && aovSlider) {
    budgetSlider.addEventListener('input', updateCalculator);
    aovSlider.addEventListener('input', updateCalculator);
    goalRadios.forEach(radio => radio.addEventListener('change', updateCalculator));
    updateCalculator(); // Run initial calculation
  }

  // ------------------------------------------------------------------------
  // 6. CASE STUDY DETAIL MODAL (RICH DEEP DIVES)
  // ------------------------------------------------------------------------
  const caseStudiesData = [
    {
      title: "Yadasutra Ayurveda — High-Ticket Wellness Patient Scaling",
      client: "Yadasutra Ayurveda",
      category: "Lead Generation",
      image: "./client-0.jpg",
      challenge: "The client was struggling with low-quality leads, high cost-per-lead (CPL) on Meta, and frequent no-shows for ayurvedic doctor consultations.",
      strategy: "Implemented pain-point video hook angles calling out specific wellness symptoms. Replaced generic lead forms with an interactive WhatsApp qualification funnel that pre-vetted patient intent before booking.",
      stats: [
        { label: "CPL Reduction", val: "-42%" },
        { label: "Qualified Leads", val: "1,200+" },
        { label: "Consultation Show Rate", val: "78%" }
      ],
      tags: ["Meta Ads", "WhatsApp API", "Direct-Response Copy", "Kerala & South India"]
    },
    {
      title: "Compass Clinic — Medical Specialist Consultation Pipeline",
      client: "Compass Clinic",
      category: "Healthcare Lead Gen",
      image: "./client-1.jpg",
      challenge: "High reliance on word-of-mouth and inconsistent walk-ins for premium specialist doctor appointments.",
      strategy: "Built a high-intent Google Search structure capturing localized high-intent symptom queries, coupled with Meta remarketing ads highlighting clinic credentials and patient video testimonials.",
      stats: [
        { label: "In-Clinic Bookings", val: "+180%" },
        { label: "Search Ad CTR", val: "8.4%" },
        { label: "CAC Reduction", val: "-35%" }
      ],
      tags: ["Google Search", "Meta Retargeting", "Local Radius Ads", "Healthcare Compliance"]
    },
    {
      title: "GrowMax Club — Investor & High-Intent Membership Funnel",
      client: "GrowMax Club",
      category: "Community & Membership",
      image: "./client-2.jpg",
      challenge: "Scaling membership subscriptions while maintaining high member lifetime value and zero spam submissions.",
      strategy: "Structured an educational video-first ad framework on Instagram with survey qualification forms that filtered applicants before granting community access.",
      stats: [
        { label: "Pipeline ROAS", val: "3.9x" },
        { label: "Member Acquisition", val: "+340" },
        { label: "Form Completion Rate", val: "64%" }
      ],
      tags: ["Instagram Reels Ads", "Funnel CRO", "Survey Filtering", "Video Direct Response"]
    },
    {
      title: "Unimoni — Enterprise Financial Services Campaign Scaling",
      client: "Unimoni",
      category: "Financial Services",
      image: "./client-3.jpg",
      challenge: "Strict financial advertising compliance, competitive search bidding auctions, and high cost-per-acquisition.",
      strategy: "Deployed compliance-verified Google Ads Search & Performance Max campaigns with trusted brand positioning and high-relevance landing page copy.",
      stats: [
        { label: "Compliance Score", val: "100%" },
        { label: "Search Share of Voice", val: "+45%" },
        { label: "Verified Call Leads", val: "3,500+" }
      ],
      tags: ["Google PMax", "Financial Compliance", "Search Moats", "Enterprise Ads"]
    },
    {
      title: "Onstara — DTC Fashion E-Commerce Revenue Multiplier",
      client: "Onstara",
      category: "E-Commerce DTC",
      image: "./client-4.jpg",
      challenge: "Online apparel brand experiencing creative ad fatigue and fluctuating ROAS during aggressive weekend scale periods.",
      strategy: "Restructured ad account into Advantage+ Shopping campaigns with dynamic lifestyle carousels and automated catalog feeds, supported by server-side CAPI tracking.",
      stats: [
        { label: "Consistent ROAS", val: "4.5x" },
        { label: "Monthly Orders", val: "850+" },
        { label: "Repeat Purchase Rate", val: "28%" }
      ],
      tags: ["Advantage+ Catalog", "Meta CAPI", "Dynamic Product Ads", "Fashion DTC"]
    },
    {
      title: "Lexen — Full-Stack Shopify Architecture & Ad Launch",
      client: "Lexen",
      category: "Shopify Dev & Scale",
      image: "./client-5.jpg",
      challenge: "Client needed a brand-new, ultra-fast online storefront built from scratch and immediate customer acquisition campaigns.",
      strategy: "Designed and coded a custom, high-speed Shopify store optimized for 1-click mobile checkout, then launched targeted Meta prospecting campaigns with UGC video reviews.",
      stats: [
        { label: "Mobile Page Speed", val: "94/100" },
        { label: "Store Conversion Rate", val: "3.8%" },
        { label: "First Month ROAS", val: "4.2x" }
      ],
      tags: ["Custom Shopify Theme", "Core Web Vitals", "Meta Ads", "AOV Upsells"]
    }
  ];

  const caseStudyModal = document.getElementById('caseStudyModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const viewCaseBtns = document.querySelectorAll('.view-case-btn');

  viewCaseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projIndex = parseInt(btn.getAttribute('data-project'), 10);
      const data = caseStudiesData[projIndex];
      if (!data) return;

      caseModalContent.innerHTML = `
        <div class="case-modal-hero">
          <img src="${data.image}" alt="${data.title}" loading="lazy">
        </div>
        <div class="case-modal-meta">
          <span class="client-name">${data.client}</span>
          <span class="badge-pill">${data.category}</span>
        </div>
        <h3 class="case-modal-title">${data.title}</h3>
        
        <div class="case-stats-row">
          ${data.stats.map(s => `
            <div class="case-stat-pill">
              <span class="case-stat-label">${s.label}</span>
              <span class="case-stat-val">${s.val}</span>
            </div>
          `).join('')}
        </div>

        <div class="case-detail-box">
          <div class="case-box-header">
            <span class="text-amber-400"><i class="fa-solid fa-triangle-exclamation"></i></span>
            <h4>The Challenge</h4>
          </div>
          <p>${data.challenge}</p>
        </div>

        <div class="case-detail-box">
          <div class="case-box-header">
            <span class="text-emerald"><i class="fa-solid fa-lightbulb"></i></span>
            <h4>The Scaling Strategy</h4>
          </div>
          <p>${data.strategy}</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
          ${data.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary trigger-modal-btn" data-service="Case Study Consultation (${data.client})">
            <span>Apply Similar Blueprint To My Brand</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <a href="https://wa.me/918590101541?text=Hi%20Nived,%20I%20saw%20your%20case%20study%20for%20${encodeURIComponent(data.client)}%20and%20want%20to%20discuss%20a%20similar%20scaling%20strategy" target="_blank" rel="noopener noreferrer" class="btn btn-wa">
            <i class="fa-brands fa-whatsapp"></i>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      `;

      // Re-attach modal trigger to internal button
      const innerTrigger = caseModalContent.querySelector('.trigger-modal-btn');
      if (innerTrigger) {
        innerTrigger.addEventListener('click', () => {
          closeCaseStudyModal();
          openConsultationModal(innerTrigger.getAttribute('data-service'));
        });
      }

      openCaseStudyModal();
    });
  });

  function openCaseStudyModal() {
    if (caseStudyModal) {
      caseStudyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCaseStudyModal() {
    if (caseStudyModal) {
      caseStudyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.close-case-modal').forEach(btn => {
    btn.addEventListener('click', closeCaseStudyModal);
  });

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeCaseStudyModal();
    });
  }

  // ------------------------------------------------------------------------
  // 7. FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item, .dm-faq-final__item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question, .dm-faq-final__question');
    const answer = item.querySelector('.faq-answer, .dm-faq-final__answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question, .dm-faq-final__question');
        const otherAns = otherItem.querySelector('.faq-answer, .dm-faq-final__answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ------------------------------------------------------------------------
  // 8. STRATEGY AUDIT MODAL & WHATSAPP ROUTING
  // ------------------------------------------------------------------------
  const consultationModal = document.getElementById('consultationModal');
  const leadForm = document.getElementById('leadForm');
  const modalHeader = document.getElementById('modalHeader');
  const formSuccess = document.getElementById('formSuccess');
  const successWaBtn = document.getElementById('successWaBtn');
  const serviceSelect = document.getElementById('serviceInterest');
  const spendSelect = document.getElementById('monthlySpend');

  function openConsultationModal(preselectedService = null, preselectedSpend = null) {
    if (!consultationModal) return;

    if (preselectedService && serviceSelect) {
      // Find matching option or select nearest
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.includes(preselectedService) || preselectedService.includes(serviceSelect.options[i].value)) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (preselectedSpend && spendSelect) {
      spendSelect.value = preselectedSpend;
    }

    // Reset view if previously submitted
    if (leadForm) leadForm.style.display = 'flex';
    if (modalHeader) modalHeader.style.display = 'block';
    if (formSuccess) formSuccess.style.display = 'none';

    consultationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeConsultationModal() {
    if (!consultationModal) return;
    consultationModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind all standard trigger buttons
  document.querySelectorAll('.trigger-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service');
      openConsultationModal(service);
    });
  });

  // Bind calculator lock-in button
  const triggerWithDataBtn = document.querySelector('.trigger-modal-with-data');
  if (triggerWithDataBtn) {
    triggerWithDataBtn.addEventListener('click', () => {
      const spendFormatted = budgetValue ? budgetValue.textContent : '₹1,00,000';
      const goal = document.querySelector('input[name="calcGoal"]:checked')?.value;
      const serviceName = goal === 'leadgen' ? 'Lead Generation Scaling' : 'E-Commerce ROAS Scaling';
      openConsultationModal(serviceName, '₹50,000 - ₹2,00,000');
    });
  }

  // Close modal buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeConsultationModal);
  });

  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) closeConsultationModal();
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConsultationModal();
      closeCaseStudyModal();
    }
  });

  // Lead Form Submission -> WhatsApp + Backup Email
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || '';
      const email = document.getElementById('clientEmail')?.value.trim() || '';
      const phone = document.getElementById('clientPhone')?.value.trim() || 'Not provided';
      const website = document.getElementById('clientWebsite')?.value.trim() || 'Not provided';
      const service = document.getElementById('serviceInterest')?.value || 'Ad Account Audit';
      const spend = document.getElementById('monthlySpend')?.value || '₹50,000 - ₹2,00,000';

      // 1. Build structured WhatsApp message
      const waMessage = 
`*Growth Session & Audit Request — Nived Digital*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
✉️ *Email:* ${email}
📱 *Phone/WhatsApp:* ${phone}
🌐 *Website / Store:* ${website}
🎯 *Service Goal:* ${service}
💰 *Current Spend:* ${spend}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Hi Nived! I just submitted an audit request on your portfolio. Let's schedule my free 1-on-1 growth session!`;

      const whatsappUrl = `https://wa.me/918590101541?text=${encodeURIComponent(waMessage)}`;

      // 2. Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // 3. Switch to success screen
      leadForm.style.display = 'none';
      if (modalHeader) modalHeader.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      if (successWaBtn) successWaBtn.href = whatsappUrl;

      // 4. Background notification to amalnived111@gmail.com via FormSubmit
      fetch('https://formsubmit.co/ajax/amalnived111@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Phone: phone,
          Website: website,
          Service_Interested: service,
          Ad_Spend_Budget: spend,
          _subject: `⚡ New Paid Media Audit Lead: ${name} (${service})`,
          _template: 'table',
          _captcha: 'false'
        })
      }).catch(() => {});
    });
  }

  // ------------------------------------------------------------------------
  // 9. COPY EMAIL TO CLIPBOARD WITH TOAST
  // ------------------------------------------------------------------------
  const copyEmailBtn = document.querySelector('.copy-email-btn');
  const toast = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('contact@niveddigital.com').then(() => {
        showToast('✓ Email copied: contact@niveddigital.com');
      }).catch(() => {
        showToast('contact@niveddigital.com');
      });
    });
  }

  // Update current year dynamically
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
