const db = require("../data/database");
const mongodb = require("mongodb");

class Product {
  constructor(productData) {
    // a single object is passed having multiple fields
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // + added so that it is stored as a number & not as a string in db
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    this.updateImageData(); // to add imagePath and imageUrl , order necessary
    // this.imagePath = `product-data/images/${productData.image}`; // for backend purposes
    // this.imageUrl = `/products/assets/images/${productData.image}`; // for frontend purposes, like when web browsers req this image then its path or url

    // added after below static method
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId; // because of variable scoping
    try {
      // maybe we dont get a valid productId thats why checking
      prodId = new mongodb.ObjectId(productId); // because productId is string and database _id has a s separate mongo Object format
    } catch (error) {
      // not a built-in property of JS Error object, it's a custom property being added to the Error obj to provide additional information about the nature of the error.
      error.code = 404; // 404 means not found
      throw error;
    }
    const product = await db // actually finding the product object
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      //  we dont find a product from db
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product); // return a new instance of Product class not the product document straight from db
  }

  // static method so that it can be called without creating an instance of the class(bc we want all products )
  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray(); // convert the cursor to documents into an array of full documents

    // map() creates an instance of Product object for each product document, automatically takes all items of array one at a time
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    // constructor commented values are put in here as a separate function
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    // //imagePath and imageUrl not added bc if they are changed we have to manually change each entry in db
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      // if we have an id then we are updating the product
      const productId = new mongodb.ObjectId(this.id); // converting this.id to mongodb Object format

      if (!this.image) {
        // if we dont have an image i.e. no new image was added this field will be submitted as null and we dont want to update current img in db as NULL
        delete productData.image; // delete keyword removes a property from an object( here key value pair of image: this.image will be removed)
      }
      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      // if we dont have an id then we are creating a new product
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  } // alternatively we could have use async - await instead of returning the result
}

module.exports = Product;
