"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex , setActiveQuestionIndex] = useState(0);

  const cleanInterviewId = params.interviewId.startsWith('resp')
    ? params.interviewId.substring('resp'.length).trim()
    : params.interviewId;

  useEffect(() => {
    console.log('Clean Interview ID:', cleanInterviewId);
    GetInterviewDetails();
  }, [cleanInterviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, cleanInterviewId));
      
      console.log('Database result:', result);
      
      if (result && result.length > 0) {
        let jsonMockRespString = result[0].jsonMockResponse;
        console.log('Raw JSON Mock Response:', jsonMockRespString);
      
        // Clean the JSON string by trimming
        jsonMockRespString = jsonMockRespString.trim();
      
        // Check if the string starts with '[' and ends with ']'
        if (jsonMockRespString.startsWith('[') && jsonMockRespString.endsWith(']')) {
          // Wrap the response inside { "questions": [...] }
          jsonMockRespString = `{ "questions": ${jsonMockRespString} }`;
        }
      
        // Parse the JSON string safely
        let jsonMockResp;
        
          jsonMockResp = JSON.parse(jsonMockRespString);

        
        
        // let jsonMockResp = (result[0].jsonMockResponse.replace(/[^}]*$/, ""));
        // console.log('JSON Mock Response:', jsonMockResp);

        // if (!jsonMockResp.startsWith('{')) {
        //   jsonMockResp = '{' + jsonMockResp;
        // }
        // if (!jsonMockResp.endsWith('}')) {
        //   jsonMockResp = jsonMockResp + '}';
        // }

        // console.log(jsonMockResp)

        // jsonMockResp = JSON.parse(jsonMockResp)

        

        console.log(jsonMockResp);
        
        if (jsonMockResp && jsonMockResp.questions) {
          setMockInterviewQuestions(jsonMockResp.questions);
          console.log('Questions:', jsonMockResp.questions);
        } else {
          console.error('No questions found in the response');
        }
        setInterviewData(result[0]);
      } else {
        console.error('No interview data found');
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
    }
  };

  if (!mockInterviewQuestions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
      <QuestionsSection MockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} />

      <RecordAnsSection MockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
    </div>

    <div className='flex justify-center md:justify-end gap-6 mb-2'>
    {activeQuestionIndex > 0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button> }
    {activeQuestionIndex < mockInterviewQuestions.length - 1 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} >Next Question</Button>}
    {activeQuestionIndex == mockInterviewQuestions.length - 1 &&  <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}
    ><Button>End Interview</Button></Link> }
    
    </div>

    </div>
  );
}

export default StartInterview;
