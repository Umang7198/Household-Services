export default {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="d-flex justify-content-start mb-3">
                        <router-link to="/admin/dashboard" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Dashboard
                        </router-link>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h2 class="text-center mb-4">Add New Service</h2>
                            <form @submit.prevent="addService">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Service Name</label>
                                    <input type="text" v-model="name" id="name" class="form-control" placeholder="Enter service name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea v-model="description" id="description" class="form-control" placeholder="Enter service description" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="base_price" class="form-label">Base Price</label>
                                    <input type="number" v-model="base_price" id="base_price" class="form-control" placeholder="Enter base price" required>
                                </div>
                                <div class="mb-3">
                                    <label for="time_required" class="form-label">Time Required (minutes)</label>
                                    <input type="number" v-model="time_required" id="time_required" class="form-control" placeholder="Enter time required in minutes" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Add Service</button>
                                <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            name: '',
            description: '',
            base_price: '',
            time_required: '',
            error: ''
        };
    },
    methods: {
        async addService() {
            try {
                const response = await fetch('/service', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.name,
                        description: this.description,
                        base_price: this.base_price,
                        time_required: this.time_required
                    })
                });

                if (response.ok) {
                    this.$router.push('/admin/dashboard');  // Redirect to Admin Dashboard
                } else {
                    const data = await response.json();
                    this.error = data.msg || 'Failed to add service';
                }
            } catch (err) {
                this.error = 'An error occurred';
            }
        }
    }
};
