// static/router.js
import Home from "./components/Home.js";
import CustomerLogin from "./components/CustomerLogin.js";
import ProfessionalLogin from "./components/ProfessionalLogin.js";
import AdminLogin from "./components/AdminLogin.js";  
import CustomerRegister from "./components/CustomerRegister.js";
import ProfessionalRegister from "./components/ProfessionalRegister.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AddService from "./components/AddService.js";
import CustomerDashboard from "./components/CustomerDashboard.js";
import CategoryServices from './components/CategoryServices.js'; 
import ProfessionalDashboard from "./components/ProfessionalDashboard.js";
import ServiceRating from "./components/ServiceRating.js";
import ProfessionalProfile from "./components/ProfessionalProfile.js";

import CustomerProfile from "./components/CustomerProfile.js";
import AdminSearch from "./components/AdminSearch.js";
import CustomerSearch from "./components/CustomerSearch.js";
import ProfessionalSearch from "./components/ProfessionalSearch.js";

export default new VueRouter({
    mode: 'history',
    routes: [
      { path : '/', component: Home },
      { path: '/login/customer', component: CustomerLogin },
      { path: '/login/professional', component: ProfessionalLogin },
      { path: '/login/admin', component: AdminLogin },  // Add route for AdminLogin
      { path: '/register/customer', component: CustomerRegister},
      { path: '/register/professionl', component: ProfessionalRegister},
      { path: '/admin/dashboard', component: AdminDashboard},
      { path: '/add-service', component: AddService },
      { path: '/customer/dashboard', component: CustomerDashboard},
      { path: '/services/:categoryId', component: CategoryServices },
      { path: '/professional/dashboard', component: ProfessionalDashboard},
      { path: '/rating', component: ServiceRating},
      { path: '/customer/profile', component: CustomerProfile},
      { path: '/professional/profile', component: ProfessionalProfile},
      { path: '/admin/search', component: AdminSearch},
      { path: '/customer/search', component: CustomerSearch},
      { path: '/professinoal/search', component: ProfessionalSearch},
    ],
});
