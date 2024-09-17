export default {
  name: 'AdminDashboard',
  data() {
    return {
      services: [],
      professionals: [],  // Professionals awaiting approval
      serviceRequests: [],
      editMode: false,  // To toggle edit mode for services
      serviceToEdit: {
        id: null,
        name: '',
        base_price: '',
        description: '',
        time_required: ''
      },
      successMessage: '',
      error: '',
    };
  },
  created() {
    this.fetchServices();
    this.fetchProfessionals();  // Fetch professionals awaiting approval
    this.fetchServiceRequests();
  },
  methods: {
    async logout() {
      try {
        const response = await fetch('/logout', {
          method: 'GET',
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Logged out successfully:', result);
          this.$router.push('/login/admin');  // Redirect to the login page
        } else {
          console.error('Failed to logout:', result.msg);
          this.error = result.msg || 'Failed to logout';
        }
      } catch (error) {
        console.error('An error occurred while logging out:', error);
        this.error = 'An error occurred while logging out';
      }
    },
    async fetchServices() {
      try {
        const response = await fetch('/services');  // Call to the Flask backend to fetch services
        if (response.ok) {
          this.services = await response.json();  // Update services with the fetched data
        } else {
          this.error = 'Failed to fetch services';
        }
      } catch (err) {
        this.error = 'An error occurred while fetching services';
      }
    },
    async fetchProfessionals() {
      try {
        const response = await fetch('/professionals/unverified');
        if (response.ok) {
          this.professionals = await response.json();
        } else {
          this.error = 'Failed to fetch professionals';
        }
      } catch (err) {
        this.error = 'An error occurred while fetching professionals';
      }
    },
    async fetchServiceRequests() {
      try {
        const response = await fetch('/service-requests');  // Fetch service requests
        if (response.ok) {
          this.serviceRequests = await response.json();
        } else {
          this.error = 'Failed to fetch service requests';
        }
      } catch (err) {
        this.error = 'An error occurred while fetching service requests';
      }
    },
    goToAddService() {
      this.$router.push('/add-service');
    },
    editService(service) {
      // Enable edit mode and populate the form with the service details
      this.serviceToEdit = { ...service };
      this.editMode = true;
    },
    async updateService() {
      try {
        const response = await fetch(`/service/${this.serviceToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.serviceToEdit.name,
            base_price: this.serviceToEdit.base_price,
            description: this.serviceToEdit.description,
            time_required: this.serviceToEdit.time_required,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          this.successMessage = result.msg;
          this.editMode = false;
          this.fetchServices(); // Refresh services after successful update
        } else {
          this.error = result.msg || 'Failed to update';
        }
      } catch (error) {
        this.error = 'An error occurred while updating the service';
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.serviceToEdit = {}; // Clear the serviceToEdit
    },
    async deleteService(serviceId) {
      if (confirm('Are you sure you want to delete this service?')) {
        try {
          const response = await fetch(`/service/${serviceId}`, {
            method: 'DELETE',
          });
          const result = await response.json();

          if (response.ok) {
            this.successMessage = result.msg;
            this.services = this.services.filter(service => service.id !== serviceId); // Remove the deleted service from the local state
          } else {
            this.error = result.msg || 'Failed to delete the service';
          }
        } catch (error) {
          this.error = 'An error occurred while deleting the service';
        }
      }
    },
    async approveProfessional(id) {
      if (confirm('Are you sure you want to approve this professional?')) {
        try {
          const response = await fetch(`/professional/approve/${id}`, {
            method: 'PUT',
          });

          if (response.ok) {
            this.successMessage = 'Professional approved successfully';
            this.professionals = this.professionals.filter(professional => professional.id !== id);  // Remove from the list
          } else {
            this.error = 'Failed to approve the professional';
          }
        } catch (error) {
          this.error = 'An error occurred while approving the professional';
        }
      }
    },
    async rejectProfessional(id) {
      if (confirm('Are you sure you want to reject this professional?')) {
        try {
          const response = await fetch(`/professional/reject/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            this.successMessage = 'Professional rejected successfully';
            this.professionals = this.professionals.filter(professional => professional.id !== id);  // Remove from the list
          } else {
            this.error = 'Failed to reject the professional';
          }
        } catch (error) {
          this.error = 'An error occurred while rejecting the professional';
        }
      }
    },
    async deleteProfessional(id) {
      if (confirm('Are you sure you want to delete this professional?')) {
        try {
          const response = await fetch(`/professional/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            this.successMessage = 'Professional deleted successfully';
            this.professionals = this.professionals.filter(professional => professional.id !== id);  // Remove from the list
          } else {
            this.error = 'Failed to delete the professional';
          }
        } catch (error) {
          this.error = 'An error occurred while deleting the professional';
        }
      }
    }
  },
  template: `
    <div class="container mt-5">
      <h1 class="text-center mb-4">Welcome to Admin Dashboard</h1>

      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <a class="navbar-brand" href="#">Admin Panel</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Search</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Summary</a></li>
            <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a> 
            </li>        
          </ul>
        </div>
      </nav>

      <!-- Services Section -->
      <section class="mb-5">
        <h3>Services</h3>

        <!-- Edit Service Form -->
        <div v-if="editMode" class="card p-3 mb-3">
          <h4>Edit Service</h4>
          <form @submit.prevent="updateService">
            <div class="form-group">
              <label for="serviceName">Service Name</label>
              <input type="text" v-model="serviceToEdit.name" class="form-control" id="serviceName" required>
            </div>
            <div class="form-group">
              <label for="basePrice">Base Price (₹)</label>
              <input type="number" v-model="serviceToEdit.base_price" class="form-control" id="basePrice" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea v-model="serviceToEdit.description" class="form-control" id="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="timeRequired">Time Required (minutes)</label>
              <input type="number" v-model="serviceToEdit.time_required" class="form-control" id="timeRequired" required>
            </div>
            <button type="submit" class="btn btn-success">Update Service</button>
            <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
          </form>
        </div>

        <!-- Service List -->
        <table class="table table-striped" v-if="!editMode">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Base Price (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.base_price }}</td>
              <td>
                  <button class="btn btn-primary btn-sm" @click="editService(service)">Edit</button>
                  <button class="btn btn-danger btn-sm" @click="deleteService(service.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="goToAddService" class="btn btn-primary mt-2">Add New Service</button>
      </section>

      <!-- Professionals Awaiting Approval -->
      <section class="mb-5">
        <h3>Professionals Awaiting Approval</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="professional in professionals" :key="professional.id">
              <td>{{ professional.id }}</td>
              <td>{{ professional.name }}</td>
              <td>{{ professional.service_name }}</td>
              <td>
                <button @click="approveProfessional(professional.id)" class="btn btn-success btn-sm">Approve</button>
                <button @click="rejectProfessional(professional.id)" class="btn btn-danger btn-sm">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Service Requests Section -->
      <section>
        <h3>Service Requests</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer Name</th>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in serviceRequests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.customer_name }}</td>
              <td>{{ request.service_name }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Success and Error Messages -->
      <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
      <div v-if="error" class="alert alert-danger mt-4">{{ error }}</div>
    </div>
  `
};
