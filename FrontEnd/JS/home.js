
const url = 'http://localhost:5678/api/works';



async function getAllWorks(){

	const response = await fetch(url,{method: 'GET',
	headers: {
		'accept': 'application/json'
	}});

	const works = await response.json();
	const gallery = document.querySelector('.gallery');
	gallery.innerHTML = '';

	for(let work of works){
		// const figure = document.createElement('figure');
		// const img = document.createElement('img');
		// img.src = work.imageUrl;
		// const caption = document.createElement('figcaption');
		// caption.innerText = `${work.title}`;
		//  figure.appendChild(img);
		//  figure.appendChild(caption);
		 gallery.innerHTML += `<figure>
		 <img src="${work.imageUrl}" alt="${work.title}">
		 <figcaption>${work.title}</figcaption>`;


	}
}


function addCatButtons(){

}


getAllWorks();

