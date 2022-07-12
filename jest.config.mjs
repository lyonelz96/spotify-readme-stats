export default {
    transform: {
        "\\.[jt]sx?$": "babel-jest",
        "\\.mjs$": "babel-jest",
    },
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/__tests__/**/*.mjs?(x)",
        "**/?(*.)+(spec|test).mjs?(x)",
    ]
}
