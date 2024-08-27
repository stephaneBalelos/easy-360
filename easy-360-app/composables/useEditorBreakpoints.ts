import { createGlobalState } from '@vueuse/core'

type Breakpoint = {
    label: string
    width: number
    height: number
}

export const useEditorBreakpoints = createGlobalState(() => {
    const breakpoints = ref<Breakpoint[]>([
        { label: 'Mobile', width: 390, height: 844 },
        { label: 'Tablet', width: 768, height: 1024 },
        { label: 'Desktop', width: 1440, height: 1024 },
        { label: 'Large Desktop', width: 1920, height: 1080 },
    ])
    const currentBreakpoint = ref<Breakpoint>(breakpoints.value[2])
    
    function setCurrentBreakpoint(index: number) {
        currentBreakpoint.value = breakpoints.value[index] ? breakpoints.value[index] : breakpoints.value[2]
    }

    return {
        breakpoints,
        currentBreakpoint,
        setCurrentBreakpoint
    }
}
)