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
    };
    // Make it reactive
    const interactionStateRef = ref(interactionState);
    // Retrieve it through a computed property.
    // Computed properties are like getters, but they are computed based on other properties
    // So, whenever one of the properties changes, the computed property will be updated
    // And, the template will be updated
    const getInteractionState = computed(() => interactionStateRef.value);

    // Separate state variable for managing saved sessions

    var selectedSessionIds = [];

    const selectedSessionIdsRef = ref(selectedSessionIds);
    const getSelectedSessionIds = computed(() => selectedSessionIdsRef.value);

    // Another separate state variable for highlighting clusters IDs by searchbox results
    
    var highlights = {
        'behaviorClusters': new Set(),
        'keywordClusters': new Set(),
        'sessionIds': []
    }

    const highlightsRef = ref(highlights);

    const getHighlights = computed(() => highlightsRef.value);

    // Get the keywordClusters dictionary
    const getKeywordClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenMetric = interactionState['chosenMetric'];
        const chosenBehaviorClusterId = interactionState['chosenBehaviorClusterId']
        if(chosenMetric === null || chosenBehaviorClusterId === null) {
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
        const savedSessions = getSelectedSessionIds.value;

        if(savedSessions.length === 0) {
            return null;
        }
        const sessions = totalSessionsRef.value.filter(session => {
            return savedSessions.includes(session.id);
        })

        return sessions
    })


    // Setters //

    // Update saved sessions

    const setSelectedSessionIds = (sessions) => {
        selectedSessionIdsRef.value = sessions;
    }

    // Update the interaction state
    const setInteractionState = (partialState) => {
        const interactionState = getInteractionState.value;
        // update the interactionState
        Object.entries(partialState).forEach(([key, value]) => {
            if(key in interactionState) {
                interactionState[key] = value;
            }
        });
        // nullify the next states
        // Namely, if a state is null, then next states should also be null 
        // (since the flow of the application is sequential)

        // update subtree size appropriately
        if ('chosenBehaviorClusterId' in partialState) {
            const sessions = totalSessionsRef.value
            const keywordClusters = keywordClustersRef.value;
            console.log(keywordClusters)
            console.log(sessions)
            for (let [key, value] of Object.entries(keywordClusters)) {
                console.log(key, value)
                value.subtreeSize = sessions.filter(session => (session.behaviorClusterId === interactionState.chosenBehaviorClusterId) && (session.keywordClusterId == key)).length;
            }
        }

        var isNull = true;
        Object.keys(interactionState).reverse().forEach((key) => {
            if(key in partialState) {
                isNull = false;
            }
            if(isNull) {
                interactionState[key] = null;
                if (key === 'savedSessions') {
                    interactionState[key] = [];
                }
            }
        });
    };

    // Update the highlights

    const setHighlights = (newHighlights) => {
        const highlights = getHighlights.value;
        Object.entries(newHighlights).forEach(([key, value]) => {
            highlights[key] = value;
        });
    }

    const setShorthandBehaviors = (shorthandBehaviors) => {
        const sessions = totalSessionsRef.value
        const filteredSessions = sessions.filter(session => {
            return session.shorthandSequence.indexOf(shorthandBehaviors) !== -1;
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

    provide('setInteractionState', setInteractionState);
    provide('setSelectedSessionIds', setSelectedSessionIds);
    provide('setHighlights', setHighlights);
    provide('setShorthandBehaviors', setShorthandBehaviors)

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

    setInteractionState: inject("setInteractionState"),
    setSelectedSessionIds: inject("setSelectedSessionIds"),
    setHighlights: inject("setHighlights"),
    setShorthandBehaviors: inject("setShorthandBehaviors")
});
