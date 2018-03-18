import mongoose from 'mongoose'
import config from 'config'

import { restDummies } from './models'

export default function () {
  const min = config.has('lorem-ipsum')
    ? config.get('lorem-ipsum')
    //  Default: 5 models of each type
    : 5
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)
  //  Activate dummy data generators, with specified minimums document counts.

  //  Generate an object containing ObjectIds for dummy objects.
  const ids = {
    user: [],
    organization: [],
    company: [],
    program: [],
    review: []
  }
  Object.keys(ids).forEach((key) => {
    for (let i = 0; i < min; i++) {
      ids[key].push(new mongoose.Types.ObjectId())
    }
  })
  let _id = new mongoose.Types.ObjectId()
  //  For testing purposes
  const developer = {
    _id,
    name: 'Web Developer',
    username: 'webdev',
    email: 'rykeller@uw.edu',
    organization: ids.organization[0],
    reviews: ids.review[0],
    experience: ids.program[0]
  }
  //  Create dummies for all RESTful models
  restDummies.map((model) => model(min, ids, developer))
}
