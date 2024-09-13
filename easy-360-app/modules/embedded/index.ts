import { addComponent, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
      name: 'easy-360-embedded',
      configKey: 'easy-360-embedded'
    },
    setup (options, nuxt) {
      const { resolve } = createResolver(import.meta.url)
  
        addComponent({
            name: "Easy360Embedded",
            filePath: resolve("./runtime/Easy360Embedded.ce.vue"),
            mode: "client"
        })
    }
  })