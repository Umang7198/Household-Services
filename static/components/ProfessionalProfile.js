export default {
  template: `
    <div class="container mt-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title">Professional Profile</h3>

          <div v-if="professional">
            <!-- Display Professional Details -->
            <div v-if="!isEditing">
              <p><strong>Name:</strong> {{ professional.name }}</p>
              <p><strong>Email:</strong> {{ professional.email }}</p>
              <p><strong>Mobile:</strong> {{ professional.mobile }}</p>
              <p><strong>Address:</strong> {{ professional.address }}</p>
              <p><strong>Pin:</strong> {{ professional.pin }}</p>
              <p><strong>Experience:</strong> {{ professional.experience }} years</p>
              <p><strong>Services:</strong> {{ professional.services.map(service => service.name).join(', ') }}</p>
              <p><strong>Rating:</strong> {{ professional.rating }}</p>
              <p><strong>Workload:</strong> {{ professional.workload }}</p>
              <p><strong>Account Created On:</strong> {{ professional.date_created }}</p>

              <!-- Edit Button -->
              <button @click="enableEditMode" class="btn btn-warning mt-3">Edit</button>
            </div>

            <!-- Edit Form for Professional Details -->
            <div v-else>
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" v-model="editProfessional.name" class="form-control">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="editProfessional.email" class="form-control">
              </div>
              <div class="form-group">
                <label for="mobile">Mobile</label>
                <input type="text" id="mobile" v-model="editProfessional.mobile" class="form-control">
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" v-model="editProfessional.address" class="form-control">
              </div>
              <div class="form-group">
                <label for="pin">Pin</label>
                <input type="text" id="pin" v-model="editProfessional.pin" class="form-control">
              </div>
              <div class="form-group">
                <label for="experience">Experience</label>
                <input type="number" id="experience" v-model="editProfessional.experience" class="form-control">
              </div>
              
             <!-- Single Service Dropdown -->
              <div class="mb-3">
                <label for="service" class="form-label">Service Name</label>
                <select v-model="editProfessional.service_id" id="service" class="form-select" required>
                  <option value="" disabled selected>Select a Service</option> <!-- Placeholder option -->
                  <option v-for="service in services" :value="service.id" :key="service.id">
                    {{ service.name }}
                  </option>
                </select>
              </div>

              <!-- Save and Cancel Buttons -->
              <button @click="saveChanges" class="btn btn-success mt-3">Save</button>
              <button @click="cancelEditMode" class="btn btn-secondary mt-3">Cancel</button>
            </div>
          </div>

          <div v-else>
            <p>Error in fetching professional details...</p>
          </div>

          <!-- Back to Dashboard Button -->
          <button @click="goToDashboard" class="btn btn-primary mt-4">Back to Dashboard</button>
        </div>
      </div>

      <!-- Success or Error Messages -->
      <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  `,
  data() {
    return {
      professional: null, // Store professional details here
      editProfessional: null, // Store details for editing
      isEditing: false, // Track if editing mode is enabled
      message: '', // Success message
      error: '', // Error message
      services: [] // Available services for dropdown
    };
  },
  mounted() {
    this.fetchProfessionalDetails();
    this.fetchServices(); // Fetch all services when component is mounted
  },
  methods: {
    fetchProfessionalDetails() {
      const professionalId = localStorage.getItem('professional_id'); // Retrieve professional_id from localStorage

      fetch(`/professional/${professionalId}`)
        .then(response => response.json())
        .then(data => {
          this.professional = data;
          this.editProfessional = {
            ...data,
            service_ids: data.services.map(service => service.id) // Pre-select services

          };
        })
        .catch(error => {
          console.error("Error fetching professional details:", error);
        });
    },
    fetchServices() {
      // Fetch all available services
      fetch('/services/edit')
        .then(response => response.json())
        .then(data => {
          this.services = data; // Populate services dropdown
        })
        .catch(error => {
          console.error("Error fetching services:", error);
        });
    },
    enableEditMode() {
      this.isEditing = true; // Enable edit mode
    },
    cancelEditMode() {
      this.isEditing = false; // Cancel edit mode
      this.editProfessional = { ...this.professional }; // Reset form to original data
    },
    saveChanges() {
      const professionalId = localStorage.getItem('professional_id'); // Get professional ID

      // Send the updated professional details to the backend
      fetch(`/professional/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(this.editProfessional) // Send the edited data
        
      })
        .then(response => {
          if (!response.ok) {
            
            throw new Error('Failed to update professional details');
          }
          return response.json();
        })
        .then(data => {
          this.professional = data; // Update the displayed professional details
          this.isEditing = false; // Exit edit mode
          this.message = 'Professional details updated successfully'; // Display success message
          setTimeout(() => this.message = '', 3000); // Clear success message after 3 seconds
        })
        .catch(error => {
          this.error = error.message; // Handle any errors
          setTimeout(() => this.error = '', 3000); // Clear error message after 3 seconds
        });
    },
    goToDashboard() {
      // Navigate back to the professional dashboard
      this.$router.push('/professional/dashboard');
    }
  }
};
