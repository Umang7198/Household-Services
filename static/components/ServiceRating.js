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
                              <input type="radio" id="star1" v-model="rating" value="1" />
                              <label for="star1" title="1 star" class="star">☆</label>
                              <input type="radio" id="star2" v-model="rating" value="2" />
                              <label for="star2" title="2 stars" class="star">☆</label>
                              <input type="radio" id="star3" v-model="rating" value="3" />
                              <label for="star3" title="3 stars" class="star">☆</label>
                              <input type="radio" id="star4" v-model="rating" value="4" />
                              <label for="star4" title="4 stars" class="star">☆</label>
                              <input type="radio" id="star5" v-model="rating" value="5" />
                              <label for="star1" title="5 stars" class="star">☆</label>
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
        requestId: this.$route.query.id,
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
        this.fetchRatingData(this.requestId);
    },
    methods: {
      submitRemarks() {
        const remarksData = {
          requestId: this.requestId,
          serviceName: this.serviceName,
          professionalId: this.professionalId,
          professionalName: this.professionalName,
          contact: this.contact,
          rating: this.rating,
          remarks: this.remarks
        };
  
        fetch('/submit-rating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(remarksData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // alert('Remarks submitted successfully!');
                this.closeService(); // Call close-service after successful submission
            } else {
                alert('Failed to submit remarks. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting remarks:', error);
            alert('Error submitting remarks. Please try again.');
        });
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
                const today = new Date();
                this.serviceName = ratingData.service.name;
                this.description = ratingData.service.description;
                this.date = today.toISOString().split('T')[0]; // Extract date
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
      closeService() {
        fetch(`/close-service/${this.requestId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Service closed successfully!');
                this.$router.push('/customer/dashboard');
            } else {
                alert('Failed to close service. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error closing service:', error);
            alert('Error closing service. Please try again.');
        });
      },
      closeForm() {
        this.$router.push('/customer/dashboard');
      }
    }
};
