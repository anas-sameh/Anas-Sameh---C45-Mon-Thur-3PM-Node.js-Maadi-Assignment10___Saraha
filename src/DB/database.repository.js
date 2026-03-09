export const findOne = async ({
  model,
  select = " ",
  option = {},
  filter = {},
} = {}) => {  
  return await model.findOne(filter, option)
};

export const createOne = async ({
  model,
  data,
  option = {},
} = {}) => {
  return model.create(data, option);
};

export const createMany = async ({
  model,
  data = [{}],
  option = {},
} = {}) => {
  const dec = await model.insertMany(data, option);
  return dec;
};

export const findById = async ({
  model,
  id = undefined,
} = {}) => {
  return await model.findById(id);
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  option = {},
} = {}) => {
  return await model.updateOne(filter, data, option);
};

export const deleteOne = async ({
  model,
  filter = {},
} = {}) => {
  return await model.deleteOne(filter)
};


export const deleteMany = async ({
  model,
  filter = {},
} = {}) => {
  return await model.deleteMany(filter)
};