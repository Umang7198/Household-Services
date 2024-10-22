export default {
    template: `
        <div class="container mt-5">
            <h2 class="text-center">Customer Profile</h2>

            <div v-if="customer" class="card mt-4">
                <div class="card-body">
                    <h5 class="card-title">Customer Details</h5>

                    <!-- Check if we are in edit mode or view mode -->
                    <div v-if="!isEditing">
                        <p><strong>User Name:</strong> {{ customer.username }}</p>
                        <p><strong>Password:</strong> {{ customer.password }}</p>
                        <p><strong>Name:</strong> {{ customer.name }}</p>
                        <p><strong>Email:</strong> {{ customer.email }}</p>
                        <p><strong>Phone:</strong> {{ customer.mobile }}</p>
                        <p><strong>Address:</strong> {{ customer.address }}</p>
                        <p><strong>Pin:</strong> {{ customer.pin }}</p>
                        <p><strong>Joined:</strong> {{ customer.date_created }}</p>

                        <!-- Edit Button -->
                        <button @click="enableEditMode" class="btn btn-warning mt-3">Edit</button>
                    </div>

                    <!-- Edit form when in edit mode -->
                    <div v-else>
                        <div class="form-group">
                            <label for="username">User Name</label>
                            <input type="text" id="username" v-model="editCustomer.username" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="text" id="password" v-model="editCustomer.password" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" v-model="editCustomer.name" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="editCustomer.email" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="mobile">Phone</label>
                            <input type="text" id="mobile" v-model="editCustomer.mobile" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="address">Address</label>
                            <input type="text" id="address" v-model="editCustomer.address" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="pin">Pin</label>
                            <input type="text" id="pin" v-model="editCustomer.pin" class="form-control">
                        </div>

                        <!-- Save and Cancel buttons -->
                        <button @click="saveChanges" class="btn btn-success mt-3">Save</button>
                        <button @click="cancelEditMode" class="btn btn-secondary mt-3">Cancel</button>
                    </div>
                </div>
            </div>
            
            <div v-else>
                <p>Loading customer details...</p>
            </div>

            <button @click="goToDashboard" class="btn btn-primary mt-4">Back to Dashboard</button>

            <!-- Success or error message -->
            <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

        </div>
    `,
    data() {
        return {
            customer: null,       // To hold customer details
            editCustomer: null,   // To hold customer data for editing
            isEditing: false,     // Whether we are in editing mode or not
            message: '',          // Success message
            error: ''             // Error message
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
                    this.editCustomer = { ...data };  // Create a copy for editing
                })
                .catch(error => {
                    this.error = error.message;  // Capture any errors
                    console.error("Error fetching customer details:", error);
                });
        },
        enableEditMode() {
            this.isEditing = true;  // Enable editing mode
        },
        cancelEditMode() {
            this.isEditing = false;  // Cancel editing mode
            this.editCustomer = { ...this.customer };  // Reset form data to original details
        },
        saveChanges() {
            const customer_id = localStorage.getItem('customer_id');  // Get customer ID from local storage

            fetch(`/customer/${customer_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.editCustomer)  // Send the updated customer data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update customer details');
                }
                return response.json();
            })
            .then(data => {
                this.customer = data;  // Update the displayed customer details
                this.isEditing = false;  // Exit edit mode
                this.message = 'Customer details updated successfully';  // Display success message
                setTimeout(() => this.message = '', 3000);  // Clear message after 3 seconds
            })
            .catch(error => {
                this.error = error.message;  // Handle errors
                console.error("Error updating customer details:", error);
                setTimeout(() => this.error = '', 3000);  // Clear error message after 3 seconds
            });
        }
    }
};
