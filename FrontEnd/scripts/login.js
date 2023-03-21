

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', onLogin);


async function onLogin(event){
	event.preventDefault();
	const url = 'http://localhost:5678/api/users/login';
	const formData = new FormData(loginForm);


	const email = formData.get('email').trim();
	const password = formData.get('password').trim();

	const user = {email, password};
	if( window.sessionStorage.getItem('token') === null){
		try{
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});
			if( response.status !== 200){
				const error = await response.json();
				throw new Error(`Error: ${error.message}`);
			}

			const result = await response.json();

			const token = result.token;

			window.sessionStorage.setItem('token', token);
			window.location = './index.html';
		}catch(err){

			alert('Wrong email or password!');
		}
	}else{
		alert('User is already logged in!');
	}

}


