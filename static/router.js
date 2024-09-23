// static/router.js
import Home from "./components/Home.js";
import CustomerLogin from "./components/CustomerLogin.js";
import ProfessionalLogin from "./components/ProfessionalLogin.js";
import AdminLogin from "./components/AdminLogin.js";  // Import AdminLogin
import CustomerRegister from "./components/CustomerRegister.js";
import ProfessionalRegister from "./components/ProfessionalRegister.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AddService from "./components/AddService.js";
import CustomerDashboard from "./components/CustomerDashboard.js";
export default new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Home },
      { path: '/login/customer', component: CustomerLogin },
      { path: '/login/professional', component: ProfessionalLogin },
      { path: '/login/admin', component: AdminLogin },  // Add route for AdminLogin
      { path: '/register/customer', component: CustomerRegister},
      { path: '/register/professionl', component: ProfessionalRegister},
      { path: '/admin/dashboard', component: AdminDashboard},
      { path: '/add-service', component: AddService },
      { path: '/customer/dashboard', component: CustomerDashboard},

    ],
});
