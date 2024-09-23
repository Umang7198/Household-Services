export default {
    template: `
        <div class="container mt-5">
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
                                <router-link class="nav-link" to="/search">Search</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/summary">Summary</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/logout">Logout</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/profile">Profile</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="row justify-content-center mb-5">
                <div class="col-md-8">
                    <div class="card p-3">
                        <h4 class="text-center">Looking For?</h4>
                        <div class="row text-center">
                            <div v-for="service in services" :key="service.id" class="col-3">
                                <button class="btn btn-outline-primary" @click="selectService(service.name)">{{ service.name }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="mb-4">Service History</h4>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Service Name</th>
                                        <th>Professional Name</th>
                                        <th>Phone No.</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(service, index) in serviceHistory" :key="index">
                                        <td>{{ service.id }}</td>
                                        <td>{{ service.name }}</td>
                                        <td>{{ service.professional }}</td>
                                        <td>{{ service.phone }}</td>
                                        <td>
                                            <span v-if="service.status === 'Closed'">Closed</span>
                                            <span v-if="service.status === 'Requested'">Requested</span>
                                            <a v-if="service.status === 'Active'" href="#" @click.prevent="closeService(service.id)">Close it?</a>
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
            services: [],  // To hold the fetched services
            serviceHistory: [
                { id: 1, name: 'Service1', professional: 'John Doe', phone: '1234567890', status: 'Active' },
                { id: 2, name: 'Service2', professional: 'Jane Smith', phone: '0987654321', status: 'Closed' },
                { id: 3, name: 'Service3', professional: 'Jim Brown', phone: '1122334455', status: 'Requested' }
            ]
        };
    },
    mounted() {
        // Fetch services from the Flask backend
        fetch('/services')
            .then(response => response.json())
            .then(data => {
                this.services = data;  // Store fetched services
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    },
    methods: {
        selectService(service) {
            // Implement logic to navigate or show details of the selected service
            alert(`Selected service: ${service}`);
        },
        closeService(serviceId) {
            // Implement logic to close the service
            alert(`Service ${serviceId} closed`);
            this.serviceHistory = this.serviceHistory.map(service => 
                service.id === serviceId ? { ...service, status: 'Closed' } : service
            );
        }
    }
};
