

class MyMap {
    apikey;
    //a function that runs immediately a class instance is created
    constructor(apikey){
        this.apikey = apikey
    }

    getApiKey() {
        return this.apikey;
    }
}

module.exports = MyMap;