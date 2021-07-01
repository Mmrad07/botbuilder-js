// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as assert from 'assert';
import { BotFrameworkAuthentication, BotFrameworkClientKey } from 'botframework-connector';
import { Resource, ResourceExplorer, ResourceProvider } from 'botbuilder-dialogs-declarative';

import {
    Activity,
    BotCallbackHandlerKey,
    BotTelemetryClientKey,
    ConversationState,
    MemoryStorage,
    NullTelemetryClient,
    SkillConversationIdFactory,
    TestAdapter,
    TurnContext,
    UserState,
} from 'botbuilder';

import {
    AdaptiveDialog,
    AdaptiveDialogBot,
    languageGeneratorKey,
    languageGeneratorManagerKey,
    LanguagePolicy,
    languagePolicyKey,
    resourceExplorerKey,
    skillConversationIdFactoryKey,
} from '../lib';

describe('AdaptiveDialogBot Tests', function () {
    it('adds the correct parameters to TurnState', async function () {
        const storage = new MemoryStorage();
        const conversationState = new ConversationState(storage);
        const userState = new UserState(storage);
        const skillConversationIdFactory = new SkillConversationIdFactory(storage);
        const languagePolicy = new LanguagePolicy('en-US');

        const resourceExplorer = new ResourceExplorer();
        resourceExplorer.registerType('Microsoft.AdaptiveDialog', AdaptiveDialog);
        const resourceProvider = new MockResourceProvider(resourceExplorer);
        resourceProvider.add(
            'main.dialog',
            new MockResource(
                JSON.stringify({
                    $kind: 'Microsoft.AdaptiveDialog',
                })
            )
        );
        resourceExplorer.addResourceProvider(resourceProvider);

        const activity = {
            channelId: 'test-channel',
            conversation: {
                id: 'test-conversation-id',
            },
            from: {
                id: 'test-id',
            },
        };

        const turnContext = new TurnContext(new TestAdapter(), activity as Activity);
        const telemetryClient = new NullTelemetryClient();

        const bot = new AdaptiveDialogBot(
            'main.dialog',
            'main.lg',
            resourceExplorer,
            conversationState,
            userState,
            skillConversationIdFactory,
            languagePolicy,
            new MockBotFrameworkAuthentication() as BotFrameworkAuthentication,
            telemetryClient
        );

        await bot.run(turnContext);

        assert.ok(turnContext.turnState.get(BotFrameworkClientKey));
        assert.ok(turnContext.turnState.get(skillConversationIdFactoryKey));
        assert.ok(turnContext.turnState.get('ConversationState'));
        assert.ok(turnContext.turnState.get('UserState'));
        assert.ok(turnContext.turnState.get(resourceExplorerKey));
        assert.ok(turnContext.turnState.get(languageGeneratorKey));
        assert.ok(turnContext.turnState.get(languageGeneratorManagerKey));
        assert.ok(turnContext.turnState.get(languagePolicyKey));
        assert.ok(turnContext.turnState.get('memoryScopes'));
        assert.ok(turnContext.turnState.get('pathResolvers'));
        assert.ok(turnContext.turnState.get(BotTelemetryClientKey));
        assert.ok(turnContext.turnState.get(BotCallbackHandlerKey));
    });

    it('should throw an error when no resource', async function () {
        const storage = new MemoryStorage();
        const conversationState = new ConversationState(storage);
        const userState = new UserState(storage);
        const skillConversationIdFactory = new SkillConversationIdFactory(storage);
        const languagePolicy = new LanguagePolicy('en-US');

        const resourceExplorer = new ResourceExplorer();
        const resourceProvider = new MockResourceProvider(resourceExplorer);
        resourceExplorer.addResourceProvider(resourceProvider);

        const activity = {
            channelId: 'test-channel',
            conversation: {
                id: 'test-conversation-id',
            },
            from: {
                id: 'test-id',
            },
        };

        const turnContext = new TurnContext(new TestAdapter(), activity as Activity);
        const telemetryClient = new NullTelemetryClient();

        const bot = new AdaptiveDialogBot(
            'main.dialog',
            'main.lg',
            resourceExplorer,
            conversationState,
            userState,
            skillConversationIdFactory,
            languagePolicy,
            new MockBotFrameworkAuthentication() as BotFrameworkAuthentication,
            telemetryClient
        );

        await assert.rejects(
            bot.run(turnContext),
            new Error('The ResourceExplorer could not find a resource with id "main.dialog"')
        );
    });
});

class MockBotFrameworkAuthentication {
    public createBotFrameworkClient() {
        return {};
    }
}

class MockResourceProvider extends ResourceProvider {
    private resources: {
        [key: string]: Resource;
    } = {};

    constructor(resourceExplorer: ResourceExplorer) {
        super(resourceExplorer);
    }

    getResource(id: string) {
        return this.resources[id];
    }

    getResources(_extension: string) {
        return Object.values(this.resources);
    }

    refresh() {
        return;
    }

    add(id: string, resource: Resource) {
        this.resources[id] = resource;
    }
}

class MockResource extends Resource {
    constructor(private json: string) {
        super();

        this._id = 'main.dialog';
    }

    public async openStream() {
        throw new Error('Not Implemented');
    }

    public readText() {
        return this.json;
    }
}
