import { provide, ref, computed, inject } from "vue";
import { loadBehaviorClusters, loadKeywordClusters, loadSessions } from "./dataLoader";

const DATAPATH = './data';
const KEYWORD_CLUSTERS_FILE = 'BERTopics-cluster.json';
const BEHAVIOR_CLUSTERS_FILE = 'cluster-info-5-20.json';
const SESSIONS_FILE = 'sequences-5-20.json';

export const initGlobalStore = () => {

    // Definitions and Getters //
    window.globalVars = {
        METRICS: ['pSkip', 'Click@1-5', 'MaxRR', 'MeanRR', 'AbandonmentRate', 'ReformulationRate'],
        METRIC_LABELS: ['P(skip)', 'Click@1-5', 'Max RR', 'Mean RR', 'Abandonment Rate', 'Reformulation Rate'],
    };
    var keywordClusters = {};
    keywordClusters = loadKeywordClusters(`${DATAPATH}/${KEYWORD_CLUSTERS_FILE}`, keywordClusters);
    keywordClusters = loadBehaviorClusters(`${DATAPATH}/${BEHAVIOR_CLUSTERS_FILE}`, keywordClusters);
    keywordClusters = loadSessions(`${DATAPATH}/${SESSIONS_FILE}`, keywordClusters);
    const keywordClustersRef = ref(keywordClusters);

    var interactionState = {
        'chosenMetric': null,
        'chosenKeywordClusterId': null,
        'chosenBehaviorClusterId': null,
        'chosenSessionId': null,
    };
    const interactionStateRef = ref(interactionState);
    const getInteractionState = computed(() => interactionStateRef.value);

    const getKeywordClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenMetric = interactionState['chosenMetric'];
        if(chosenMetric === null) {
            return null;
        }
        return keywordClustersRef.value;
    });

    const getBehaviorClusters = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenKeywordClusterId = interactionState['chosenKeywordClusterId'];
        if(chosenKeywordClusterId === null) {
            return null;
        }
        const keywordCluster = getKeywordClusters.value[chosenKeywordClusterId];
        return keywordCluster.behaviorClusters;
    });

    const getSessions = computed(() => {
        const interactionState = getInteractionState.value;
        const chosenBehaviorClusterId = interactionState['chosenBehaviorClusterId'];
        if(chosenBehaviorClusterId === null) {
            return null;
        } 
        const behaviorCluster = getBehaviorClusters.value[chosenBehaviorClusterId];
        return behaviorCluster.sessions;
    });

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

    const setInteractionState = (partialState) => {
        const interactionState = getInteractionState.value;
        // update the interactionState
        Object.entries(partialState).forEach(([key, value]) => {
            if(key in interactionState) {
                interactionState[key] = value;
            }
        });
        // nullify the next states
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

    provide('getInteractionState', getInteractionState);
    provide('getKeywordClusters', getKeywordClusters);
    provide('getBehaviorClusters', getBehaviorClusters);
    provide('getSessions', getSessions);    
    provide('getSession', getSession);

    provide('setInteractionState', setInteractionState);

    // Return necessary methods //

    return {
        getInteractionState,
        getKeywordClusters,
        getBehaviorClusters,
        getSessions,
        getSession,
        setInteractionState,
    }

};

export const useGlobalStore = () => ({

    getInteractionState: inject("getInteractionState"),
    getKeywordClusters: inject("getKeywordClusters"),
    getBehaviorClusters: inject("getBehaviorClusters"),
    getSessions: inject("getSessions"),
    getSession: inject("getSession"),

    setInteractionState: inject("setInteractionState"),

});
