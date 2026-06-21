interface themeCustomMap {
    [key: string]: string
}

const createSingleStepTheme = (start: number = 1, step: number = 1, length: number = 50, unit: string = "px"): themeCustomMap => {
    const stepTheme: themeCustomMap = {}
    for (let index = start; index < length; index += step) {
        stepTheme[index] = `${index}${unit}`
    }
    return stepTheme
}

export default {
    // content: ["./app/components/**/*.{vue,js,ts,jsx,tsx}", "./app/**/*.{vue,js,ts,jsx,tsx}"],
    content: ["./app/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            spacing: createSingleStepTheme(1, 1, 150),
            fontSize: createSingleStepTheme(12, 2, 36),
            lineHeight: createSingleStepTheme(2, 2, 36),
            borderRadius: createSingleStepTheme(2, 1, 50)
        }
    }
}
