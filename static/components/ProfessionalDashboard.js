export default {
    template: `
        <div class="container mt-5">
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-5">
                <div class="container">
                    <span class="navbar-brand">Welcome to Professional</span>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/home">Home</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/search">Search</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/summary">Summary</router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/profile">Profile</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Today Services -->
            <section class="mb-5">
                <h3 class="text-muted">Today Services</h3>
                <table class="table table-hover shadow-sm rounded">
                    <thead class="thead-dark">
                        <tr>
                            <th>Customer Name</th>
                            <th>Contact Phone</th>
                            <th>Location (with pin code)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(service, index) in todayServices" :key="index">
                            <td>{{ service.customerName }}</td>
                            <td>{{ service.phone }}</td>
                            <td>{{ service.location }}</td>
                            <td>
                                <button class="btn btn-success" @click="acceptService(service)">Accept</button>
                                <button class="btn btn-danger" @click="rejectService(service)">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Closed Services -->
            <section class="mb-5">
                <h3 class="text-muted">Closed Services</h3>
                <table class="table table-hover shadow-sm rounded">
                    <thead class="thead-dark">
                        <tr>
                            <th>Customer Name</th>
                            <th>Contact Phone</th>
                            <th>Location (with pin code)</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(service, index) in closedServices" :key="index">
                            <td>{{ service.customerName }}</td>
                            <td>{{ service.phone }}</td>
                            <td>{{ service.location }}</td>
                            <td>{{ service.date }}</td>
                            <td>{{ service.rating.score }}</td>
                            <td>{{ service.rating.review}}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    `,
    data() {
        return {
            todayServices: [],
            closedServices: []
        };
    },
    methods: {
        fetchTodayServices(professional_id) {
            fetch(`/professional/today-services?professional_id=${professional_id}`)
                .then(response => response.json())
                .then(data => {
                    this.todayServices = data;
                })
                .catch(error => {
                    console.error('Error fetching today services:', error);
                });
        },
        fetchClosedServices(professional_id) {
            fetch(`/professional/closed-services?professional_id=${professional_id}`)
                .then(response => response.json())
                .then(data => {
                    this.closedServices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                })
                .catch(error => {
                    console.error('Error fetching closed services:', error);
                });
        },
        acceptService(service) {
            fetch('/professional/accept-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_id: service.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(`Service accepted for customer: ${service.customerName}`);
                    // Optionally, remove service from the list or refresh
                    this.todayServices = this.todayServices.filter(s => s.id !== service.id);
                } else {
                    alert(data.error || 'Failed to accept service');
                }
            })
            .catch(error => {
                console.error('Error accepting service:', error);
            });
        },
        rejectService(service) {
            fetch('/professional/reject-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_id: service.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(`Service rejected for customer: ${service.customerName}`);
                    // Optionally, remove service from the list
                    this.todayServices = this.todayServices.filter(s => s.id !== service.id);
                } else {
                    alert(data.error || 'Failed to reject service');
                }
            })
            .catch(error => {
                console.error('Error rejecting service:', error);
            });
        },
        async logout() {
            try {
                const response = await fetch('/logout', { method: 'GET' });
                if (response.ok) {
                    localStorage.removeItem('professional_id');  // Clear professional_id from localStorage
                    this.$router.push('/login/professional');
                } else {
                    console.error('Failed to logout');
                }
            } catch (error) {
                console.error('An error occurred during logout:', error);
            }
        }
    },
    mounted() {
        const professional_id = localStorage.getItem('professional_id');
        // console.log(professional_id)
        if (!professional_id) {
            this.$router.push('/login/professional');
        } else {
            this.fetchTodayServices(professional_id);
            this.fetchClosedServices(professional_id);
        }
    }
};
