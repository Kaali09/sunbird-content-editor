EkstepEditor.contentService = new(EkstepEditor.iService.extend({
    serviceURL: EkstepEditor.config.baseURL + '/api/learning/',
    content: {},
    initService: function() {},
    setContentMeta: function(id, versionKey) {
        if (id) {
            this.content[id] = _.isUndefined(this.content[id]) ? {} : this.content[id];
            this.content[id].versionKey = _.isUndefined(versionKey) ? this.content[id].versionKey : versionKey;
        }
    },
    getContentMeta: function(id) {
        return this.content[id];
    },
    saveContent: function(contentId, body, callback) {
        var instance = this,                        
            versionKey = instance.content[contentId].versionKey;

        if (contentId && versionKey && body) {
            var requestObj = {
                request: {
                    content: {
                        body: body,
                        versionKey: versionKey
                    }
                }
            };

            console.log("save content: ", requestObj);

            instance.http.patch(this.serviceURL + 'v2/content/' + contentId, requestObj)
                .then(function success(response) {
                    console.log("success response", response);
                    instance.setContentMeta(contentId, response.data.result.versionKey);
                    callback(null, response);                    
                }, function error(response) {
                    callback(response, null);
                });
        }
    },
    getContent: function(contentId, callback) {
        var instance = this;
        if (contentId) {
            var metaDataFields = "body,editorState,templateId,languageCode,template,gradeLevel,status,concepts,versionKey";
            instance.http.get(this.serviceURL + 'v2/content/' + contentId + "?fields=" + metaDataFields)
                .then(function success(response) {
                    instance.setContentMeta(contentId, response.data.result.content.versionKey);
                    callback(null, response.data.result.content.body);
                }, function error(response) {
                    callback(response, null);
                });
        }
    },
    getContentMetadata: function(contentId, callback) {
        this.http.get(this.serviceURL + 'v2/content/' + contentId)
            .then(function success(response) {
                callback(null, response);
            }, function error(response) {
                callback(response, null);
            });
    }
}));
