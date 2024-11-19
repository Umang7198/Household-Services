export default {
  name: 'AdminDashboard',
  data() {
    return {
      services: [],
      professionals: [],  // Professionals awaiting approval
      serviceRequests: [],
      categories: [],  // Initialize categories
      selectedCategory: null,  // Initialize selected category
      editMode: false,  // To toggle edit mode for services
      serviceToEdit: {
        id: null,
        name: '',
        base_price: '',
        description: '',
        time_required: ''
      },
      newCategory: {
        name: '',
        description: ''
      },
      successMessage: '',
      error: '',
      showCategoryForm: false,  // To toggle add category form modal
      selectedProfessional: null,
    };
  },
  created() {
    this.fetchServices();  // Call the fetchServices method
    this.fetchProfessionals();  // Fetch professionals awaiting approval
    this.fetchServiceRequests();
    this.fetchCategories();  // Fetch categories
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
        const response = await fetch('/services/edit');  // Replace with your actual API URL
        if (response.ok) {
          this.services = await response.json();  // Populate services
        } else {
            pass
        }
      } catch (err) { 
        pass
      }
    },
    
    
    async fetchProfessionals() {
      try {
        const response = await fetch('/professionals/unverified');
        if (response.ok) {
          this.professionals = await response.json();
          // console.log(this.professionals)
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
    async fetchCategories() {
      try {
        const response = await fetch('/service-categories');
        if (response.ok) {
          this.categories = await response.json();
        } else {
          this.error = 'Failed to fetch service categories';
        }
      } catch (err) {
        this.error = 'An error occurred while fetching categories';
      }
    },
    
    // Add a new category
    async saveCategory() {
      const url = this.newCategory.id ? `/service-categories/${this.newCategory.id}` : '/service-categories';
      const method = this.newCategory.id ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newCategory)
        });

        const result = await response.json();

        if (response.ok) {
          this.successMessage = this.newCategory.id ? 'Category updated successfully' : 'Category added successfully';
          this.fetchCategories();  // Refresh categories after adding/editing
          this.resetCategoryForm();
          this.showCategoryForm = false;  // Hide the form after submission
        } else {
          this.error = result.msg || 'Failed to save category';
        }
      } catch (error) {
        this.error = 'An error occurred while saving the category';
      }
    },
    async deleteCategory(id) {
      if (!confirm('Are you sure you want to delete this category?')) {
        return;
      }

      try {
        const response = await fetch(`/service-categories/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          this.successMessage = 'Category deleted successfully';
          this.fetchCategories();  // Refresh categories after deletion
        } else {
          this.error = result.msg || 'Failed to delete category';
        }
      } catch (error) {
        this.error = 'An error occurred while deleting the category';
      }
    },
    
    // Show form to add category
    showAddCategoryForm() {
      this.resetCategoryForm();  // Reset form for new entry
      this.showCategoryForm = true;
    },
    showEditCategoryForm(category) {
      this.newCategory = { ...category };  // Populate newCategory with selected category details
      this.showCategoryForm = true;        // Show the edit form
    },
    // Hide the add/edit category form
    hideCategoryForm() {
      this.resetCategoryForm();
      this.showCategoryForm = false;
    },

    // Reset the category form
    resetCategoryForm() {
      this.newCategory = { id: null, name: '', description: '' };  // Reset the form fields
      this.successMessage = '';
      this.error = '';
    },
    editService(service) {
      // Enable edit mode and populate the form with the service details
      this.serviceToEdit = { ...service };
      this.editMode = true;
    },
    navigateToServices(categoryId) {
      this.$router.push(`/services/${categoryId}`);
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
    async fetchProfessionalDetails(id) {
      try {
        const response = await fetch(`/professional/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch professional details');
        }
        const data = await response.json();
        this.selectedProfessional = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    showProfessionalDetail(id) {
      this.fetchProfessionalDetails(id);

    },

    closeProfessionalDetail() {
      this.selectedProfessional = null;
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
     triggerExport() {
      const adminEmail = prompt("Enter your email address to receive the export link:");
      if (!adminEmail) {
          alert("Email is required to proceed.");
          return;
      }
  
      fetch('/export-closed-requests', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: adminEmail }),
      })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  alert(`Error: ${data.error}`);
              } else {
                  alert("Export job initiated. You will receive an email once it's complete.");
              }
          })
          .catch(err => {
              alert("Failed to initiate export job.");
              console.error(err);
          });
  }
  
    
  },
  template: `
  
  <div class="container mt-5">
    <h1 class="text-center mb-4">Welcome to Admin Dashboard</h1>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
              <router-link to="/admin/search" class="nav-link">Search</router-link>
          </li>
          <li class="nav-item">
              <router-link to="/admin/summary" class="nav-link">Summary</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a> 
          </li>
        </ul>
        
      </div>
    </nav>

  <!-- Service Categories Section -->
<section class="mb-5">
  <h3 class="text-muted">Service Categories</h3>

  <div class="row g-3"> <!-- Added g-3 for consistent gap between cards -->
    <div class="col-md-3" v-for="category in categories" :key="category.id">

      <div class="card shadow-sm border-0" style="cursor: pointer;" @click="navigateToServices(category.id)">
        <!-- Card container for name and buttons -->
        <div class="card-body p-3 border rounded d-flex flex-column align-items-center justify-content-center">
          <h5 class="card-title text-center mb-4">{{ category.name }}</h5>
          <div class="d-flex justify-content-center">
            <button class="btn btn-warning me-2" @click.stop="showEditCategoryForm(category)">Edit</button>
            <button class="btn btn-danger" @click.stop="deleteCategory(category.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Button -->
    <div class="col-md-3">
      <div class="card shadow-sm border-0 text-center" style="cursor: pointer;" @click="showAddCategoryForm">
        <div class="card-body p-3 border rounded d-flex align-items-center justify-content-center" style="height: 150px;">
          <h5 class="card-title mb-0">+ Add Category</h5>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Add/Edit Category Form Modal -->
<div v-if="showCategoryForm" class="modal" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ newCategory.id ? 'Edit Category' : 'Add New Category' }}</h5>
        <button type="button" class="btn-close" @click="hideCategoryForm"></button> <!-- Updated close button -->
      </div>
      <div class="modal-body">
        <div class="form-group mb-3"> <!-- Add margin-bottom for spacing -->
          <label for="categoryName">Category Name</label>
          <input type="text" id="categoryName" v-model="newCategory.name" class="form-control" required>
        </div>
        <div class="form-group mb-3">
          <label for="categoryDescription">Description</label>
          <textarea id="categoryDescription" v-model="newCategory.description" class="form-control"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="hideCategoryForm">Cancel</button>
        <button type="button" class="btn btn-primary" @click="saveCategory">{{ newCategory.id ? 'Save Changes' : 'Add Category' }}</button>
      </div>
    </div>
  </div>
</div>



    <!-- Services for Selected Category -->
    <section v-if="selectedCategory" class="mb-5">
      <h3 class="text-muted">Services for {{ selectedCategory.name }}</h3>
      <table class="table table-hover shadow-sm rounded">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Service Name</th>
            <th>Base Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in categoryServices" :key="service.id">
            <td>{{ service.id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.base_price }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Professionals Awaiting Approval -->
    <section class="mb-5">
      <h3 class="text-muted">Professionals Awaiting Approval</h3>
      <table class="table table-hover shadow-sm rounded">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Service</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="professional in professionals" :key="professional.id">
            <td @click="showProfessionalDetail(professional.id)" style="cursor: pointer;">{{ professional.id }}</td>
            <td>{{ professional.name }}</td>
            <td>{{ professional.services[0].name }}</td>
            <td>
              <button @click="approveProfessional(professional.id)" class="btn btn-success btn-sm mr-2">Approve</button>
              <button @click="rejectProfessional(professional.id)" class="btn btn-danger btn-sm">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Professional Detail Component -->
    <div v-if="selectedProfessional" class="professional-detail">
      <h5>Professional Details</h5>
      <p><strong>Name:</strong> {{ selectedProfessional.name }}</p>
      <p><strong>Email:</strong> {{ selectedProfessional.email }}</p>
      <p><strong>Phone:</strong> {{ selectedProfessional.mobile }}</p>
      <p><strong>Address:</strong> {{ selectedProfessional.address }}</p>
      <p><strong>PIN:</strong> {{ selectedProfessional.pin }}</p>
      <p><strong>Experience:</strong> {{ selectedProfessional.experience }}</p>
      <p><strong>Description:</strong> {{ selectedProfessional.description }}</p>
      <p><strong>Services:</strong> {{ selectedProfessional.services.map(service => service.name).join(', ') }}</p>
      
      <p><strong>Date Created:</strong> {{ selectedProfessional.date_created }}</p>
      <button class="btn btn-secondary" @click="closeProfessionalDetail">Close</button>
    </div>

    <!-- Service Requests Section -->
    <section class="mb-5">
      <h3 class="text-muted">Service Requests</h3>
      <table class="table table-hover shadow-sm rounded">
        <thead class="thead-dark">
          <tr>
            <th>Request ID</th>
            <th>Customer Name</th>
            <th>Service</th>
            <th>Professional</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in serviceRequests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.customer_name }}</td>
            <td>{{ request.service_name }}</td>
            <td> {{ request.professional_name }} </td>
            <td>{{ request.service_status }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section id="export-section" class="mb-5">
    <h3 class="text-muted">Export Closed Service Requests</h3>
    <button id="export-csv" class="btn btn-primary" @click="triggerExport()">Export as CSV</button>
  </section>

    <!-- Success and Error Messages -->
    <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
    <div v-if="error" class="alert alert-danger mt-4">{{ error }}</div>
  </div>

  `
};
