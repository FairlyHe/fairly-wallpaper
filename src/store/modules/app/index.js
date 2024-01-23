import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';

import defaultSettings from '@/settings.json';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            ...defaultSettings
        }
    },
    getters: {
        doubleCount: (state) => state.count * 2
    },
    actions: {
        // Change theme color
        toggleTheme(dark) {
            if (dark) {
                this.theme = 'dark';
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                this.theme = 'light';
                document.body.removeAttribute('arco-theme');
            }
        }
    },

    persist: true,
})
