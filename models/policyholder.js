const mongoose = require("mongoose");

const policyholderSchema = new mongoose.Schema({
  code: String,
  name: String,
  registration_date: Date,
  introducer_code: String,
  l: {
    code: String,
    name: String,
    registration_date: Date,
    introducer_code: String
  },
  r: {
    code: String,
    name: String,
    registration_date: Date,
    introducer_code: String
  }
}, { collection: 'policyholder' });

policyholderSchema.statics.getPolicyholder = async function (code) {
  const policyholder = await this.findOne({ code });

  if (!policyholder) {
    return null;
  }
  return policyholder;
};

policyholderSchema.statics.getTopPolicyholders = async function (code) {
  const policyholder = await this.findOne({ code });

  if (!policyholder) {
    return null;
  }
  const topPolicyholders = await this.find({ code: policyholder.introducer_code });

  return topPolicyholders;
};

const Policyholder = mongoose.model("Policyholder", policyholderSchema);

module.exports = Policyholder;
