/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
	displayName: 'server',
	preset: '../../jest.preset.ts',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	moduleDirectories: ['../../node_modules'],
	rootDir: '.',
	roots: ['<rootDir>'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.[tj]s$': 'ts-jest',
	},
	moduleNameMapper: {
		'@nx-next-nest/types': '<rootDir>/../../libs/types/src/index.ts',
		'@server/(.*)': '<rootDir>/$1',
	},
	collectCoverageFrom: ['**/*.(tj)s'],
	coverageDirectory: '../../coverage/apps/server',
	testEnvironment: 'node',
	verbose: true,
};

export default config;
