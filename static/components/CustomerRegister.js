export default {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <!-- Back Button -->
                    <div class="d-flex justify-content-start mb-3">
                        <router-link to="/login/customer" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Customer Login
                        </router-link>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h2 class="text-center mb-4">Customer Registration</h2>
                            <form @submit.prevent="register">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" v-model="name" id="name" class="form-control" placeholder="Enter your name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" v-model="email" id="email" class="form-control" placeholder="Enter your email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="mobile" class="form-label">Mobile</label>
                                    <input type="text" v-model="mobile" id="mobile" class="form-control" placeholder="Enter your mobile number" 
                                    minlength="10"
                                    required>
                                </div>
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter your username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        v-model="password" 
                                        id="password" 
                                        class="form-control" 
                                        placeholder="Enter your password" 
                                        required 
                                        @input="validatePassword"
                                    >
                                    <small class="text-muted">
                                        Password must contain at least 8 characters, including uppercase, lowercase, number, and a special character.
                                    </small>
                                    <p v-if="passwordError" class="text-danger mt-1">{{ passwordError }}</p>
                                </div>

                                <div class="mb-3">
                                    <label for="address" class="form-label">Address</label>
                                    <input type="text" v-model="address" id="address" class="form-control" placeholder="Enter your address" required>
                                </div>
                                <div class="mb-3">
                                    <label for="pin" class="form-label">Pin Code</label>
                                    <input type="text" v-model="pin" id="pin" class="form-control" placeholder="Enter your postal code" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Register</button>
                                <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            name: '',
            email: '',
            mobile: '',
            username: '',
            password: '',
            address: '',
            pin: '',
            error: '',
            passwordError: '' // For password validation feedback

        };
    },
    methods: {
        async register() {
            try {
                const response = await fetch('/register/customer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.name,
                        email: this.email,
                        mobile: this.mobile,
                        username: this.username,
                        password: this.password,
                        address: this.address,
                        pin: this.pin,
                        role: 'customer'  // Automatically set role as 'customer'
                    })
                });

                if (response.ok) {
                    alert('Registration successful!');

                    this.$router.push('/login/customer');
                } else {
                    const data = await response.json();
                    this.error = data.msg || 'Registration failed';
                }
            } catch (err) {
                this.error = 'An error occurred';
            }
        },
        validatePassword() {
            const hasLength = this.password.length >= 8;
            const hasLetter = /[A-Za-z]/.test(this.password);
            const hasDigit = /\d/.test(this.password);
            const hasSpecialChar = /[@$!%*?&]/.test(this.password);
        
            if (!hasLength) {
                this.passwordError = 'Password must be at least 8 characters long.';
            } else if (!hasLetter) {
                this.passwordError = 'Password must contain at least one letter.';
            } else if (!hasDigit) {
                this.passwordError = 'Password must contain at least one number.';
            } else if (!hasSpecialChar) {
                this.passwordError = 'Password must contain at least one special character.';
            } else {
                this.passwordError = '';
            }
        }
        
    }
};
