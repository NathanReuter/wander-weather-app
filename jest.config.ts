export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',  // Specify the path to your tsconfig file
        }],
    },
    testMatch: ['**/tests/**/*.test.ts'],
    moduleDirectories: ['node_modules', 'src'],
};
