import router from "./router.js";
import Home from "./components/Home.js";

new Vue({
    el: "#app",
    template: `<router-view/>`,
    router,
    
});
