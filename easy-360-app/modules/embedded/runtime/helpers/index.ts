export const mapRange = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}