import { provide, ref, computed, inject } from "vue";
import { loadBehaviorClusters, loadKeywordClusters, loadSessions } from "./dataLoader";

const DATAPATH = './data/AOL';
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
            'Click1-5_Short': 'a',
            'Click6-10_Short': 'b',
            'Click11+_Short': 'c',
            'NewQuery_Short': 'n',
            'RefinedQuery_Short': 'r',
            'ClickQuickLink': 'Q',
            'EndSession': 'E',
            'NextPage': 'P'
        }
    };

    // Load the data to the keywordClusters dictionary
    var keywordClusters = {};
    var behaviorClusters = {};
    var totalSessions = null;
    var totalSessionsDict = {}
    var username = localStorage.getItem('username') || '';
    keywordClusters = loadKeywordClusters(`${DATAPATH}/${KEYWORD_CLUSTERS_FILE}`, keywordClusters);
    behaviorClusters = loadBehaviorClusters(`${DATAPATH}/${BEHAVIOR_CLUSTERS_FILE}`, keywordClusters);
    [keywordClusters, behaviorClusters, totalSessions, totalSessionsDict ] = loadSessions(`${DATAPATH}/${SESSIONS_FILE}`, keywordClusters, behaviorClusters);
    // console.log(totalSessionsDict)
    // Create a ref --> make it reactive
    // Whenever it changes, it will send a signal to the vue
    // And, vue will update the template based on the changes, if needed
    const keywordClustersRef = ref(keywordClusters);
    const behaviorClustersRef = ref(behaviorClusters);
    // const totalSessionsRef = ref(totalSessions);
    const usernameRef = ref(username);

    const isExactMatchEnabled = ref(false)

    // The interactions state, keeping the current state of the app
    var interactionState = {
        'chosenBehaviorClusterId': null,
        'chosenMetric': 'Click@1-5',
        'chosenKeywordClusterId': null,
        'chosenThreshold': null,
        'chosenSessionId': null,
        'chosenTag': '',
        'flowInitiator': null
    };
    // Make it reactive
    const interactionStateRef = ref(interactionState);
    // Retrieve it through a computed property.
    // Computed properties are like getters, but they are computed based on other properties
    // So, whenever one of the properties changes, the computed property will be updated
    // And, the template will be updated
    const getInteractionState = computed(() => interactionStateRef.value);

    // const getTotalSessions = computed(() => totalSessionsRef.value)

    // Separate state variable for managing saved sessions

    var selectedSessionIds = JSON.parse(localStorage.getItem('selectedSessionIds')) || {};

    const selectedSessionIdsRef = ref(selectedSessionIds);
    const getSelectedSessionIds = computed(() => selectedSessionIdsRef.value);

    // Another separate state variable for highlighting clusters IDs by searchbox results
    
    var highlights = {
        'behaviorClusters': new Set(),
        'keywordClusters': new Set(),
        'sessionIds': [],
        'source': null
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

        if(chosenBehaviorClusterId === null && chosenKeywordClusterId === null) {
            return null;
        } 
        
        const behaviorClusterSessionIds = chosenBehaviorClusterId !== null ? getBehaviorClusters.value[chosenBehaviorClusterId].sessionIds : [];
        const keywordClusterSessionIds = chosenKeywordClusterId !== null ? getKeywordClusters.value[chosenKeywordClusterId].sessionIds : [];
        const intersection = chosenBehaviorClusterId !== null ?
                                (chosenKeywordClusterId !== null ?
                                    behaviorClusterSessionIds.filter(x => keywordClusterSessionIds.includes(x)) :
                                    behaviorClusterSessionIds) :
                                (chosenKeywordClusterId !== null ?
                                    keywordClusterSessionIds :
                                    [])

        
        // console.log(intersection)
        const sessions = intersection.map(sessionId => {
            // console.log(sessionId)
            return totalSessionsDict[sessionId]
        })
        // totalSessionsRef.value.filter(session => {
        //     return intersection.includes(session.id)
        //     // return (
        //     //     (chosenKeywordClusterId === null || session.keywordClusterId === chosenKeywordClusterId) && 
        //     //     (chosenBehaviorClusterId === null || session.behaviorClusterId === chosenBehaviorClusterId)
        //     // )
        // });

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
        const session = totalSessionsDict[chosenSessionId]; // totalSessionsRef.value.find(s => s.id === chosenSessionId)
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
        const sessions = selectedSessions.map(sessionId => { return totalSessionsDict[sessionId]});
        // totalSessionsRef.value.filter(session => {
        //     return selectedSessions.includes(session.id);
        // })
        return sessions
    })

    // get username

    const getUsername = computed(() => {
        return usernameRef.value;
    })

    const getExactMatchEnabled = computed(() => {
        return isExactMatchEnabled.value;
    })


    // Setters //

    // Add / delete notes
    // Update saved sessions

    const setExactMatchEnabled = (value) => {
        isExactMatchEnabled.value = value;
    }

    const setUsername = (newUsername) => {
        usernameRef.value = newUsername;
        localStorage.setItem('username', newUsername);
    }

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
        localStorage.setItem('selectedSessionIds', JSON.stringify(selectedSessionIds));


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

        if ('chosenMetric' in partialState) {
            interactionState['chosenThreshold'] = null;
            interactionState['chosenSessionId'] = null;
            // interactionState['chosenKeywordClusterId'] = null;
        }

        // if (('chosenBehaviorClusterId' in partialState) || ('chosenKeywordClusterId' in partialState)) {
        //     interactionState['chosenSessionId'] = null;
        //     const sessions = totalSessionsRef.value
        //     const keywordClusters = keywordClustersRef.value; 
        //     const behaviorClusters = behaviorClustersRef.value;
            
        //     if (interactionState['chosenBehaviorClusterId'] === null && interactionState['chosenKeywordClusterId'] !== null) {
        //         // When keyword cluster was selected first
        //         console.log('when keyword cluster was selected first')
        //         console.log('updating behavior cluster subtree size')

        //         for (let [key, value] of Object.entries(behaviorClusters)) {
        //             value.subtreeSize = sessions.filter(session => (session.keywordClusterId === interactionState.chosenKeywordClusterId) && (session.behaviorClusterId == key)).length;
        //         }
        //         interactionState['flowInitiator'] = 'keyword'
        //         console.log('then revert keywords')
        //         for (let [key, value] of Object.entries(keywordClusters)) {
        //             const includedSessions = sessions.filter(session => (session.keywordClusterId == key))
        //             value.subtreeSize = includedSessions.length;
        //             const initialTempMetrics = window.globalVars.METRICS.reduce((acc,curr)=> (acc[curr]=0,acc),{})
        //             value.subtreeSize = includedSessions.length;
        //             const metricValues = includedSessions.reduce((prev, cur) => {
        //                 const tempMetricValues = prev;
        //                 window.globalVars.METRICS.forEach(metric => {
        //                     tempMetricValues[metric] += cur.metricValues[metric];
        //                 });
        //                 return tempMetricValues
        //             }, initialTempMetrics)
        //            value.metricValues = metricValues
        //         }
        //     } else if (interactionState['chosenBehaviorClusterId'] !== null && interactionState['chosenKeywordClusterId'] === null) {
        //         console.log('when behavior cluster was selected first')
        //         console.log('updating keyword cluster subtree size') 
        //         // When behavior cluster was selected first
        //         for (let [key, value] of Object.entries(keywordClusters)) {
        //             const includedSessions = sessions.filter(session => (session.behaviorClusterId === interactionState.chosenBehaviorClusterId) && (session.keywordClusterId == key))
        //             const initialTempMetrics = window.globalVars.METRICS.reduce((acc,curr)=> (acc[curr]=0,acc),{})
        //             value.subtreeSize = includedSessions.length;
        //             const metricValues = includedSessions.reduce((prev, cur) => {
        //                 const tempMetricValues = prev;
        //                 window.globalVars.METRICS.forEach(metric => {
        //                     tempMetricValues[metric] += cur.metricValues[metric];
        //                 });
        //                 return tempMetricValues
        //             }, initialTempMetrics)
        //            value.metricValues = metricValues
        //         }
        //         interactionState['flowInitiator'] = 'behavior'
        //         console.log('then revert behaviors')
        //         for (let [key, value] of Object.entries(behaviorClusters)) {
        //             value.subtreeSize = sessions.filter(session => (session.behaviorClusterId == key)).length;
        //         }
        //     } else if (interactionState['chosenBehaviorClusterId'] === null && interactionState['chosenKeywordClusterId'] === null ){
        //         console.log('reverting subtree size')
        //         console.log('when none of them are selected')

        //         for (let [key, value] of Object.entries(keywordClusters)) {
        //             const includedSessions = sessions.filter(session => (session.keywordClusterId == key))
        //             value.subtreeSize = includedSessions.length;
        //             const initialTempMetrics = window.globalVars.METRICS.reduce((acc,curr)=> (acc[curr]=0,acc),{})
        //             value.subtreeSize = includedSessions.length;
        //             const metricValues = includedSessions.reduce((prev, cur) => {
        //                 const tempMetricValues = prev;
        //                 window.globalVars.METRICS.forEach(metric => {
        //                     tempMetricValues[metric] += cur.metricValues[metric];
        //                 });
        //                 return tempMetricValues
        //             }, initialTempMetrics)
        //            value.metricValues = metricValues
        //         }
        //         for (let [key, value] of Object.entries(behaviorClusters)) {
        //             value.subtreeSize = sessions.filter(session => (session.behaviorClusterId == key)).length;
        //         }
        //         interactionState['flowInitiator'] = null
        //     } else if (interactionState['chosenBehaviorClusterId'] !== null && interactionState['chosenKeywordClusterId'] !== null) {
        //         if (interactionState['flowInitiator'] === 'behavior') {
        //             // keyword subtree size update 
        //             console.log('both selected, but when behavior cluster was selected first and behavior has changed')
        //             for (let [key, value] of Object.entries(keywordClusters)) {
        //                 const includedSessions = sessions.filter(session => (session.behaviorClusterId === interactionState.chosenBehaviorClusterId) && (session.keywordClusterId == key))
        //                 value.subtreeSize = includedSessions.length;
        //                 const initialTempMetrics = window.globalVars.METRICS.reduce((acc,curr)=> (acc[curr]=0,acc),{})
        //                 const metricValues = includedSessions.reduce((prev, cur) => {
        //                     const tempMetricValues = prev;
        //                     window.globalVars.METRICS.forEach(metric => {
        //                         tempMetricValues[metric] += cur.metricValues[metric];
        //                     });
        //                     return tempMetricValues
        //                 }, initialTempMetrics)
        //                value.metricValues = metricValues
        //             }
                    
        //         } else if (interactionState['flowInitiator'] === 'keyword' && 'keyword' in partialState) {
        //             console.log('both selected, but when keyword cluster was selected first and keyword has changed')

        //             for (let [key, value] of Object.entries(behaviorClusters)) {
        //                 value.subtreeSize = sessions.filter(session => (session.keywordClusterId === interactionState.chosenKeywordClusterId) && (session.behaviorClusterId == key)).length;
        //             }
        //         }
        //     }
        // }




        // localStorage.setItem('interactionState', JSON.stringify(interactionState));


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
        // localStorage.setItem('highlights', JSON.stringify(highlights));
    }

    const setShorthandBehaviors = (shorthandBehaviors) => {
        const sessions = totalSessions
        let filteredSessions = []
        if (shorthandBehaviors === '') {
            filteredSessions = []
            setHighlights({
                behaviorClusters: new Set(),
                keywordClusters: new Set(),
                sessionIds: [],
                source: 'BehaviorSearchBox'
            })
            return
        } 
        
        if (getExactMatchEnabled.value) {
            filteredSessions = sessions.filter(session => {
                // return session.shorthandSequence.indexOf(shorthandBehaviors) !== -1;
                return session.shorthandSequence === shorthandBehaviors
            })
        } else {
            filteredSessions = sessions.filter(session => {
                return session.shorthandSequence.indexOf(shorthandBehaviors) !== -1;
            })
        }

        if (filteredSessions.length === 0) {
            alert('No sessions found with the given behaviors.')
            return
        }

        const behaviorClusters = new Set(filteredSessions.map(session => session.behaviorClusterId))
        const keywordClusters = new Set(filteredSessions.map(session => session.keywordClusterId))

        setHighlights({
            behaviorClusters: behaviorClusters,
            keywordClusters: keywordClusters,
            sessionIds: filteredSessions.map(session => session.id),
            source: 'BehaviorSearchBox'
        })
    }

    const setQuery = (query) => {
        const sessions = totalSessions;
        if (query === '') {
            setHighlights({
                behaviorClusters: new Set(),
                keywordClusters: new Set(),
                sessionIds: [],
                source: 'QuerySearchBox'
            })
            return
        }
        const filteredSessions = sessions.filter(session => {
            return session.allQueries.includes(query)
        })

        if (filteredSessions.length === 0) {
            alert('No sessions found with the given query.')
            return
        }

        const behaviorClusters = new Set(filteredSessions.map(session => session.behaviorClusterId))
        const keywordClusters = new Set(filteredSessions.map(session => session.keywordClusterId))

        setHighlights({
            behaviorClusters: behaviorClusters,
            keywordClusters: keywordClusters,
            sessionIds: filteredSessions.map(session => session.id),
            source: 'KeywordSearchBox'
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
    provide('getUsername', getUsername)
    provide('getExactMatchEnabled', getExactMatchEnabled)
    // provide('getTotalSessions', getTotalSessions)

    provide('setInteractionState', setInteractionState);
    provide('setSelectedSessionIds', setSelectedSessionIds);
    provide('setHighlights', setHighlights);
    provide('setShorthandBehaviors', setShorthandBehaviors)
    provide('setQuery', setQuery)
    provide('addActionItem', addActionItem)
    provide('removeActionItem', removeActionItem)
    provide('updateActionItem', updateActionItem)
    provide('setUsername', setUsername)
    provide('setExactMatchEnabled', setExactMatchEnabled)

    // Return necessary methods to the app.vue //

    // Apparently nothing specific to return
    return {
        setInteractionState,
        setUsername,
        getUsername
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
    getUsername: inject('getUsername'),
    getExactMatchEnabled: inject('getExactMatchEnabled'),
    // getTotalSessions: inject('getTotalSessions'),

    setInteractionState: inject("setInteractionState"),
    setSelectedSessionIds: inject("setSelectedSessionIds"),
    setHighlights: inject("setHighlights"),
    setShorthandBehaviors: inject("setShorthandBehaviors"),
    setQuery: inject("setQuery"),
    addActionItem: inject("addActionItem"),
    removeActionItem: inject("removeActionItem"),
    updateActionItem: inject("updateActionItem"),
    setUsername: inject('setUsername'),
    setExactMatchEnabled: inject('setExactMatchEnabled')

});
