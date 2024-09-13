export default {
    template: `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <button class="btn btn-link text-start mb-3" @click="$router.push('/login/professional')">Back to Professional Login</button>
                <h2 class="text-center">Professional Registration</h2>
                <form @submit.prevent="register">
                  <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" v-model="name" id="name" class="form-control" placeholder="Enter Full Name" required>
                  </div>
                  <div class="mb-3">
                    <label for="service_name" class="form-label">Service Name</label>
                    <input type="text" v-model="service_name" id="service_name" class="form-control" placeholder="e.g. 'Plumbing', 'AC Repair'" required>
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
        service_name: '',
        experience: '',
        description: '',
        address: '',
        pin: '',
        error: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await fetch('/register/professional', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: this.name,
              service_name: this.service_name,
              experience: this.experience,
              description: this.description,
              address: this.address,
              pin: this.pin
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
  