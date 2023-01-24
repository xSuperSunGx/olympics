import { createApp } from 'vue'
import App from './App.vue'

import './assets/background.css'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faUserSecret, faCamera, faBullhorn ,  faBattery2, faBalanceScale, faWandMagicSparkles, faPhone, faSnowflake, faBell, faBolt, faCode, faFlag, faRss, faHeart, faMap, faGraduationCap, faSearch, faTag, faUniversity, faWrench} from "@fortawesome/free-solid-svg-icons";
library.add(faUserSecret);
library.add(faSnowflake);
library.add(faBell);
library.add(faBolt);
library.add(faCode);
library.add(faPhone);
library.add(faHeart);
library.add(faUniversity);
library.add(faTag);
library.add(faSearch);
library.add(faRss);
library.add(faFlag);
library.add(faWandMagicSparkles);
library.add(faWrench);
library.add(faGraduationCap);
library.add(faBattery2);
library.add(faBalanceScale);
library.add(faBullhorn);
library.add(faCamera);



createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
