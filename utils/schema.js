
import { pgTable } from "drizzle-orm/pg-core";

import { varchar } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview' , {
  id:serial('id').primaryKey(),
  jsonMockResponse:text('jsonMockResp').notNull(),
  jobPosition:varchar('jobPosition').notNull(),
  jobDescription:varchar('jobDescription').notNull(),
  jobExperience:varchar('jobExperience').notNull(),
  createdBy:varchar('createdBy').notNull(),
  createdAt:varchar('createdAt').notNull(),
  mockId:varchar('mockId').notNull(),

})


export const UserAnswer=pgTable('userAnswer', {
  id:serial('id').primaryKey(),
  mockIdRef:varchar('mockId').notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns').notNull(),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt:varchar('createdAt'),
})