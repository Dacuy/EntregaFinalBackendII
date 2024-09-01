import ticketModel from "../models/tickets.model.js";

export default class TicketDao {
    get(){
        return ticketModel.find({})
    }
    getOne(params){
        return ticketModel.findOne(params);
    }
    create(ticket){
        return ticketModel.create(ticket);
    }
    update(id,ticket){
        return ticketModel.updateOne({_id:id}, ticket)
    }
    delete(id){
        return ticketModel.deleteOne({_id: id});
    }
}