import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

/*
REVIEW SCHEMA:
Contains unoffical, arbitrary voting information cast by members
Such as scoring on the "academic merit" or "presentation quality" of a proposal.
known as "metrics" in STF nomenclature
*/
const ReviewSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  role: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  score: { type: Number, min: 0, max: 5 },
  recommended: Boolean
})
ReviewSchema.plugin(autoref, [
  // No backwards ref for companies, due to business logic
  'program.reviews',
  'author.reviews'
])
ReviewSchema.plugin(autopopulate)
const Review = mongoose.model('Review', ReviewSchema)
export default Review
/*
RATING QUESTIONS:
When we get to the relevant point in data migration, put a plain-english explaination of the possible rating
key-value pairs here.
NOTE:
*/

/* *****
FAKE DATA GENERATOR: Review
******/
const dummyReviews = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Review.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Review schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Review({
          _id: ids.review[i],
          date: faker.date.recent(),
          company: ids.company[i],
          program: ids.program[i],
          role: (i % 2 === 0) ? 'SWE' : 'SDET',
          author: ids.user[i],
          title: faker.company.catchPhraseDescriptor(),
          body: faker.lorem.paragraph(),
          score: faker.random.number(),
          recommended: faker.random.boolean()
        })
      }
      //  Create will push our fakes into the DB.
      Review.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Review (${fakes.length})`) }
      })
    }
  })
}
export { dummyReviews }
