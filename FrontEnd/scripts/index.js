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

	const portfolio = document.querySelector('#portfolio');
	const myProjectHeader = elementGenerator('h2', 'Mes projets');



	if (window.sessionStorage.getItem('token') === null) {
		const categories = await response.json();
		const logged = 'login';
		renderNav(logged);

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
	} else {
		topPublishMenu();

		const works = JSON.parse(window.localStorage.getItem('works'));

		const logged = 'logout';
		renderNav(logged);

		const div = elementGenerator('div', undefined,['class=modify']);
		const modifyLink = elementGenerator('a',undefined, ['class=popup']);
		const span = elementGenerator('span', 'modify');
		const icon = elementGenerator('a', undefined, ['class=fa-regular fa-pen-to-square']);

		modifyLink.appendChild(icon);
		modifyLink.appendChild(span);
		div.appendChild(myProjectHeader);
		div.appendChild(modifyLink);
		portfolio.prepend(div);
		renderGallery(works);
		logout();
		openModal();
		deleteSelected();
	}
}

function elementGenerator( type, text, attributes = []){
	let element = document.createElement(type);
	if(text){
		element.textContent = text;
	}

	attributes
			.map(attr => attr.split('='))
			.forEach(([name, value]) =>{
			element.setAttribute(name, value);
});
return element;
}

function renderNav(logged){
	const nav = document.querySelector('nav');
	nav.innerHTML = `<ul>
			<li><a href='./index.html'>projets</a></li>
			<li><a href='#contact'>contact</a></li>
			<li><a id='${logged}' href='./login.html'>${logged}</a></li>
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
		console.log();
		const logout = document.getElementById('logout');
		logout.addEventListener('click', () => {
			window.sessionStorage.clear();
			window.location.replace('./index.html');
		});
	}else{
		console.log('test logout');
	}
}


function renderGallery(works) {
	const gallery = document.querySelector('.gallery');
	gallery.innerHTML = '';
	for (let work of works) {
		gallery.innerHTML += `<figure>
		 				<img src="${work.imageUrl}" alt="${work.title}">
		 				<figcaption>${work.title}</figcaption></figure>`;
	}
}


async function uploadWork() {

	const url = 'http://localhost:5678/api/works';

	const data = {
		imageUrl: 'George',
		title: 'test test',
		categoryId: 1,
	};

	const token = window.sessionStorage.getItem('token');
	const options = {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(data)
	};
	const response = await fetch(url, options);

	const result = await response.json();
	return result;
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


function openModal(){
	const openModalButton = document.querySelector('.popup');
	const closeModalButton = document.querySelector('.close-button');
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
  if (modal == null) {return;};
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  if (modal == null) {return;};
  modal.classList.remove('active');
  overlay.classList.remove('active');
}
loadModalImages();
}

function loadModalImages(){
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

function deleteSelected(){

	const deleteBtns = document.querySelectorAll('[data-image-id]');

	deleteBtns.forEach(button => {
		button.addEventListener('click', (e) => {
			const id = e.target.dataset.imageId;
			console.log(id);
			e.target.parentElement.remove();
			// delWork(id);
			// loadModalImages();
		});
	});
}


// async function delWork(id){

// 	const url = 'http://localhost:5678/api/works/';
// 	const token = window.sessionStorage.getItem('token');
// 	console.log(token);
// 	const options = {
// 		method: 'delete',
// 		headers: {
// 			'accept': '*/*',
// 			'Authorization': `Bearer ${token}`
// 		}
// 	};

// 	await fetch(url + `${id}`, options);

// }

function addPhotoModal(){



}