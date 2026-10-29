import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, cloudinaryConfig, db } from '../firebase-config.js';

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
const imageInput = document.getElementById('carImages');
const imagePreview = document.getElementById('imagePreview');
const editorTitle = document.getElementById('editorTitle');
let cars = [];

function showLogin() {
    dashboard.hidden = true;
    loginView.hidden = false;
}

function showDashboard() {
    loginView.hidden = true;
    dashboard.hidden = false;
}

async function refreshUserSession() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        await user.reload();
        return auth.currentUser;
    } catch (error) {
        console.warn('Could not refresh auth user session:', error);
        return auth.currentUser;
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
        image.src = car.image || car.images?.[0] || '';

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

async function loadCars() {
    const snapshot = await getDocs(collection(db, 'cars'));
    cars = snapshot.docs.map(carDocument => ({
        id: carDocument.id,
        ...carDocument.data()
    }));
    renderInventory();
}

async function verifyAdmin(user) {
    const refreshedUser = await refreshUserSession();
    const currentUser = refreshedUser || user;

    if (!currentUser?.emailVerified) {
        loginMessage.textContent = 'Сначала подтвердите email администратора через Firebase. После подтверждения выйдите и войдите в аккаунт снова.';
        await signOut(auth);
        return;
    }

    try {
        const adminDocument = await getDoc(doc(db, 'admins', currentUser.uid));
        if (!adminDocument.exists()) {
            loginMessage.textContent = 'У этой учётной записи нет доступа администратора.';
            await signOut(auth);
            return;
        }

        await loadCars();
        loginMessage.textContent = '';
        showDashboard();
    } catch (error) {
        console.error('Admin verification failed:', error);
        loginMessage.textContent = 'Не удалось проверить доступ. Проверьте настройки Firebase и правила Firestore.';
        await signOut(auth);
    }
}

async function uploadImages(files) {
    if (files.length === 0) return [];
    if (cloudinaryConfig.cloudName.startsWith('YOUR_') || cloudinaryConfig.uploadPreset.startsWith('YOUR_')) {
        throw new Error('Сначала укажите Cloudinary cloud name и unsigned upload preset в firebase-config.js.');
    }

    return Promise.all(files.map(async file => {
        if (!file.type.startsWith('image/')) throw new Error('Можно загружать только изображения.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Размер каждой фотографии не должен превышать 10 МБ.');

        const body = new FormData();
        body.append('file', file);
        body.append('upload_preset', cloudinaryConfig.uploadPreset);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryConfig.cloudName)}/image/upload`, {
            method: 'POST',
            body
        });
        const result = await response.json();
        if (!response.ok || !result.secure_url) {
            throw new Error(result.error?.message || 'Cloudinary не принял фотографию.');
        }
        return result.secure_url;
    }));
}

function resetEditor() {
    carForm.reset();
    document.getElementById('carId').value = '';
    imagePreview.removeAttribute('src');
    imagePreview.hidden = true;
    editorTitle.textContent = 'Добавить автомобиль';
    saveButton.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i> Добавить в каталог';
    cancelButton.hidden = true;
    saveMessage.textContent = '';
}

loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    loginMessage.textContent = '';
    const formData = new FormData(loginForm);
    try {
        await signInWithEmailAndPassword(
            auth,
            String(formData.get('username') || '').trim(),
            String(formData.get('password') || '')
        );
    } catch (error) {
        loginMessage.textContent = error.code === 'auth/invalid-credential'
            ? 'Неверный email или пароль.'
            : 'Не удалось войти. Проверьте email, пароль и настройки Firebase Authentication.';
    }
});

document.getElementById('passwordToggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const reveal = passwordInput.type === 'password';
    passwordInput.type = reveal ? 'text' : 'password';
    button.setAttribute('aria-label', reveal ? 'Скрыть пароль' : 'Показать пароль');
    button.innerHTML = `<i class="fa-regular ${reveal ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>`;
});

document.getElementById('logoutButton').addEventListener('click', () => signOut(auth));
cancelButton.addEventListener('click', resetEditor);

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.hidden = false;
});

carForm.addEventListener('submit', async event => {
    event.preventDefault();
    saveButton.disabled = true;
    saveMessage.textContent = 'Сохраняю объявление...';
    const formData = new FormData(carForm);
    const id = String(formData.get('id') || '');
    const existing = cars.find(car => car.id === id);

    try {
        const uploadedImages = await uploadImages(Array.from(imageInput.files || []));
        const images = uploadedImages.length
            ? uploadedImages
            : existing?.images || (existing?.image ? [existing.image] : []);
        const car = {
            brand: String(formData.get('brand') || '').trim().toLowerCase(),
            name: String(formData.get('name') || '').trim(),
            year: Number(formData.get('year')),
            price: Number(formData.get('price')),
            images,
            image: images[0] || '',
            mileage: String(formData.get('mileage') || '').trim(),
            description: String(formData.get('description') || '').trim(),
            descriptionRu: existing?.descriptionRu || '',
            createdAt: existing?.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        if (existing) {
            await setDoc(doc(db, 'cars', existing.id), car);
        } else {
            await addDoc(collection(db, 'cars'), car);
        }

        await loadCars();
        resetEditor();
        saveMessage.textContent = 'Объявление сохранено в Firebase.';
    } catch (error) {
        console.error('Could not save vehicle:', error);
        saveMessage.textContent = error.message || 'Не удалось сохранить объявление. Проверьте подключение и права доступа.';
    } finally {
        saveButton.disabled = false;
    }
});

carList.addEventListener('click', async event => {
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
        document.getElementById('carMileage').value = car.mileage || '';
        document.getElementById('carDescription').value = car.description || '';
        const currentImage = car.image || car.images?.[0];
        imagePreview.hidden = !currentImage;
        if (currentImage) imagePreview.src = currentImage;
        editorTitle.textContent = 'Редактировать автомобиль';
        saveButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Сохранить изменения';
        cancelButton.hidden = false;
        saveMessage.textContent = '';
        document.getElementById('carName').focus();
        return;
    }

    if (button.dataset.action === 'delete' && window.confirm(`Удалить «${car.name}» из каталога?`)) {
        try {
            await deleteDoc(doc(db, 'cars', car.id));
            cars = cars.filter(item => item.id !== car.id);
            if (document.getElementById('carId').value === car.id) resetEditor();
            saveMessage.textContent = 'Объявление удалено из каталога.';
            renderInventory();
        } catch (error) {
            console.error('Could not delete vehicle:', error);
            saveMessage.textContent = 'Не удалось удалить объявление. Проверьте права доступа.';
        }
    }
});

onAuthStateChanged(auth, async user => {
    if (user) {
        await verifyAdmin(user);
    } else {
        showLogin();
    }
});