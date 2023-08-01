// import AppError from '@Utils/AppError';
import { expressAsyncHandler } from '../utils';
import AppError from '../utils/AppError';
import APIFeatures from './APIFeatures';

const DOC_NOT_FOUND = 'Document not found!';

export const createOne = (Model) =>
  expressAsyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    return res.status(201).json(doc);
  });

export const getAll = (Model, populateOptions) =>
  expressAsyncHandler(async (req, res) => {
    let filter = {};
    if (req.params.linkId) filter = { link: req.params.linkId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (populateOptions) features.query = features.query.populate(populateOptions);

    const docs = await features.query;
    return res.status(200).json(docs);
  });

export const getOne = (Model, populateOptions) =>
  expressAsyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;
    if (!doc) return next(new AppError(DOC_NOT_FOUND, 404));

    return res.status(200).json(doc);
  });

export const updateOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    delete req.body._id;
    delete req.body.id;

    const document = await Model.findById(req.params.id);
    if (!document) return next(new AppError(DOC_NOT_FOUND, 404));

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(doc);
  });

export const deleteOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(DOC_NOT_FOUND, 404));
    }

    return res.status(204).json({});
  });
