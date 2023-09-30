"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongodb_1 = require("mongodb");
const enum_1 = require("../constants/enum");
class Contact {
    constructor(contact) {
        const date = new Date();
        this._id = contact._id || new mongodb_1.ObjectId();
        this.name = contact.name;
        this.email = contact.email;
        this.phone = contact.phone;
        this.message = contact.message;
        this.status = contact.status || enum_1.statusContact.SUBMITTED;
        this.created_at = contact.created_at || date;
        this.updated_at = contact.updated_at || date;
    }
}
exports.Contact = Contact;
