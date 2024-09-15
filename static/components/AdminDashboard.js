export default {
    name: 'AdminDashboard',
    data() {
      return {
        services: [
          // Sample data, replace with actual data fetched from the backend
          { id: 1, name: 'Plumbing', basePrice: '₹500' },
          { id: 2, name: 'AC Repair', basePrice: '₹1000' }
        ],
        professionals: [
          { id: 1, name: 'John Doe', experience: 5, serviceName: 'Plumbing' },
          { id: 2, name: 'Jane Doe', experience: 3, serviceName: 'AC Repair' }
        ],
        serviceRequests: [
          { id: 1, professional: 'John Doe', requestedDate: '2024-09-01', status: 'Requested' },
          { id: 2, professional: 'Jane Doe', requestedDate: '2024-09-02', status: 'Accepted' }
        ]
      };
    },
    methods: {
      editService(id) {
        // Handle the edit service action
        console.log(`Editing service with id ${id}`);
      },
      deleteService(id) {
        // Handle the delete service action
        console.log(`Deleting service with id ${id}`);
      },
      approveProfessional(id) {
        // Handle professional approval
        console.log(`Approving professional with id ${id}`);
      },
      rejectProfessional(id) {
        // Handle professional rejection
        console.log(`Rejecting professional with id ${id}`);
      },
      deleteProfessional(id) {
        // Handle professional deletion
        console.log(`Deleting professional with id ${id}`);
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
              <li class="nav-item"><a class="nav-link" href="#">Logout</a></li>
            </ul>
          </div>
        </nav>
  
        <!-- Services Section -->
        <section class="mb-5">
          <h3>Services</h3>
          <table class="table table-striped">
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
                <td>{{ service.basePrice }}</td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="editService(service.id)">Edit</button>
                  <button class="btn btn-danger btn-sm" @click="deleteService(service.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-success">+ New Service</button>
        </section>
  
        <!-- Professionals Section -->
        <section class="mb-5">
          <h3>Professionals</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Experience (Yrs)</th>
                <th>Service Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="professional in professionals" :key="professional.id">
                <td>{{ professional.id }}</td>
                <td>{{ professional.name }}</td>
                <td>{{ professional.experience }}</td>
                <td>{{ professional.serviceName }}</td>
                <td>
                  <button class="btn btn-success btn-sm" @click="approveProfessional(professional.id)">Approve</button>
                  <button class="btn btn-warning btn-sm" @click="rejectProfessional(professional.id)">Reject</button>
                  <button class="btn btn-danger btn-sm" @click="deleteProfessional(professional.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
  
        <!-- Service Requests Section -->
        <section class="mb-5">
          <h3>Service Requests</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Assigned Professional</th>
                <th>Requested Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in serviceRequests" :key="request.id">
                <td>{{ request.id }}</td>
                <td>{{ request.professional }}</td>
                <td>{{ request.requestedDate }}</td>
                <td>{{ request.status }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `
  };
  