export default {
    template: `
      <div class="container mt-5">
          <div class="card">
              <div class="card-body">
                  <h2 class="text-center">Service Remarks</h2>
                  <p class="text-center">Request ID: {{ requestId }}</p>
                  <form @submit.prevent="submitRemarks">
                      <div class="row mb-3">
                          <div class="col-md-4">
                              <label for="serviceName" class="form-label">Service Name</label>
                              <input type="text" v-model="serviceName" id="serviceName" class="form-control" disabled>
                          </div>
                          <div class="col-md-4">
                              <label for="description" class="form-label">Description</label>
                              <input type="text" v-model="description" id="description" class="form-control" disabled>
                          </div>
                          <div class="col-md-4">
                              <label for="date" class="form-label">Date</label>
                              <input type="text" v-model="date" id="date" class="form-control" disabled>
                          </div>
                      </div>
  
                      <div class="row mb-3">
                          <div class="col-md-4">
                              <label for="professionalId" class="form-label">Professional ID</label>
                              <input type="text" v-model="professionalId" id="professionalId" class="form-control" disabled>
                          </div>
                          <div class="col-md-4">
                              <label for="professionalName" class="form-label">Professional Name</label>
                              <input type="text" v-model="professionalName" id="professionalName" class="form-control" disabled>
                          </div>
                          <div class="col-md-4">
                              <label for="contact" class="form-label">Contact No.</label>
                              <input type="text" v-model="contact" id="contact" class="form-control" disabled>
                          </div>
                      </div>
  
                      <!-- Service Rating -->
                      <div class="mb-3">
                          <label class="form-label">Service Rating:</label>
                          <div class="rating">
                              <input type="radio" id="star5" v-model="rating" value="5" />
                              <label for="star5" title="5 stars" class="star">☆</label>
                              <input type="radio" id="star4" v-model="rating" value="4" />
                              <label for="star4" title="4 stars" class="star">☆</label>
                              <input type="radio" id="star3" v-model="rating" value="3" />
                              <label for="star3" title="3 stars" class="star">☆</label>
                              <input type="radio" id="star2" v-model="rating" value="2" />
                              <label for="star2" title="2 stars" class="star">☆</label>
                              <input type="radio" id="star1" v-model="rating" value="1" />
                              <label for="star1" title="1 star" class="star">☆</label>
                          </div>
                      </div>
  
                      <!-- Remarks -->
                      <div class="mb-3">
                          <label for="remarks" class="form-label">Remarks (if any):</label>
                          <textarea v-model="remarks" id="remarks" class="form-control" rows="3"></textarea>
                      </div>
  
                      <!-- Submit and Close Buttons -->
                      <div class="d-flex justify-content-between">
                          <button type="submit" class="btn btn-primary w-50">Submit</button>
                          <button type="button" class="btn btn-outline-secondary w-50 ms-3" @click="closeForm">Close</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    `,
    data() {
      return {
        requestId:  this.$route.query.id,  // Example request ID
        serviceName: '',
        description: '',
        date: '',
        professionalId: '',
        professionalName: '',
        contact: '',
        rating: 0,
        remarks: ''
      };
    },
    mounted() {
        // Call fetchRatingData when the component is mounted
        this.fetchRatingData(this.requestId);
      },
    methods: {
      
      submitRemarks() {
        // Handle form submission logic here
        const remarksData = {
          requestId: this.requestId,
          serviceName: this.serviceName,
          professionalId: this.professionalId,
          professionalName: this.professionalName,
          contact: this.contact,
          rating: this.rating,
          remarks: this.remarks
        };
        alert('Remarks submitted successfully!');
      },
      fetchRatingData(serviceRequestId) {
        fetch(`/rating/${serviceRequestId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(ratingData => {
                // Populate the component's data properties with the fetched data
                console.log(ratingData)
                const today = new Date();

                this.serviceName = ratingData.service.name;
                this.description = ratingData.service.description;
                this.date = today.toISOString().split('T')[0]; // Extract the date part
                this.professionalId = ratingData.professional.id;
                this.professionalName = ratingData.professional.name;
                this.contact = ratingData.professional.phone;
                this.rating = ratingData.rating.score;
                this.remarks = ratingData.rating.review;
            })
            .catch(error => {
                console.error('Error fetching rating data:', error);
                alert('Failed to load rating data. Please try again later.');
            });
    },
      closeForm() {
        // Handle closing the form, such as navigating back or resetting
        alert('Form closed without submitting.');
        this.$router.push('/customer/dashboard');

        // You can also reset form data if needed
      }
    }
  };
  