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
