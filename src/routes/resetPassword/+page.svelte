<script>
	let usernameOrPhone = '';
	let otp = '';
	let isOtpSent = false;

	const resetpassword = async () => {
        try {
            const response = await fetch('/api/resetpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrPhone, newPassword })
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

</script>

<main>
	<div class="container">
		{#if !isOtpSent}
			<h1>Forgot Password</h1>
			<form>
				<div class="form-group">
					<input
						type="tel"
						id="phone"
						bind:value={usernameOrPhone}
						placeholder="Enter your username or phone number"
						required
					/>
				</div>
				<button type="submit">Send OTP</button>
			</form>
		{:else}
			<h1>Enter OTP</h1>
			<p>We have sent an OTP to your phone number. Please enter it below.</p>
			<div class="form-group">
				<input
					type="text"
					id="otp"
					bind:value={otp}
					placeholder="Enter OTP"
					required
					maxlength="6"
				/>
			</div>
			<button>Verify OTP</button>
		{/if}
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
		margin-bottom: 1.5rem;
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

	p {
		color: #ff0000;
	}
</style>
