const url = 'http://localhost:5678/api/';


//get all the works from the API and Load the homepage
async function getAllWorks() {

	try {
		const response = await fetch(url + 'works', {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'accept': 'application/json'
			}
		});

		const works = await response.json();
		window.localStorage.setItem('works', JSON.stringify(works));


		renderGallery(works);

		return works;

	} catch (err) {
		alert(err.message);
		throw err;
	}

}

//add categories and modify if logged in
async function generateHomepage() {

	const response = await fetch(url + 'categories/',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});


	if (window.sessionStorage.getItem('token') === null) {
		const categories = await response.json();
		window.localStorage.setItem('categories', JSON.stringify(categories));
		const logged = 'login';
		renderNav(logged, logged);
		generateHomeGuest(categories);

	} else {
		const works = JSON.parse(window.localStorage.getItem('works'));
		topPublishMenu();
		generateHomeAdmin();
		renderGallery(works);
		logout();
		openGalleryModal();
	}
}

function generateHomeAdmin() {
	const portfolio = document.querySelector('#portfolio');
	const myProjectHeader = elementGenerator('h2', 'Mes projets');

	const logged = 'logout';
	const path = 'index';
	renderNav(logged, path);

	const div = elementGenerator('div', undefined, ['class=modify']);
	const modifyLink = elementGenerator('a', undefined, ['class=popup']);
	const span = elementGenerator('span', 'modify');
	const icon = elementGenerator('a', undefined, ['class=fa-regular fa-pen-to-square']);

	modifyLink.appendChild(icon);
	modifyLink.appendChild(span);
	div.appendChild(myProjectHeader);
	div.appendChild(modifyLink);
	portfolio.prepend(div);
}

function generateHomeGuest(categories) {
	const portfolio = document.querySelector('#portfolio');
	const myProjectHeader = elementGenerator('h2', 'Mes projets');
	const btnContainer = elementGenerator('div', undefined, ['class=btnContainer']);

	const allCat = elementGenerator('button', 'Tous', ['class=btn all']);
	btnContainer.appendChild(allCat);
	portfolio.prepend(btnContainer);
	portfolio.prepend(myProjectHeader);
	for (let cat of categories) {
		const button = elementGenerator('button', `${cat.name}`, ['class=btn', `data-category-id=${cat.id}`]);
		btnContainer.appendChild(button);
	}

	let buttons = document.querySelectorAll('.btn');
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', showCategories);
	}
}

function elementGenerator(type, text, attributes = []) {
	let element = document.createElement(type);
	if (text) {
		element.textContent = text;
	}
	attributes
		.map(attr => attr.split('='))
		.forEach(([name, value]) => {
			element.setAttribute(name, value);
		});
	return element;
}

function renderNav(logged, path) {
	const nav = document.querySelector('nav');
	nav.innerHTML = `<ul>
			<li><a href='./index.html'>projets</a></li>
			<li><a href='#contact'>contact</a></li>
			<li><a id='${logged}' href='./${path}.html'>${logged}</a></li>
			<li><img src='./assets/icons/instagram.png' alt='Instagram'></li>
			</ul>`;
}

// filter through different categories
function showCategories(event) {
	const works = JSON.parse(localStorage.getItem('works'));
	if (event.target.className === 'btn all') {
		getAllWorks();
	} else {
		const workCategory = works.filter(i => i.categoryId == `${event.target.dataset.categoryId}`);
		renderGallery(workCategory);
	}

}


function logout() {
	if (document.getElementById('logout')) {
		const logout = document.getElementById('logout');
		logout.addEventListener('click', () => {
			window.sessionStorage.clear();
			window.location.replace('./index.html');
		});
	}
}


function renderGallery(works) {
	const gallery = document.querySelector('.gallery');
	gallery.innerHTML = '';
	for (let work of works) {
		gallery.innerHTML += `<figure data-figure-id=${work.id}>
		 				<img src="${work.imageUrl}" alt="${work.title}">
		 				<figcaption>${work.title}</figcaption></figure>`;
	}
}



function topPublishMenu() {
	const div = elementGenerator('div', undefined, ['class=publish']);
	const modifyLink = elementGenerator('a', undefined, ['href=#']);
	const span = elementGenerator('span', 'Mode édition', []);
	const button = elementGenerator('button', 'publier les changements', []);
	const icon = elementGenerator('i', undefined, ['class=fa-regular fa-pen-to-square']);
	div.appendChild(modifyLink);
	document.querySelector('body').prepend(div);
	modifyLink.appendChild(icon);
	modifyLink.appendChild(span);
	div.appendChild(button);

}

getAllWorks();
generateHomepage();


function openGalleryModal() {
	const openModalButton = document.querySelector('.popup');
	const closeModalButton = document.querySelector('.close-button-1');
	const overlay = document.getElementById('overlay');

	openModalButton.addEventListener('click', () => {
		const modal = document.querySelector('.modal');
		openModal(modal);
	});


	overlay.addEventListener('click', () => {
		const modal = document.querySelector('.modal.active');
		closeModal(modal);
	});

	closeModalButton.addEventListener('click', () => {
		const modal = document.querySelector('.modal');
		closeModal(modal);
	});


	function openModal(modal) {
		if (modal == null) { return; };
		modal.classList.add('active');
		overlay.classList.add('active');
		loadModalImages();
	}

	function closeModal(modal) {
		if (modal == null) { return; };
		modal.classList.remove('active');
		overlay.classList.remove('active');
	}
}

function loadModalImages() {
	const works = JSON.parse(localStorage.getItem('works'));
	const modal = document.querySelector('.modal-body');

	modal.innerHTML = '';
	for (let work of works) {
		modal.innerHTML += `<div class="modal-item">
		 				<img src="${work.imageUrl}" alt="${work.title}">
						 <button class="del-image" data-image-id=${work.id}>
						 <i class="fa-solid fa-trash-can"></i>
						 </button>
		 				<a href="#">éditer</a></div>`;
	}

	addPhotoModal();
	deleteSelected();
}

function deleteSelected() {

	const deleteBtns = document.querySelectorAll('[data-image-id]');
	deleteBtns.forEach(button => {
		button.addEventListener('click', (e) => {
			const id = e.target.dataset.imageId;
			const figToRemove = document.querySelector(`[data-figure-id="${id}"]`);
			figToRemove.remove();
			e.target.parentElement.remove();
			delWork(id);
		});
	});
}


async function delWork(id) {

	const url = 'http://localhost:5678/api/works/';
	const token = window.sessionStorage.getItem('token');
	try{

		const options = {
			method: 'delete',
			headers: {
				'accept': '*/*',
				'Authorization': `Bearer ${token}`
			}
		};

		const response = await fetch(url + `${id}`, options);

		if(!response.ok){
			const error = await response.json();
			throw new Error(`Error: ${error.message}`);
		}
	}catch(err){
		alert(err.message);
	}

}

function addPhotoModal() {
	addSelectOptions();

	const galleryModal = document.querySelector('.modal.active');
	const addImgBtn = document.querySelector('.modal-input>button');
	const closeFormModal = document.querySelector('.close-button-2');
	const overlay = document.getElementById('overlay');
	const backToGalleryModalBtn = document.querySelector('.back-to-gallery');

	addImgBtn.addEventListener('click', () => {

		const modalForm = document.querySelector('.modal-form');
		galleryModal.classList.remove('active');
		openModalForm(modalForm);
	});

	closeFormModal.addEventListener('click', () => {
		const modal = document.querySelector('.modal-form');
		galleryModal.classList.remove('active');
		closeModal(modal);
	});

	backToGalleryModalBtn.addEventListener('click', () => {
		const modalForm = document.querySelector('.modal-form');
		modalForm.classList.remove('active');
		galleryModal.classList.add('active');
	});


	overlay.addEventListener('click', () => {
		const modal = document.querySelector('.modal-form.active');
		closeModal(modal);
	});

	function openModalForm(modalForm) {
		if (modalForm == null) { return; };
		modalForm.classList.add('active');
		overlay.classList.add('active');
	}

	function closeModal(modal) {
		if (modal == null) { return; };
		modal.classList.remove('active');
		overlay.classList.remove('active');
	}


	const addWork = document.querySelector('#addWork');
	addWork.addEventListener('submit', onSubmit);


	document.querySelector('#browseImg').addEventListener('change', (ev) => {
		if (!ev.target.files) {
			return;
		}
		else {
			document.querySelector('.add-img').style.display = 'none';
			document.querySelector('.display-img').style.display = 'flex';
			const reader = new FileReader();
			const image = ev.target.files[0];

			reader.onload = () => {
				const img = document.createElement('img');
				img.src = reader.result;
				img.alt = image.name;
				document.querySelector('.img-preview').append(img);
				Object.assign(image, { result: reader.result });

			};
			reader.readAsDataURL(image);

		}
	});



	async function onSubmit(event) {
		event.preventDefault();
		const valider = document.getElementById('imgSubmit');

		const formData = new FormData();
		const title = document.querySelector('#title');
		const category = document.querySelector('#categories');
		const image = document.querySelector('#browseImg');

		formData.append('image', image.files[0]);
		formData.append('title', title.value);
		formData.append('category', parseInt(category.value));



		valider.classList.add('activated');

		await uploadWork(formData);
		//show uploaded image in the gallery after upload
		const gallery = document.querySelector('.gallery');
		gallery.innerHTML += `<figure data-figure-id=${category.value}>
								 <img src="${image.files[0].result}" alt="${title.value}">
								 <figcaption>${title.value}</figcaption></figure>`;

		const modal = document.querySelector('.modal-body');
		modal.innerHTML += `<div class="modal-item">
		 				<img src="${image.files[0].result}" alt="${title.value}">
						 <button class="del-image" data-image-id=${category.value}>
						 <i class="fa-solid fa-trash-can"></i>
						 </button>
		 				<a href="#">éditer</a></div>`;

		const modalForm = document.querySelector('.modal-form');
		const overlay = document.getElementById('overlay');

		title.value = '';
		category.value = '';
		image.files[0].value = '';
		document.querySelector('.add-img').style.display = 'flex';
		document.querySelector('.display-img').style.display = 'none';
		document.querySelector('.img-preview').innerHTML = '';
		modalForm.classList.remove('active');
		overlay.classList.remove('active');


	}

}

async function uploadWork(formData) {

	const url = 'http://localhost:5678/api/works';

try{

	const token = window.sessionStorage.getItem('token');
	const options = {
		method: 'POST',
		headers: {
			'accept': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Content-Type': 'multipart/form-data'
		},
		body: formData
	};

	const response = await fetch(url, options);
	if(!response.ok){
		const error = await response.json();
		throw new Error(`Error: ${error.message}`);
	}
	const result = await response.json();
	return result;
}catch(err){
	alert(err.message);
}
}


function addSelectOptions() {
	const select = document.querySelector('#categories');
	const categories = JSON.parse(window.localStorage.getItem('categories'));
	for (let cat of categories) {
		const option = elementGenerator('option', `${cat.name}`, [`value=${cat.id}`]);
		select.appendChild(option);
	}

}