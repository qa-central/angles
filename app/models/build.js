const mongoose = require('mongoose');

const { Schema } = mongoose;
const executionStates = ['SKIPPED', 'PASS', 'ERROR', 'FAIL'];

const Artefact = new Schema({
  artifactId: { type: String, required: false },
  groupId: { type: String, required: false },
  version: { type: String, required: false },
});

const Suite = mongoose.Schema({
  name: { type: String, required: true },
  result: { type: Map, of: Number, required: false },
  status: { type: String, enum: executionStates, required: false },
  executions: [{ type: Schema.Types.ObjectId, ref: 'TestExecution' }],
});


const BuildSchema = Schema({
  name: { type: String, required: false },
  result: { type: Map, of: Number, required: false },
  artifacts: [{ type: Artefact, required: false }],
  keep: { type: Boolean, required: false },
  environment: { type: Schema.Types.ObjectId, ref: 'Environment' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  component: { type: Schema.Types.ObjectId, ref: 'Component' },
  suites: [{ type: Suite, required: true }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Build', BuildSchema);
