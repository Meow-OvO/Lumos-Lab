export const useNavTabStore = defineStore("navTabStore", {
    state: () => ({
        tabs: [1, 2, 3, 999]
    }),
    actions: {
        tabsAdd(tab: number) {
            this.tabs.push(tab)
        }
    },
    persist: true
})
