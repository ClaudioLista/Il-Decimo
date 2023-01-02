const db = require('../util/database');

module.exports = class Match {
  constructor(id, title, placeName, address, time, description, price, totalPlayers, currentPlayers, listPlayers) {
    this.id = id;
    this.title = title;
    this.placeName = placeName;
    this.address = address;
    this.time = time;
    this.description = description;
    this.price = price;
    this.totalPlayers = totalPlayers;
    this.currentPlayers = currentPlayers;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
