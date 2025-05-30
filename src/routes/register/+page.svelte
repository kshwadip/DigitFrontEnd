<script>
	let username = '';
	let phoneNumber = '';
	let password = '';
	let confirmPassword = '';
	let isPasswordVisible = false;
	let msg;
	let isCreating = false;

	let errors = {
		username: '',
		phoneNumber: '',
		password: '',
		confirmPassword: ''
	};

    const register = async () => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, phoneNumber, password })
            });
			const data = await response.json();
            if (response.ok) {
                msg = data.message; 
            } else {
                msg = data.message;
            }
        } catch (err) {
            msg = err.message;
        }
    };

	const validateForm = () => {
		let valid = true;

		errors = {
			username: '',
			phoneNumber: '',
			password: '',
			confirmPassword: ''
		};

		if (username.trim() === '') {
			errors.username = 'Username is required';
			valid = false;
		}

		if (phoneNumber.length < 10 || phoneNumber.length > 10) {
			errors.phoneNumber = 'Enter valid phone number';
			valid = false;
		}

		if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
			valid = false;
		}

		if (password !== confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
			valid = false;
		}

		return valid;
	};

	const submitForm = (event) => {
		event.preventDefault();
		if (validateForm()) {
			isCreating = true;
			register(username, phoneNumber, password);
			isCreating = false;
		}
	};
</script>

<main>
	<div class="container">
		<h1>Register</h1>

		<form on:submit={submitForm}>
			<div class="form-group">
				<input
					id="username"
					type="text"
					bind:value={username}
					class:error={errors.username}
					placeholder="Enter your username"
					required
				/>
				{#if errors.username}
					<div class="error-message">{errors.username}</div>
				{/if}
			</div>

			<div class="form-group">
				<input
					id="phoneNumber"
					type="tel"
					bind:value={phoneNumber}
					class:error={errors.phoneNumber}
					placeholder="Enter your phone number"
					required
				/>
				{#if errors.phoneNumber}
					<div class="error-message">{errors.phoneNumber}</div>
				{/if}
			</div>

			<div class="form-group">
				<input
					id="password"
					type={isPasswordVisible ? 'text' : 'password'}
					bind:value={password}
					class:error={errors.password}
					placeholder="Enter your password"
					required
				/>
				<div id="checkbox">
					<input
						type="checkbox"
						checked={isPasswordVisible}
						on:change={() => (isPasswordVisible = !isPasswordVisible)}
					/>Show
				</div>
				{#if errors.password}
					<div class="error-message">{errors.password}</div>
				{/if}
			</div>

			<div class="form-group">
				<input
					id="confirmPassword"
					type={isPasswordVisible ? 'text' : 'password'}
					bind:value={confirmPassword}
					class:error={errors.confirmPassword}
					placeholder="Confirm your password"
					required
				/>
				{#if errors.confirmPassword}
					<div class="error-message">{errors.confirmPassword}</div>
				{/if}
			</div>

			{#if msg}
				<p>{msg}</p>
			{/if}
			<button type="submit" disabled={isCreating}>
				{isCreating ? 'Creating...' : 'Register'}
			</button>
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

	.form-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	#checkbox {
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

	.error-message {
		color: #ff3333;
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

	.form-group input[type='checkbox'] {
		margin-right: 8px;
	}
</style>
