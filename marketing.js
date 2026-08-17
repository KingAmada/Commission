const heroPhrases = [
      "Get paid for referring hotels",
      "Make money introducing hotels to friends",
      "Earn money while you sleep",
      "Get paid for free... just refer a guest",
      "Be your own boss. Refer and earn."
    ];

    let currentPhraseIndex = 0;
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
      setInterval(() => {
        heroSlider.style.opacity = '0';
        heroSlider.style.transform = 'translateY(8px)';
        setTimeout(() => {
          currentPhraseIndex = (currentPhraseIndex + 1) % heroPhrases.length;
          heroSlider.textContent = heroPhrases[currentPhraseIndex];
          heroSlider.style.opacity = '1';
          heroSlider.style.transform = 'translateY(0)';
        }, 350);
      }, 3400);
    }

    const heroSlides = document.querySelectorAll('.hero-slide');
    let heroSlideIndex = 0;
    setInterval(() => {
      heroSlides[heroSlideIndex].classList.remove('active');
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add('active');
    }, 4200);

    const AVG_BOOKING_VALUE = 75000;
    const DIRECT_COMMISSION_RATE = 0.08;
    const NETWORK_POOL_PER_BOOKING = 1500;
    const REQUIRED_DIRECTS = 3;

    const PLAN_CONFIG = {
      standard: { name: 'Standard', depth: 1, ambassadors: 2, share: 1.00, cost: 0, priceLabel: 'FREE' },
      silver:   { name: 'Silver', depth: 2, ambassadors: 6, share: 1.00, cost: 2500, priceLabel: '₦2,500 / month' },
      gold:     { name: 'Gold', depth: 5, ambassadors: 62, share: 0.80, cost: 15000, priceLabel: '₦15,000 / month' },
      diamond:  { name: 'Diamond', depth: 9, ambassadors: 1022, share: 0.65, cost: 50000, priceLabel: '₦50,000 / month' }
    };

    let selectedPlan = 'standard';

    const directSlider = document.getElementById('directSlider');
    const networkSlider = document.getElementById('networkSlider');
    const directCountEl = document.getElementById('directCount');
    const networkCountEl = document.getElementById('networkCount');
    const directEarningsEl = document.getElementById('directEarnings');
    const networkEarningsEl = document.getElementById('networkEarnings');
    const totalEarningsEl = document.getElementById('totalEarnings');
    const planCostEl = document.getElementById('planCost');
    const lockPanel = document.getElementById('lockPanel');
    const networkStatusIcon = document.getElementById('networkStatusIcon');
    const lockedAmountEl = document.getElementById('lockedAmount');
    const remainingDirectsEl = document.getElementById('remainingDirects');
    const resultsCard = document.getElementById('resultsCard');
    const selectedPlanPriceEl = document.getElementById('selectedPlanPrice');
    const planDepthEl = document.getElementById('planDepth');
    const planAmbassadorsEl = document.getElementById('planAmbassadors');
    const planShareEl = document.getElementById('planShare');
    const planMathNoteEl = document.getElementById('planMathNote');
    const networkBookingSummaryEl = document.getElementById('networkBookingSummary');
    const planOptions = document.querySelectorAll('.plan-option');
    const pricingCards = document.querySelectorAll('.plan-pricing-card');
    const pricingActions = document.querySelectorAll('.plan-card-action');

    const formatCurrency = (amount) => {
      const sign = amount < 0 ? '-' : '';
      const value = Math.abs(Math.round(amount));
      return sign + new Intl.NumberFormat('en-NG', {
        style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0
      }).format(value);
    };

    function updatePlanUI() {
      const plan = PLAN_CONFIG[selectedPlan];
      planOptions.forEach((btn) => btn.classList.toggle('selected', btn.dataset.plan === selectedPlan));
      pricingCards.forEach((card) => card.classList.toggle('is-selected', card.dataset.planCard === selectedPlan));
      selectedPlanPriceEl.textContent = plan.priceLabel;
      planDepthEl.textContent = plan.depth;
      planAmbassadorsEl.textContent = plan.ambassadors.toLocaleString('en-NG');
      planShareEl.textContent = Math.round(plan.share * 100) + '%';
      planMathNoteEl.textContent = `${plan.name} keeps ${Math.round(plan.share * 100)}% of eligible network earnings across ${plan.depth} unlocked ${plan.depth === 1 ? 'depth' : 'depths'}.`;
      calculateEarnings();
    }

    function calculateEarnings() {
      const plan = PLAN_CONFIG[selectedPlan];
      const directCount = parseInt(directSlider.value, 10);
      const bookingsPerAmbassador = parseInt(networkSlider.value, 10);

      directCountEl.textContent = directCount;
      networkCountEl.textContent = bookingsPerAmbassador;

      const directEarnings = directCount * (AVG_BOOKING_VALUE * DIRECT_COMMISSION_RATE);
      const totalNetworkBookings = plan.ambassadors * bookingsPerAmbassador;
      const grossNetworkPool = totalNetworkBookings * NETWORK_POOL_PER_BOOKING;
      const networkEarnings = grossNetworkPool * plan.share;

      networkBookingSummaryEl.textContent = `${plan.ambassadors.toLocaleString('en-NG')} accessible Ambassadors × ${bookingsPerAmbassador} ${bookingsPerAmbassador === 1 ? 'booking' : 'bookings'} = ${totalNetworkBookings.toLocaleString('en-NG')} qualifying network bookings.`;

      directEarningsEl.textContent = formatCurrency(directEarnings);
      networkEarningsEl.textContent = formatCurrency(networkEarnings);
      planCostEl.textContent = plan.cost === 0 ? 'FREE' : formatCurrency(plan.cost);

      if (directCount < REQUIRED_DIRECTS) {
        lockPanel.style.display = 'block';
        resultsCard.style.borderColor = 'rgba(239,68,68,.20)';
        lockedAmountEl.textContent = formatCurrency(networkEarnings);
        remainingDirectsEl.textContent = REQUIRED_DIRECTS - directCount;
        const activeTotal = directEarnings - plan.cost;
        totalEarningsEl.textContent = formatCurrency(activeTotal);
        totalEarningsEl.classList.remove('text-brand-400');
        totalEarningsEl.classList.add('text-slate-300');
        networkStatusIcon.className = 'fas fa-lock text-amber-400 text-[10px]';
      } else {
        lockPanel.style.display = 'none';
        resultsCard.style.borderColor = 'rgba(34,211,238,.22)';
        const total = directEarnings + networkEarnings - plan.cost;
        totalEarningsEl.textContent = formatCurrency(total);
        totalEarningsEl.classList.remove('text-slate-300');
        totalEarningsEl.classList.add('text-brand-400');
        networkStatusIcon.className = 'fas fa-unlock text-money-400 text-[10px]';
      }
    }

    function choosePlan(planKey, scrollToCalculator = false) {
      if (!PLAN_CONFIG[planKey]) return;
      selectedPlan = planKey;
      updatePlanUI();
      if (scrollToCalculator) {
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    planOptions.forEach((btn) => {
      btn.addEventListener('click', () => choosePlan(btn.dataset.plan, false));
    });

    pricingCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('.plan-card-action')) return;
        choosePlan(card.dataset.planCard, false);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choosePlan(card.dataset.planCard, false);
        }
      });
    });

    pricingActions.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        choosePlan(btn.dataset.planAction, false);
        toggleModal('signup', btn.dataset.planAction);
      });
    });

    directSlider.addEventListener('input', calculateEarnings);
    networkSlider.addEventListener('input', calculateEarnings);
    updatePlanUI();


    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach((button) => {
      const item = button.closest('.faq-item');
      button.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
      button.addEventListener('click', () => {
        const wasOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach((otherItem) => {
          otherItem.classList.remove('active');
          const otherButton = otherItem.querySelector('.faq-question');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    function openPlatform(request) {
      window.dispatchEvent(new CustomEvent('tc-platform-request', { detail: request }));
    }

    function toggleModal(mode = 'signup', plan = selectedPlan) {
      openPlatform({ type: 'tc-auth', mode, plan });
    }

    function openAppRoute(route, mode = 'signup', plan = 'standard') {
      openPlatform({ type: 'tc-route', route, mode, plan });
    }

    const propertyCarousel = document.getElementById('propertyCarousel');
    const propertyDots = Array.from(document.querySelectorAll('#propertyDots .property-dot'));
    let propertyCardStep = 0;
    let propertyAutoTimer = null;

    function detectPropertyStep() {
      if (!propertyCarousel) return 0;
      const firstCard = propertyCarousel.querySelector('.marketing-property-card');
      if (!firstCard) return 0;
      const carouselStyle = getComputedStyle(propertyCarousel);
      const gap = parseFloat(carouselStyle.columnGap || carouselStyle.gap || 12) || 12;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updatePropertyDots() {
      if (!propertyCarousel || !propertyDots.length) return;
      propertyCardStep = detectPropertyStep();
      const activeIndex = propertyCardStep > 0 ? Math.round(propertyCarousel.scrollLeft / propertyCardStep) : 0;
      propertyDots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
    }

    function scrollToProperty(index) {
      if (!propertyCarousel) return;
      propertyCardStep = detectPropertyStep();
      propertyCarousel.scrollTo({ left: propertyCardStep * index, behavior: 'smooth' });
      updatePropertyDots();
    }

    function startPropertyAutoplay() {
      if (!propertyCarousel) return;
      stopPropertyAutoplay();
      propertyAutoTimer = setInterval(() => {
        propertyCardStep = detectPropertyStep();
        if (!propertyCardStep) return;
        const totalCards = propertyCarousel.querySelectorAll('.marketing-property-card').length;
        const currentIndex = Math.round(propertyCarousel.scrollLeft / propertyCardStep);
        const nextIndex = (currentIndex + 1) % totalCards;
        scrollToProperty(nextIndex);
      }, 3400);
    }

    function stopPropertyAutoplay() {
      if (propertyAutoTimer) clearInterval(propertyAutoTimer);
    }

    propertyDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        scrollToProperty(index);
        startPropertyAutoplay();
      });
    });

    if (propertyCarousel) {
      propertyCarousel.addEventListener('scroll', updatePropertyDots, { passive: true });
      propertyCarousel.addEventListener('touchstart', stopPropertyAutoplay, { passive: true });
      propertyCarousel.addEventListener('mouseenter', stopPropertyAutoplay);
      propertyCarousel.addEventListener('mouseleave', startPropertyAutoplay);
      window.addEventListener('resize', updatePropertyDots, { passive: true });
      updatePropertyDots();
      startPropertyAutoplay();
    }

    // Reliable one-time scroll animation for the internal phone viewport.
    // Elements start from the actual phone edges and animate the first time they enter view,
    // whether the user is scrolling down or back up.
    const scrollRoot = document.getElementById('mainScroll');
    const revealTargets = Array.from(document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale'));
    const animatedTargets = new WeakSet();
    let revealTicking = false;

    function elementIsInPhoneView(el) {
      const rootRect = scrollRoot.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const triggerTop = rootRect.top + 38;
      const triggerBottom = rootRect.bottom - 54;
      return rect.bottom > triggerTop && rect.top < triggerBottom;
    }

    function revealElement(el) {
      if (animatedTargets.has(el)) return;
      animatedTargets.add(el);
      requestAnimationFrame(() => {
        el.classList.remove('reveal-pending');
        el.classList.add('reveal-visible');
      });
    }

    function checkScrollReveals() {
      revealTargets.forEach((el) => {
        if (!animatedTargets.has(el) && elementIsInPhoneView(el)) {
          revealElement(el);
        }
      });
      revealTicking = false;
    }

    // Only hide items that have not yet entered the phone viewport.
    // This makes the page fail-safe: content remains visible if animation setup ever fails.
    revealTargets.forEach((el) => {
      if (elementIsInPhoneView(el)) {
        animatedTargets.add(el);
        el.classList.add('reveal-visible');
      } else {
        el.classList.add('reveal-pending');
      }
    });

    scrollRoot.addEventListener('scroll', () => {
      if (!revealTicking) {
        revealTicking = true;
        requestAnimationFrame(checkScrollReveals);
      }
    }, { passive: true });

    window.addEventListener('resize', checkScrollReveals, { passive: true });
    setTimeout(checkScrollReveals, 80);

    // Lightweight haptic feedback for supported mobile browsers.
    // Silently ignored on devices/browsers without the Vibration API.
    function hapticPulse(duration = 8) {
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    }

    // Calculator sliders: subtle pulse while moving, throttled so dragging stays pleasant.
    let lastHapticAt = 0;
    document.querySelectorAll('#directSlider, #networkSlider').forEach((slider) => {
      slider.addEventListener('input', () => {
        const now = Date.now();
        if (now - lastHapticAt > 70) {
          hapticPulse(6);
          lastHapticAt = now;
        }
      }, { passive: true });

      slider.addEventListener('change', () => hapticPulse(10), { passive: true });
    });

    // Join/claim CTAs and the free-plan CTA get a slightly firmer tap response.
    document.querySelectorAll('[data-auth-mode], [data-plan-action="standard"]').forEach((button) => {
      button.addEventListener('click', () => hapticPulse(12), { passive: true });
    });

    document.querySelectorAll('[data-auth-mode]').forEach((button) => {
      button.addEventListener('click', () => toggleModal(button.dataset.authMode, button.dataset.authPlan || selectedPlan));
    });

    document.querySelectorAll('[data-app-route]').forEach((button) => {
      button.addEventListener('click', () => openAppRoute(button.dataset.appRoute));
    });

    const legalDialog = document.getElementById('marketingLegalDialog');
    const legalTitle = document.getElementById('marketingLegalTitle');
    const legalCopy = document.getElementById('marketingLegalCopy');
    const legalContent = {
      terms: {
        title: 'Terms of Service',
        copy: 'The Commission connects Ambassadors with participating hospitality properties. Earnings apply only to verified, qualifying stays under the property’s active commission rules. Registration is free. Paid membership tiers expand eligible network depth; they do not guarantee earnings.'
      },
      privacy: {
        title: 'Privacy Policy',
        copy: 'We collect the account, referral, booking and payout information needed to operate the platform. Access is limited by account role and database security policies. We do not sell personal information. Guests do not need platform accounts.'
      },
      spam: {
        title: 'Anti-Spam Policy',
        copy: 'Ambassadors must share referral information only with people who have asked for it or can reasonably expect it. Unsolicited bulk messaging, misleading earnings claims and impersonation are prohibited.'
      }
    };

    function closeLegalDialog() {
      legalDialog.classList.add('hidden');
      legalDialog.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('[data-legal]').forEach((button) => {
      button.addEventListener('click', () => {
        const content = legalContent[button.dataset.legal];
        if (!content) return;
        legalTitle.textContent = content.title;
        legalCopy.textContent = content.copy;
        legalDialog.classList.remove('hidden');
        legalDialog.setAttribute('aria-hidden', 'false');
        document.getElementById('marketingLegalClose').focus();
      });
    });
    document.getElementById('marketingLegalClose').addEventListener('click', closeLegalDialog);
    legalDialog.addEventListener('click', (event) => {
      if (event.target === legalDialog) closeLegalDialog();
    });
    legalDialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLegalDialog();
    });
