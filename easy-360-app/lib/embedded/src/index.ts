import { defineCustomElement } from 'vue'
import Easy360EmbeddedCe from '../../../modules/embedded/runtime/Easy360Embedded.vue'


export { Easy360EmbeddedCe }

// register
export const registerEmbeddedElement = () => {
    customElements.define('easy-360-viewer', defineCustomElement(Easy360EmbeddedCe))
}
