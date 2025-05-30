<script>
	let usernameOrPhone = '';
	let password = '';
	let isPasswordVisible = false;
	let msg;
	let isDeleting;

	const deleteAcc = async () => {
        try {
            const response = await fetch('/api/deleteaccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrPhone, password })
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

	const handleSubmit = (e) => {
		e.preventDefault();
		isDeleting = true;
		deleteAcc(usernameOrPhone, password);
		isDeleting = false;
	};
</script>

<main>
	<div class="container">
		<h1>Delete Account</h1>
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
			<button type="submit" disabled={isDeleting}>
				{isDeleting ? 'Deleting...' : 'Delete Account'}
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
</style>
