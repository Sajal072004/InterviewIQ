"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const cleanInterviewId = params.interviewId.startsWith('resp')
    ? params.interviewId.substring('resp'.length).trim()
    : params.interviewId;

  useEffect(() => {
    console.log(cleanInterviewId);
    GetInterviewDetails();
  }, [cleanInterviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, cleanInterviewId));
      console.log(result);
      setInterviewData(result[0] || null); // Set to null if no data
    } catch (err) {
      console.error('Error fetching interview details:', err);
    }
  };

  useEffect(() => {
    console.log(interviewData);
  }, [interviewData]);

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        <div className='flex flex-col my-5 gap-5 '>

          <div className='flex flex-col  p-5 rounded-lg border gap-5'>

          <h2 className='text-lg'>
            <strong>Job Role/Job Position:</strong> {interviewData ? interviewData.jobPosition : 'Loading...'}
          </h2>
          <h2 className='text-lg'>
            <strong>Job Description/ Tech Stack:</strong> {interviewData ? interviewData.jobDescription : 'Loading...'}
          </h2>
          <h2 className='text-lg'>
            <strong>Years of Experience:</strong> {interviewData ? interviewData.jobExperience : 'Loading...'}
          </h2>

          </div>
          <div className='p-5
           border rounded-lg border-yellow-300 bg-yellow-100'>
           
            <h2 className='flex gap-2 items-center text-yellow-800 text-lg'><Lightbulb/><strong>Information</strong></h2>
            <h2 className='mt-3 text-yellow-500 font-semibold'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>

        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              style={{
                height: 300,
                width: 300,
              }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
            />
          ) : (
            <>
            <div>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
            <div className='text-center'>
            <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
            </div>
              
            </div>
              
            </>
          )}
        </div>




      </div>
      <div className='flex items-center justify-end'>
        <Link href={`/dashboard/interview/${cleanInterviewId}/start`}>
        <Button className>Start Interview</Button>
        </Link>
     
      </div>

      

    </div>
  );
}

export default Interview;
