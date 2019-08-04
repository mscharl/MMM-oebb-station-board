import Config from './types/Config';

const DOM_INSTANCES: { [key: string]: DomTree } = {};

interface DomTree {
    root: HTMLDivElement,
}

Module.register<Config>('MMM-oebb-arrival-departure', {
    /**
     * Define the default instance config
     */
    defaults: {},

    /**
     * Core-Function to return the modules DOM-Tree.
     */
    getDom(): HTMLElement {
        const { root } = this._getDomInstance() as DomTree;
        const { config } = this;

        return root;
    },

    _getDomInstance(): DomTree {
        const { identifier } = this;

        // Create DOM Elements only if not created before.
        if (!DOM_INSTANCES[identifier]) {
            const root = document.createElement<'div'>('div');

            DOM_INSTANCES[identifier] = {
                root,
            };
        }

        return DOM_INSTANCES[identifier];
    },
});
