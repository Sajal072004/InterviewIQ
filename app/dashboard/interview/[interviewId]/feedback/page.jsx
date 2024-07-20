"use client";
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const cleanInterviewId = params.interviewId.startsWith('resp')
    ? params.interviewId.substring('resp'.length).trim()
    : params.interviewId;

  const [feedbackList, setFeedBackList] = useState([]);
  const [cnt, setCnt] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const GetFeedback = async () => {
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, cleanInterviewId))
        .orderBy(UserAnswer.id);
      setFeedBackList(result);

      // Calculate total rating
      const totalRating = result.reduce((sum, item) => sum + parseFloat(item.rating) || 0, 0);
      setCnt(totalRating);
    };

    GetFeedback();
  }, [cleanInterviewId]);

  const overallRating = cnt / 5;

  return (
    <div className='p-10'>


      {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2> :

        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
          <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
          <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>{overallRating.toFixed(1)}/10</strong></h2>
          <h2 className='text-sm text-gray-500'>Find below the most relatable answer to the questions and your answer along with the areas of improvement.</h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between gap-10 my-2 text-left w-full'>
                {item.question}
                <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'>
                    <strong>Rating - </strong>{item.rating}
                  </h2>
                  <h2 className='bg-red-50 p-2 border rounded-lg text-sm text-red-900'>
                    <strong>Your Answer - </strong>{item.userAns}
                  </h2>
                  <h2 className='bg-green-50 p-2 border rounded-lg text-sm text-green-900'>
                    <strong>Better Answer - </strong>{item.correctAns}
                  </h2>
                  <h2 className='bg-blue-50 p-2 border rounded-lg text-sm text-primary'>
                    <strong>Area of Improvement - </strong>{item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          <Button className='mt-5' onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </>
      }
    </div>
  );
}

export default Feedback;
