export default {
    name: 'CustomerSearchComponent',
    data() {
        return {
            searchQuery: '',
            searchResults: [],
            error: ''
        };
    },
    methods: {
        async performSearch() {
            try {
                const customer_id = localStorage.getItem('customer_id');  // Retrieve customer_id
                const url = `/search/services?name=${this.searchQuery}&customer_id=${customer_id}`;  // Pass customer_id to backend
                const response = await fetch(url);
                const result = await response.json();

                if (response.ok) {
                    this.searchResults = result;  // Store search results
                    console.log(result);
                } else {
                    this.error = result.msg || 'Failed to fetch search results';
                }
            } catch (err) {
                this.error = 'An error occurred while fetching search results';
            }
        },
        async logout() {
            try {
                const response = await fetch('/logout', {
                    method: 'GET',
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    console.log('Logged out successfully:', result);
                    this.$router.push('/login/customer');  // Redirect to customer login
                } else {
                    console.error('Failed to logout:', result.msg);
                    this.error = result.msg || 'Failed to logout';
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
                this.error = 'An error occurred while logging out';
            }
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
                    // Find the service in searchResults and update its status to 'requested'
                    const serviceIndex = this.searchResults.findIndex(s => s.id === service.id);
                    if (serviceIndex !== -1) {
                        this.searchResults[serviceIndex].status = 'requested';  // Update the service status locally
                    }
                    alert("Service booked successfully!");
                } else {
                    alert("Failed to book the service.");
                }
            })
            .catch(error => {
                console.error("Error booking service:", error);
            });
        },
    },
    template: `
        <div class="container mt-5">
            <h2 class="text-center mb-4">Search Services</h2>

            <!-- Navigation Bar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
                <a class="navbar-brand" href="#">Customer Panel</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <router-link to="/customer/dashboard" class="nav-link">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Search input for services -->
            <div class="form-group">
                <label for="searchQuery">Enter Service Name or Category</label>
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    class="form-control" 
                    id="searchQuery" 
                    placeholder="Type a service name or category"
                />
            </div>

            <button @click="performSearch" class="btn btn-primary mt-3">Search</button>

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

            <!-- Display Search Results -->
            <div v-if="searchResults.length" class="mt-5">
                <h3 class="text-center">Search Results</h3>
                <div class="list-group">
                    <li class="list-group-item" v-for="service in searchResults" :key="service.id">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>Service Name:</strong> {{ service.name }}<br>
                                <strong>Category:</strong> {{ service.category }}<br>
                                <strong>Description:</strong> {{ service.description }}<br>
                                <strong>Price:</strong> {{ service.base_price }}<br>
                                <strong>Professionals:</strong> {{ service.professionals.join(', ') }} <br> <!-- Show professional names -->
                                <strong>Rating:</strong> {{ service.rating || 'N/A' }}<br>
                            </div>
                        <div>
                            <!-- Disable the button if service is already requested -->
                            <button v-if="service.status !== 'requested'" class="btn btn-primary" @click="bookService(service)">Book Now</button>
                            <button v-else class="btn btn-secondary" disabled>Requested</button>
                        </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    `
};
