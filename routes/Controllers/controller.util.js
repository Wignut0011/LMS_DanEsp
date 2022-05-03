exports.getQueryParams = (req) => {
    let params = {
        sortCol: null,
        sortDir: null,
        filterCol: null,
        filterStr: null,
        limit: null,
        offset: null,
    };
    if ("sortCol" in req.query) {
        params['sortCol'] = req.query.sortCol;
    }
    if ("sortDir" in req.query) {
        params['sortDir'] = req.query.sortDir;
    }
    if ("filterCol" in req.query) {
        params['filterCol'] = req.query.filterCol;
    }
    if ("filterStr" in req.query) {
        params['filterStr'] = req.query.filterStr;
    }
    if ("limit" in req.query){
        params['limit'] = req.query.limit;
    }
    if ("offset" in req.query){
        params['offset'] = req.query.offset;
    }
    return params;
}