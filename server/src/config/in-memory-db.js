// server/src/config/in-memory-db.js
import bcrypt from 'bcryptjs';

class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = new Map();
  }

  generateId() {
    return 'mem_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  async findOne(predicate) {
    for (const item of this.items.values()) {
      let match = true;
      for (const [key, val] of Object.entries(predicate)) {
        if (key === '_id' || key === 'id') {
          if (String(item._id) !== String(val) && String(item.id) !== String(val)) match = false;
        } else if (item[key] !== val) {
          match = false;
        }
      }
      if (match) return this.wrapDocument(item);
    }
    return null;
  }

  findById(id) {
    const item = this.items.get(String(id));
    const doc = item ? this.wrapDocument(item) : null;
    
    // Support Mongoose query chaining like .select(...)
    const queryPromise = Promise.resolve(doc);
    queryPromise.select = () => Promise.resolve(doc);
    return queryPromise;
  }

  find(filter = {}) {
    const results = [];
    for (const item of this.items.values()) {
      let match = true;
      for (const [key, val] of Object.entries(filter)) {
        if (key === 'ownerId') {
          if (String(item.ownerId) !== String(val)) match = false;
        } else if (item[key] !== val) {
          match = false;
        }
      }
      if (match) results.push(this.wrapDocument(item));
    }

    const query = {
      select: () => query,
      sort: () => query,
      skip: (skipCount) => ({
        limit: (limitCount) => Promise.resolve(results.slice(skipCount, skipCount + limitCount))
      }),
      then: (resolve) => resolve(results)
    };
    return query;
  }

  async countDocuments(filter = {}) {
    let count = 0;
    for (const item of this.items.values()) {
      let match = true;
      for (const [key, val] of Object.entries(filter)) {
        if (key === 'ownerId') {
          if (String(item.ownerId) !== String(val)) match = false;
        } else if (item[key] !== val) {
          match = false;
        }
      }
      if (match) count++;
    }
    return count;
  }

  async findByIdAndDelete(id) {
    const item = this.items.get(String(id));
    this.items.delete(String(id));
    return item;
  }

  async deleteMany(filter = {}) {
    let deleted = 0;
    for (const [id, item] of this.items.entries()) {
      let match = true;
      for (const [key, val] of Object.entries(filter)) {
        if (String(item[key]) !== String(val)) match = false;
      }
      if (match) {
        this.items.delete(id);
        deleted++;
      }
    }
    return { deletedCount: deleted };
  }

  wrapDocument(data) {
    const doc = { ...data };
    const self = this;

    if (!doc._id) {
      doc._id = this.generateId();
    }

    doc.toObject = () => ({ ...doc });
    doc.toJSON = () => {
      const copy = { ...doc };
      delete copy.password;
      delete copy.privateSolution;
      return copy;
    };
    doc.toPublicJSON = () => {
      const copy = { ...doc };
      delete copy.privateSolution;
      delete copy.password;
      return copy;
    };

    if (this.name === 'users') {
      doc.comparePassword = async function (candidate) {
        return bcrypt.compare(candidate, doc.password);
      };
    }

    doc.save = async function () {
      doc.updatedAt = new Date();
      if (!doc.createdAt) doc.createdAt = new Date();

      if (self.name === 'users' && doc.password && !doc.password.startsWith('$2a$') && !doc.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash(doc.password, salt);
      }

      self.items.set(String(doc._id), doc);
      return doc;
    };

    return doc;
  }

  create(data) {
    const doc = this.wrapDocument({
      _id: this.generateId(),
      createdAt: new Date(),
      ...data
    });
    return doc;
  }
}

export const inMemoryStore = {
  users: new InMemoryCollection('users'),
  cases: new InMemoryCollection('cases'),
  progress: new InMemoryCollection('progress')
};
