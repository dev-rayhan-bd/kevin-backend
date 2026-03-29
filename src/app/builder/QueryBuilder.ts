import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search functionality for multiple fields
  search(searchableFields: string[]) {
    const search = this?.query?.search as string;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' }, // case-insensitive search
        })),
      });
    }
    return this;
  }

  // filter() {

  //   const queryObj = { ...this.query };
  //   const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
  //   excludeFields.forEach((el) => delete queryObj[el]);

  //   const mongoQuery: Record<string, unknown> = {};
  //   for (const [key, value] of Object.entries(queryObj)) {
  //     if (typeof value === 'string') {
  //       mongoQuery[key] = { $regex: new RegExp(`^${value}$`, 'i') };
  //     } else {
  //       mongoQuery[key] = value;
  //     }
  //   }

  //   this.modelQuery = this.modelQuery.find(mongoQuery as FilterQuery<T>);
  //   return this;
  // }

  // filter() {
  //   const queryObj: Record<string, unknown> = { ...this.query };
  //   const exclude = ['search', 'sort', 'limit', 'page', 'fields'];
  //   exclude.forEach((k) => delete queryObj[k]);

  //   const mongo: Record<string, unknown> = {};
  //   for (const [key, raw] of Object.entries(queryObj)) {
  //     if (raw == null) continue;
  //     if (typeof raw === 'string') {
  //       // boolean normalize
  //       if (/^(true|false)$/i.test(raw)) {
  //         mongo[key] = /^true$/i.test(raw);
  //         continue;
  //       }
  //       // objectId normalize (optional)
  //       // if (key.toLowerCase().endsWith('id') && mongoose.isValidObjectId(raw)) {
  //       //   mongo[key] = new mongoose.Types.ObjectId(raw);
  //       //   continue;
  //       // }
  //       // default: case-insensitive exact string match
  //       mongo[key] = {
  //         $regex: `^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
  //         $options: 'i',
  //       };
  //     } else {
  //       mongo[key] = raw;
  //     }
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   this.modelQuery = this.modelQuery.find(mongo as FilterQuery<any>);
  //   return this;
  // }
filter() {
  const queryObj: Record<string, unknown> = { ...this.query };
  const exclude = ['search', 'sort', 'limit', 'page', 'fields'];
  exclude.forEach((k) => delete queryObj[k]);

  const mongo: Record<string, unknown> = {};

  for (const [key, raw] of Object.entries(queryObj)) {
    if (raw == null) continue;

    if (typeof raw === 'string') {
      // Handle boolean normalization
      if (/^(true|false)$/i.test(raw)) {
        mongo[key] = /^true$/i.test(raw);
        continue;
      }

      // Partial, case-insensitive match (A-z flexible)
      mongo[key] = {
        $regex: raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // escape regex chars
        $options: 'i', // case-insensitive
      };
    } else {
      mongo[key] = raw;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.modelQuery = this.modelQuery.find(mongo as FilterQuery<any>);
  return this;
}

  // Sorting functionality
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'; // Default to descending by createdAt
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // Pagination functionality
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
}

// Fields selection (allow dynamic field inclusion/exclusion)

  fields() {
    const fields =
      (this.query?.fields as string)?.split(',')?.join(' ') || '-__v'; // Default to excluding __v field
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  

  // Count total records for pagination metadata
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
