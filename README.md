# API Digest

* /api/auth/create
    * @params(_post_) { username: String, password: String }
    * @returns { status: String, response: String }
    
* /api/auth/request
    * @params(_post_) { username: String, password: String }
    * @returns { status: String, response: String, token: String(64) }
    
* /api/auth/validate/{token}
    * @params(_get_) { token: String(64) }
    * @returns { status: String, response: String }
    
* /api/institution/create
    * @params(_post_) { name: String }
    * @returns { status: String, response: String }
    
* /api/institution/list
    * @params(_get_) { }
    * @returns { status: String, response: String, data: JSON }
    
* /api/institution/delete/{id}
    * @params(_get_) { id: String }
    * @returns { status: String, response: String }
    
* /api/class/create/{inst}
    * @params(_get_) { inst: String }
    * @params(_post_) { name: String }
    * @returns { status: String, response: String }
    
* /api/class/list/{inst}
    * @params(_get_) { inst: String }
    * @returns { status: String, response: String, data: JSON }
    
* /api/class/delete/{id}
    * @params(_get_) { id: String }
    * @returns { status: String, response: String }
