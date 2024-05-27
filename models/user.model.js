const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  static findById(userId){
    const uid = new mongodb.ObjectId(userId); // converting string to object id
    // sencond parameter is to decide what to return from database, 0 means except this everything else will be returned
    return db.getDb().collection('users').findOne({_id: uid}, {projection: {password: 0}}); // projection key is standard
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  // a bool func that checks and returns true/false if a user with the enterd email is present in database or not
  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail(); // to use other method in new method have to use this keyword again for classes
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
