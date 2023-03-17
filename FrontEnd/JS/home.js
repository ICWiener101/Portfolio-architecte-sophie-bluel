
const url = 'http://localhost:5678/api/';


//get all the works from the API and Load the homepage
async function getAllWorks() {
	try {
		const response = await fetch(url + 'works', {
			method: 'GET',
			headers: {
				'accept': 'application/json'
			}
		});

			const works = await response.json();
			window.localStorage.setItem('works', JSON.stringify(works));
			const gallery = document.querySelector('.gallery');
			gallery.innerHTML = '';


			renderGallery(works);
			// for (let work of works) {
			// 	// const figure = document.createElement('figure');
			// 	// const img = document.createElement('img');
			// 	// img.src = work.imageUrl;
			// 	// const caption = document.createElement('figcaption');
			// 	// caption.innerText = `${work.title}`;
			// 	//  figure.appendChild(img);
			// 	//  figure.appendChild(caption);
			// 	gallery.innerHTML += `<figure>
		 	// 			<img src="${work.imageUrl}" alt="${work.title}">
		 	// 			<figcaption>${work.title}</figcaption>`;
			// }

			return works;

		} catch (err) {
			// alert(err.message);
			throw err; //to tell the functions that there is an error, otherwise they might continue working with false data
	}

}

async function addCatButtons() {

	const response = await fetch(url + 'categories/',
		{
			method: 'GET',
			headers: {
				'accept': 'application/json'
			}
		});

	const categories = await response.json();
	const portfolio = document.querySelector('#portfolio');
	const myProjectHeader = document.createElement('h2');
	myProjectHeader.textContent = 'Mes Projets';
	const btnContainer = document.createElement('div');
	btnContainer.classList.add('btnContainer');
	const allCat = document.createElement('button');
	allCat.textContent = 'Tous';
	allCat.classList.add('btn', 'all');
	btnContainer.appendChild(allCat);
	portfolio.prepend(btnContainer);
	portfolio.prepend(myProjectHeader);
	// portfolio.innerHTML =
		for ( let cat of categories){
			let btnClass = cat.name.toLowerCase().slice(0, 6).toLowerCase();
			let  btn = document.createElement('button');
			btn.classList.add('btn', `${btnClass}`);
			btn.textContent = cat.name;
			btnContainer.appendChild(btn);
		}

	let buttons = document.querySelectorAll('.btn');
	for( let i=0; i<buttons.length; i++){
		buttons[i].addEventListener('click', showCategories);
	}

}

function showCategories(event){
	const works = JSON.parse(localStorage.getItem('works'));
	if(event.target.className === 'btn all'){
		console.log('check', event.target);
		getAllWorks();
	}else if(event.target.className === 'btn objets'){
		const objCategorie = works.filter(i => i.categoryId == 1);
		renderGallery(objCategorie);
	}else if(event.target.className === 'btn appart'){
		const objCategorie = works.filter(i => i.categoryId == 2);
		renderGallery(objCategorie);
	}else if(event.target.className === 'btn hotels'){
		const objCategorie = works.filter(i => i.categoryId == 3);
		console.log('hotels');
		renderGallery(objCategorie);
	}
}



function renderGallery(works){
	const gallery = document.querySelector('.gallery');
			gallery.innerHTML = '';
			for (let work of works) {
				gallery.innerHTML += `<figure>
		 				<img src="${work.imageUrl}" alt="${work.title}">
		 				<figcaption>${work.title}</figcaption>`;
			}
}








getAllWorks();
addCatButtons();