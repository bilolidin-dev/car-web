// Car data
const INVENTORY_STORAGE_KEY = 'koreamotors.inventory.v1';
let cars = loadCars();
const USD_TO_KGS_RATE = 87.5;

const translations = {
    en: {
        'nav.home': 'Home',
        'nav.cars': 'Cars',
        'nav.contact': 'Contact',
        'hero.greeting': 'korea.auto.export ⚡ · Assalamu Alaikum 🤝',
        'hero.title': 'Your Next Ride, Just a Click Away',
        'hero.subtitle': 'Order any car or special equipment from Korea for delivery worldwide.',
        'hero.cta': 'Explore Cars',
        'contact.call': 'Call us',
        'contact.koreaPhone': 'Korea: +82 10-5656-9626',
        'contact.whatsapp': 'WhatsApp: +82 10-5656-9626',
        'contact.telegram': 'Telegram channel',
        'bottom.home': 'Home',
        'bottom.cars': 'Cars',
        'bottom.call': 'Call',
        'bottom.telegram': 'Telegram',
        'admin.title': 'Vehicle management',
        'admin.warning': 'Temporary local mode: no login or access protection. Data is saved only in this browser.',
        'admin.name': 'Vehicle name',
        'admin.brand': 'Brand',
        'admin.year': 'Year',
        'admin.price': 'Price (USD)',
        'admin.mileage': 'Mileage',
        'admin.image': 'Image URL',
        'admin.description': 'Description',
        'admin.add': 'Add vehicle',
        'admin.save': 'Save changes',
        'admin.cancel': 'Cancel edit',
        'admin.inventory': 'Saved vehicles',
        'admin.empty': 'No saved vehicles yet.',
        'admin.edit': 'Edit',
        'admin.delete': 'Delete',
        'admin.saved': 'Vehicle saved in this browser.',
        'admin.deleted': 'Vehicle deleted.',
        'admin.invalidImage': 'Image URL must start with http:// or https://.',
        'admin.storageError': 'Could not save. Browser storage may be unavailable or full.',
        'admin.confirmDelete': 'Delete this vehicle?',
        'gallery.title': 'Our Collection',
        'gallery.subtitle': 'Handpicked vehicles for the discerning buyer',
        'filters.all': 'All Cars',
        'filters.toyota': 'Toyota',
        'filters.honda': 'Honda',
        'filters.bmw': 'BMW',
        'filters.mercedes': 'Mercedes',
        'gallery.empty': 'No cars available right now.',
        'contact.title': 'Get In Touch',
        'contact.subtitle': 'Ready to find your perfect car? Contact us today!',
        'contact.name': 'Full Name',
        'contact.email': 'Email Address',
        'contact.phone': 'Phone Number',
        'contact.message': 'Message',
        'contact.submit': 'Send Message',
        'footer.about': 'koreamotors.export — your trusted source for quality Korean vehicles and reliable export solutions. Based in Daegu, South Korea, we deliver cars and export services across Central Asia.',
        'footer.quickLinksTitle': 'Quick Links',
        'footer.browseCars': 'Browse Cars',
        'footer.sellCar': 'Join our Telegram channel',
        'footer.aboutBrand': 'About koreamotors.export',
        'footer.call': 'Call +82 10-5656-9626',
        'footer.stayConnectedTitle': 'Stay Connected',
        'footer.newsletterText': 'Get the best deals on pre-owned cars straight to your inbox. Subscribe for exclusive listings, offers & car-buying tips.',
        'footer.newsletterPlaceholder': 'Your email address',
        'footer.subscribeNow': 'Subscribe Now',
        'footer.copyright': '© 2026 koreamotors.export. All rights reserved.',
        'footer.madeBy': 'Designed and built by',
        'modal.contactCar': 'Contact About This Car',
        'modal.year': 'Year',
        'modal.mileage': 'Mileage',
        'contact.messagePrefill': 'I\'m interested in the {carName}. Please provide more details.',
        'contact.sending': 'Sending...',
        'contact.thanks': 'Thank you for your message! We\'ll get back to you soon.'
    },
    ru: {
        'nav.home': 'Главная',
        'nav.cars': 'Авто',
        'nav.contact': 'Контакты',
        'hero.greeting': 'korea.auto.export ⚡ · Ассаламу Алейкум 🤝',
        'hero.title': 'Ваш следующий автомобиль — в один клик',
        'hero.subtitle': 'У нас можно заказать любой автомобиль и спецтехнику из Кореи с доставкой по всему миру.',
        'hero.cta': 'Посмотреть авто',
        'contact.call': 'Позвонить',
        'contact.koreaPhone': 'Корея: +82 10-5656-9626',
        'contact.whatsapp': 'WhatsApp: +82 10-5656-9626',
        'contact.telegram': 'Telegram-канал',
        'bottom.home': 'Главная',
        'bottom.cars': 'Авто',
        'bottom.call': 'Звонок',
        'bottom.telegram': 'Telegram',
        'admin.title': 'Управление автомобилями',
        'admin.warning': 'Временный локальный режим: вход и защита отсутствуют. Данные сохраняются только в этом браузере.',
        'admin.name': 'Название автомобиля',
        'admin.brand': 'Марка',
        'admin.year': 'Год',
        'admin.price': 'Цена (USD)',
        'admin.mileage': 'Пробег',
        'admin.image': 'Ссылка на фото',
        'admin.description': 'Описание',
        'admin.add': 'Добавить автомобиль',
        'admin.save': 'Сохранить изменения',
        'admin.cancel': 'Отменить редактирование',
        'admin.inventory': 'Сохранённые автомобили',
        'admin.empty': 'Сохранённых автомобилей пока нет.',
        'admin.edit': 'Изменить',
        'admin.delete': 'Удалить',
        'admin.saved': 'Автомобиль сохранён в этом браузере.',
        'admin.deleted': 'Автомобиль удалён.',
        'admin.invalidImage': 'Ссылка на фото должна начинаться с http:// или https://.',
        'admin.storageError': 'Не удалось сохранить данные: хранилище браузера недоступно или заполнено.',
        'admin.confirmDelete': 'Удалить этот автомобиль?',
        'gallery.title': 'Наша коллекция',
        'gallery.subtitle': 'Подобранные автомобили для внимательного покупателя',
        'filters.all': 'Все авто',
        'filters.toyota': 'Toyota',
        'filters.honda': 'Honda',
        'filters.bmw': 'BMW',
        'filters.mercedes': 'Mercedes',
        'gallery.empty': 'Сейчас автомобилей нет.',
        'contact.title': 'Свяжитесь с нами',
        'contact.subtitle': 'Готовы найти идеальный автомобиль? Напишите нам сегодня!',
        'contact.name': 'Полное имя',
        'contact.email': 'Электронная почта',
        'contact.phone': 'Номер телефона',
        'contact.message': 'Сообщение',
        'contact.submit': 'Отправить сообщение',
        'footer.about': 'koreamotors.export — ваш надёжный источник качественных корейских автомобилей и экспортных решений. Мы находимся в Дэгу, Южная Корея, и осуществляем поставки по всей Центральной Азии.',
        'footer.quickLinksTitle': 'Быстрые ссылки',
        'footer.browseCars': 'Просмотр авто',
        'footer.sellCar': 'Перейти в Telegram-канал',
        'footer.aboutBrand': 'О koreamotors.export',
        'footer.call': 'Позвонить: +82 10-5656-9626',
        'footer.stayConnectedTitle': 'Будьте на связи',
        'footer.newsletterText': 'Получайте лучшие предложения по подержанным авто прямо на почту. Подписывайтесь на эксклюзивные предложения и советы по покупке.',
        'footer.newsletterPlaceholder': 'Ваш адрес электронной почты',
        'footer.subscribeNow': 'Подписаться',
        'footer.copyright': '© 2026 koreamotors.export. Все права защищены.',
        'footer.madeBy': 'Сайт разработал',
        'modal.contactCar': 'Связаться об этом автомобиле',
        'modal.year': 'Год',
        'modal.mileage': 'Пробег',
        'contact.messagePrefill': 'Меня интересует {carName}. Пожалуйста, пришлите больше деталей.',
        'contact.sending': 'Отправка...',
        'contact.thanks': 'Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.'
    }
};

// DOM Elements
const navbar = document.getElementById('navbarx');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const currencyToggle = document.getElementById('currencyToggle');
const carGrid = document.getElementById('carGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('carModal');
const closeModal = document.getElementById('closeModal');
let activeFilter = 'all';

function loadCars() {
    try {
        const storedCars = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || '[]');
        if (!Array.isArray(storedCars)) return [];
        return storedCars.filter(car => car && typeof car === 'object' && typeof car.name === 'string')
            .map((car, index) => ({
                id: String(car.id || `vehicle-${index}`),
                brand: String(car.brand || '').toLowerCase(),
                name: String(car.name),
                year: Number(car.year) || '',
                price: Number(car.price) || 0,
                image: String(car.image || ''),
                mileage: String(car.mileage || ''),
                description: String(car.description || ''),
                descriptionRu: String(car.descriptionRu || '')
            }));
    } catch (error) {
        return [];
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function safeImageUrl(value) {
    if (!value) return '';
    try {
        const imageUrl = new URL(value);
        return ['http:', 'https:'].includes(imageUrl.protocol) ? imageUrl.href : '';
    } catch (error) {
        return '';
    }
}

function getCurrentLanguage() {
    return localStorage.getItem('lang') || 'en';
}

function getCurrentCurrency() {
    return localStorage.getItem('currency') === 'KGS' ? 'KGS' : 'USD';
}

function formatPrice(priceUsd) {
    const currency = getCurrentCurrency();
    const amount = currency === 'KGS' ? priceUsd * USD_TO_KGS_RATE : priceUsd;
    const locale = getCurrentLanguage() === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

function updateCurrencyToggle() {
    const currency = getCurrentCurrency();
    currencyToggle.textContent = currency;
    currencyToggle.setAttribute('aria-label', `${getCurrentLanguage() === 'ru' ? 'Валюта' : 'Currency'}: ${currency}`);
    currencyToggle.title = `${getCurrentLanguage() === 'ru' ? 'Переключить валюту' : 'Switch currency'} (${currency})`;
}

function updateLanguageToggle() {
    if (!langToggle) return;
    const isRussian = getCurrentLanguage() === 'ru';
    langToggle.textContent = isRussian ? 'EN' : 'RU';
    langToggle.setAttribute('aria-label', isRussian ? 'Switch to English' : 'Переключить на русский');
}

function applyLanguage(language = getCurrentLanguage()) {
    localStorage.setItem('lang', language);
    document.documentElement.lang = language === 'ru' ? 'ru' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (!translations[language][key]) return;
        element.textContent = translations[language][key];
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translations[language][key];
        }
    });

    updateLanguageToggle();
    updateCurrencyToggle();
    renderCars(getFilteredCars());
}

function getFilteredCars() {
    const filter = activeFilter || 'all';
    return filter === 'all' ? cars : cars.filter(car => car.brand === filter);
}

// Theme Toggle
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

langToggle.addEventListener('click', () => {
    const nextLanguage = getCurrentLanguage() === 'ru' ? 'en' : 'ru';
    applyLanguage(nextLanguage);
});

currencyToggle.addEventListener('click', () => {
    localStorage.setItem('currency', getCurrentCurrency() === 'USD' ? 'KGS' : 'USD');
    updateCurrencyToggle();
    renderCars(getFilteredCars());
    if (modal.style.display === 'block') {
        const activeCar = cars.find(car => String(car.id) === modal.dataset.activeCar);
        if (activeCar) openModal(activeCar);
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateBottomNavActive();
});

// Render Cars
function renderCars(carsToShow = cars) {
    carGrid.innerHTML = '';
    if (carsToShow.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'section-subtitle';
        emptyMessage.textContent = translations[getCurrentLanguage() === 'ru' ? 'ru' : 'en']['gallery.empty'];
        carGrid.appendChild(emptyMessage);
        return;
    }

    const isRussian = getCurrentLanguage() === 'ru';

    carsToShow.forEach((car, index) => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card loading';
        const mileage = isRussian ? car.mileage.replace(/miles/gi, 'миль') : car.mileage;
        const yearLabel = isRussian ? 'Год' : 'Year';

        carCard.innerHTML = `
                <img src="${escapeHtml(safeImageUrl(car.image))}" alt="${escapeHtml(car.name)}" class="car-image">
                <div class="car-info">
                <h3 class="car-title">${escapeHtml(car.name)}</h3>
                <div class="car-details">
                    <span>${yearLabel}: ${escapeHtml(car.year)}</span>
                    <span>${escapeHtml(mileage)}</span>
                </div>
                <div class="car-price">${formatPrice(car.price)}</div>
                </div>
            `;

        carCard.addEventListener('click', () => openModal(car));
        carGrid.appendChild(carCard);

        setTimeout(() => {
            carCard.classList.remove('loading');
            carCard.classList.add('loaded');
        }, index * 100);
    });
}

// Filter Functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderCars(getFilteredCars());
    });
});

// Modal Functionality
function openModal(car) {
    const modalContent = document.getElementById('modalContent');
    const isRussian = getCurrentLanguage() === 'ru';
    const yearLabel = isRussian ? 'Год' : 'Year';
    const mileageLabel = isRussian ? 'Пробег' : 'Mileage';
    const description = isRussian ? (car.descriptionRu || car.description) : car.description;

    modalContent.innerHTML = `
                <img src="${escapeHtml(safeImageUrl(car.image))}" alt="${escapeHtml(car.name)}" class="modal-image">
                <h2>${escapeHtml(car.name)}</h2>
                <div style="display: flex; justify-content: space-between; margin: 1rem 0;">
                    <span><strong>${yearLabel}:</strong> ${escapeHtml(car.year)}</span>
                    <span><strong>${mileageLabel}:</strong> ${escapeHtml(car.mileage)}</span>
                </div>
                <div style="font-size: 2rem; color: var(--primary-color); font-weight: bold; margin: 1rem 0;">
                    ${formatPrice(car.price)}
                </div>
                <p style="line-height: 1.6; color: #f8fafc;">
                    ${escapeHtml(description)}
                </p>
            `;
    modal.dataset.activeCar = String(car.id);
    modal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

function setActiveBottomNavItem(activeItem) {
    bottomNavItems.forEach(item => {
        const isActive = item === activeItem;
        item.classList.toggle('is-active', isActive);
        if (isActive) {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
    });
}

function updateBottomNavActive() {
    const gallerySection = document.getElementById('gallery');
    const galleryTop = gallerySection.getBoundingClientRect().top;
    const activeTarget = window.scrollY > 80 && galleryTop < window.innerHeight * 0.55
        ? '#gallery'
        : '#home';
    const activeItem = Array.from(bottomNavItems).find(item => item.getAttribute('href') === activeTarget);
    if (activeItem) setActiveBottomNavItem(activeItem);
}

bottomNavItems.forEach(item => {
    item.addEventListener('click', () => setActiveBottomNavItem(item));
});

window.addEventListener('hashchange', updateBottomNavActive);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(getCurrentLanguage());
    renderCars(getFilteredCars());
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        observer.observe(el);
    });
});

// Add floating particles animation
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                opacity: 0.6;
            `;

    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';

    document.body.appendChild(particle);

    const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: 0.6 },
        { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'linear'
    });

    animation.onfinish = () => particle.remove();
}

// Create particles periodically
setInterval(createParticle, 300);