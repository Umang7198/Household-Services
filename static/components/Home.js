export default {
    template: 
    `
        <div class="container mt-5 text-center">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="home-banner p-5 bg-light shadow-sm rounded">
                        <h1 class="display-4">Welcome to <span class="text-primary">ServiceX</span></h1>
                        <p class="lead">Your trusted platform for professional household services. Fast, reliable, and affordable!</p>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-4">
                    <router-link to="/login/admin" class="btn btn-outline-primary btn-block btn-lg w-100">Admin Login</router-link>
                </div>
                <div class="col-md-4">
                    <router-link to="/login/customer" class="btn btn-outline-success btn-block btn-lg w-100">Customer Login</router-link>
                </div>
                <div class="col-md-4">
                    <router-link to="/login/professional" class="btn btn-outline-info btn-block btn-lg w-100">Professional Login</router-link>
                </div>
            </div>
        </div>
    `,
    mounted() {
        document.title = "ServiceX - Your Household Services Platform"; // Update page title dynamically
    }
}
