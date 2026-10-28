const INVENTORY_STORAGE_KEY = 'koreamotors.inventory.v1';
const ADMIN_SESSION_KEY = 'koreamotors.demoAdminSession';
const DEMO_USERNAME = 'koreamotors.export';
const DEMO_PASSWORD = '1234';
const USD_TO_KGS_RATE = 87.5;

const loginView = document.getElementById('loginView');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const passwordInput = document.getElementById('password');
const dashboard = document.getElementById('dashboard');
const carForm = document.getElementById('carForm');
const carList = document.getElementById('carList');
const carCount = document.getElementById('carCount');
const saveMessage = document.getElementById('saveMessage');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const editorTitle = document.getElementById('editorTitle');
let cars = loadCars();

function loadCars() {
    try {
        const value = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || '[]');
        if (!Array.isArray(value)) return [];
        return value.filter(car => car && typeof car === 'object' && typeof car.name === 'string')
            .map((car, index) => ({
                id: String(car.id || `vehicle-${index}`),
                brand: String(car.brand || '').trim().toLowerCase(),
                name: String(car.name),
                year: Number(car.year) || '',
                price: Number(car.price) || 0,
                image: safeImageUrl(car.image),
                mileage: String(car.mileage || ''),
                description: String(car.description || ''),
                descriptionRu: String(car.descriptionRu || '')
            }));
    } catch (error) {
        return [];
    }
}

function persistCars(nextCars) {
    try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(nextCars));
        cars = nextCars;
        return true;
    } catch (error) {
        saveMessage.textContent = 'Не удалось сохранить данные. Возможно, хранилище браузера заполнено.';
        return false;
    }
}

function safeImageUrl(value) {
    if (!value) return '';
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (error) {
        return '';
    }
}

function formatPrice(priceUsd) {
    const currency = localStorage.getItem('currency') === 'KGS' ? 'KGS' : 'USD';
    const amount = currency === 'KGS' ? priceUsd * USD_TO_KGS_RATE : priceUsd;
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

function showDashboard() {
    loginView.hidden = true;
    dashboard.hidden = false;
    renderInventory();
}

function renderInventory() {
    carList.replaceChildren();
    carCount.textContent = String(cars.length);

    if (cars.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-inventory';
        empty.textContent = 'Каталог пока пуст. Добавьте первое объявление через форму.';
        carList.appendChild(empty);
        return;
    }

    cars.forEach(car => {
        const row = document.createElement('article');
        row.className = 'car-row';

        const image = document.createElement('img');
        image.className = 'car-thumb';
        image.alt = '';
        image.src = car.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58"%3E%3Crect width="58" height="58" fill="%23edf2ee"/%3E%3Cpath d="M10 34h38l-4-10H17z" fill="%238a9b91"/%3E%3Ccircle cx="20" cy="37" r="4" fill="%2333443d"/%3E%3Ccircle cx="39" cy="37" r="4" fill="%2333443d"/%3E%3C/svg%3E';

        const main = document.createElement('div');
        main.className = 'car-row-main';
        const name = document.createElement('strong');
        name.textContent = car.name;
        const meta = document.createElement('p');
        meta.className = 'car-row-meta';
        meta.textContent = `${car.year} · ${formatPrice(car.price)}`;
        const actions = document.createElement('div');
        actions.className = 'car-row-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.dataset.action = 'edit';
        editButton.dataset.id = car.id;
        editButton.textContent = 'Изменить';

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.dataset.action = 'delete';
        deleteButton.dataset.id = car.id;
        deleteButton.textContent = 'Удалить';

        actions.append(editButton, deleteButton);
        main.append(name, meta, actions);
        row.append(image, main);
        carList.appendChild(row);
    });
}

function resetEditor() {
    carForm.reset();
    document.getElementById('carId').value = '';
    editorTitle.textContent = 'Добавить автомобиль';
    saveButton.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i> Добавить в каталог';
    cancelButton.hidden = true;
    saveMessage.textContent = '';
}

loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');

    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
        loginMessage.textContent = 'Неверный логин или пароль.';
        return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
    loginMessage.textContent = '';
    showDashboard();
});

document.getElementById('passwordToggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const reveal = passwordInput.type === 'password';
    passwordInput.type = reveal ? 'text' : 'password';
    button.setAttribute('aria-label', reveal ? 'Скрыть пароль' : 'Показать пароль');
    button.innerHTML = `<i class="fa-regular ${reveal ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>`;
});

document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    dashboard.hidden = true;
    loginView.hidden = false;
    loginForm.reset();
});

cancelButton.addEventListener('click', resetEditor);

carForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(carForm);
    const imageValue = String(formData.get('image') || '').trim();
    const image = safeImageUrl(imageValue);
    if (imageValue && !image) {
        saveMessage.textContent = 'Укажите корректную ссылку на изображение с http:// или https://.';
        return;
    }

    const id = String(formData.get('id') || '');
    const existing = cars.find(car => car.id === id);
    const car = {
        id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `vehicle-${Date.now()}`),
        brand: String(formData.get('brand') || '').trim().toLowerCase(),
        name: String(formData.get('name') || '').trim(),
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        image,
        mileage: String(formData.get('mileage') || '').trim(),
        description: String(formData.get('description') || '').trim(),
        descriptionRu: existing?.descriptionRu || ''
    };

    const nextCars = existing
        ? cars.map(savedCar => savedCar.id === id ? car : savedCar)
        : [...cars, car];

    if (!persistCars(nextCars)) return;
    resetEditor();
    saveMessage.textContent = 'Объявление сохранено в этом браузере.';
    renderInventory();
});

carList.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const car = cars.find(item => item.id === button.dataset.id);
    if (!car) return;

    if (button.dataset.action === 'edit') {
        document.getElementById('carId').value = car.id;
        document.getElementById('carName').value = car.name;
        document.getElementById('carBrand').value = car.brand;
        document.getElementById('carYear').value = car.year;
        document.getElementById('carPrice').value = car.price;
        document.getElementById('carMileage').value = car.mileage;
        document.getElementById('carImage').value = car.image;
        document.getElementById('carDescription').value = car.description;
        editorTitle.textContent = 'Редактировать автомобиль';
        saveButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Сохранить изменения';
        cancelButton.hidden = false;
        saveMessage.textContent = '';
        document.getElementById('carName').focus();
        return;
    }

    if (button.dataset.action === 'delete' && window.confirm(`Удалить «${car.name}» из каталога?`)) {
        if (persistCars(cars.filter(item => item.id !== car.id))) {
            if (document.getElementById('carId').value === car.id) resetEditor();
            saveMessage.textContent = 'Объявление удалено.';
            renderInventory();
        }
    }
});

if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active') showDashboard();
