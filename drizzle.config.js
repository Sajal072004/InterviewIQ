/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://Expense-Tracker_owner:qMucLzs50YRe@ep-orange-meadow-a59qgsq4.us-east-2.aws.neon.tech/InterviewIQ?sslmode=require',
  }
};
