// UserSummary.js
export default {
    name: 'UserSummary',
    data() {
        return {
            user: {
                name: '',
                total_requests: 0,
                completed_requests: 0,
                total_spent: 0.0,
                favorite_services: [],
                average_rating_given: 0.0,
                recent_reviews: []
            }
        };
    },
    async created() {
        const userId = localStorage.getItem('customer_id');  // Retrieve the user's ID from local storage or other state management
        try {
            const response = await fetch(`/customer/summary/${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
            } else {
                console.error('Failed to fetch user summary:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user summary:', error);
        }
    },
    methods:{
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

    },
    template: `
        <div class="container my-5 user-summary">
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
                            <router-link to="/customer/search" class="nav-link">Search</router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="card">
                <div class="card-header text-center bg-info text-white">
                    <h2>{{ user.name }}'s Summary</h2>
                </div>
                <div class="card-body">
                    <!-- KPI Overview -->
                    <div class="row text-center mb-4">
                        <div class="col-md-4">
                            <p class="h5">Total Requests</p>
                            <p class="text-muted">{{ user.total_requests }}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="h5">Completed Requests</p>
                            <p class="text-muted">{{ user.completed_requests }}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="h5">Total Amount Spent</p>
                            <p class="text-muted">₹ {{ user.total_spent.toFixed(2) }}</p>
                        </div>
                    </div>
                    <div class="row text-center mb-4">
                        <div class="col-md-6">
                            <p class="h5">Average Rating Given</p>
                            <p class="text-muted">{{ user.average_rating_given.toFixed(1) }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="h5">Favorite Services</p>
                            <ul class="list-group">
                                <li v-for="service in user.favorite_services" :key="service.id" class="list-group-item">
                                    {{ service.name }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Recent Reviews -->
                    <div class="reviews mt-4">
                        <h3>Recent Reviews</h3>
                        <ul class="list-group mt-3">
                            <li v-for="review in user.recent_reviews" :key="review.id" class="list-group-item">
                                <p><strong>Rating:</strong> {{ review.rating }} - {{ review.review }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
};
