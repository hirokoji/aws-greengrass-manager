import { program }from 'commander';
import { Greengrass } from './Greengrass'

export class Cli{
    private gg: Greengrass;

    constructor() {
        this.gg = new Greengrass('ap-northeast-1');
    }

    public cli = async (argv: any) => {

        program
            .command('list')
            .description('list greengrass group')
            .action(async (cmd) => {
                await this.displayListGroups();
            });

        program
            .command('subscription')
            .description('show subscription')
            .requiredOption('-g, --group <group>', 'Target greengrass group')
            .action(async (cmd) => {

                await this.displaySubscription(cmd.group);

            });

        program.parse(argv);

    };

    displayListGroups = async():Promise<void> => {
        const groups = await this.gg.listGroups();

        groups.forEach((group) => {
            console.log(`${group.Name}`);
        });
};

    displaySubscription = async(groupName: string):Promise<void> => {

        const getSubscriptionAttributes = (SubscriptionDefinitionVersionArn:string) :{SubscriptionDefinitionId: string, SubscriptionDefinitionVersionId: string} => {
            const splitedArn = SubscriptionDefinitionVersionArn.split('/');

            return {SubscriptionDefinitionId: splitedArn[4], SubscriptionDefinitionVersionId: splitedArn[6]};
        };

        const groups = await this.gg.listGroups();
        const group = groups.filter((group) => group.Name === groupName)[0];
        const groupDetail = await this.gg.getGroupDetail(group.Id, group.LatestVersion)
        const attr = getSubscriptionAttributes(groupDetail.Definition.SubscriptionDefinitionVersionArn)
        const subscriptions = await this.gg.getSubscription(attr.SubscriptionDefinitionId, attr.SubscriptionDefinitionVersionId)


        console.log(`Source: Target  Topic`)
        console.log(` ->  Target  Topic`)

        const sources = [...new Set(subscriptions.map(s => s.Source))];
        const structSub: StructSubscriptions = {};
        sources.forEach((source) => {
            structSub[source] = [];
        });

        subscriptions.forEach((subscription) => {
            const targetShort = subscription.Target.split('/')[1] ? subscription.Target.split('/')[1] : subscription.Target;
            structSub[subscription.Source].push({target: targetShort, topic: subscription.Subject})
        });

        sources.forEach((source) => {

            const sourceShort = source.split('/')[1] ? source.split('/')[1] : source;
            console.log(`${sourceShort}:`);
            structSub[source].forEach((sub) => {
                console.log(` ->  ${sub.target}  ${sub.topic}`);
            });

        })

    }
}

type tmp ={

}

type StructSubscriptions = {
    [source:string]:
        {
            target: string
            topic: string
        }[]
}