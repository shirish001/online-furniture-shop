const db = require('../data/database');
const mongodb = require('mongodb');

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart; // {products: [...], totalAmount: ...}
    this.userData = userData; // {email: ..., userId: ...}
    this.status = status; 
    this.date = new Date(date); // date of order

    if (this.date) { // if date is not null
      this.formattedDate = this.date.toLocaleDateString('en-US', { // formatting the date in a specific manner
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  // static method to transform order documents
  static transformOrderDocument(orderDoc) { // orderDoc is the order document
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) { // orderDocs is an array of order documents
    return orderDocs.map(this.transformOrderDocument); // returning an array of order objects
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders); // returning an array of order objects
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  save() { // method will be called on an created obj of order class
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),// mongodb is configured to work with this
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;