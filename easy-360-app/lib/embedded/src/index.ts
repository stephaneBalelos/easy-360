import { defineCustomElement } from 'vue'
import Easy360EmbeddedCe from './../../../modules/embedded/runtime/Easy360Embedded.ce.vue'


export { Easy360EmbeddedCe }

// register
export const registerEmbedddedElement = () => {
    customElements.define('easy-360-viewer', defineCustomElement(Easy360EmbeddedCe))
}
