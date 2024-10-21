export default {
    template: `
      <div class="container mt-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title">Professional Profile</h3>
  
            <div v-if="professional">
              <p><strong>Name:</strong> {{ professional.name }}</p>
              <p><strong>Email:</strong> {{ professional.email }}</p>
              <p><strong>Mobile:</strong> {{ professional.mobile }}</p>
              <p><strong>Address:</strong> {{ professional.address }}</p>
              <p><strong>Pin:</strong> {{ professional.pin }}</p>
              <p><strong>Experience:</strong> {{ professional.experience }} years</p>
              <p><strong>Services: </strong>{{
              professional.services[0].name}} 
              </p>
              <p><strong>Rating:</strong> {{ professional.rating }}</p>
              <p><strong>Workload:</strong> {{ professional.workload }}</p>
              <p><strong>Account Created On:</strong> {{ professional.date_created }}</p>
            </div>
  
            <div v-else>
              <p>Error in fetching professional details...</p>
            </div>
  
            <!-- Back to Dashboard Button -->
            <button @click="goToDashboard" class="btn btn-primary mt-4">Back to Dashboard</button>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        professional: null  // Store professional details here
      };
    },
    mounted() {
      this.fetchProfessionalDetails();
    },
    methods: {
      fetchProfessionalDetails() {
        const professionalId = localStorage.getItem('professional_id');  // Retrieve professional_id from localStorage
        console.log(professionalId)
        // Fetch professional details from backend
        fetch(`/professional/${professionalId}`)
          .then(response => response.json())
          .then(data => {
            this.professional = data;
          })
          .catch(error => {
            console.error("Error fetching professional details:", error);
          });
      },
      goToDashboard() {
        // Navigate back to the professional dashboard
        this.$router.push('/professional/dashboard');
      }
    }
  };
  