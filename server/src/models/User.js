// server/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../config/in-memory-db.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exclude password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const MongooseUser = mongoose.model('User', userSchema);

export class User {
  constructor(data) {
    if (isDbConnected()) {
      return new MongooseUser(data);
    }
    return inMemoryStore.users.create(data);
  }

  static findOne(predicate) {
    return isDbConnected() ? MongooseUser.findOne(predicate) : inMemoryStore.users.findOne(predicate);
  }

  static findById(id) {
    return isDbConnected() ? MongooseUser.findById(id) : inMemoryStore.users.findById(id);
  }
}
