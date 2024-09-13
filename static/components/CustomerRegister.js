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
                                    <input type="text" v-model="mobile" id="mobile" class="form-control" placeholder="Enter your mobile number" required>
                                </div>
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter your username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" v-model="password" id="password" class="form-control" placeholder="Enter your password" required>
                                </div>
                                <div class="mb-3">
                                    <label for="address" class="form-label">Address</label>
                                    <input type="text" v-model="address" id="address" class="form-control" placeholder="Enter your address" required>
                                </div>
                                <div class="mb-3">
                                    <label for="pin" class="form-label">Postal Code</label>
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
            error: ''
        };
    },
    methods: {
        async register() {
            try {
                const response = await fetch('/register', {
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
                    window.location.href = '/login/customer';  // Redirect to customer login after successful registration
                } else {
                    const data = await response.json();
                    this.error = data.msg || 'Registration failed';
                }
            } catch (err) {
                this.error = 'An error occurred';
            }
        }
    }
};
