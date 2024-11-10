// SearchComponent.js
export default {
    name: 'SearchComponent',
    data() {
        return {
            searchQuery: '',
            searchType: 'customer', // Default selection
            searchResults: [],
            message: '', // For success messages
            error: ''    // For error messages
        };
    },
    methods: {
        async performSearch() {
            try {
                let url = '';
                if (this.searchType === 'customer') {
                    url = `/search/users?role=customer&name=${this.searchQuery}`;
                } else if (this.searchType === 'professional') {
                    url = `/search/users?role=professional&name=${this.searchQuery}`;
                } else if (this.searchType === 'serviceRequests') {
                    url = `/search/service-requests?request=${this.searchQuery}`;
                }

                const response = await fetch(url);
                const result = await response.json();
                
                if (response.ok) {
                    this.searchResults = result; // Populate results based on search type
                    this.error = ''; // Clear any previous error
                    this.message = ''; // Clear any previous success message
                } else {
                    this.handleError(result.msg || 'Failed to fetch search results');
                }
            } catch (err) {
                this.handleError('An error occurred while fetching search results');
            }
        },
        async deleteUser(id) {
            try {
                const response = await fetch(`/delete/user/${id}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (response.ok) {
                    this.searchResults = this.searchResults.filter(user => user.id !== id); // Remove deleted user from results
                    this.handleMessage(`User with ID ${id} has been deleted successfully.`);
                } else {
                    this.handleError(result.msg || 'Failed to delete user');
                }
            } catch (error) {
                this.handleError('An error occurred while deleting the user');
            }
        },
        handleMessage(message) {
            this.message = message;
            // Clear the message after 3 seconds
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },
        handleError(message) {
            this.error = message;
            // Clear the error message after 3 seconds
            setTimeout(() => {
                this.error = '';
            }, 3000);
        },
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
                    this.handleError(result.msg || 'Failed to logout');
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
                this.handleError('An error occurred while logging out');
            }
        },
    },
    template: `
        <div class="container mt-5">
            <h2 class="text-center mb-4">Search</h2>

            <!-- Navigation Bar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
                <a class="navbar-brand" href="#">Admin Panel</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <router-link to="/admin/dashboard" class="nav-link">Home</router-link>
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

            <!-- Dropdown to select search type -->
            <div class="form-group">
                <label for="searchType">Search by</label>
                <select v-model="searchType" class="form-control" id="searchType">
                    <option value="customer">Customer</option>
                    <option value="professional">Professional</option>
                    <option value="serviceRequests">Service Requests</option>
                </select>
            </div>

            <!-- Search input -->
            <div class="form-group">
                <label for="searchQuery">Enter Search Query</label>
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    class="form-control" 
                    id="searchQuery" 
                    placeholder="Type a name or request" 
                />
            </div>

            <button @click="performSearch" class="btn btn-primary mt-3">Search</button>

            <!-- Message for success -->
            <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

            <!-- Display Search Results -->
            <div v-if="searchResults.length" class="mt-5">
                <h3 class="text-center">Search Results</h3>

                <div v-if="searchType === 'customer'" class="list-group">
                    <h4 class="text-primary">Customers</h4>
                    <li class="list-group-item" v-for="customer in searchResults" :key="customer.id">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>Name:</strong> {{ customer.name }}<br>
                                <strong>Email:</strong> {{ customer.email }}<br>
                                <strong>Mobile:</strong> {{ customer.mobile }}<br>
                                <strong>Username:</strong> {{ customer.username }}<br>
                                <strong>Address:</strong> {{ customer.address }}<br>
                                <strong>Pin:</strong> {{ customer.pin }}<br>
                                <strong>Date Created:</strong> {{ customer.date_created }}
                            </div>
                            <div>
                            <button @click="deleteUser(customer.id)" class="btn btn-danger ">Delete</button>
                            </div>
                        </div>
                    </li>
                </div>

                <div v-if="searchType === 'professional'" class="list-group">
                    <h4 class="text-primary">Professionals</h4>
                    <li class="list-group-item" v-for="professional in searchResults" :key="professional.id">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>Name:</strong> {{ professional.name }}<br>
                                <strong>Email:</strong> {{ professional.email }}<br>
                                <strong>Mobile:</strong> {{ professional.mobile }}<br>
                                <strong>Username:</strong> {{ professional.username }}<br>
                                <strong>Rating:</strong> {{ professional.rating || 'N/A' }}<br>
                                <strong>Workload:</strong> {{ professional.workload || 'N/A' }}<br>
                                <strong>Services:</strong> {{ professional.services.map(s => s.name).join(', ') || 'No Service' }}<br>
                                <strong>Address:</strong> {{ professional.address }}<br>
                                <strong>Pin:</strong> {{ professional.pin }}<br>
                                <strong>Date Created:</strong> {{ professional.date_created }}
                            </div>
                            <div>
                            <button @click="deleteUser(professional.id)" class="btn btn-danger ">Delete</button>
                            </div>
                        </div>
                    </li>
                </div>

                <div v-if="searchType === 'serviceRequests'" class="list-group">
                    <h4 class="text-primary">Service Requests</h4>
                    <li class="list-group-item" v-for="request in searchResults" :key="request.id">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>Request ID:</strong> {{ request.id }}<br>
                                <strong>Service Name:</strong> {{ request.service_name }}<br>
                                <strong>Customer Name:</strong> {{ request.customer_name }}<br>
                                <strong>Professional Name:</strong> {{ request.professional_name }}<br>
                                <strong>Status:</strong> {{ request.status }}<br>
                                <strong>Price:</strong> {{ request.price }}<br>
                                <strong>Date of Request:</strong> {{ request.date_of_request }}<br>
                                <strong>Date of Completion:</strong> {{ request.date_of_completion || 'N/A' }}<br>
                                <strong>Rating:</strong> {{ request.rating || 'N/A' }}<br>
                                <strong>Review:</strong> {{ request.review || 'N/A' }}
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    `
};
