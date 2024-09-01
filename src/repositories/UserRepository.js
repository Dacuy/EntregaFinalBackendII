
export default class UserRepository {
    constructor(dao){
        this.dao = dao;
    }

    getUsers(){
        return this.dao.get();
    }
    getUserById(id){
        return this.dao.getOne({_id:id});
    }
    getUserByEmail(email){
        return this.dao.getOne({email:email});
    }
    createUser(user){
        return this.dao.create(user)
    }
    updateUser(id, user){
        return this.dao.update(id, user)
    }
    deleteUser(id){
        return this.dao.delete(id)
    }

}