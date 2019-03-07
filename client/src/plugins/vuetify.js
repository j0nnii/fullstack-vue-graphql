import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  iconfont: "md",
  theme: {
    primary: "#009688",
    secondary: "#ff5722",
    accent: "#ffc107",
    error: "#f44336",
    warning: "#ff9800",
    info: "#cddc39",
    success: "#4caf50"
  }
});
