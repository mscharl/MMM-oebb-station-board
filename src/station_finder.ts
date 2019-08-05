import chalk from 'chalk';
import prompts from 'prompts';
// @ts-ignore
import * as oebb from 'oebb-api';
import Station from './types/Station';

prompts({
    type: 'text',
    message: 'Enter the full or partial name of the station',
    name: 'stationName',
})
    .then(({ stationName }): Promise<Station[]> => {
        if (!stationName) {
            return Promise.reject('No station entered.')
        }

        return oebb.searchStationsNew(stationName);
    })
    .then((stations) => prompts({
        type: 'select',
        message: 'Select a station',
        name: 'station',
        choices: stations.map((station): prompts.Choice => ({
            title: `${station.name || station.meta}`,
            value: JSON.stringify(station),
        })),
    }))
    .then((answers) => {

        const station = JSON.parse(answers.station);

        const name: string = station.name || station.meta;
        const number = station.number;

        console.log(`\nYou selected ${chalk.blue.bold(name)}.\nUse this number in you module configuration: ${chalk.red.bold(number)}\n\n`);
    })
    .catch((reason) => {
        console.log('');
        console.log(chalk.red('✘ ') + reason);
        process.exit(1);
    });
