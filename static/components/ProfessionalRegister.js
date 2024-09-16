export default {
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="d-flex justify-content-start mb-3">
            <router-link to="/login/professional" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left"></i> Back to Home
            </router-link>
          </div>
          <div class="card">
            <div class="card-body">
              <h2 class="text-center">Professional Registration</h2>
              <form @submit.prevent="register">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" v-model="name" id="name" class="form-control" placeholder="Enter Full Name" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" v-model="email" id="email" class="form-control" placeholder="Enter Email" required>
                </div>
                <div class="mb-3">
                  <label for="mobile" class="form-label">Mobile</label>
                  <input type="text" v-model="mobile" id="mobile" class="form-control" placeholder="Enter Mobile Number" required>
                </div>
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter Username" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" v-model="password" id="password" class="form-control" placeholder="Enter Password" required>
                </div>
                <div class="mb-3">
                  <label for="service" class="form-label">Service Name</label>
                  <select v-model="service_id" id="service" class="form-select" required>
                      <option value="" disabled selected>Select a Service</option> <!-- Placeholder option -->
                      <option v-for="service in services" :value="service.id" :key="service.id">
                        {{ service.name }}
                      </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="experience" class="form-label">Experience (in years)</label>
                  <input type="number" v-model="experience" id="experience" class="form-control" placeholder="Years of experience" required>
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea v-model="description" id="description" class="form-control" placeholder="Describe your expertise" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <input type="text" v-model="address" id="address" class="form-control" placeholder="Enter Address" required>
                </div>
                <div class="mb-3">
                  <label for="pin" class="form-label">PIN Code</label>
                  <input type="text" v-model="pin" id="pin" class="form-control" placeholder="Enter PIN Code" required>
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
      experience: '',
      description: '',
      address: '',
      pin: '',
      error: '',
      services: [],
      service_id: '',
    };
  },
  created() {
    this.fetchServices();  // Fetch available services when component is created
  },
  methods: {
    async fetchServices() {
      try {
        const response = await fetch('/services');    
        if (response.ok) {
          this.services = await response.json();
        } else {
          this.error = 'Failed to fetch services';
        }
      } catch (err) {
        this.error = 'An error occurred while fetching services';
      }
    },
    async register() {
      try {
        const response = await fetch('/register/professional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            mobile: this.mobile,
            username: this.username,
            password: this.password,
            service_id: this.service_id,
            experience: this.experience,
            description: this.description,
            address: this.address,
            pin: this.pin,
            role: 'professional'  // Role set to 'professional'
          })
        });

        if (response.ok) {
          alert('Registration successful!');
          this.$router.push('/login/professional');
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
