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
		openModal();
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


function openModal() {

	renderModal();
	renderFormModal();
	fileHandler();


	const openModalButton = document.querySelector('.popup');
	const closeModalButton = document.querySelector('.close-button-1');
	const closeFormModalButton = document.querySelector('.close-button-2');
	const overlay = document.getElementById('overlay');
	const addImgBtn = document.querySelector('.modal-input>button');
	const backToGalleryModalBtn = document.querySelector('.back-to-gallery');
	const galleryModal = document.querySelector('.modal');

	addImgBtn.addEventListener('click', () => {
		const modalForm = document.querySelector('.modal-form');
		galleryModal.classList.remove('active');
		modalForm.classList.add('active');

	});

	openModalButton.addEventListener('click', () => {
		const modal = document.querySelector('.modal');
		openModal(modal);
		deleteSelected();
	});

	backToGalleryModalBtn.addEventListener('click', () => {
		const modalForm = document.querySelector('.modal-form');
		modalForm.classList.remove('active');
		galleryModal.classList.add('active');
	});

	overlay.addEventListener('click', () => {
		const modal = document.querySelector('.modal.active');
		const modalForm = document.querySelector('.modal-form.active');
		closeModal(modal);
		closeModal(modalForm);
	});

	closeModalButton.addEventListener('click', () => {
		const modal = document.querySelector('.modal');

		closeModal(modal);
	});

	closeFormModalButton.addEventListener('click', () => {
		const modal = document.querySelector('.modal-form');

		closeModal(modal);
	});

	function openModal(modal) {
		if (modal == null) { return; };
		modal.classList.add('active');
		overlay.classList.add('active');

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


}

function deleteSelected() {

	const deleteBtns = document.querySelectorAll('[data-image-id]');
	deleteBtns.forEach(button => {
		button.addEventListener('click', (e) => {
			const idToRemove = e.target.dataset.imageId;

			const works = JSON.parse(localStorage.getItem('works'));
			window.localStorage.removeItem('works');

			const found = works.find(el => el.id == idToRemove);
			const index = works.indexOf(found);

			works.splice(index, 1);

			const figToRemove = document.querySelector(`[data-figure-id="${idToRemove}"]`);
			figToRemove.remove();
			e.target.parentElement.remove();
			window.localStorage.setItem('works', JSON.stringify(works));
			delWork(idToRemove);
		});
	});
}



async function delWork(id) {

	const url = 'http://localhost:5678/api/works/';
	const token = window.sessionStorage.getItem('token');
	try {

		const options = {
			method: 'delete',
			headers: {
				'accept': '*/*',
				'Authorization': `Bearer ${token}`
			}
		};

		const response = await fetch(url + `${id}`, options);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Error: ${error.message}`);
		}
	} catch (err) {
		alert(err.message);
	}

}


function fileHandler() {
	const addWork = document.querySelector('#addWork');
	addWork.addEventListener('submit', onSubmit);


	document.querySelector('#browseImg').addEventListener('change', (ev) => {
		if (!ev.target.files) {
			return;
		}
		else {
			console.log(ev.target.files);
			document.querySelector('.img-preview').innerHTML = '';
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
	const valider = document.getElementById('imgSubmit');

	const formData = new FormData();
	const title = document.querySelector('#title');
	const category = document.querySelector('#categories');
	const image = document.querySelector('#browseImg');

	const inputList = [title, category, image];

	inputList.forEach(function (input) {
		input.addEventListener('input', () => {
			if (image.files[0] && title.value && category.value) {
				valider.classList.add('green');
			}
		});
	});

	async function onSubmit(event) {
		event.preventDefault();

		formData.append('image', image.files[0]);
		formData.append('title', title.value);
		formData.append('category', parseInt(category.value));

		if (title.value == '' || image.files[0] == undefined || category.value == '') {
			return alert('Please fill all the fields!');
		} else {

			const result = await uploadWork(formData);
			const works = JSON.parse(localStorage.getItem('works'));
			window.localStorage.removeItem('works');
			works.push(result);
			window.localStorage.setItem('works', JSON.stringify(works));
			//show uploaded image in the gallery after upload
			const gallery = document.querySelector('.gallery');
			gallery.innerHTML += `<figure data-figure-id=${result.id}>
									 <img src="${result.imageUrl}" alt="${result.title}">
									 <figcaption>${result.title}</figcaption></figure>`;

			const modal = document.querySelector('.modal-body');
			modal.innerHTML += `<div class="modal-item">
							 <img src="${result.imageUrl}" alt="${result.title}">
							 <button class="del-image" data-image-id=${result.id}>
							 <i class="fa-solid fa-trash-can"></i>
							 </button>
							 <a href="#">éditer</a></div>`;

			const modalForm = document.querySelector('.modal-form');
			const overlay = document.getElementById('overlay');

			image.files[0].value = '';
			addWork.reset();

			document.querySelector('.img-preview img').remove();
			document.querySelector('.img-preview').innerHTML = '';

			document.querySelector('.add-img').style.display = 'flex';
			document.querySelector('.display-img').style.display = 'none';
			modalForm.classList.remove('active');
			overlay.classList.remove('active');


		}


	}

}
async function uploadWork(formData) {
//test
	const url = 'http://localhost:5678/api/works';

	try {

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

		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Error: ${error.message}`);
		}
		const result = await response.json();
		return result;
	} catch (err) {
		alert(err.message);
	}


}


function addSelectOptions() {
	const select = document.querySelector('#categories');
	const categories = JSON.parse(window.localStorage.getItem('categories'));
	const emptySlot = elementGenerator('option', undefined, ['value=']);
	select.appendChild(emptySlot);
	for (let cat of categories) {
		const option = elementGenerator('option', `${cat.name}`, [`value=${cat.id}`]);
		select.appendChild(option);
	}

}



function renderModal() {
	const modalSection = document.querySelector('.modal-section');
	const modal = elementGenerator('div', undefined, ['class=modal']);
	const modalNav = elementGenerator('div', undefined, ['class=modal-nav']);
	const closeButton = elementGenerator('button', undefined, ['class=close-button-1']);
	const btnIcon = elementGenerator('i', undefined, ['class=fa-solid fa-xmark']);
	const modalHeader = elementGenerator('div', undefined, ['class=modal-header']);
	const h2 = elementGenerator('h2', 'Galerie photo', ['class=modal-title']);
	const modalBody = elementGenerator('div', undefined, ['class=modal-body']);
	const modalInput = elementGenerator('div', undefined, ['class=modal-input']);
	const inputBtn = elementGenerator('button', 'Ajouter une photo', []);
	const a = elementGenerator('a', 'Supprimer la galerie', ['href=#']);
	const overlay = elementGenerator('div', undefined, ['id=overlay']);
	closeButton.appendChild(btnIcon);
	modalNav.appendChild(closeButton);
	modalHeader.appendChild(h2);

	modalInput.appendChild(inputBtn);
	modalInput.appendChild(a);

	modal.appendChild(modalNav);
	modal.appendChild(modalHeader);
	modal.appendChild(modalBody);
	modal.appendChild(modalInput);

	modalSection.appendChild(modal);
	modalSection.appendChild(overlay);

	loadModalImages();

}

function renderFormModal() {
	const modalFormSection = document.querySelector('.modal-form-section');
	const modalForm = elementGenerator('div', undefined, ['class=modal-form']);

	const modalNav = elementGenerator('div', undefined, ['class=modal-nav']);
	const closeButton = elementGenerator('button', undefined, ['class=close-button-2']);
	const backButton = elementGenerator('button', undefined, ['class=back-to-gallery']);
	const closeIcon = elementGenerator('i', undefined, ['class=fa-solid fa-xmark']);
	const backIcon = elementGenerator('i', undefined, ['class=fa-solid fa-arrow-left-long']);
	const modalHeader = elementGenerator('div', undefined, ['class=modal-form-header']);
	const h2 = elementGenerator('h2', 'Ajout photo', ['class=modal-form-title']);

	const form = elementGenerator('form', undefined, ['id=addWork']);
	const divAddImg = elementGenerator('div', undefined, ['class=add-img']);
	const imageIcon = elementGenerator('i', undefined, ['class=fa-regular fa-image']);
	const p = elementGenerator('p', undefined, []);
	const labelAddPic = elementGenerator('label', '+ Ajouter photo', ['for=browseImg']);
	const fileInput = elementGenerator('input', undefined, ['type=file', 'id=browseImg', 'name=image', 'accept=image/png, image/jpg', 'class=inputCheck']);
	const imgType = elementGenerator('p', 'jpg, png : 4mo max', ['class=image-type']);
	const displayImg = elementGenerator('div', undefined, ['class=display-img']);
	const imgPreview = elementGenerator('div', undefined, ['class=img-preview']);
	const titleImgForm = elementGenerator('div', undefined, ['class=modal-titleImg-form']);
	const labelTitle = elementGenerator('label', 'Titre', ['for=title']);
	const titleInput = elementGenerator('input', undefined, ['type=text', 'id=title', 'name=title', 'class=inputCheck']);
	const divCat = elementGenerator('div', undefined, ['class=category']);
	const labelCat = elementGenerator('label', 'Catégorie', ['for=categories']);
	const selectCat = elementGenerator('select', undefined, ['id=categories', 'name=categories', 'class=inputCheck']);

	const modalFormInput = elementGenerator('div', undefined, ['class=modal-form-input']);
	const submit = elementGenerator('input', undefined, ['type=submit', 'id=imgSubmit', 'value=Valider']);
	const overlay = elementGenerator('div', undefined, ['id=overlay']);


	closeButton.appendChild(closeIcon);
	backButton.appendChild(backIcon);
	modalNav.appendChild(backButton);
	modalNav.appendChild(closeButton);

	modalForm.appendChild(modalNav);

	modalHeader.appendChild(h2);
	modalForm.appendChild(modalHeader);

	divAddImg.appendChild(imageIcon);
	p.appendChild(labelAddPic);
	p.appendChild(fileInput);
	divAddImg.appendChild(p);
	divAddImg.appendChild(imgType);

	form.appendChild(divAddImg);
	displayImg.appendChild(imgPreview);
	form.appendChild(displayImg);

	titleImgForm.appendChild(labelTitle);
	titleImgForm.appendChild(titleInput);
	form.appendChild(titleImgForm);

	divCat.appendChild(labelCat);
	divCat.appendChild(selectCat);

	form.appendChild(divCat);

	modalFormInput.appendChild(submit);
	form.appendChild(modalFormInput);

	modalForm.appendChild(form);
	modalForm.appendChild(overlay);

	modalFormSection.appendChild(modalForm);
	modalFormSection.appendChild(overlay);

	addSelectOptions();

}