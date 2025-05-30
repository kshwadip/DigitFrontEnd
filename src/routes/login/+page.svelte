<script>
	import { goto } from '$app/navigation';
	let usernameOrPhone = '';
	let password = '';
	let deviceId = '';
	let isPasswordVisible = false;
	let msg;
    let isLogging = false;

	const generateDeviceId = () => {
		// Check if there's already a device ID in localStorage
		let storedDeviceId = localStorage.getItem('deviceId');

		if (!storedDeviceId) {
			// Generate a new ID if none exists
			storedDeviceId = 'device-' + Math.random().toString(36).substr(2, 20);

			localStorage.setItem('deviceId', storedDeviceId);
		}

		return storedDeviceId;
	};

	const login = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrPhone, password, deviceId })
            });
			const data = await response.json();
            if (data.success) {
				goto(data.redirectTo); 
            } else {
                msg = data.message;
            }
        } catch (err) {
            msg = err.message;
        }
    };

	const handleSubmit = (e) => {
		e.preventDefault();
		isLogging = true;
		deviceId = generateDeviceId();
		login(usernameOrPhone, password, deviceId);
		isLogging = false;
	};

</script>

<main>
	<div class="container">
		<h1>Login</h1>
		<form on:submit={handleSubmit} class="login-form">
			<div class="form-group">
				<input
					type="text"
					id="usernameOrPhone"
					bind:value={usernameOrPhone}
					placeholder="Enter your username or phone number"
					required
				/>
			</div>

			<div class="form-group">
				<input
					id="password"
					type={isPasswordVisible ? 'text' : 'password'}
					bind:value={password}
					placeholder="Enter your password"
					required
				/>
				<div id="checkbox"><input type="checkbox" checked={isPasswordVisible} on:change={() => (isPasswordVisible = !isPasswordVisible)}/>Show</div>
			</div>

			{#if msg}
				<p style="color: red;">{msg}</p>
			{/if}
			<button type="submit" disabled={isLogging}>
				{isLogging ? 'Logging...' : 'Login'}
			</button>

			<div class="forgot-password">
				<a href="/forgot-password">Forgot your password?</a>
			</div>
		</form>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #f4f4f4;
	}

	.container {
		width: 100%;
		max-width: 400px;
		background: #fff;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	h1 {
		margin-bottom: 1.5rem;
		font-size: 2rem;
		color: #333;
	}

	.login-form {
		width: 100%;
	}

	.form-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 1.5rem;
	}

    #checkbox{
		font-size: 12px;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid #ddd;
		font-size: 1rem;
	}

	.form-group input:focus {
		border-color: #5b9bd5;
		outline: none;
	}

    

	button {
		width: 100%;
		padding: 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.forgot-password {
		margin-top: 1rem;
		text-align: center;
	}

	.forgot-password a {
		color: #007bff;
		text-decoration: none;
	}

	.forgot-password a:hover {
		text-decoration: underline;
	}
</style>
