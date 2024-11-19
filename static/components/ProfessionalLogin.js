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
                        <h2 class="text-center">Professional Login</h2>
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
                            <div class="d-flex justify-content-between mt-4">
                                <button type="submit" class="btn btn-primary w-50">Login</button>
                                <router-link to="/register/professionl" class="btn btn-outline-secondary w-50 ms-3">Register</router-link>
                            </div>
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
            role: 'professional'
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
                    // console.log(data)
                    // console.log(data.user.id)
                    // Assuming the response contains professional_id
                    if (data.user.id) {
                        localStorage.setItem('professional_id', data.user.id); // Store professional_id in localStorage
                        this.$router.push('/professional/dashboard'); // Redirect to dashboard
                    } else {
                        this.error = 'Login failed: Missing professional ID';
                    }
                } else {
                    const errorData = await response.json();
                    this.error = errorData.msg || 'Login failed';
                }
            } catch (err) {
                this.error = 'An error occurred';
            }
        }
    }
    
};
