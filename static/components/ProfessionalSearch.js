export default {
    name: 'ProfessionalSearchComponent',
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
                const professional_id = localStorage.getItem('professional_id');  // Retrieve professional_id
                const url = `/search/professional-services?query=${this.searchQuery}&professional_id=${professional_id}`;  // Pass professional_id to backend
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
                    this.$router.push('/login/professional');  // Redirect to professional login
                } else {
                    console.error('Failed to logout:', result.msg);
                    this.error = result.msg || 'Failed to logout';
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
                this.error = 'An error occurred while logging out';
            }
        },
    },
    template: `
        <div class="container mt-5">
            <h2 class="text-center mb-4">Search Your Services</h2>

            <!-- Navigation Bar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
                <a class="navbar-brand" href="#">Professional Panel</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <router-link to="/professional/dashboard" class="nav-link">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Search input for services -->
            <div class="form-group">
                <label for="searchQuery">Enter  Customer Name</label>
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    class="form-control" 
                    id="searchQuery" 
                    placeholder="Type a  customer name"
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
                                <strong>Service Name:</strong> {{ service.service_name }}<br>
                                <strong>Customer:</strong> {{ service.customer_name }}<br>
                                <strong>Date Requested:</strong> {{ service.date_of_request }}<br>
                                <strong>Status:</strong> {{ service.service_status }}<br>
                                <strong>Rating:</strong> {{ service.rating || 'N/A' }}<br>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    `
};
