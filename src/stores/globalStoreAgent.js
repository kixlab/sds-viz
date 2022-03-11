import { provide, ref, computed, inject } from "vue";
import { loadBehaviorClusters, loadKeywordClusters, loadSessions } from "./dataLoader";

const DATAPATH = './data/SDS/new';
const KEYWORD_CLUSTERS_FILE = 'BERTopics-clusters.json'; 
const BEHAVIOR_CLUSTERS_FILE = 'cluster-info-3-20.json'; 
const SESSIONS_FILE = 'sequences-3-20.json'; 

export const initGlobalStore = () => {

    // Definitions and Getters //

    // The global variables (keeps info about the metrics)
    window.globalVars = {
        METRICS: ['Click@1-5', 'MeanRR', 'AbandonmentRate', 'ReformulationRate', 'MAP', 'NDCG'],
        METRIC_LABELS: ['CTR@5', 'Mean RR', 'Abandonment Rate', 'Reformulation Rate', 'mAP', 'NDCG'],
        IS_METRIC_GOODNESS_DIRECT: {
            'Click@1-5': true,
            'MeanRR': true,
            'AbandonmentRate': false,
            'ReformulationRate': false,
            'MAP': true,
            'NDCG': true
        },
        SHORTHAND_ACTIONS: {
            'Click1-5': 'A',
            'Click6-10': 'B',
            'Click11+': 'C',
            'NewQuery': 'N',
            'RefinedQuery': 'R',
            'Click1-5_short': 'a',
            'Click6-10_short': 'b',
            'Click11+_short': 'c',
            'NewQuery_short': 'n',
            'RefinedQuery_short': 'r',
            'ClickQuickLink': 'Q',
            'EndSession': 'E'
        }
    };

    // Load the data to the keywordClusters dictionary
    var keywordClusters = {};
    var behaviorClusters = {};
    var totalSessions = null;
    keywordClusters = loadKeywordClusters(`${DATAPATH}/${KEYWORD_CLUSTERS_FILE}`, keywordClusters);
    behaviorClusters = loadBehaviorClusters(`${DATAPATH}/${BEHAVIOR_CLUSTERS_FILE}`, keywordClusters);
    [keywordClusters, behaviorClusters, totalSessions ] = loadSessions(`${DATAPATH}/${SESSIONS_FILE}`, keywordClusters, behaviorClusters);
    
    // Create a ref --> make it reactive
    // Whenever it changes, it will send a signal to the vue
    // And, vue will update the template based on the changes, if needed
    const keywordClustersRef = ref(keywordClusters);
    const behaviorClustersRef = ref(behaviorClusters);

    const totalSessionsRef = ref(totalSessions);

    // The interactions state, keeping the current state of the app
    var interactionState = {
        'chosenBehaviorClusterId': null,
        'chosenMetric': null,
        'chosenKeywordClusterId': null,
        'chosenThreshold': null,
        'chosenSessionId': null,
        'chosenTag': ''
    };
    // Make it reactive
    const interactionStateRef = ref(interactionState);
    // Retrieve it through a computed property.
    // Computed properties are like getters, but they are computed based on other properties
    // So, whenever one of the properties changes, the computed property will be updated
    // And, the template will be updated
    const getInteractionState = computed(() => interactionStateRef.value);

    // Separate state variable for managing saved sessions

    var selectedSessionIds = JSON.parse(localStorage.getItem('selectedSessionIds')) || {};

    const selectedSessionIdsRef = ref(selectedSessionIds);
    const getSelectedSessionIds = computed(() => selectedSessionIdsRef.value);

    // Another separate state variable for highlighting clusters IDs by searchbox results
    
    var highlights = JSON.parse(localStorage.getItem('selectedHighlights')) || {
        'behaviorClusters': new Set(),
        'keywordClusters': new Set(),
        'sessionIds': []
    }

    const highlightsRef = ref(highlights);

    const getHighlights = computed(() => highlightsRef.value);

    // yet another state variable for managing action items

    var actionItems = JSON.parse(localStorage.getItem('actionItems')) || [];

    const actionItemsRef = ref(actionItems);
    const getActionItems = computed(() => actionItemsRef.value);

    // Get the keywordClusters dictionary
    const getKeywordClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenMetric = interactionState['chosenMetric'];
        // const chosenBehaviorClusterId = interactionState['chosenBehaviorClusterId']
        if(chosenMetric === null) {
            return null;
        }
        return keywordClustersRef.value;
    });

    // based on the interaction state's status, get the behavior clusters that are relevant
    const getBehaviorClusters = computed(() => {
        // const interactionState = getInteractionState.value;
        // const chosenKeywordClusterId = interactionState['chosenKeywordClusterId'];
        // if(chosenKeywordClusterId === null) {
        //     return null;
        // }
        // const keywordCluster = getKeywordClusters.value[chosenKeywordClusterId];
        // return keywordCluster.behaviorClusters;
        return behaviorClustersRef.value;
    });

    // Get the sessions that are relevant to the current status of the interaction state
    const getSessions = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenKeywordClusterId = interactionState['chosenKeywordClusterId'];
        const chosenBehaviorClusterId = interactionState['chosenBehaviorClusterId'];
        if(chosenBehaviorClusterId === null || chosenKeywordClusterId === null) {
            return null;
        } 
        const sessions = totalSessionsRef.value.filter(session => {
            return (session.keywordClusterId === chosenKeywordClusterId && session.behaviorClusterId === chosenBehaviorClusterId)
        });

        return sessions
        // const behaviorCluster = getBehaviorClusters.value[chosenBehaviorClusterId];
        // return behaviorCluster.sessions;
    });

    // Get the chosen session
    const getSession = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenSessionId = interactionState['chosenSessionId'];
        if(chosenSessionId === null) {
            return null;
        }
        const session = getSessions.value[chosenSessionId];
        return session;
    });

    const getSelectedSessions = computed(() => {
        const interactionState = getInteractionState.value;

        const selectedTag = interactionState['chosenTag'];
        const savedSessions = getSelectedSessionIds.value;

        if(!selectedTag || !(selectedTag in savedSessions) || (savedSessions[selectedTag].length === 0)) {
            console.log('empty')
            return [];
        }
        const selectedSessions = savedSessions[selectedTag]
        const sessions = totalSessionsRef.value.filter(session => {
            return selectedSessions.includes(session.id);
        })
        console.log('sessions', sessions)
        return sessions
    })


    // Setters //

    // Add / delete notes
    // Update saved sessions

    const addActionItem = (item) => {
        actionItemsRef.value.push(item);
        localStorage.setItem('actionItems', JSON.stringify(actionItemsRef.value));
    }

    const updateActionItem = (idx, item) => {
        actionItemsRef.value.splice(idx, 1, item);
        localStorage.setItem('actionItems', JSON.stringify(actionItemsRef.value));

    }

    const removeActionItem = (idx) => {
        actionItemsRef.value.splice(idx, 1)
        localStorage.setItem('actionItems', JSON.stringify(actionItemsRef.value));

    }

    const setSelectedSessionIds = (tag, sessionId, method) => {
        const selectedSessionIds = getSelectedSessionIds.value;

        if (method === 'add') {
            if (tag in selectedSessionIds) {
                if (selectedSessionIds[tag].includes(sessionId)) {
                    // selectedSessionIds[tag] = selectedSessionIds[tag].filter(id => id !== sessionId);
                } else {
                    selectedSessionIds[tag].push(sessionId);
                }
            } else {
                selectedSessionIds[tag] = [sessionId];
            }
        } else if (method === 'remove') {
            if (tag in selectedSessionIds) {
                if (selectedSessionIds[tag].includes(sessionId)) {
                    selectedSessionIds[tag] = selectedSessionIds[tag].filter(id => id !== sessionId);
                }
            }
        }

        // if (tag in selectedSessionIds) {
        //     if (selectedSessionIds[tag].includes(sessionId)) {
        //         selectedSessionIds[tag] = selectedSessionIds[tag].filter(id => id !== sessionId);
        //     } else {
        //         selectedSessionIds[tag].push(sessionId);
        //     }
        // } else {
        //     selectedSessionIds[tag] = [sessionId];
        // }
    }

    // const setSelectedSessionIds = (sessions) => {
    //     selectedSessionIdsRef.value = sessions;
    //     localStorage.setItem('selectedSessionIds', JSON.stringify(sessions));
    // }

    // Update the interaction state
    const setInteractionState = (partialState) => {
        const interactionState = getInteractionState.value;
        // update the interactionState
        Object.entries(partialState).forEach(([key, value]) => {
            if(key in interactionState) {
                interactionState[key] = value;
            }
        });
        // nullify the states
        // update subtree size appropriately when behavior cluster is updated
        if (('chosenBehaviorClusterId' in partialState) || ('chosenKeywordClusterId' in partialState)) {
            interactionState['chosenSessionId'] = null;
            const sessions = totalSessionsRef.value
            const keywordClusters = keywordClustersRef.value; 
            const behaviorClusters = behaviorClustersRef.value;
            
            if (!interactionState['chosenBehaviorClusterId'] && interactionState['chosenKeywordClusterId']) {
                console.log('updating behavior cluster subtree size')

                for (let [key, value] of Object.entries(behaviorClusters)) {
                    value.subtreeSize = sessions.filter(session => (session.keywordClusterId === interactionState.chosenKeywordClusterId) && (session.behaviorClusterId == key)).length;
                }
            } else if (interactionState['chosenBehaviorClusterId'] && !interactionState['chosenKeywordClusterId'] ) {
                console.log('updating keyword cluster subtree size')

                for (let [key, value] of Object.entries(keywordClusters)) {
                    value.subtreeSize = sessions.filter(session => (session.behaviorClusterId === interactionState.chosenBehaviorClusterId) && (session.keywordClusterId == key)).length;
                }
            } else if (!interactionState['chosenBehaviorClusterId'] && !interactionState['chosenKeywordClusterId'] ){
                console.log('reverting subtree size')
                for (let [key, value] of Object.entries(keywordClusters)) {
                    value.subtreeSize = sessions.filter(session => (session.keywordClusterId == key)).length;
                }
                for (let [key, value] of Object.entries(behaviorClusters)) {
                    value.subtreeSize = sessions.filter(session => (session.behaviorClusterId == key)).length;
                }
            }
        }


        if ('chosenMetric' in partialState) {
            interactionState['chosenThreshold'] = null;
            interactionState['chosenSessionId'] = null;
            interactionState['chosenKeywordClusterId'] = null;

        }

        localStorage.setItem('interactionState', JSON.stringify(interactionState));


        // if ('chosenKeywordClusterId' in partialState) {
        //     interactionState['chosenSessionId'] = null;
        //     const sessions = totalSessionsRef.value
        //     const behaviorClusters = behaviorClustersRef.value;
        //     if (interactionState['chosenKeywordClusterId'] && !interactionState['chosenBehaviorClusterId']) {
        //         console.log('updating subtree size')
        //         for (let [key, value] of Object.entries(behaviorClusters)) {
        //             value.subtreeSize = sessions.filter(session => (session.keywordClusterId === interactionState.chosenKeywordClusterId) && (session.behaviorClusterId == key)).length;
        //         }
        //     } else if (!interactionState['chosenBehaviorClusterId'] && !interactionState['chosenKeywordClusterId'] ) {
        //         console.log('reverting subtree size')
        //         for (let [key, value] of Object.entries(keywordClusters)) {
        //             value.subtreeSize = sessions.filter(session => (session.behaviorClusterId == key)).length;
        //         }
        //     }
        // }

        // var isNull = true;
        // Object.keys(interactionState).reverse().forEach((key) => {
        //     if(key in partialState) {
        //         isNull = false;
        //     }
        //     if(isNull) {
        //         interactionState[key] = null;
        //         if (key === 'savedSessions') {
        //             interactionState[key] = [];
        //         }
        //     }
        // });
    };

    // Update the highlights

    const setHighlights = (newHighlights) => {
        const highlights = getHighlights.value;
        Object.entries(newHighlights).forEach(([key, value]) => {
            highlights[key] = value;
        });
        localStorage.setItem('highlights', JSON.stringify(highlights));
    }

    const setShorthandBehaviors = (shorthandBehaviors) => {
        const sessions = totalSessionsRef.value
        const filteredSessions = sessions.filter(session => {
            // return session.shorthandSequence.indexOf(shorthandBehaviors) !== -1;
            return session.shorthandSequence === shorthandBehaviors
        })

        const behaviorClusters = new Set(filteredSessions.map(session => session.behaviorClusterId))
        const keywordClusters = new Set(filteredSessions.map(session => session.keywordClusterId))

        setHighlights({
            behaviorClusters: behaviorClusters,
            keywordClusters: keywordClusters,
            sessionIds: filteredSessions.map(session => session.id)
        })
    }

    const setQuery = (query) => {
        console.log(query)
        const sessions = totalSessionsRef.value;
        const filteredSessions = sessions.filter(session => {
            return session.allQueries.includes(query)
        })

        const behaviorClusters = new Set(filteredSessions.map(session => session.behaviorClusterId))
        const keywordClusters = new Set(filteredSessions.map(session => session.keywordClusterId))

        setHighlights({
            behaviorClusters: behaviorClusters,
            keywordClusters: keywordClusters,
            sessionIds: filteredSessions.map(session => session.id)
        })
    }

    // Provide //

    // Provide those getters and setters to the sub-components of the app
    provide('getInteractionState', getInteractionState);
    provide('getKeywordClusters', getKeywordClusters);
    provide('getBehaviorClusters', getBehaviorClusters);
    provide('getSessions', getSessions);    
    provide('getSession', getSession);
    provide('getSelectedSessions', getSelectedSessions)
    provide('getSelectedSessionIds', getSelectedSessionIds)
    provide('getHighlights', getHighlights)
    provide('getActionItems', getActionItems)

    provide('setInteractionState', setInteractionState);
    provide('setSelectedSessionIds', setSelectedSessionIds);
    provide('setHighlights', setHighlights);
    provide('setShorthandBehaviors', setShorthandBehaviors)
    provide('setQuery', setQuery)
    provide('addActionItem', addActionItem)
    provide('removeActionItem', removeActionItem)
    provide('updateActionItem', updateActionItem)

    // Return necessary methods to the app.vue //

    // Apparently nothing specific to return
    return {
    }

};

export const useGlobalStore = () => ({

    // Inject the getters and setters whenever this mixin is called
    getInteractionState: inject("getInteractionState"),
    getKeywordClusters: inject("getKeywordClusters"),
    getBehaviorClusters: inject("getBehaviorClusters"),
    getSessions: inject("getSessions"),
    getSession: inject("getSession"),
    getSelectedSessions: inject("getSelectedSessions"),
    getSelectedSessionIds: inject("getSelectedSessionIds"),
    getHighlights: inject("getHighlights"),
    getActionItems: inject('getActionItems'),

    setInteractionState: inject("setInteractionState"),
    setSelectedSessionIds: inject("setSelectedSessionIds"),
    setHighlights: inject("setHighlights"),
    setShorthandBehaviors: inject("setShorthandBehaviors"),
    setQuery: inject("setQuery"),
    addActionItem: inject("addActionItem"),
    removeActionItem: inject("removeActionItem"),
    updateActionItem: inject("updateActionItem")
});
