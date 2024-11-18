export default {
    template: `
      <div class="container mt-5">
        <h2>Services for {{ categoryName }}</h2>

        <!-- Button to go back to Admin Dashboard -->
        <div class="mb-3">
          <button @click="goToAdminDashboard" class="btn btn-secondary">Back to Admin Dashboard</button>
        </div>

        <div class="mb-3">
          <button @click="showAddServiceForm" class="btn btn-primary">+ Add Service</button>
        </div>
  
        <table class="table table-hover shadow-sm rounded">
          <thead class="thead-dark">
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Base Price (₹)</th>
              <th>Time Required (mins)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.base_price }}</td>
              <td>{{ service.time_required }}</td>
              <td>
                <button @click="editService(service)" class="btn btn-warning btn-sm me-2">Edit</button>
                <button @click="deleteService(service.id)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Add/Edit Service Modal -->
        <div v-if="showServiceForm" class="modal" style="display: block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ selectedService.id ? 'Edit Service' : 'Add New Service' }}</h5>
                <button type="button" class="btn-close" @click="hideServiceForm"></button>
              </div>
              <div class="modal-body">
                <div class="form-group mb-3">
                  <label for="serviceName">Service Name</label>
                  <input type="text" id="serviceName" v-model="selectedService.name" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                  <label for="servicePrice">Base Price</label>
                  <input type="number" id="servicePrice" v-model="selectedService.base_price" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                  <label for="serviceTimeRequired">Time Required (minutes)</label>
                  <input type="number" id="serviceTimeRequired" v-model="selectedService.time_required" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                    <label for="serviceDescription">Description</label>
                    <textarea id="serviceDescription" v-model="selectedService.description" class="form-control" rows="3" required></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="hideServiceForm">Cancel</button>
                <button type="button" class="btn btn-primary" @click="saveService">{{ selectedService.id ? 'Save Changes' : 'Add Service' }}</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Success and Error Messages -->
        <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-4">{{ errorMessage }}</div>
      </div>
    `,
    data() {
      return {
        categoryName: '',
        services: [],
        selectedService: {
            description: ''  // Initialize description in selectedService

        },
        showServiceForm: false,
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
        goToAdminDashboard() {
            this.$router.push('/admin/dashboard');
          },
          fetchServices() {
            const categoryId = this.$route.params.categoryId;  // Get category ID from the route
    
            fetch(`/services?category=${categoryId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch services');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        this.errorMessage = data.error;
                        this.categoryName = "Unknown Category";  // Fallback if category not found
                    } else {
                        this.categoryName = data.categoryName;  // Set category name
                        this.services = data.services;  // Set services list
                    }
                })
                .catch(error => {
                    console.error('Error fetching services:', error);
                    this.errorMessage = 'Failed to load services';
                });
        },
      showAddServiceForm() {
        this.selectedService = { description: ''};
        this.showServiceForm = true;
      },
      editService(service) {
        this.selectedService = { ...service };
        this.showServiceForm = true;
      },
      saveService() {
        const categoryId = this.$route.params.categoryId; // Get the category ID from the route
        const url = this.selectedService.id
          ? `/service/${this.selectedService.id}` // Update URL to point to the specific service
          : `/service`; // Corrected to use the /service endpoint
      
        const method = this.selectedService.id ? 'PUT' : 'POST';
      
        // Include the category_id in the request body
        const requestBody = {
          ...this.selectedService,
          category_id: categoryId // Add category_id from the route
        };
      
        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to save service');
            }
            return response.json();
          })
          .then(data => {
            this.successMessage = data.msg;
            this.fetchServices(); // Reload the services
            this.showServiceForm = false;
          })
          .catch(error => {
            console.error('Error saving service:', error);
            this.errorMessage = 'Failed to save service';
          });
      },
      deleteService(serviceId) {
        fetch(`/service/${serviceId}`, { method: 'DELETE' })
          .then(response => {
            if (!response.ok) {
              
              throw new Error('Failed to delete service');
            }
            return response.json();
          })
          .then(data => {
            this.successMessage = data.msg;
            this.fetchServices(); // Reload the services
            console.log("done")
          })
          .catch(error => {
            console.error('Error deleting service:', error);
            this.errorMessage = 'Failed to delete service';
          });
      },
      hideServiceForm() {
        this.showServiceForm = false;
      }
    },
    created() {
      this.fetchServices();  // Fetch services when component is created
    }
  };
  