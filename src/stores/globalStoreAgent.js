import { provide, ref, computed, inject } from "vue";
import { loadBehaviorClusters, loadKeywordClusters, loadSessions } from "./dataLoader";

const DATAPATH = './data';
const KEYWORD_CLUSTERS_FILE = 'BERTopics-cluster-50000-50.json'; 
const BEHAVIOR_CLUSTERS_FILE = 'cluster-info-3-20.json'; 
const SESSIONS_FILE = 'sequences-3-20.json'; 

export const initGlobalStore = () => {

    // Definitions and Getters //

    // The global variables (keeps info about the metrics)
    window.globalVars = {
        METRICS: ['pSkip', 'Click@1-5', 'MaxRR', 'MeanRR', 'AbandonmentRate', 'ReformulationRate', 'NDCG'],
        METRIC_LABELS: ['pSkip', 'Click@1-5', 'Max RR', 'Mean RR', 'Abandonment Rate', 'Reformulation Rate', 'NDCG'],
        IS_METRIC_GOODNESS_DIRECT: {
            'pSkip': false,
            'Click@1-5': true,
            'MaxRR': true,
            'MeanRR': true,
            'AbandonmentRate': false,
            'ReformulationRate': false,
            'NDCG': true
        }
    };

    // Load the data to the keywordClusters dictionary
    var keywordClusters = {};
    keywordClusters = loadKeywordClusters(`${DATAPATH}/${KEYWORD_CLUSTERS_FILE}`, keywordClusters);
    keywordClusters = loadBehaviorClusters(`${DATAPATH}/${BEHAVIOR_CLUSTERS_FILE}`, keywordClusters);
    keywordClusters = loadSessions(`${DATAPATH}/${SESSIONS_FILE}`, keywordClusters);
    
    // Create a ref --> make it reactive
    // Whenever it changes, it will send a signal to the vue
    // And, vue will update the template based on the changes, if needed
    const keywordClustersRef = ref(keywordClusters);

    // The interactions state, keeping the current state of the app
    var interactionState = {
        'chosenMetric': null,
        'chosenKeywordClusterId': null,
        'chosenThreshold': null,
        'chosenBehaviorClusterId': null,
        'chosenSessionId': null,
    };
    // Make it reactive
    const interactionStateRef = ref(interactionState);
    // Retrieve it through a computed property.
    // Computed properties are like getters, but they are computed based on other properties
    // So, whenever one of the properties changes, the computed property will be updated
    // And, the template will be updated
    const getInteractionState = computed(() => interactionStateRef.value);

    // Get the keywordClusters dictionary
    const getKeywordClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenMetric = interactionState['chosenMetric'];
        if(chosenMetric === null) {
            return null;
        }
        return keywordClustersRef.value;
    });

    // based on the interaction state's status, get the behavior clusters that are relevant
    const getBehaviorClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenKeywordClusterId = interactionState['chosenKeywordClusterId'];
        if(chosenKeywordClusterId === null) {
            return null;
        }
        const keywordCluster = getKeywordClusters.value[chosenKeywordClusterId];
        return keywordCluster.behaviorClusters;
    });

    // Get the sessions that are relevant to the current status of the interaction state
    const getSessions = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenBehaviorClusterId = interactionState['chosenBehaviorClusterId'];
        if(chosenBehaviorClusterId === null) {
            return null;
        } 
        const behaviorCluster = getBehaviorClusters.value[chosenBehaviorClusterId];
        return behaviorCluster.sessions;
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

    // Setters //

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
        var isNull = true;
        Object.keys(interactionState).reverse().forEach((key) => {
            if(key in partialState) {
                isNull = false;
            }
            if(isNull) {
                interactionState[key] = null;
            }
        });
    };

    // Provide //

    // Provide those getters and setters to the sub-components of the app
    provide('getInteractionState', getInteractionState);
    provide('getKeywordClusters', getKeywordClusters);
    provide('getBehaviorClusters', getBehaviorClusters);
    provide('getSessions', getSessions);    
    provide('getSession', getSession);

    provide('setInteractionState', setInteractionState);

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

    setInteractionState: inject("setInteractionState"),

});
