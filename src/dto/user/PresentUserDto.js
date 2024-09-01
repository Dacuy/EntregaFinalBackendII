
export default class PresentUserDto {
    name;
    id;
    role;
    constructor(user){
        this.name = `${user.first_name} ${user.last_name}`
        this.id = user._id
        this.role = user.role
    }   
}