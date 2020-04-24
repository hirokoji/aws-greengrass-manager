import * as AWS from 'aws-sdk';

type Group = {
    Arn: string
    CreationTimestamp: string
    Id: string
    LastUpdatedTimestamp: string
    LatestVersion: string
    LatestVersionArn: string
    Name: string
}

export class Greengrass {
    private greengrass: any;

    constructor(region: string) {
        this.greengrass = new AWS.Greengrass({region: region});
    }

    listGroups = async():Promise<Group[]> => {
        const response = await this.greengrass.listGroups().promise();
        return response['Groups'];
    };

}