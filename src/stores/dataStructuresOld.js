const DATAPATH = './data';

export class Session {
    constructor(session) {
        this.session = session;
    }

    getKeywordClusterId() {
        return this.session.BERTopicsKeywordCluster;
    }

    getBehaviorClusterId() {
        return this.session.ClusterID;
    }

    getId() {
        return this.session.SessionNum;
    }

    getMetricVal(metric) {
        if(!(metric in this.session)) {
            return null;
        }
        return this.session[metric];
    }

    static getCmpFunction(sortBy) {
        if(!sortBy) {
            return (a, b) => a.getId() - b.getId();
        }
        return (a, b) => a.getMetricVal(sortBy) - b.getMetricVal(sortBy);
    }

}

export class KeywordCluster {

    constructor(keywordCluster) {
        this.keywordCluster = keywordCluster;
    }

    getId() {
        return this.keywordCluster.id;
    }

    getTopKeyword() {
        return this.keywordCluster.keywords[0];
    }

    getKeywords() {
        return this.keywordCluster.keywords;
    }

    getKeywordCount() {
        return this.keywordCluster.keywords.length;
    }

}

export class FilterState {
    constructor() {
        this.chosenMetrics = [];
        this.chosenKeywordClusterId = null;
        this.chosenBehaviorClusterId = null;
        this.chosenSessionId = null;
        this.sortBy = null;
    }

    accepts(session) {
        if (this.chosenKeywordClusterId && this.chosenKeywordClusterId !== session.getKeywordClusterId()) {
            return false;
        }
        if (this.chosenBehaviorClusterId && this.chosenBehaviorClusterId !== session.getBehaviorClusterId()) {
            return false;
        }
        if (this.chosenSessionId && this.chosenSessionId !== session.getId()) {
            return false;
        }
        return true;
    }
    
    getCmpFunction() {
        return Session.getCmpFunction(this.sortBy);
    }

}

class List {

    constructor(buildFile = null, buildList = null, listElementClass) {
        this.list = [];
        
        if(buildFile) {
            const data = this.parseFile(require(`${DATAPATH}/${buildFile}`));

            data.forEach((dataInstance) => {
                this.list.push(new listElementClass(dataInstance));
            })
        }
        else if(buildList) {
            this.list = buildList.map(dataInstance => dataInstance);
        }
    }

    getIndex(index) {
        return this.list[index];
    }

    getId(id) {
        return this.list.find(element => element.getId() === id);
    }

}

export class SessionList extends List {

    constructor(sessionsFile = null, sessionList = null) {
        super(sessionsFile, sessionList, Session);
    }

    parseFile(data) {
        return data;
    }

    getFilteredSessions(filterState) {
        return new SessionList(null, this.list
            .filter(session => {
                return filterState.accepts(session);
            })
            .sort(filterState.getCmpFunction())
        );
    }
}

export class KeywordClusterList extends List {

    constructor(keywordClustersFile = null, keywordClusters = null) {
        super(keywordClustersFile, keywordClusters, KeywordCluster);
    }
    
    parseFile(data) {
        return Object.entries(data).map(([keywordClusterId, keywords]) => {
            return {
                'id': keywordClusterId,
                'keywords': keywords.map(keyword => { 
                    return {
                        'keyword': keyword[0],
                        'score': keyword[1]
                    }
                }).sort((a, b) => b.score - a.score)
            };
        });
    }

}