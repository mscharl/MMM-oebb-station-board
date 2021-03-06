import banner from 'rollup-plugin-banner';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

const bannerText = [
    'ÖBB Station Arrivals & Departures',
    '<%= pkg.description %>',
    '',
    'Version <%= pkg.version %>',
    'By <%= pkg.author %>',
    '',
    'License <%= pkg.license %>',
    '',
    'This is an autogenerated file. DO NOT EDIT!',
].join('\n');

export default [
    {
        input: './src/MMM-oebb-station-board.ts',
        plugins: [
            typescript(),
            resolve(),
            commonjs(),
            banner(bannerText),
        ],
        output: {
            file: './MMM-oebb-station-board.js',
            format: 'iife',
        },
    }, {
        input: './src/station_finder.ts',
        plugins: [
            typescript(),
            banner(bannerText),
        ],
        output: {
            file: './station_finder.js',
            format: 'umd',
        },
        external: Object.keys(pkg.dependencies)
    }, {
        input: './src/node_helper.ts',
        plugins: [
            typescript(),
            banner(bannerText),
        ],
        output: {
            file: './node_helper.js',
            format: 'umd',
        },
        external: Object.keys(pkg.dependencies)
    },
]
