import './assets/main.css'

import { defineCustomElement } from 'vue'
import Easy360View from './components/Easy360View.ce.vue'

const Easy360ViewElement = defineCustomElement(Easy360View)

customElements.define('easy-360', Easy360ViewElement)

