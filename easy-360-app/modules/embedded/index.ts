import { addComponent, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
      name: 'easy-360-embedded',
      configKey: 'easy-360-embedded'
    },
    setup (options, nuxt) {
      const { resolve } = createResolver(import.meta.url)

      nuxt.hook("nitro:build:public-assets", (nitro) => {
        
      })
  
        addComponent({
            name: "Easy360Embedded",
            filePath: resolve("./runtime/Easy360Embedded.ce.vue"),
            mode: "client",
            chunkName: "easy-360-embedded"
        })
    }
  })