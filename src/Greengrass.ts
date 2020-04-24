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

type GroupVersion = {
    Arn: string
    CreationTimestamp: string
    Definition: {
        CoreDefinitionVersionArn: string
        DeviceDefinitionVersionArn: string
        FunctionDefinitionVersionArn: string
        SubscriptionDefinitionVersionArn: string
    }
    Id: string
    Version: string
}

type Subscription = {
    Id: string
    Source: string
    Subject: string
    Target: string
};

export class Greengrass {
    private greengrass: any;

    constructor(region: string) {
        this.greengrass = new AWS.Greengrass({region: region});
    }

    listGroups = async():Promise<Group[]> => {
        const response = await this.greengrass.listGroups().promise();
        return response['Groups'];
    };

   getGroupDetail = async (groupId:string, groupVersionId:string):Promise<GroupVersion> => {
       return await this.greengrass.getGroupVersion({ GroupId: groupId, GroupVersionId: groupVersionId}).promise();
   }

   getSubscription = async (subscriptionDefinitionId: string, subscriptionDefinitionVersionId: string):Promise<Subscription[]> => {

        const response = await this.greengrass.getSubscriptionDefinitionVersion(
            {
                SubscriptionDefinitionId: subscriptionDefinitionId,
                SubscriptionDefinitionVersionId: subscriptionDefinitionVersionId
            }).promise()

       return response.Definition.Subscriptions;
   };


}