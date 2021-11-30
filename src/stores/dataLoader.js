import { Session, BehaviorCluster, KeywordCluster } from './dataStructures.js';

export const loadSessions = (filePath, keywordClustersDict) => {
    const sessionsRaw = require(`${filePath}`);
    sessionsRaw.forEach(session => {
        const keywordCluster = keywordClustersDict[session.BERTopicsKeywordCluster];
        const behaviorCluster = Object.values(keywordCluster.behaviorClusters).find(bc => bc.subtreeNodeIds.has(session.ClusterID));
        behaviorCluster.sessions[session.SessionNum] = new Session(session);
        behaviorCluster.subtreeSize = behaviorCluster.subtreeSize + 1;
        keywordCluster.subtreeSize = keywordCluster.subtreeSize + 1;
        window.globalVars.METRICS.forEach(metric => {
            const metricValues = keywordCluster.metricValues;
            metricValues[metric] = metricValues[metric] + session[metric];
            keywordCluster.metricValues = metricValues;
        });
    });
    // remove the ones without any session
    Object.entries(keywordClustersDict).forEach(([key, value]) => {
        if (value.subtreeSize === 0) {
            delete keywordClustersDict[key];
        }
    });
    return keywordClustersDict;
};

export const loadKeywordClusters = (filePath, keywordClustersDict) => {
    keywordClustersDict = {};
    const keywordClustersRaw = require(`${filePath}`);
    const keywordClustersList = Object.entries(keywordClustersRaw).map(([key, value]) => {
        var id = key;
        if (typeof id === 'string') {
            id = parseInt(id);
        }
        return new KeywordCluster({
            'id': id,
            'subtree_size': 0,
            'metric_values': window.globalVars.METRICS.reduce((a, x) => ({ ...a, [x]: 0.0 }), {}),
            'keywords': value.map(keyword => {
                return {
                    'keyword': keyword[0],
                    'score': keyword[1],
                }
            }),
        });
    });
    keywordClustersList.forEach(keywordCluster => {
        keywordClustersDict[keywordCluster.id] = keywordCluster;
    });
    return keywordClustersDict;
};

export const loadBehaviorClusters = (filePath, keywordClustersDict) => {
    const behaviorGalaxiesRaw = require(`${filePath}`);
    behaviorGalaxiesRaw.forEach(behaviorGalaxy => {
        const keywordClusterId = behaviorGalaxy.keyword_cluster;
        const keywordCluster = keywordClustersDict[keywordClusterId];
        const behaviorClusters = keywordCluster.behaviorClusters;

        const galaxyRootNode = behaviorGalaxy.nodes.find(node => node.id === behaviorGalaxy.root_id);
        const firstLayerNodeIds = galaxyRootNode.children;

        const dfs = (nodeId) => {
            const curNode = behaviorGalaxy.nodes.find(node => node.id === nodeId);
            let subtreeNodeIds = [nodeId];
            if (curNode.children !== null) {
                curNode.children.forEach(childId => {
                    subtreeNodeIds = subtreeNodeIds.concat(dfs(childId));
                });
            }
            return subtreeNodeIds;
        };


        if (firstLayerNodeIds !== null) {
            const firstLayerNodes = behaviorGalaxy.nodes.filter(node => firstLayerNodeIds.includes(node.id));

            firstLayerNodes.forEach(firstLayerNode => {
                behaviorClusters[firstLayerNode.id] = new BehaviorCluster(
                    firstLayerNode
                );
                behaviorClusters[firstLayerNode.id].subtreeSize = 0;
                behaviorClusters[firstLayerNode.id].subtreeNodeIds = new Set(dfs(firstLayerNode.id));
                behaviorClusters[firstLayerNode.id].distinguishingFeatures = behaviorClusters[firstLayerNode.id].distinguishingFeatures.filter(df => df.score > 0);
            });
        }
        else {
            behaviorClusters[behaviorGalaxy.root_id] = new BehaviorCluster(
                galaxyRootNode
            );
            behaviorClusters[behaviorGalaxy.root_id].subtreeSize = 0;
            behaviorClusters[behaviorGalaxy.root_id].subtreeNodeIds = new Set(dfs(behaviorGalaxy.root_id));
            behaviorClusters[behaviorGalaxy.root_id].distinguishingFeatures = behaviorClusters[behaviorGalaxy.root_id].distinguishingFeatures.filter(df => df.score > 0);
        }
    });
    return keywordClustersDict;
};