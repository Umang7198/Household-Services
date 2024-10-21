export default {
    template: `
        <div class="container mt-5">
            <h2 class="text-center">Customer Profile</h2>
            
            <div v-if="customer" class="card mt-4">
                <div class="card-body">
                    <h5 class="card-title">Customer Details</h5>
                    <p><strong>User Name:</strong> {{ customer.username}}</p>
                    <p><strong>Password:</strong> {{ customer.password}}</p>
                    <p><strong>Name:</strong> {{ customer.name }}</p>
                    <p><strong>Email:</strong> {{ customer.email }}</p>
                    <p><strong>Phone:</strong> {{ customer.mobile }}</p>
                    <p><strong>Address:</strong> {{ customer.address }}</p>
                    <p><strong>Pin:</strong> {{ customer.pin }}</p>
                    <p><strong>Joined:</strong> {{ customer.date_created }}</p>
                </div>
            </div>
            <div v-else>
                <p>Loading customer details...</p>
            </div>
            <button @click="goToDashboard" class="btn btn-primary mt-4">Back to Dashboard</button>

        </div>
    `,
    data() {
        return {
            customer: null,  // To hold customer details
            error: ''  // To hold any error messages
        };
    },
    mounted() {
        this.fetchCustomerDetails();  // Fetch customer details when component is mounted
    },
    methods: {
        goToDashboard() {
            // Navigate back to the customer dashboard
            this.$router.push('/customer/dashboard');
          },
        fetchCustomerDetails() {
            const customer_id = localStorage.getItem('customer_id');  // Retrieve customer ID from local storage
            fetch(`/customer/${customer_id}`)  // Assuming this endpoint gets customer details by ID
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch customer details');
                    }
                    return response.json();
                })
                .then(data => {
                    this.customer = data;  // Set the customer data
                })
                .catch(error => {
                    this.error = error.message;  // Capture any errors
                    console.error("Error fetching customer details:", error);
                });
        }
    }
};
