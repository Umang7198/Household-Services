export default {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <!-- Back Button -->
                    <div class="d-flex justify-content-start mb-3">
                        <router-link to="/" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Home
                        </router-link>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h2 class="text-center">Admin Login</h2>
                            <form @submit.prevent="login">
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter Username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" v-model="password" id="password" 
                                    minlength="8"
                                    class="form-control" placeholder="Enter Password" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Login</button>
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
            username: '',
            password: '',
            error: '',
            role: 'admin'
        };
    },
    methods: {
        async login() {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: this.username, password: this.password, role: this.role })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        // Redirect to AdminDashboard on successful login
                        this.$router.push('/admin/dashboard');
                    } else {
                        this.error = data.msg;
                    }
                } else {
                    const data = await response.json();
                    this.error = data.msg || 'Login failed';
                }
            } catch (err) {
                this.error = 'An error occurred';
            }
        }
    }
};
