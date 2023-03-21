

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
async function addCatButtons() {

	const response = await fetch(url + 'categories/',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

	const portfolio = document.querySelector('#portfolio');
	const myProjectHeader = document.createElement('h2');
	myProjectHeader.textContent = 'Mes Projets';
	const nav = document.querySelector('nav');

	if (window.sessionStorage.getItem('token') === null) {
		const categories = await response.json();

		nav.innerHTML = `<ul>
			<li><a href='./index.html'>projets</a></li>
			<li><a href='#contact'>contact</a></li>
			<li><a href='./login.html'>login</a></li>
			<li><img src='./assets/icons/instagram.png' alt='Instagram'></li>
			</ul>`;
		const btnContainer = document.createElement('div');
		btnContainer.classList.add('btnContainer');
		const allCat = document.createElement('button');
		allCat.textContent = 'Tous';
		allCat.classList.add('btn', 'all');
		btnContainer.appendChild(allCat);
		portfolio.prepend(btnContainer);
		portfolio.prepend(myProjectHeader);
		for (let cat of categories) {
			console.log(cat);
			const button = document.createElement('button');
			button.setAttribute('class', 'btn');
			button.setAttribute('data-category-id', `${cat.id}`);
			button.textContent = `${cat.name}`;
			console.log(button.dataset.categoryId);
			btnContainer.appendChild(button);
		}

		let buttons = document.querySelectorAll('.btn');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', showCategories);
		}
	} else {
		publishMenu();
		const works = JSON.parse(window.localStorage.getItem('works'));
		nav.innerHTML = `<ul>
			<li><a href="./index.html">projets</a></li>
			<li><a href="#contact">contact</a></li>
			<li><a id="logout" href="#">logout</a></li>
			<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
			</ul>`;
		const div = document.createElement('div');
		div.classList.add('modify');
		const modifyLink = document.createElement('button');
		modifyLink.classList.add('modal');
		const span = document.createElement('span');
		span.textContent = 'modify';
		const icon = document.createElement('i');
		icon.classList.add('fa-regular', 'fa-pen-to-square');
		modifyLink.appendChild(icon);
		modifyLink.appendChild(span);
		div.appendChild(myProjectHeader);
		div.appendChild(modifyLink);
		portfolio.prepend(div);
		renderGallery(works);


	}
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


// function logout() {
// 	if(document.querySelector('#logout')){


// 	const logout = document.querySelector('#logout');

// 	logout.addEventListener('onclick', (event) => {
// 		event.preventDefault();
// 		window.sessionStorage.clear();
// 		window.location.replace('./login.html');
// 	});
// }
// }


function renderGallery(works) {
	const gallery = document.querySelector('.gallery');
	gallery.innerHTML = '';
	for (let work of works) {
		gallery.innerHTML += `<figure>
		 				<img src="${work.imageUrl}" alt="${work.title}">
		 				<figcaption>${work.title}</figcaption>`;
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
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(data)
	};
	const response = await fetch(url, options);

	const result = await response.json();
	return result;
}

function publishMenu() {
	const div = document.createElement('div');
	div.setAttribute('class', 'publish');
	const modifyLink = document.createElement('a');
	modifyLink.href = '#';
	const span = document.createElement('span');
	span.textContent = 'Mode édition';
	const button = document.createElement('button');
	button.textContent = 'publier les changements';
	const icon = document.createElement('i');
	icon.classList.add('fa-regular', 'fa-pen-to-square');
	div.appendChild(modifyLink);
	document.querySelector('body').prepend(div);
	modifyLink.appendChild(icon);
	modifyLink.appendChild(span);
	div.appendChild(button);

}



getAllWorks();
addCatButtons();
