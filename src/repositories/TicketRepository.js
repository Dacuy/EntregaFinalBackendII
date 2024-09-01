export default class TicketsRepository {
    constructor(dao){
        this.dao = dao;
    }
    getTickets(){
        return this.dao.get()
    }
    getOneTicket(id){
        return this.dao.getOne({_id: id})
    }
    getTicketByEmail(email){
        return this.dao.getOne({purchaser: email})
    }
    deleteTIcket(id){
        return this.dao.delete(id)
    }
    updateTicket(id, ticket){
        return this.dao.update(id, ticket)
    }
    createTicket(ticket){
        return this.dao.create(ticket)
    }
}