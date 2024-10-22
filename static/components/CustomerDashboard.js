export default {
    template: `
        <div class="container mt-5">
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-5">
                <div class="container">
                    <span class="navbar-brand">Welcome to Customer</span>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/home">Home</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/customer/search">Search</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/summary">Summary</router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/customer/profile">Profile</router-link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Service Categories Section -->
            <section class="mb-5">
                <h3 class="text-muted">Service Categories</h3>
                <div class="row g-3">
                    <div class="col-md-3" v-for="category in categories" :key="category.id">
                        <div class="card shadow-sm border-0" style="cursor: pointer;" @click="navigateToServices(category)">
                            <div class="card-body p-3 border rounded d-flex flex-column align-items-center justify-content-center">
                                <h5 class="card-title text-center mb-4">{{ category.name }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Services for Selected Category Section -->
                <section v-if="selectedCategory" class="mb-5">
                    <h3 class="text-muted">Services for {{ selectedCategory.name }}</h3>
                    <table class="table table-hover shadow-sm rounded">
                        <thead class="thead-dark">
                            <tr>
                                <th>Service Name</th>
                                <th>Base Price (₹)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in categoryServices" :key="service.id">
                                <td>{{ service.name }}</td>
                                <td>{{ service.base_price }}</td>
                                <td>
                                    <!-- Button changes based on service status -->
                                    <button v-if="service.status !== 'Requested'" class="btn btn-primary" @click="bookService(service)">Book Now</button>
                                    <button v-else class="btn btn-secondary" disabled>Requested</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

    
            <!-- Service History Section -->
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="mb-4">Service History</h4>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Service Name</th>
                                        <th>Professional Name</th>
                                        <th>Phone No.</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(service, index) in serviceHistory" :key="index">
                                        <td>{{ service.name }}</td>
                                        <td>{{ service.professional }}</td>
                                        <td>{{ service.phone }}</td>
                                        <td>
                                            <span v-if="service.status === 'closed'">Closed</span>
                                            <span v-if="service.status === 'requested'">Requested</span>
                                            <span v-if="service.status === 'rejected'">Rejected</span>
                                            <!-- Show "Close it?" for accepted services -->
                                            <a v-if="service.status === 'accepted'" href="#" @click.prevent="closeService(service.id)">Close it?</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>            
    `,
    data() {
        return {
            categories: [],  // Fetched service categories
            categoryServices: [],  // Services for the selected category
            selectedCategory: null,  // The selected service category
            serviceHistory: [],
        };
    },
    mounted() {
        // Fetch service categories from the backend
        fetch('/service-categories')
            .then(response => response.json())
            .then(data => {
                this.categories = data;
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
            this.fetchServiceHistory();
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
                    this.$router.push('/login/customer');  // Redirect to the login page
                } else {
                    console.error('Failed to logout:', result.msg);
                    this.error = result.msg || 'Failed to logout';
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
                this.error = 'An error occurred while logging out';
            }
        },
        navigateToServices(category) {
            this.selectedCategory = category;
            // Fetch services for the selected category
            fetch(`/services?category=${category.id}`)
                .then(response => response.json())
                .then(data => {
                    this.categoryServices = data;
                })
                .catch(error => {
                    console.error("Error fetching services:", error);
                });
        },
        bookService(service) {
            const customer_id = localStorage.getItem('customer_id');  // Retrieve customer_id
            
            // Send request to book a service
            fetch('/book-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: service.id,
                    customer_id: customer_id  // Include customer_id in the request
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the service object to show it as "Requested" instead of "Book Now"
                    service.status = 'requested';  // Assuming each service now has a 'status' field
                    
                    // Add the booked service to the service history
                    this.serviceHistory.push({
                        id: service.id,
                        name: service.name,
                        professional: data.professional,  // Name of the professional from the backend
                        phone: '1234567890',  // Placeholder for professional's phone (fetch the actual value from the backend if available)
                        status: 'requested'
                    });
                    
                    alert("Service booked successfully!");
                } else {
                    alert("Failed to book the service.");
                }
            })
            .catch(error => {
                console.error("Error booking service:", error);
            });
        },
        
        
        fetchServiceHistory() {
            const customer_id = localStorage.getItem('customer_id');  // Retrieve the customer ID
            // Fetch service history from the backend
            fetch(`/service-history?customer_id=${customer_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.serviceHistory = data;  // Set the service history data
                })
                .catch(error => {
                    console.error("Error fetching service history:", error);
                });
        },
        closeService(serviceId) {
            // Close the service (send request to backend to mark it as closed)
            this.$router.push({
                path: '/rating',
                query: { id: serviceId } // Passing serviceId as a query parameter
            });
    }
    }
}