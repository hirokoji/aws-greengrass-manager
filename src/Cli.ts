import { program }from 'commander';
import { Greengrass } from './Greengrass'

export class Cli{

    constructor() {
    }

    public cli = async (argv: any) => {

        program
            .command('list')
            .description('list greengrass group')
            .action(async (cmd) => {

                await this.displayListGroups();

            });

        program.parse(argv);

    };


    displayListGroups = async() => {
        const gg = new Greengrass('ap-northeast-1');
        const groups = await gg.listGroups();

        groups.forEach((group) => {
            console.log(`${group.Name}`);
        });

    };

}