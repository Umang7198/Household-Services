export default {
    name: 'ProfessionalSummary',
    data() {
        return {
            professional: {
                name: '',
                total_requests: 0,
                completed_requests: 0,
                pending_requests: 0,
                total_earnings: 0.0,
                rating: 0.0,
                latest_reviews: []
            },
            error: null
        };
    },
    async created() {
        const professionalId = localStorage.getItem('professional_id');
        try {
            const response = await fetch(`/professionals/summary/${professionalId}`);
            
            // Check if the request was successful
            if (response.ok) {
                const data = await response.json();
                this.professional = data.professional;
            } else {
                console.error('Failed to fetch professional summary:', response.status);
            }
        } catch (error) {
            console.error('Error fetching professional summary:', error);
        }
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
                    this.$router.push('/login/professional');  // Redirect to professional login
                } else {
                    console.error('Failed to logout:', result.msg);
                    this.error = result.msg || 'Failed to logout';
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
                this.error = 'An error occurred while logging out';
            }
        }
    },
    template: `
        <div class="container my-5 professional-summary">
            <div class="card">
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
                                <router-link to="/professional/search" class="nav-link">Search</router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="card-header text-center bg-primary text-white">
                    <h2>{{ professional.name }}'s Summary</h2>
                </div>
                <div class="card-body">
                    <!-- KPI Overview -->
                    <div class="row text-center mb-4">
                        <div class="col-md-4">
                            <p class="h5">Total Requests</p>
                            <p class="text-muted">{{ professional.total_requests }}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="h5">Completed Requests</p>
                            <p class="text-muted">{{ professional.completed_requests }}</p>
                        </div>
                        <div class="col-md-4">
                            <p class="h5">Pending Requests</p>
                            <p class="text-muted">{{ professional.pending_requests }}</p>
                        </div>
                    </div>
                    <div class="row text-center mb-4">
                        <div class="col-md-6">
                            <p class="h5">Total Earnings</p>
                            <p class="text-muted">₹ {{ professional.total_earnings.toFixed(2) }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="h5">Average Rating</p>
                            <p class="text-muted">{{ professional.rating.toFixed(1) }}</p>
                        </div>
                    </div>

                    <!-- Latest Reviews -->
                    <div class="reviews">
                        <h3 class="mt-4">Latest Customer Reviews</h3>
                        <ul class="list-group mt-3">
                            <li v-for="review in professional.latest_reviews" :key="review.id" class="list-group-item">
                                <p><strong>Rating:</strong> {{ review.rating }} - {{ review.review }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
};
