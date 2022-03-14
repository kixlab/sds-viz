
/*
    
    config: {
        SessionNum: int,
        UserID: int,
        ClusterID: int,
        Sequence: [
            {
                Type: string,
                Query: string
            },
        ],
        pSkip: float,
        Click@1-5: float,
        MaxRR: float,
        MeanRR: float,
        AbandonmentRate: float,
        ReformulationRate: float,
        NDCG: float,
        QueriesCount: int,
        ClicksPerQuery: float,
        BERTopicsKeywordCluster: int,
        KMeansCluster: int
    }

*/

export class Session {
    constructor(config) {
        this.config = config;
    }

    get id() {
        return this.config.SessionNum;
    }

    get userId() {
        return this.config.UserID;
    }

    get behaviorClusterId() {
        return this.config.ClusterID;
    }

    get sequence() {
        return this.config.Sequence;
    }

    get timestamp() {
        return new Date(this.config.Timestamp);
    }

    get metricValues() {
        return {
            // 'pSkip': this.config['pSkip'],
            'Click@1-5': this.config['Click@1-5'],
            // 'MaxRR': this.config['MaxRR'],
            'MeanRR': this.config['MeanRR'],
            'AbandonmentRate': this.config['AbandonmentRate'],
            'ReformulationRate': this.config['ReformulationRate'],
            'NDCG': this.config['NDCG'],
            'MAP': this.config['MAP']
        };
    }

    get shorthandSequence() {
        const shorthand_actions_dict = window.globalVars.SHORTHAND_ACTIONS;
        const shorthand_actions = this.config.Sequence.map(action => {
            return shorthand_actions_dict[action.Type];
        })
        return shorthand_actions.join('');
    }

    get allQueries() {
        const queries = this.config.Sequence.filter(action => action.Type === 'NewQuery' || action.Type === 'RefinedQuery').map(action => {
            return action.Query;
        })

        return queries.join('|');
    }

    get queriesCount() {
        return this.config.queriesCount;
    }

    get clicksPerQuery() {
        return this.config.clicksPerQuery;
    }
    
    get keywordClusterId() {
        return this.config.BERTopicsKeywordCluster;
    }

    get allQueryPairs() {
        const queries = this.config.Sequence.filter(action => action.Type === 'NewQuery' || action.Type === 'RefinedQuery').map(action => {
            return `${action.Query}|${action.ExtendedQuery}`;
        })

        return queries
    }

    get allClickedItems() {

        const clickEventNames = ['Click1-5', 'Click6-10', 'Click11+', 'Click1-5_Short', 'Click6-10_Short', 'Click11+_Short'];
        const queries = this.config.Sequence.filter(action => action.Type === 'NewQuery' || action.Type === 'RefinedQuery')
        // .map(action => {
        //     return action
        // })

        const clickedItems = queries.map(query => {
            const clickedURLs = this.config.Sequence.filter(action => clickEventNames.includes(action.Type) && action.Query === query.Query).map(action => {
                return action.ClickedURL
            })

            const queryResults = query.QueryResults.map(queryResult => {
                const count = clickedURLs.filter(url => url === queryResult.url).length
                return {
                    ...queryResult,
                    count: count
                }
            })
            const clickCounts = queryResults.reduce((prev, cur) => {
                return prev + cur.count
            }, 0)
            return {
                query: query.Query,
                expandedQuery: query.ExtendedQuery,
                results: queryResults,
                clickCounts: clickCounts
            }
        })



        return clickedItems
    }

    set id(id) {
        this.config.SessionNum = id;
    }

    set userId(userId) {
        this.config.UserId = userId;
    }

    set behaviorClusterId(behaviorClusterId) {
        this.config.behaviorClusterId = behaviorClusterId;
    }

    set sequence(sequence) {
        this.config.Sequence = sequence;
    }

    set metricValues(metricValues) {
        Object.entries(metricValues).forEach(([key, value]) => {
            if(key in this.config) {
                this.config[key] = value;
            }
        });
    }

    set queriesCount(queriesCount) {
        this.config.queriesCount = queriesCount;
    }

    set clicksPerQuery(clicksPerQuery) {
        this.config.clicksPerQuery = clicksPerQuery;
    }

    set keywordClusterId(keywordClusterId) {
        this.config.BERTopicsKeywordCluster = keywordClusterId;
    }

}

/*

    config: {
        id: int,
        label: string 
        distinguishing_features: [
            {
                cluster_id: int,
                action_items: [
                    string
                ],
                score: float
            }
        ],
        divided_cluster: int,
        remaining_cluster: int,
        children: [
            int
        ],
        subtree_size: int
    }

*/

export class BehaviorCluster {
    constructor(config) {
        this.config = config;
        this.subtreeNodeIds = new Set();
        this.sessions = {};
    }

    get id() {
        return this.config.id;
    }

    get label() {
        return this.config.label;
    }

    get distinguishingFeatures() {
        return this.config.distinguishing_features;
    }

    get dividedCluster() {
        return this.config.divided_cluster;
    }

    get remainingCluster() {
        return this.config.remaining_cluster;
    }

    get children() {
        return this.config.children;
    }

    get subtreeSize() {
        return this.config.subtree_size;
    }

    set id(id) {
        this.config.id = id;
    }

    set label(label) {
        this.config.label = label;
    }

    set distinguishingFeatures(distinguishing_features) {
        this.config.distinguishing_features = distinguishing_features;
    }

    set dividedCluster(divided_cluster) {
        this.config.divided_cluster = divided_cluster;
    }

    set remainingCluster(remaining_cluster) {
        this.config.remaining_cluster = remaining_cluster;
    }

    set children(children) {
        this.config.children = children;
    }

    set subtreeSize(subtree_size) {
        this.config.subtree_size = subtree_size;
    }

}

/*

    config: {
        id: int,
        subtree_size: int,
        metric_values: {
            metric: float
        }
        keywords: [
            {
                keyword: string,
                score: float
            }
        ]
    }

*/

export class KeywordCluster {
    constructor(config) {
        this.config = config;
        this.behaviorClusters = {};
    }

    get id() {
        return this.config.id;
    }

    get subtreeSize() {
        return this.config.subtree_size;
    }

    get metricValues() {
        return this.config.metric_values;
    }

    get keywords() {
        return this.config.keywords;
    }

    get topKeyword() {
        return this.config.keywords[0].keyword;
    }

    get topFiveKeywords() {
        return this.config.keywords.slice(0, 5).map(k => k.keyword)
    }

    set id(id) {
        this.config.id = id;
    }

    set subtreeSize(subtreeSize) {
        this.config.subtree_size = subtreeSize;
    }

    set metricValues(metricValues) {
        this.config.metric_values = metricValues;
    }

    set keywords(keywords) {
        this.config.keywords = keywords;
    }

}