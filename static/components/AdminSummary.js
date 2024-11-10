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
        }
    },
    mounted() {
        this.fetchServiceStats();
        this.fetchProfessionalStats();
        this.fetchUserStats();
    },
    template: `
        <div class="container mt-5">
            <h2 class="text-center mb-4">Admin Summary Page</h2>

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
                            {{ professional.name }} - Rating: {{ professional.rating }}
                        </li>
                    </ul>
                    <p>Workload Distribution:</p>
                    <ul>
                        <li v-for="workload in sortedWorkloadDistribution" :key="workload.professional_id">
                            Professional ID: {{ workload.professional_id }}, Jobs: {{ workload.workload }}
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
