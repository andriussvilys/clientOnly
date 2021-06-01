class Auth {
    constructor(){
        this.authenticated = false
        this.guest = false
    }
    login(cb, props){
        if(props && props.guest){
            this.guest = true
        }
        else{
            this.guest = false
        }
        this.authenticated = true
        cb()
    }
    logout(cb){
        this.authenticated = false
        this.guest = null
        cb()
    }
    isAuthenticated(){
        return this.authenticated
    }
}

export default new Auth()