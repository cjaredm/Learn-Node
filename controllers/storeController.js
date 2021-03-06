const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home Page'});
};

exports.addStore = (req, res) => {
  res.render('editStore',  {
    title: 'Add Store'
  });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  await store.save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`)
};

exports.getStores = async (req, res) => {
  // 1. Query The DB for all stores
  const stores = await Store.find();

  res.render('stores', {title: 'Stores', stores})
};

exports.editStore = async (req, res) => {
  // 1. Find store given ID
  const store = await Store.findOne({_id: req.params.id});
  // 2. Confirm they are the owner of the store
  // TODO
  // 3. Render the dit form to edit the store
  res.render('editStore', {title: `Edit ${store.name}`, store})
};

exports.updateStore = async (req, res) => {
  // 1. Find and update the store
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, // Return new store instead of the old store
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View Store</a>`)
  // 2. Redirect to the store, Say it worked
  res.redirect(`/stores/${store._id}/edit`);

};
