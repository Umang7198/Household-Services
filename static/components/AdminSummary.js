export default {
    name: 'AdminSummary',
    data() {
        return {
            serviceStats: {},
            professionalStats: {},
            userStats: {}
        };
    },
    computed: {
        // Computed property to sort workload_distribution in descending order of workload
        sortedWorkloadDistribution() {
            if (!this.professionalStats.workload_distribution) return [];
            return [...this.professionalStats.workload_distribution].sort((a, b) => b.workload - a.workload);
        }
    },
    methods: {
        async fetchServiceStats() {
            try {
                const response = await fetch('/admin/summary/service-requests');
                if (!response.ok) throw new Error("Failed to fetch service request stats");
                this.serviceStats = await response.json();
            } catch (error) {
                console.error("Error fetching service stats:", error);
            }
        },
        async fetchProfessionalStats() {
            try {
                const response = await fetch('/admin/summary/professionals');
                if (!response.ok) throw new Error("Failed to fetch professional stats");
                this.professionalStats = await response.json();
            } catch (error) {
                console.error("Error fetching professional stats:", error);
            }
        },
        async fetchUserStats() {
            try {
                const response = await fetch('/admin/summary/users');
                if (!response.ok) throw new Error("Failed to fetch user stats");
                this.userStats = await response.json();
            } catch (error) {
                console.error("Error fetching user stats:", error);
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
    mounted() {
        this.fetchServiceStats();
        this.fetchProfessionalStats();
        this.fetchUserStats();
    },
    template: `
        <div class="container mt-5">
            <h2 class="text-center mb-4">Admin Summary Page</h2>
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
                            <router-link to="/admin/search" class="nav-link">Search</router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="logout" style="cursor: pointer;">Logout</a> 
                        </li>
                    </ul>
                </div>
            </nav>
            <!-- Service Request Summary -->
            <div class="card mb-3">
                <h3 class="card-header">Service Request Statistics</h3>
                <div class="card-body">
                    <p>Total Requests: {{ serviceStats.total_requests }}</p>
                    <p>Completed Requests: {{ serviceStats.completed_requests }}</p>
                    <p>Pending Requests: {{ serviceStats.pending_requests }}</p>
                    <p>Failed Requests: {{ serviceStats.failed_requests }}</p>
                </div>
            </div>

            <!-- Professionals Summary -->
            <div class="card mb-3">
                <h3 class="card-header">Professionals Statistics</h3>
                <div class="card-body">
                    <p>Total Professionals: {{ professionalStats.total_professionals }}</p>
                    <p>Average Rating: {{ professionalStats.average_rating != null ? professionalStats.average_rating.toFixed(2) : 'N/A' }}</p>
                    <p>Top Rated Professionals:</p>
                    <ul>
                        <li v-for="professional in professionalStats.top_rated_professionals" :key="professional.id">
                            {{ professional.name }} - Rating: {{ professional.rating != null ? professional.rating.toFixed(2) : 'N/A' }}
                        </li>

                    </ul>
                    <p>Workload Distribution:</p>
                    <ul>
                        <li v-for="workload in sortedWorkloadDistribution" :key="workload.professional_id">
                            Professional ID: {{ workload.professional_id }},Jobs: {{ workload.workload }},
                              Name:{{ workload.professional_Name}}, 
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Users Summary -->
            <div class="card mb-3">
                <h3 class="card-header">Users Statistics</h3>
                <div class="card-body">
                    <p>Total Users: {{ userStats.total_users }}</p>
                  
                    <p>Users by Role:</p>
                    <ul>
                        <li v-for="role in userStats.role_counts" :key="role.role">
                            {{ role.role }}: {{ role.count }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
};
